import * as THREE from 'three';
import {
  DEFAULT_GARDEN_STATE,
  DEFAULT_BEACH_STATE,
  DEFAULT_SHARED_OPTIONS,
  sanitizeGardenState,
  sanitizeBeachState,
  sanitizeCameraState,
} from '../src/three/core/storage';
import { ThemeId, ThemeState, ThemeInstance } from '../src/three/core/types';
import { ThemeLifecycleCoordinator } from '../src/three/core/ThemeLifecycleCoordinator';
import { SceneManager } from '../src/three/core/SceneManager';
import { checkRenderTargetSupport } from '../src/three/themes/beach/water';
import { setCameraProjection } from '../src/three/core/camera';
import { loadThemeWithRetry } from '../src/three/themes/registry';

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
const foreignBeachUpdate: any = {
  themeId: 'beach',
  season: 'dry',
  timeOfDay: 17.75,
};

const sanitizedGardenAttempt = sanitizeGardenState({
  ...gardenBase,
  season: foreignBeachUpdate.season,
});

assert(
  sanitizedGardenAttempt.season === DEFAULT_GARDEN_STATE.season && (sanitizedGardenAttempt.season as string) !== 'dry',
  'Sanitization prevents Beach season: "dry" from corrupting Garden state'
);

const sanitizedBeachAttempt = sanitizeBeachState({
  ...DEFAULT_BEACH_STATE,
  season: 'winter' as any,
});

assert(
  sanitizedBeachAttempt.season === 'dry',
  'Sanitization prevents Garden season: "winter" from corrupting Beach state'
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
  disposeCount: number;
  appliedState: any;
  quality: string;
}

function createFakeThemeInstance(
  id: ThemeId,
  options: {
    failInit?: boolean;
    failApplyState?: boolean;
    initPromise?: Promise<void>;
    initDelay?: number;
  } = {}
): ThemeInstance<any> & MockThemeExtra {
  const instance: ThemeInstance<any> & MockThemeExtra = {
    id,
    disposed: false,
    disposeCount: 0,
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
      if (options.initPromise) {
        await options.initPromise;
      }
      if (options.initDelay) {
        await new Promise((r) => setTimeout(r, options.initDelay));
      }
      if (options.failInit) {
        throw new Error(`Init failed on theme: ${id}`);
      }
    },
    update() {},
    applyState(state: any) {
      if (options.failApplyState) {
        throw new Error(`applyState failed on theme: ${id}`);
      }
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
      this.disposeCount++;
    },
  };

  return instance;
}

function createDeferred<T = void>() {
  let resolve!: (val: T | PromiseLike<T>) => void;
  let reject!: (err?: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function runLifecycleTests() {
  const createdThemes: (ThemeInstance<any> & MockThemeExtra)[] = [];

  const loaderMap: Partial<Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>>> = {
    lantern:async()=>createFakeThemeInstance('lantern'),
    garden: async () => {
      const t = createFakeThemeInstance('garden');
      createdThemes.push(t);
      return t;
    },
    beach: async () => {
      const t = createFakeThemeInstance('beach');
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
  const switchPromise = coordinator.switchTheme('beach', { ...DEFAULT_BEACH_STATE });
  assert(coordinator.getRequestedThemeId() === 'beach', 'Requested theme is tracked as beach');
  assert(coordinator.getActiveThemeId() === 'garden', 'Active theme remains garden during async load');

  // Send update for beach while it is in-flight loading
  coordinator.updateState({ themeId: 'beach', timeOfDay: 19.5, windStrength: 0.8 } as any);

  // Garden state must not have changed to 19.5
  assert(
    coordinator.getActiveThemeState() === null || coordinator.getActiveThemeState()?.timeOfDay !== 19.5,
    'Active garden state was not polluted by inflight beach update'
  );

  const res1 = await switchPromise;
  assert(res1.status === 'success', 'Theme switch completed with success result');
  assert(coordinator.getActiveThemeId() === 'beach', 'Active theme is now committed to beach');
  assert(
    coordinator.getActiveThemeState()?.timeOfDay === 19.5 && coordinator.getActiveThemeState()?.windStrength === 0.8,
    'Buffered pending state was accurately merged and applied upon switch completion'
  );

  // Test 2B: Switch failure keeps active theme intact and disposes failed instance
  const failLoaderMap: Partial<Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>>> = {
    lantern:async()=>createFakeThemeInstance('lantern'),
    garden: async () => {
      const t = createFakeThemeInstance('garden', { failInit: true, initDelay: 10 });
      createdThemes.push(t);
      return t;
    },
    beach: async () => {
      const t = createFakeThemeInstance('beach');
      createdThemes.push(t);
      return t;
    },
  };

  const failCoordinator = new ThemeLifecycleCoordinator({
    loaderMap: failLoaderMap,
    initialThemeId: 'beach',
  });
  // Commit beach first
  await failCoordinator.switchTheme('beach', { ...DEFAULT_BEACH_STATE });

  const failRes = await failCoordinator.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
  assert(failRes.status === 'failed', 'Theme switch failure returned failed status with error');
  assert(failCoordinator.getActiveThemeId() === 'beach', 'Active theme remains beach after switch failure');
  assert(failCoordinator.getRequestedThemeId() === null, 'Requested theme was reset after failed request');
  const failedGardenInstance = createdThemes.find((t) => t.id === 'garden' && t.disposed);
  assert(Boolean(failedGardenInstance), 'Failed theme instance was safely disposed');

  // Test 2C: Rapid switching A -> B -> A cancellation
  const rapidCoordinator = new ThemeLifecycleCoordinator({
    loaderMap,
    initialThemeId: 'garden',
  });
  const p1 = rapidCoordinator.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
  const p2 = rapidCoordinator.switchTheme('beach', { ...DEFAULT_BEACH_STATE });
  const [out1, out2] = await Promise.all([p1, p2]);

  assert(out1.status === 'cancelled', 'Interrupted earlier theme switch returned cancelled');
  assert(out2.status === 'success', 'Latest theme switch returned success');
  assert(rapidCoordinator.getActiveThemeId() === 'beach', 'Final active theme matches latest request');

  // =========================================================================
  // 3. Critical Race Condition Regression Test:
  // Old request reject must NEVER clear requestedThemeId of a newer request!
  // =========================================================================
  let slowRejectTheme: any = null;
  const raceLoaderMap: Partial<Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>>> = {
    lantern:async()=>createFakeThemeInstance('lantern'),
    garden: async () => {
      slowRejectTheme = createFakeThemeInstance('garden', { failInit: true, initDelay: 60 });
      createdThemes.push(slowRejectTheme);
      return slowRejectTheme;
    },
    beach: async () => {
      const t = createFakeThemeInstance('beach', { initDelay: 40 });
      createdThemes.push(t);
      return t;
    },
  };

  const raceCoordinator = new ThemeLifecycleCoordinator({
    loaderMap: raceLoaderMap,
    initialThemeId: 'garden',
  });

  const reqAPromise = raceCoordinator.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
  await new Promise((r) => setTimeout(r, 15));
  const reqBPromise = raceCoordinator.switchTheme('beach', { ...DEFAULT_BEACH_STATE });

  assert(
    raceCoordinator.getRequestedThemeId() === 'beach',
    'Requested theme is beach before request A rejects'
  );

  raceCoordinator.updateState({ themeId: 'beach', timeOfDay: 18.0 } as any);

  const [resA, resB] = await Promise.all([reqAPromise, reqBPromise]);

  assert(resA.status === 'cancelled', 'Old failing request A returned cancelled rather than failed');
  assert(resB.status === 'success', 'Newer request B completed successfully');
  assert(
    raceCoordinator.getActiveThemeId() === 'beach',
    'Active theme is committed to beach despite older request A failure'
  );
  assert(
    raceCoordinator.getActiveThemeState()?.timeOfDay === 18.0,
    'Pending state for request B was preserved and applied even after request A rejected'
  );

  // =========================================================================
  // 4. Regression Test A: Khởi tạo cùng theme (Garden init at 16:00, update to 21:00)
  // =========================================================================
  const deferredInitA = createDeferred();
  let instanceInitA: any = null;

  const coordinatorInitA = new ThemeLifecycleCoordinator({
    loaderMap: {
      lantern:async()=>createFakeThemeInstance('lantern'),
      garden: async () => {
        instanceInitA = createFakeThemeInstance('garden', { initPromise: deferredInitA.promise });
        return instanceInitA;
      },
      beach: async () => createFakeThemeInstance('beach'),
    },
    initialThemeId: 'garden',
  });

  // Start init Garden at 16:00
  const initPromiseA = coordinatorInitA.switchTheme('garden', { ...DEFAULT_GARDEN_STATE, timeOfDay: 16.0 });

  // While held by deferred promise, send state update for Garden at 21:00
  coordinatorInitA.updateState({ themeId: 'garden', timeOfDay: 21.0 });

  // Complete init
  deferredInitA.resolve();
  const initResultA = await initPromiseA;

  assert(initResultA.status === 'success', 'Test A: Init completed with success');
  assert(
    coordinatorInitA.getActiveThemeState()?.timeOfDay === 21.0,
    'Test A: Coordinator active state received 21:00 update during same-theme initial load'
  );
  assert(
    instanceInitA.appliedState?.timeOfDay === 21.0,
    'Test A: Theme instance appliedState received 21:00 update'
  );

  // =========================================================================
  // 5. Regression Test B: Reload cùng theme (Garden active at 17:00, reload & update to 22:00)
  // =========================================================================
  const deferredInitB = createDeferred();
  let instanceReloadB: any = null;
  let gardenLoadCount = 0;

  const coordinatorReloadB = new ThemeLifecycleCoordinator({
    loaderMap: {
      lantern:async()=>createFakeThemeInstance('lantern'),
      garden: async () => {
        gardenLoadCount++;
        if (gardenLoadCount === 1) {
          // First active instance
          return createFakeThemeInstance('garden');
        } else {
          // Reload instance
          instanceReloadB = createFakeThemeInstance('garden', { initPromise: deferredInitB.promise });
          return instanceReloadB;
        }
      },
      beach: async () => createFakeThemeInstance('beach'),
    },
    initialThemeId: 'garden',
  });

  // Establish initial active Garden at 17:00
  await coordinatorReloadB.switchTheme('garden', { ...DEFAULT_GARDEN_STATE, timeOfDay: 17.0 });
  assert(coordinatorReloadB.getActiveThemeState()?.timeOfDay === 17.0, 'Test B: Initial garden active at 17:00');

  // Start reloading Garden at 17:00
  const reloadPromiseB = coordinatorReloadB.switchTheme('garden', { ...DEFAULT_GARDEN_STATE, timeOfDay: 17.0 });

  // During init, update Garden to 22:00
  coordinatorReloadB.updateState({ themeId: 'garden', timeOfDay: 22.0 });

  // Complete reload init
  deferredInitB.resolve();
  const reloadResultB = await reloadPromiseB;

  assert(reloadResultB.status === 'success', 'Test B: Reload completed with success');
  assert(
    coordinatorReloadB.getActiveThemeState()?.timeOfDay === 22.0,
    'Test B: Coordinator active state is 22:00 after reload commit'
  );
  assert(
    instanceReloadB.appliedState?.timeOfDay === 22.0,
    'Test B: Reloaded theme instance received latest 22:00 state'
  );

  // =========================================================================
  // 6. Rollback Transaction Tests on Handover Errors (5 Failure Points)
  // =========================================================================

  type FailurePoint = 'applyState' | 'onMountTheme' | 'onRestoreCamera' | 'onApplyQuality' | 'onCommitTheme';
  const failurePoints: FailurePoint[] = [
    'applyState',
    'onMountTheme',
    'onRestoreCamera',
    'onApplyQuality',
    'onCommitTheme',
  ];

  for (const point of failurePoints) {
    let oldGarden: any = null;
    let newBeach: any = null;

    const rollbackCoordinator = new ThemeLifecycleCoordinator({
      loaderMap: {
      lantern:async()=>createFakeThemeInstance('lantern'),
        garden: async () => {
          oldGarden = createFakeThemeInstance('garden');
          return oldGarden;
        },
        beach: async () => {
          newBeach = createFakeThemeInstance('beach', {
            failApplyState: point === 'applyState',
          });
          return newBeach;
        },
      },
      onMountTheme: (theme) => {
        if (point === 'onMountTheme' && theme.id === 'beach') {
          throw new Error('Simulated mount failure on beach');
        }
      },
      onRestoreCamera: (_themeId, theme) => {
        if (point === 'onRestoreCamera' && theme.id === 'beach') {
          throw new Error('Simulated restoreCamera failure on beach');
        }
      },
      onApplyQuality: () => {
        if (point === 'onApplyQuality' && newBeach && !newBeach.disposed) {
          throw new Error('Simulated applyQuality failure on beach');
        }
      },
      onCommitTheme: (_themeId, theme) => {
        if (point === 'onCommitTheme' && theme.id === 'beach') {
          throw new Error('Simulated commitTheme failure on beach');
        }
      },
    });

    // Mount initial active Garden
    const initRes = await rollbackCoordinator.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
    assert(initRes.status === 'success', `Rollback (${point}): Garden established`);

    // Attempt switch to Beach which will fail at `point`
    const failSwitchRes = await rollbackCoordinator.switchTheme('beach', { ...DEFAULT_BEACH_STATE });

    assert(
      failSwitchRes.status === 'failed',
      `Rollback (${point}): Switch to Beach failed as expected`
    );
    assert(
      rollbackCoordinator.getActiveTheme() === oldGarden,
      `Rollback (${point}): Active instance remains valid old Garden`
    );
    assert(
      oldGarden.disposed === false,
      `Rollback (${point}): Old Garden was NOT disposed during rollback`
    );
    assert(
      newBeach.disposed === true,
      `Rollback (${point}): Failed new Beach instance was safely disposed`
    );
    assert(
      rollbackCoordinator.getRequestedThemeId() === null,
      `Rollback (${point}): Requested theme state is not stuck`
    );

    // Verify next retry (without error) succeeds
    // Remove failure triggers
    (newBeach as any).failApplyState = false;
    const retryCoordinatorPoint = new ThemeLifecycleCoordinator({
      loaderMap: {
      lantern:async()=>createFakeThemeInstance('lantern'),
        garden: async () => oldGarden,
        beach: async () => createFakeThemeInstance('beach'),
      },
      initialThemeId: 'garden',
    });
    // Set active
    await retryCoordinatorPoint.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
    const retryRes = await retryCoordinatorPoint.switchTheme('beach', { ...DEFAULT_BEACH_STATE });
    assert(
      retryRes.status === 'success',
      `Rollback (${point}): Next retry succeeded cleanly after error`
    );
  }

  // =========================================================================
  // 6.b. Rollback Regression: In-flight Active Theme Update & Single Dispose Count
  // =========================================================================
  const beachDeferred = createDeferred();
  let testGardenTheme: any = null;
  let testBeachTheme: any = null;

  const inFlightUpdateCoordinator = new ThemeLifecycleCoordinator({
    loaderMap: {
      lantern:async()=>createFakeThemeInstance('lantern'),
      garden: async () => {
        testGardenTheme = createFakeThemeInstance('garden');
        return testGardenTheme;
      },
      beach: async () => {
        testBeachTheme = createFakeThemeInstance('beach', {
          initPromise: beachDeferred.promise,
        });
        return testBeachTheme;
      },
    },
    onRestoreCamera: (_themeId, theme) => {
      if (theme.id === 'beach') {
        throw new Error('Simulated onRestoreCamera failure on beach');
      }
    },
  });

  // 1. Garden starts at timeOfDay = 16
  await inFlightUpdateCoordinator.switchTheme('garden', {
    ...DEFAULT_GARDEN_STATE,
    timeOfDay: 16,
  });
  assert(inFlightUpdateCoordinator.getActiveThemeId() === 'garden', 'Initial active theme is garden');
  assert(
    inFlightUpdateCoordinator.getActiveThemeState()?.timeOfDay === 16,
    'Garden initial timeOfDay is 16'
  );

  // 2. Start loading Beach (in-flight)
  const beachSwitchPromise = inFlightUpdateCoordinator.switchTheme('beach', {
    ...DEFAULT_BEACH_STATE,
  });

  // 3. While waiting for Beach, update Garden timeOfDay to 21
  inFlightUpdateCoordinator.updateState('garden', { timeOfDay: 21 });
  assert(
    testGardenTheme.appliedState?.timeOfDay === 21,
    'Garden appliedState updated to 21 while Beach is loading'
  );
  assert(
    inFlightUpdateCoordinator.getActiveThemeState()?.timeOfDay === 21,
    'Coordinator activeThemeState updated to 21 while Beach is loading'
  );

  // 4. Complete Beach init -> enters handover -> onRestoreCamera throws
  beachDeferred.resolve();
  const failedSwitchResult = await beachSwitchPromise;

  // 5. Verify rollback results: Garden keeps 21, and Beach disposeCount === 1
  assert(failedSwitchResult.status === 'failed', 'Switch to Beach failed as expected on restore camera');
  assert(inFlightUpdateCoordinator.getActiveThemeId() === 'garden', 'Active theme rolled back to garden');
  assert(
    inFlightUpdateCoordinator.getActiveThemeState()?.timeOfDay === 21,
    'Rollback preserved latest Garden state (timeOfDay = 21)'
  );
  assert(
    testGardenTheme.appliedState?.timeOfDay === 21,
    'Garden instance retained timeOfDay = 21 after rollback'
  );
  assert(
    testBeachTheme.disposed === true,
    'Beach instance was disposed'
  );
  assert(
    testBeachTheme.disposeCount === 1,
    `Beach instance was disposed exactly once (disposeCount = ${testBeachTheme.disposeCount})`
  );

  // =========================================================================
  // 7. Integration Level Testing with SceneManager (Initial Fail -> Retry -> Start once)
  // =========================================================================
  let attemptNumber = 0;
  let startCount = 0;
  let readyCount = 0;
  let successCount = 0;
  let errorCount = 0;

  const mockDocument: any = {
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  const mockContainer: any = {
    clientWidth: 800,
    clientHeight: 600,
    appendChild: () => {},
  };
  const mockDomElement: any = {
    clientWidth: 800,
    clientHeight: 600,
    parentElement: mockContainer,
    addEventListener: () => {},
    removeEventListener: () => {},
    remove: () => {},
    getRootNode: () => mockDocument,
    ownerDocument: mockDocument,
    style: {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
  };
  const mockRenderer: any = {
    domElement: mockDomElement,
    setSize: () => {},
    setPixelRatio: () => {},
    shadowMap: { enabled: true, type: 0 },
    toneMapping: 0,
    toneMappingExposure: 1.0,
    outputColorSpace: '',
    render: () => {},
    dispose: () => {},
    getContext: () => ({
      getExtension: () => ({}),
    }),
  };

  const integrationLoaderMap: Partial<Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>>> = {
    lantern:async()=>createFakeThemeInstance('lantern'),
    garden: async () => {
      attemptNumber++;
      const shouldFail = attemptNumber === 1;
      return createFakeThemeInstance('garden', { failInit: shouldFail });
    },
    beach: async () => createFakeThemeInstance('beach'),
  };

  const sceneManager = new SceneManager(mockContainer, {
    renderer: mockRenderer,
    loaderMap: integrationLoaderMap,
    onReady: () => {
      readyCount++;
    },
    onThemeSuccess: () => {
      successCount++;
    },
    onThemeError: () => {
      errorCount++;
    },
  });

  // Track start calls
  const originalStart = sceneManager.start.bind(sceneManager);
  sceneManager.start = () => {
    startCount++;
    originalStart();
  };

  // Step 1: Initial load fails
  const firstSwitch = await sceneManager.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
  assert(firstSwitch.status === 'failed', 'Integration: First theme init failed as configured');
  assert(sceneManager.isInitialized() === false, 'Integration: Manager is not initialized after failure');
  assert(sceneManager.isStarted() === false, 'Integration: Manager did not start loop after failure');
  assert(startCount === 0, 'Integration: start() was not called');
  assert(readyCount === 0, 'Integration: onReady was not called');
  assert(errorCount === 1, 'Integration: onThemeError was emitted');

  // Step 2: User clicks Retry -> Succeeds
  const retrySwitch = await sceneManager.switchTheme('garden', { ...DEFAULT_GARDEN_STATE });
  assert(retrySwitch.status === 'success', 'Integration: Retry succeeded');
  assert(sceneManager.isInitialized() === true, 'Integration: Manager is initialized after retry');
  assert(sceneManager.isStarted() === true, 'Integration: Manager is started after retry');
  assert(startCount === 1, 'Integration: start() was called exactly once');
  assert(readyCount === 1, 'Integration: onReady was called exactly once');
  assert(successCount === 1, 'Integration: onThemeSuccess was called on retry');

  // Regression: resizing the actual manager from desktop to portrait must refit
  // rendered geometry, while preserving the user's orbit and zoom.
  const resizeProbe=new THREE.Mesh(new THREE.BoxGeometry(20,5,15),new THREE.MeshBasicMaterial());
  const resizeTheme=sceneManager.getActiveTheme()!;resizeTheme.group.add(resizeProbe);resizeTheme.group.updateMatrixWorld(true);
  const resizeCamera=sceneManager.camera;
  const savedPosition=resizeCamera.position.clone(),savedZoom=resizeCamera.zoom;
  mockContainer.clientWidth=390;mockContainer.clientHeight=844;(sceneManager as any).handleResize();
  let resizeContained=true;const resizeBounds=new THREE.Box3().setFromObject(resizeProbe);
  for(const x of [resizeBounds.min.x,resizeBounds.max.x])for(const y of [resizeBounds.min.y,resizeBounds.max.y])for(const z of [resizeBounds.min.z,resizeBounds.max.z]){const point=new THREE.Vector3(x,y,z).project(resizeCamera);if(Math.abs(point.x)>1||Math.abs(point.y)>1)resizeContained=false;}
  assert(resizeContained,'Integration: real manager desktop-to-portrait resize keeps rendered bounds visible');
  assert(resizeCamera.position.distanceTo(savedPosition)<1e-12&&resizeCamera.zoom===savedZoom,'Integration: responsive fit preserves orbit position and user zoom');
  resizeProbe.removeFromParent();resizeProbe.geometry.dispose();(resizeProbe.material as THREE.Material).dispose();mockContainer.clientWidth=800;mockContainer.clientHeight=600;(sceneManager as any).handleResize();

  // Step 3: Subsequent switch or start does not duplicate loop or ready
  sceneManager.start();
  assert(startCount === 2, 'Integration: Calling start again was attempted');
  // SceneManager.updateLoopState is idempotent, animFrameId is not duplicated

  // Switch to beach while running
  const switchNext = await sceneManager.switchTheme('beach', { ...DEFAULT_BEACH_STATE });
  assert(switchNext.status === 'success', 'Integration: Subsequent theme switch succeeded');
  assert(readyCount === 1, 'Integration: onReady was not emitted again on theme switch');
  assert(sceneManager.getActiveThemeId() === 'beach', 'Integration: Active theme is beach');

  // Step 4: Unmount before in-flight switch completes
  const deferredUnmount = createDeferred();
  const unmountLoaderMap: Partial<Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>>> = {
    lantern:async()=>createFakeThemeInstance('lantern'),
    garden: async () => createFakeThemeInstance('garden'),
    beach: async () => createFakeThemeInstance('beach', { initPromise: deferredUnmount.promise }),
  };

  let unmountReadyCount = 0;
  let unmountStartCount = 0;
  const unmountManager = new SceneManager(mockContainer, {
    renderer: mockRenderer,
    loaderMap: unmountLoaderMap,
    onReady: () => {
      unmountReadyCount++;
    },
  });
  unmountManager.start = () => {
    unmountStartCount++;
  };

  const inFlightPromise = unmountManager.switchTheme('beach', { ...DEFAULT_BEACH_STATE });

  // Component unmounts
  unmountManager.dispose();

  // In-flight init completes after unmount
  deferredUnmount.resolve();
  const inFlightRes = await inFlightPromise;

  assert(inFlightRes.status === 'cancelled', 'Integration: Unmounted in-flight switch returned cancelled');
  assert(unmountReadyCount === 0, 'Integration: Unmount did not invoke onReady callback');
  assert(unmountStartCount === 0, 'Integration: Unmount did not start rendering loop');

  // =========================================================================
  // 8. GPU Framebuffer Completeness & Analytical Fallback Verification
  // =========================================================================
  const fakeGlIncomplete = {
    FRAMEBUFFER: 0x8d40,
    FRAMEBUFFER_COMPLETE: 0x8cd5,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 0x8cd6,
    NO_ERROR: 0,
    getExtension: () => ({}),
    checkFramebufferStatus: () => 0x8cd6,
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
    checkFramebufferStatus: () => 0x8cd5,
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
  // 9. Camera Frustum Projection Independence Verification
  // =========================================================================
  const testCam = new THREE.OrthographicCamera(-10, 10, 10, -10, -50, 50);
  const aspect = 16 / 9;

  setCameraProjection(testCam, 25.5, aspect);
  const gardenHeight = testCam.top - testCam.bottom;
  assert(Math.abs(gardenHeight - 25.5) < 0.001, 'Theme A projection has height 25.5');

  setCameraProjection(testCam, 24.5, aspect);
  const beachHeight = testCam.top - testCam.bottom;
  const beachWidth = testCam.right - testCam.left;
  assert(Math.abs(beachHeight - 24.5) < 0.001, 'Theme B projection recalibrated to height 24.5');
  assert(
    Math.abs(beachWidth - (24.5 * aspect)) < 0.001,
    'Theme B projection horizontal width scales correctly with aspect ratio'
  );
  assert(
    beachHeight !== gardenHeight,
    'Restoring camera to Theme B does not retain Theme A leftover frustum height'
  );

  // =========================================================================
  // 10. Single Source of Truth for Quality State Verification
  // =========================================================================
  assert(
    (DEFAULT_GARDEN_STATE as any).quality === undefined,
    'DEFAULT_GARDEN_STATE does not store redundant quality'
  );
  assert(
    (DEFAULT_BEACH_STATE as any).quality === undefined,
    'DEFAULT_BEACH_STATE does not store redundant quality'
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

  // =========================================================================
  // 11. Dynamic Chunk Loading & Stale Module Recovery Verification
  // =========================================================================
  let dynamicChunkAttempts = 0;
  const resilientModule = await loadThemeWithRetry(async () => {
    dynamicChunkAttempts++;
    if (dynamicChunkAttempts < 2) {
      throw new TypeError('Failed to fetch dynamically imported module: https://chill-chill-orpin.vercel.app/assets/index-b6HVVwdd.js');
    }
    return { status: 'module_loaded_successfully' };
  }, 2, 10);

  assert(
    (resilientModule as any).status === 'module_loaded_successfully',
    'loadThemeWithRetry successfully recovers on retry when initial dynamic chunk fetch fails'
  );
  assert(
    dynamicChunkAttempts === 2,
    'loadThemeWithRetry retried the failed dynamic import chunk'
  );

  let failingAttempts = 0;
  let caughtError: Error | null = null;
  try {
    await loadThemeWithRetry(async () => {
      failingAttempts++;
      throw new TypeError('Failed to fetch dynamically imported module: https://chill-chill-orpin.vercel.app/assets/index-b6HVVwdd.js');
    }, 1, 10);
  } catch (err: any) {
    caughtError = err;
  }

  assert(failingAttempts === 2, 'Exhausts retries before throwing error');
  assert(
    caughtError !== null && caughtError.message.includes('Phiên bản ứng dụng đã có cập nhật mới'),
    'loadThemeWithRetry provides friendly guidance when dynamic chunk is permanently missing'
  );

  // =========================================================================
  // 12. SceneManager Authoritative intersectWater & Fallback Execution Path
  // =========================================================================
  let rippleCount = 0;
  let lastRippleCoords = { x: 0, z: 0 };

  // Create a real CPU plane mesh representing water at y = 0.3, spanning [-5, 5] in x and z
  const testWaterPlaneGeo = new THREE.PlaneGeometry(10, 10);
  testWaterPlaneGeo.rotateX(-Math.PI / 2); // facing +Y
  testWaterPlaneGeo.translate(0, 0.3, 0); // at Y = 0.3
  const testWaterMesh = new THREE.Mesh(testWaterPlaneGeo, new THREE.MeshBasicMaterial());
  testWaterMesh.name = 'TestWaterMesh';

  let mockIntersectWaterReturn: { point: THREE.Vector3; distance: number } | null = null;

  const testRaycastTheme = createFakeThemeInstance('garden');
  testRaycastTheme.isInWater = () => true;
  (testRaycastTheme as any).getWaterMesh = () => testWaterMesh;
  (testRaycastTheme as any).getWaterLevel = () => 0.3;
  testRaycastTheme.addRipple = (x: number, z: number) => {
    rippleCount++;
    lastRippleCoords = { x, z };
  };
  (testRaycastTheme as any).intersectWater = (_ray: THREE.Ray) => {
    return mockIntersectWaterReturn;
  };

  const raycastLoaderMap: Partial<Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>>> = {
    lantern:async()=>createFakeThemeInstance('lantern'),
    garden: async () => testRaycastTheme,
    beach: async () => testRaycastTheme,
  };

  const raycastSceneManager = new SceneManager(mockContainer, {
    renderer: mockRenderer,
    loaderMap: raycastLoaderMap,
  });

  await raycastSceneManager.switchTheme('garden', { ...DEFAULT_GARDEN_STATE, rippleStrength: 0.5 });

  // Position camera directly overhead looking down at (0, 0, 0)
  (raycastSceneManager as any).camera.position.set(0, 5, 0);
  (raycastSceneManager as any).camera.lookAt(0, 0, 0);
  (raycastSceneManager as any).camera.updateMatrixWorld(true);

  // Center pointer on screen: NDC (0, 0)
  (raycastSceneManager as any).mouse.set(0, 0);

  // Case 1: intersectWater returns null (e.g. authoritative theme logic says point is on land or outside footprint)
  // Even though CPU waterMesh lies directly beneath the cursor, SceneManager must treat intersectWater()
  // as the FINAL decision, abort processing, and NOT fallback to waterMesh!
  mockIntersectWaterReturn = null;
  rippleCount = 0;

  (raycastSceneManager as any).raycastAndRipple(0.65, true);

  assert(
    rippleCount === 0,
    'SceneManager terminates water interaction when intersectWater() returns null, without falling back to CPU waterMesh'
  );

  // Case 2: intersectWater returns a valid hit point
  mockIntersectWaterReturn = {
    point: new THREE.Vector3(1.5, 0.3, 2.5),
    distance: 4.7,
  };
  rippleCount = 0;

  (raycastSceneManager as any).raycastAndRipple(0.65, true);

  assert(
    rippleCount === 1 && Math.abs(lastRippleCoords.x - 1.5) < 0.01 && Math.abs(lastRippleCoords.z - 2.5) < 0.01,
    'SceneManager emits ripple at exact authoritative coordinates when intersectWater() succeeds'
  );

  // Case 3: Theme does NOT provide intersectWater (legacy theme) -> ONLY then fallback to waterMesh
  delete (testRaycastTheme as any).intersectWater;
  rippleCount = 0;

  (raycastSceneManager as any).raycastAndRipple(0.65, true);

  assert(
    rippleCount === 1,
    'SceneManager falls back to CPU waterMesh ONLY when theme does not implement intersectWater()'
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
