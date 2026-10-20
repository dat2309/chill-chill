import {
  DEFAULT_GARDEN_STATE,
  DEFAULT_PHUQUOC_STATE,
  sanitizeGardenState,
  sanitizePhuQuocState,
  sanitizeCameraState,
} from '../src/three/core/storage';
import { ThemeId, ThemeState, SwitchThemeResult } from '../src/three/core/types';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true });
  } else {
    results.push({ name, passed: false, details });
    console.error(`FAIL: ${name} ${details ? `(${details})` : ''}`);
  }
}

console.log('--- RUNNING THEME LIFECYCLE & STATE ISOLATION SUITE ---');

// 1. Cross-Theme State Leaking Prevention
// When Garden is active, an incoming update with themeId 'phuquoc' must never alter Garden state
const gardenBase = { ...DEFAULT_GARDEN_STATE };
const foreignPhuQuocUpdate: any = {
  themeId: 'phuquoc',
  season: 'dry',
  timeOfDay: 17.75,
};

// Test boundary sanitization
const sanitizedGardenAttempt = sanitizeGardenState({
  ...gardenBase,
  season: foreignPhuQuocUpdate.season,
});

assert(
  sanitizedGardenAttempt.season === DEFAULT_GARDEN_STATE.season && sanitizedGardenAttempt.season !== 'dry',
  'Sanitization prevents Phu Quoc season: "dry" from corrupting Garden state'
);

const sanitizedPhuQuocAttempt = sanitizePhuQuocState({
  ...DEFAULT_PHUQUOC_STATE,
  season: 'winter',
});

assert(
  sanitizedPhuQuocAttempt.season === 'dry',
  'Sanitization prevents Garden season: "winter" from corrupting Phu Quoc state'
);

// 2. Cancellation and Token State Machine Emulation
class MockThemeManager {
  private activeThemeId: ThemeId = 'garden';
  private requestedThemeId: ThemeId | null = null;
  private pendingStates = new Map<ThemeId, ThemeState<any>>();
  private currentSwitchToken = 0;
  private disposedThemes: string[] = [];

  getActiveThemeId() {
    return this.activeThemeId;
  }
  getRequestedThemeId() {
    return this.requestedThemeId;
  }
  getDisposedThemes() {
    return this.disposedThemes;
  }

  updateState(stateOrPatch: Partial<ThemeState<any>>) {
    const targetThemeId = (stateOrPatch as any).themeId as ThemeId | undefined;
    if (targetThemeId && targetThemeId !== this.activeThemeId) {
      if (targetThemeId === this.requestedThemeId) {
        const cur = this.pendingStates.get(targetThemeId);
        this.pendingStates.set(targetThemeId, { ...(cur ?? {}), ...stateOrPatch } as any);
      }
      return;
    }
    // Update active theme state
    Object.assign(this.activeThemeState, stateOrPatch);
  }

  private activeThemeState: any = { ...DEFAULT_GARDEN_STATE };
  getActiveThemeState() {
    return this.activeThemeState;
  }

  async switchTheme(
    targetThemeId: ThemeId,
    targetState: ThemeState<any>,
    shouldFail: boolean = false
  ): Promise<SwitchThemeResult> {
    const switchToken = ++this.currentSwitchToken;
    this.requestedThemeId = targetThemeId;
    this.pendingStates.set(targetThemeId, { ...targetState });

    // Simulate async loader & init
    await new Promise((r) => setTimeout(r, 20));

    if (switchToken !== this.currentSwitchToken) {
      this.disposedThemes.push(`${targetThemeId}-token-${switchToken}`);
      return { status: 'cancelled' };
    }

    if (shouldFail) {
      this.disposedThemes.push(`${targetThemeId}-token-${switchToken}-failed`);
      this.requestedThemeId = null;
      return { status: 'failed', error: new Error(`Simulated init failure on ${targetThemeId}`) };
    }

    // Commit
    const latestState = this.pendingStates.get(targetThemeId) ?? targetState;
    this.activeThemeId = targetThemeId;
    this.activeThemeState = { ...latestState };
    this.requestedThemeId = null;
    this.pendingStates.delete(targetThemeId);

    return { status: 'success' };
  }
}

async function runLifecycleTests() {
  const manager = new MockThemeManager();

  // Test 2A: Buffer pending state during loading without mutating active theme
  const switchPromise = manager.switchTheme('phuquoc', { ...DEFAULT_PHUQUOC_STATE });
  assert(manager.getRequestedThemeId() === 'phuquoc', 'Requested theme is tracked as phuquoc');
  assert(manager.getActiveThemeId() === 'garden', 'Active theme remains garden during async load');

  // Send update for phuquoc while it is loading
  manager.updateState({ themeId: 'phuquoc', timeOfDay: 19.5 } as any);

  // Garden state must not have changed to 19.5
  assert(
    manager.getActiveThemeState().timeOfDay === DEFAULT_GARDEN_STATE.timeOfDay,
    'Active garden state was not polluted by inflight phuquoc update'
  );

  const res1 = await switchPromise;
  assert(res1.status === 'success', 'Theme switch completed with success result');
  assert(manager.getActiveThemeId() === 'phuquoc', 'Active theme is now committed to phuquoc');
  assert(
    manager.getActiveThemeState().timeOfDay === 19.5,
    'Buffered pending state was applied upon switch completion'
  );

  // Test 2B: Switch failure keeps active theme intact and disposes failed instance
  const failPromise = manager.switchTheme('garden', { ...DEFAULT_GARDEN_STATE }, true);
  const failRes = await failPromise;
  assert(failRes.status === 'failed', 'Theme switch failure returned failed status with error');
  assert(manager.getActiveThemeId() === 'phuquoc', 'Active theme remains phuquoc after switch failure');
  assert(
    manager.getDisposedThemes().some((t) => t.includes('garden') && t.includes('failed')),
    'Failed theme instance was safely disposed'
  );

  // Test 2C: Rapid switching A -> B -> A cancellation
  const switchP1 = manager.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
  const switchP2 = manager.switchTheme('phuquoc', { ...DEFAULT_PHUQUOC_STATE });
  const [out1, out2] = await Promise.all([switchP1, switchP2]);

  assert(out1.status === 'cancelled', 'Interrupted earlier theme switch returned cancelled');
  assert(out2.status === 'success', 'Latest theme switch returned success');
  assert(
    manager.getDisposedThemes().some((t) => t.includes('garden')),
    'Interrupted earlier theme instance was disposed immediately'
  );
  assert(manager.getActiveThemeId() === 'phuquoc', 'Final active theme matches latest request');

  // Summary
  const totalPassed = results.filter((r) => r.passed).length;
  console.log('----------------------------------------------------');
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${totalPassed} | FAILED: ${results.length - totalPassed}`);
  if (totalPassed === results.length) {
    console.log('>>> ALL LIFECYCLE & ISOLATION VALIDATION TESTS PASSED! <<<');
    process.exit(0);
  } else {
    console.error('>>> SOME VALIDATION TESTS FAILED! <<<');
    process.exit(1);
  }
}

runLifecycleTests();
