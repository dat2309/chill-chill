import * as THREE from 'three';
import {
  DEFAULT_GARDEN_STATE,
  DEFAULT_PHUQUOC_STATE,
  DEFAULT_SHARED_OPTIONS,
  sanitizeGardenState,
  sanitizePhuQuocState,
  sanitizeCameraState,
} from '../src/three/core/storage';
import { ThemeId, ThemeState, ThemeInstance } from '../src/three/core/types';
import { ThemeLifecycleCoordinator } from '../src/three/core/ThemeLifecycleCoordinator';
import { checkRenderTargetSupport } from '../src/three/themes/phuquoc/water';
import { setCameraProjection } from '../src/three/core/camera';

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

console.log('--- RUNNING PRODUCTION THEME LIFECYCLE & STATE ISOLATION SUITE ---');

// =========================================================================
// 1. Cross-Theme State Leaking Prevention & Sanitization
// =========================================================================
const gardenBase = { ...DEFAULT_GARDEN_STATE };
const foreignPhuQuocUpdate: any = {
  themeId: 'phuquoc',
  season: 'dry',
  timeOfDay: 17.75,
};

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

// Sanitization of CameraState with baseFrustumHeight validation and migration
const validCamWithFrustum = sanitizeCameraState({
  position: [24, 18, 24],
  target: [0, 0, 0],
  zoom: 1.2,
  baseFrustumHeight: 25.0,
});
assert(
  validCamWithFrustum !== undefined && validCamWithFrustum.baseFrustumHeight === 25.0,
  'sanitizeCameraState preserves valid baseFrustumHeight'
);

const legacyCamWithoutFrustum = sanitizeCameraState({
  position: [24, 18, 24],
  target: [0, 0, 0],
  zoom: 1.0,
});
assert(
  legacyCamWithoutFrustum !== undefined && legacyCamWithoutFrustum.baseFrustumHeight === undefined,
  'sanitizeCameraState gracefully migrates legacy camera without baseFrustumHeight'
);

const invalidCamWithCorruptedFrustum = sanitizeCameraState({
  position: [24, 18, 24],
  target: [0, 0, 0],
  zoom: 1.0,
  baseFrustumHeight: -999,
});
assert(
  invalidCamWithCorruptedFrustum !== undefined && invalidCamWithCorruptedFrustum.baseFrustumHeight === undefined,
  'sanitizeCameraState strips invalid/out-of-range baseFrustumHeight'
);

// =========================================================================
// 2. Production ThemeLifecycleCoordinator Regression Testing
// =========================================================================

interface MockThemeExtra {
  disposed: boolean;
  appliedState: any;
  quality: string;
}

function createFakeThemeInstance(
  id: ThemeId,
  options: {
    failInit?: boolean;
    loadDelay?: number;
    initDelay?: number;
  } = {}
): ThemeInstance<any> & MockThemeExtra {
  const instance: ThemeInstance<any> & MockThemeExtra = {
    id,
    disposed: false,
    appliedState: null,
    quality: 'high',
    group: new THREE.Group(),
    metadata: { id, name: id } as any,
    cameraPreset: {
      position: new THREE.Vector3(26, 23, 26),
      target: new THREE.Vector3(0, 0, 0),
      baseFrustumHeight: id === 'garden' ? 25.5 : 24.5,
    },
    async init() {
      if (options.initDelay) {
        await new Promise((r) => setTimeout(r, options.initDelay));
      }
      if (options.failInit) {
        throw new Error(`Init failed on theme: ${id}`);
      }
    },
    update() {},
    applyState(state: any) {
      this.appliedState = { ...state };
    },
    setQuality(q: string) {
      this.quality = q;
    },
    getContentBounds() {
      return new THREE.Box3(new THREE.Vector3(-10, -1, -8), new THREE.Vector3(10, 4, 8));
    },
    isInWater() {
      return false;
    },
    addRipple() {},
    reactToSplash() {},
    dispose() {
      this.disposed = true;
    },
  };

  return instance;
}

async function runLifecycleTests() {
  const createdThemes: (ThemeInstance<any> & MockThemeExtra)[] = [];

  const loaderMap: Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>> = {
    garden: async () => {
      const t = createFakeThemeInstance('garden');
      createdThemes.push(t);
      return t;
    },
    phuquoc: async () => {
      const t = createFakeThemeInstance('phuquoc');
      createdThemes.push(t);
      return t;
    },
  };

  const coordinator = new ThemeLifecycleCoordinator({
    loaderMap,
    initialThemeId: 'garden',
    initialQuality: 'high',
  });

  // Test 2A: Buffer pending state during loading without mutating active theme
  const switchPromise = coordinator.switchTheme('phuquoc', { ...DEFAULT_PHUQUOC_STATE });
  assert(coordinator.getRequestedThemeId() === 'phuquoc', 'Requested theme is tracked as phuquoc');
  assert(coordinator.getActiveThemeId() === 'garden', 'Active theme remains garden during async load');

  // Send update for phuquoc while it is in-flight loading
  coordinator.updateState({ themeId: 'phuquoc', timeOfDay: 19.5, windStrength: 0.8 } as any);

  // Garden state must not have changed to 19.5
  assert(
    coordinator.getActiveThemeState() === null || coordinator.getActiveThemeState()?.timeOfDay !== 19.5,
    'Active garden state was not polluted by inflight phuquoc update'
  );

  const res1 = await switchPromise;
  assert(res1.status === 'success', 'Theme switch completed with success result');
  assert(coordinator.getActiveThemeId() === 'phuquoc', 'Active theme is now committed to phuquoc');
  assert(
    coordinator.getActiveThemeState()?.timeOfDay === 19.5 && coordinator.getActiveThemeState()?.windStrength === 0.8,
    'Buffered pending state was accurately merged and applied upon switch completion'
  );

  // Test 2B: Switch failure keeps active theme intact and disposes failed instance
  const failLoaderMap: Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>> = {
    garden: async () => {
      const t = createFakeThemeInstance('garden', { failInit: true, initDelay: 10 });
      createdThemes.push(t);
      return t;
    },
    phuquoc: async () => {
      const t = createFakeThemeInstance('phuquoc');
      createdThemes.push(t);
      return t;
    },
  };

  const failCoordinator = new ThemeLifecycleCoordinator({
    loaderMap: failLoaderMap,
    initialThemeId: 'phuquoc',
  });
  // Commit phuquoc first
  await failCoordinator.switchTheme('phuquoc', { ...DEFAULT_PHUQUOC_STATE });

  const failRes = await failCoordinator.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
  assert(failRes.status === 'failed', 'Theme switch failure returned failed status with error');
  assert(failCoordinator.getActiveThemeId() === 'phuquoc', 'Active theme remains phuquoc after switch failure');
  assert(failCoordinator.getRequestedThemeId() === null, 'Requested theme was reset after failed request');
  const failedGardenInstance = createdThemes.find((t) => t.id === 'garden' && t.disposed);
  assert(Boolean(failedGardenInstance), 'Failed theme instance was safely disposed');

  // Test 2C: Rapid switching A -> B -> A cancellation
  const rapidCoordinator = new ThemeLifecycleCoordinator({
    loaderMap,
    initialThemeId: 'garden',
  });
  const p1 = rapidCoordinator.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
  const p2 = rapidCoordinator.switchTheme('phuquoc', { ...DEFAULT_PHUQUOC_STATE });
  const [out1, out2] = await Promise.all([p1, p2]);

  assert(out1.status === 'cancelled', 'Interrupted earlier theme switch returned cancelled');
  assert(out2.status === 'success', 'Latest theme switch returned success');
  assert(rapidCoordinator.getActiveThemeId() === 'phuquoc', 'Final active theme matches latest request');

  // =========================================================================
  // 3. Critical Race Condition Regression Test:
  // Old request reject must NEVER clear requestedThemeId of a newer request!
  // =========================================================================
  let slowRejectTheme: any = null;
  const raceLoaderMap: Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>> = {
    garden: async () => {
      slowRejectTheme = createFakeThemeInstance('garden', { failInit: true, initDelay: 60 });
      createdThemes.push(slowRejectTheme);
      return slowRejectTheme;
    },
    phuquoc: async () => {
      const t = createFakeThemeInstance('phuquoc', { initDelay: 40 });
      createdThemes.push(t);
      return t;
    },
  };

  const raceCoordinator = new ThemeLifecycleCoordinator({
    loaderMap: raceLoaderMap,
    initialThemeId: 'garden',
  });

  // Start Request A: garden (will fail after 60ms)
  const reqAPromise = raceCoordinator.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });

  // At 15ms, user changes mind and initiates Request B: phuquoc (will succeed after 40ms)
  await new Promise((r) => setTimeout(r, 15));
  const reqBPromise = raceCoordinator.switchTheme('phuquoc', { ...DEFAULT_PHUQUOC_STATE });

  // Right now, requestedThemeId MUST be phuquoc
  assert(
    raceCoordinator.getRequestedThemeId() === 'phuquoc',
    'Requested theme is phuquoc before request A rejects'
  );

  // Send pending update for phuquoc
  raceCoordinator.updateState({ themeId: 'phuquoc', timeOfDay: 18.0 } as any);

  const [resA, resB] = await Promise.all([reqAPromise, reqBPromise]);

  assert(resA.status === 'cancelled', 'Old failing request A returned cancelled rather than failed');
  assert(resB.status === 'success', 'Newer request B completed successfully');
  assert(
    raceCoordinator.getActiveThemeId() === 'phuquoc',
    'Active theme is committed to phuquoc despite older request A failure'
  );
  assert(
    raceCoordinator.getActiveThemeState()?.timeOfDay === 18.0,
    'Pending state for request B was preserved and applied even after request A rejected'
  );

  // =========================================================================
  // 4. Retry after first failure recovery test
  // =========================================================================
  let attemptCount = 0;
  const retryLoaderMap: Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>> = {
    garden: async () => {
      attemptCount++;
      const fail = attemptCount === 1;
      const t = createFakeThemeInstance('garden', { failInit: fail, initDelay: 5 });
      createdThemes.push(t);
      return t;
    },
    phuquoc: async () => {
      const t = createFakeThemeInstance('phuquoc');
      createdThemes.push(t);
      return t;
    },
  };

  const retryCoordinator = new ThemeLifecycleCoordinator({
    loaderMap: retryLoaderMap,
  });

  const firstAttempt = await retryCoordinator.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
  assert(firstAttempt.status === 'failed', 'First attempt fails as simulated');
  assert(retryCoordinator.getActiveTheme() === null, 'Active theme is null after initial failure');

  // User clicks "Thử lại" (Retry)
  const retryAttempt = await retryCoordinator.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
  assert(retryAttempt.status === 'success', 'Retry attempt succeeds cleanly');
  assert(retryCoordinator.getActiveTheme() !== null, 'Active theme is established after retry');
  assert(retryCoordinator.getActiveThemeId() === 'garden', 'Active theme ID is garden after retry');

  // =========================================================================
  // 5. GPU Framebuffer Completeness & Analytical Fallback Verification
  // =========================================================================
  const fakeGlIncomplete = {
    FRAMEBUFFER: 0x8d40,
    FRAMEBUFFER_COMPLETE: 0x8cd5,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8cd6,
    NO_ERROR: 0,
    getExtension: () => ({}),
    checkFramebufferStatus: () => 0x8cd6, // Incomplete!
    getError: () => 0,
  };
  const fakeRendererIncomplete: any = {
    getContext: () => fakeGlIncomplete,
    getRenderTarget: () => null,
    setRenderTarget: () => {},
    clear: () => {},
  };
  const gpuIncompleteSupport = checkRenderTargetSupport(fakeRendererIncomplete, THREE.FloatType);
  assert(
    gpuIncompleteSupport === false,
    'checkRenderTargetSupport returns false when framebuffer is incomplete, triggering analytical fallback'
  );

  const fakeGlComplete = {
    FRAMEBUFFER: 0x8d40,
    FRAMEBUFFER_COMPLETE: 0x8cd5,
    NO_ERROR: 0,
    getExtension: () => ({}),
    checkFramebufferStatus: () => 0x8cd5, // Complete!
    getError: () => 0,
  };
  const fakeRendererComplete: any = {
    getContext: () => fakeGlComplete,
    getRenderTarget: () => null,
    setRenderTarget: () => {},
    clear: () => {},
  };
  const gpuCompleteSupport = checkRenderTargetSupport(fakeRendererComplete, THREE.FloatType);
  assert(
    gpuCompleteSupport === true,
    'checkRenderTargetSupport returns true when framebuffer status is COMPLETE with NO_ERROR'
  );

  // =========================================================================
  // 6. Camera Frustum Projection Independence Verification
  // =========================================================================
  const testCam = new THREE.OrthographicCamera(-10, 10, 10, -10, -50, 50);
  const aspect = 16 / 9;

  // Theme A projection (Garden baseFrustumHeight = 25.5)
  setCameraProjection(testCam, 25.5, aspect);
  const gardenHeight = testCam.top - testCam.bottom;
  const gardenWidth = testCam.right - testCam.left;
  assert(Math.abs(gardenHeight - 25.5) < 0.001, 'Theme A projection has height 25.5');

  // Switch to Theme B projection (Phu Quoc baseFrustumHeight = 24.5)
  setCameraProjection(testCam, 24.5, aspect);
  const phuquocHeight = testCam.top - testCam.bottom;
  const phuquocWidth = testCam.right - testCam.left;
  assert(Math.abs(phuquocHeight - 24.5) < 0.001, 'Theme B projection recalibrated to height 24.5');
  assert(
    Math.abs(phuquocWidth - (24.5 * aspect)) < 0.001,
    'Theme B projection horizontal width scales correctly with aspect ratio'
  );
  assert(
    phuquocHeight !== gardenHeight,
    'Restoring camera to Theme B does not retain Theme A leftover frustum height'
  );

  // =========================================================================
  // 7. Single Source of Truth for Quality State Verification
  // =========================================================================
  assert(
    (DEFAULT_GARDEN_STATE as any).quality === undefined,
    'DEFAULT_GARDEN_STATE does not store redundant quality'
  );
  assert(
    (DEFAULT_PHUQUOC_STATE as any).quality === undefined,
    'DEFAULT_PHUQUOC_STATE does not store redundant quality'
  );
  assert(
    DEFAULT_SHARED_OPTIONS.quality === 'high',
    'DEFAULT_SHARED_OPTIONS.quality is the single source of truth for graphics quality'
  );

  coordinator.setQuality('medium');
  assert(
    coordinator.getCurrentQuality() === 'medium',
    'Coordinator setQuality updates current quality setting'
  );

  // Summary
  const totalPassed = results.filter((r) => r.passed).length;
  console.log('----------------------------------------------------');
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${totalPassed} | FAILED: ${results.length - totalPassed}`);
  if (totalPassed === results.length) {
    console.log('>>> ALL PRODUCTION LIFECYCLE & ISOLATION VALIDATION TESTS PASSED! <<<');
    process.exit(0);
  } else {
    console.error('>>> SOME VALIDATION TESTS FAILED! <<<');
    process.exit(1);
  }
}

runLifecycleTests();
