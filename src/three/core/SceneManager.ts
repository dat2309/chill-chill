import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  ThemeId,
  ThemeInstance,
  ThemeState,
  Quality,
  SwitchThemeResult,
  SavedCameraState,
} from './types';
import { THEME_LOADERS } from '../themes/registry';
import {
  fitOrthographicCameraToBounds,
  calculateBaseFrustumHeight,
  setCameraProjection,
} from './camera';
import { ThemeLifecycleCoordinator } from './ThemeLifecycleCoordinator';

export interface SceneManagerOptions {
  onFpsUpdate?: (fps: number) => void;
  onQualityChange?: (quality: Quality) => void;
  onThemeLoadingChange?: (loading: boolean, error?: Error | null) => void;
  onCameraChange?: (themeId: ThemeId, camera: SavedCameraState) => void;
  onReady?: () => void;
  onThemeSuccess?: (themeId: ThemeId) => void;
  onThemeError?: (error: Error) => void;
  initialQuality?: Quality;
  loaderMap?: Record<ThemeId, (renderer: any) => Promise<ThemeInstance<any>>>;
  renderer?: THREE.WebGLRenderer;
}

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.OrthographicCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly controls: OrbitControls;

  readonly coordinator: ThemeLifecycleCoordinator;
  private themeCameraStates = new Map<ThemeId, SavedCameraState>();

  private clock = new THREE.Clock();
  private animFrameId = 0;
  private isRunning = false;
  private isPaused = false;
  private isDocumentVisible = typeof document !== 'undefined' ? !document.hidden : true;
  private isIntersecting = true;
  private isContextLost = false;
  private disposed = false;
  private simTime = 0;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private isPointerOnUI = false;
  private isPointerDown = false;
  private isDragging = false;
  private pointerDownPos = new THREE.Vector2();
  private pointerMoveRafId = 0;
  private pendingPointerMove = false;
  private pendingPointerClientPos = new THREE.Vector2();
  private waterPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private waterHitPoint = new THREE.Vector3();

  // Lifecycle & Performance
  private initialized = false;
  private frameCount = 0;
  private fpsAccum = 0;
  private currentFps = 60;
  private lowFpsSeconds = 0;
  private qualityDowngraded = false;
  private currentQuality: Quality = 'high';
  private onFpsUpdate: ((fps: number) => void) | null = null;
  private onQualityChange: ((quality: Quality) => void) | null = null;
  private onCameraChange: ((themeId: ThemeId, camera: SavedCameraState) => void) | null = null;
  private onReadyCallback: (() => void) | null = null;
  private onThemeSuccessCallback: ((themeId: ThemeId) => void) | null = null;
  private onThemeErrorCallback: ((error: Error) => void) | null = null;

  // Observers
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor(container: HTMLElement, options: SceneManagerOptions = {}) {
    this.onFpsUpdate = options.onFpsUpdate ?? null;
    this.onQualityChange = options.onQualityChange ?? null;
    this.onCameraChange = options.onCameraChange ?? null;
    this.onReadyCallback = options.onReady ?? null;
    this.onThemeSuccessCallback = options.onThemeSuccess ?? null;
    this.onThemeErrorCallback = options.onThemeError ?? null;
    this.currentQuality = options.initialQuality ?? 'high';

    // WebGL Renderer (allow injected renderer for headless testing)
    this.renderer =
      options.renderer ??
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.applyQuality(this.currentQuality);
    if (!this.renderer.domElement.parentElement) {
      container.appendChild(this.renderer.domElement);
    }

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Camera
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    const initialFrustumH = 26.0;
    this.camera = new THREE.OrthographicCamera(
      (-initialFrustumH * aspect) / 2,
      (initialFrustumH * aspect) / 2,
      initialFrustumH / 2,
      -initialFrustumH / 2,
      -70,
      140
    );

    // Default isometric view
    this.camera.position.set(16.0, 15.2, 27.5);

    // Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(-0.4, 0.45, 0.0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minZoom = 0.55;
    this.controls.maxZoom = 2.2;
    this.controls.maxPolarAngle = Math.PI * 0.44;
    this.controls.minPolarAngle = Math.PI * 0.16;
    this.controls.update();

    this.controls.addEventListener('end', () => {
      const activeId = this.coordinator.getActiveThemeId();
      if (this.coordinator.getActiveTheme() && activeId) {
        const cam = this.getCameraState();
        this.themeCameraStates.set(activeId, cam);
        this.onCameraChange?.(activeId, cam);
      }
    });

    // Theme Lifecycle Coordinator
    this.coordinator = new ThemeLifecycleCoordinator({
      renderer: this.renderer,
      loaderMap: options.loaderMap ?? THEME_LOADERS,
      initialQuality: this.currentQuality,
      onThemeLoadingChange: options.onThemeLoadingChange,
      onMountTheme: (theme) => {
        this.scene.add(theme.group);
      },
      onUnmountTheme: (theme) => {
        this.scene.remove(theme.group);
      },
      onRestoreCamera: (themeId, theme, state, initialCamera) => {
        const savedCam = initialCamera || this.themeCameraStates.get(themeId) || state.cameraState;
        this.restoreCameraForTheme(themeId, theme, savedCam);
      },
      onApplyQuality: (quality) => {
        this.applyQuality(quality);
      },
    });

    // Event listeners
    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('webglcontextlost', this.onContextLost, false);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored, false);

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }

    // Observers
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      this.resizeObserver.observe(container);
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        this.isIntersecting = !!entry?.isIntersecting;
        this.updateLoopState();
      });
      this.intersectionObserver.observe(container);
    }
  }

  getActiveThemeId(): ThemeId {
    return this.coordinator.getActiveThemeId();
  }

  getRequestedThemeId(): ThemeId | null {
    return this.coordinator.getRequestedThemeId();
  }

  getActiveTheme(): ThemeInstance<any> | null {
    return this.coordinator.getActiveTheme();
  }

  getActiveThemeState(): ThemeState<any> | null {
    return this.coordinator.getActiveThemeState();
  }

  getCameraState(): SavedCameraState {
    const frustumH = this.camera.top - this.camera.bottom;
    return {
      position: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
      target: [this.controls.target.x, this.controls.target.y, this.controls.target.z],
      zoom: this.camera.zoom,
      baseFrustumHeight: Number.isFinite(frustumH) && frustumH > 0 ? frustumH : undefined,
    };
  }

  setCameraState(cam: SavedCameraState): void {
    this.camera.position.set(...cam.position);
    this.controls.target.set(...cam.target);
    this.camera.zoom = cam.zoom;
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  /**
   * Recalculates and restores camera projection and position specifically for the target theme.
   * Guarantees that frustum boundaries are calibrated to target theme bounds and viewport aspect ratio,
   * completely eliminating projection leakage or distortion from previous themes.
   */
  restoreCameraForTheme(
    _targetThemeId: ThemeId,
    newTheme: ThemeInstance<any>,
    savedCam?: SavedCameraState
  ): void {
    const parent = this.renderer.domElement.parentElement;
    const w = parent ? parent.clientWidth : this.renderer.domElement.width;
    const h = parent ? parent.clientHeight : this.renderer.domElement.height;
    const aspect = w > 0 && h > 0 ? w / h : 1.0;

    let frustumH = savedCam?.baseFrustumHeight;
    if (typeof frustumH !== 'number' || !Number.isFinite(frustumH) || frustumH <= 5 || frustumH > 100) {
      if (newTheme.cameraPreset?.baseFrustumHeight) {
        frustumH = newTheme.cameraPreset.baseFrustumHeight;
      } else {
        frustumH = calculateBaseFrustumHeight(this.camera, this.renderer, newTheme.group);
      }
    }

    setCameraProjection(this.camera, frustumH, aspect);

    if (savedCam) {
      this.camera.position.set(...savedCam.position);
      this.controls.target.set(...savedCam.target);
      this.camera.zoom = savedCam.zoom;
    } else if (newTheme.cameraPreset) {
      this.camera.position.copy(newTheme.cameraPreset.position);
      this.controls.target.copy(newTheme.cameraPreset.target);
      this.camera.zoom = 1.0;
    }

    if (newTheme.cameraPreset) {
      this.controls.minPolarAngle = newTheme.cameraPreset.minPolarAngle ?? Math.PI * 0.16;
      this.controls.maxPolarAngle = newTheme.cameraPreset.maxPolarAngle ?? Math.PI * 0.44;
    }

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const camParam = urlParams.get('camera');
      if (camParam === 'top') {
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI;
        this.camera.position.set(0, 35, 0.001);
        this.controls.target.set(0, 0, 0);
      } else if (camParam === 'side') {
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI * 0.5;
        this.camera.position.set(35, 2, 0);
        this.controls.target.set(0, 0, 0);
      }
    }

    this.camera.updateProjectionMatrix();
    this.controls.update();
    if (!savedCam) {
      // Fit after choosing the viewing direction, including top/side reviews.
      // The full rectangular display must also fit narrow mobile viewports.
      const fittedHeight = calculateBaseFrustumHeight(this.camera, this.renderer, newTheme.group);
      setCameraProjection(this.camera, Math.max(frustumH, fittedHeight), aspect);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  isStarted(): boolean {
    return this.isRunning;
  }

  /**
   * Unified transition pipeline for initial load, theme switching, and retry.
   * Guarantees:
   * - Starts renderer on first success exactly once without duplicate RAF loops.
   * - Emits onReady and onThemeSuccess callbacks on commit.
   * - Emits onThemeError on failure without leaving permanent WebGL error.
   */
  async switchTheme(
    targetThemeId: ThemeId,
    targetState: ThemeState<any>,
    initialCamera?: SavedCameraState
  ): Promise<SwitchThemeResult> {
    if (this.disposed) return { status: 'cancelled' };

    // Save camera for current active theme before switching
    const activeTheme = this.coordinator.getActiveTheme();
    const activeThemeId = this.coordinator.getActiveThemeId();
    if (activeTheme && activeThemeId) {
      this.themeCameraStates.set(activeThemeId, this.getCameraState());
    }

    const result = await this.coordinator.switchTheme(targetThemeId, targetState, initialCamera);

    if (this.disposed) return { status: 'cancelled' };

    if (result.status === 'success') {
      if (!this.initialized) {
        this.initialized = true;
        this.start();
        this.onReadyCallback?.();
      }
      this.onThemeSuccessCallback?.(targetThemeId);
    } else if (result.status === 'failed') {
      this.onThemeErrorCallback?.(result.error);
    }

    return result;
  }

  /**
   * Apply partial state updates to the currently active theme.
   * State is verified to match activeThemeId, preventing foreign theme state leakage.
   */
  updateState(
    themeIdOrPatch: ThemeId | Partial<ThemeState<any>>,
    maybePatch?: Partial<ThemeState<any>>
  ): void {
    this.coordinator.updateState(themeIdOrPatch, maybePatch);
  }

  setQuality(quality: Quality): void {
    this.currentQuality = quality;
    this.coordinator.setQuality(quality);
    this.applyQuality(quality);
  }

  private applyQuality(quality: Quality): void {
    this.currentQuality = quality;
    const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
    if (quality === 'low') {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
    } else if (quality === 'medium') {
      this.renderer.setPixelRatio(Math.min(dpr, 1.25));
      this.renderer.shadowMap.enabled = true;
    } else {
      this.renderer.setPixelRatio(Math.min(dpr, 2));
      this.renderer.shadowMap.enabled = true;
    }
  }

  start(): void {
    if (this.disposed) return;
    this.isRunning = true;
    this.updateLoopState();
  }

  pause(): void {
    this.isPaused = true;
    this.updateLoopState();
  }

  resume(): void {
    this.isPaused = false;
    this.updateLoopState();
  }

  private updateLoopState(): void {
    const shouldRun =
      this.isRunning &&
      !this.disposed &&
      !this.isPaused &&
      this.isDocumentVisible &&
      this.isIntersecting &&
      !this.isContextLost;

    if (shouldRun) {
      if (this.animFrameId === 0 && typeof requestAnimationFrame !== 'undefined') {
        this.clock.getDelta(); // flush delta to avoid sudden time jumps
        this.animFrameId = requestAnimationFrame(this.animate);
      }
    } else {
      if (this.animFrameId !== 0 && typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.animFrameId);
        this.animFrameId = 0;
      }
    }
  }

  private onVisibilityChange = (): void => {
    this.isDocumentVisible = !document.hidden;
    this.updateLoopState();
  };

  private onContextLost = (e: Event): void => {
    e.preventDefault();
    this.isContextLost = true;
    this.updateLoopState();
    console.warn('WebGL context lost.');
  };

  private onContextRestored = (): void => {
    this.isContextLost = false;
    const active = this.coordinator.getActiveTheme();
    (active as any)?.onContextRestored?.();
    this.updateLoopState();
    console.info('WebGL context restored.');
  };

  private animate = (): void => {
    if (this.disposed) return;
    this.animFrameId = 0;

    const shouldRun =
      this.isRunning &&
      !this.isPaused &&
      this.isDocumentVisible &&
      this.isIntersecting &&
      !this.isContextLost;

    if (!shouldRun) return;

    this.animFrameId = requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);
    this.simTime += dt;

    // FPS measurement
    this.frameCount++;
    this.fpsAccum += dt;
    if (this.fpsAccum >= 0.5) {
      this.currentFps = Math.round(this.frameCount / this.fpsAccum);
      this.frameCount = 0;
      this.fpsAccum = 0;
      this.onFpsUpdate?.(this.currentFps);

      // Dynamic quality adaptation: downgrade if FPS < 30 for 3 consecutive intervals
      if (this.currentFps < 30) {
        this.lowFpsSeconds += 0.5;
        if (this.lowFpsSeconds >= 1.5 && !this.qualityDowngraded) {
          if (this.currentQuality === 'high') {
            this.setQuality('medium');
            this.onQualityChange?.('medium');
            this.lowFpsSeconds = 0;
          } else if (this.currentQuality === 'medium') {
            this.setQuality('low');
            this.onQualityChange?.('low');
            this.qualityDowngraded = true;
          }
        }
      } else {
        this.lowFpsSeconds = Math.max(0, this.lowFpsSeconds - 0.25);
      }
    }

    // Auto rotate controls
    const activeState = this.coordinator.getActiveThemeState();
    if (activeState?.autoRotate) {
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.8;
    } else {
      this.controls.autoRotate = false;
    }

    this.controls.update();

    // Update active theme with continuous simulation time
    const activeTheme = this.coordinator.getActiveTheme();
    if (activeTheme && activeState) {
      activeTheme.update(dt, this.simTime, activeState);
    }

    this.renderer.render(this.scene, this.camera);
  };

  private handleResize(): void {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w <= 0 || h <= 0) return;

    const aspect = w / h;
    const currentFrustumH = (this.camera.top - this.camera.bottom) || 26.0;
    // A desktop frustum reused at a narrow aspect clips a wide diorama.
    // Refit the active content; retain the existing orbit target and camera.zoom.
    const activeTheme=this.coordinator.getActiveTheme();
    const fittedHeight=activeTheme
      ? calculateBaseFrustumHeight(this.camera,this.renderer,activeTheme.group)
      : currentFrustumH;
    setCameraProjection(this.camera,fittedHeight,aspect);
    this.renderer.setSize(w, h);
  }

  fitCamera(): void {
    fitOrthographicCameraToBounds(this.camera, this.renderer, this.scene);
  }

  resetCurrentTheme(defaultState: ThemeState<any>): void {
    const activeTheme = this.coordinator.getActiveTheme();
    const activeThemeId = this.coordinator.getActiveThemeId();
    if (!activeTheme) return;

    // Reset saved camera strictly for active theme
    this.themeCameraStates.delete(activeThemeId);

    if (activeTheme.cameraPreset) {
      this.camera.position.copy(activeTheme.cameraPreset.position);
      this.controls.target.copy(activeTheme.cameraPreset.target);
      this.camera.zoom = 1.0;
      this.controls.minPolarAngle = activeTheme.cameraPreset.minPolarAngle ?? Math.PI * 0.16;
      this.controls.maxPolarAngle = activeTheme.cameraPreset.maxPolarAngle ?? Math.PI * 0.44;
    }

    this.fitCamera();
    this.updateState(defaultState);

    const camState = this.getCameraState();
    this.themeCameraStates.set(activeThemeId, camState);
    this.onCameraChange?.(activeThemeId, camState);
  }

  // --- Interaction & Ripple Dispatch ---
  private onPointerMove = (e: PointerEvent): void => {
    if (this.isPointerDown) {
      const dx = e.clientX - this.pointerDownPos.x;
      const dy = e.clientY - this.pointerDownPos.y;
      if (dx * dx + dy * dy > 16) this.isDragging = true;
    }
    const activeTheme = this.coordinator.getActiveTheme();
    if (this.isDragging || this.isPointerOnUI || !activeTheme) return;

    this.pendingPointerClientPos.set(e.clientX, e.clientY);
    if (!this.pendingPointerMove) {
      this.pendingPointerMove = true;
      if (typeof requestAnimationFrame !== 'undefined') {
        this.pointerMoveRafId = requestAnimationFrame(this.handleThrottledPointerMove);
      } else {
        this.handleThrottledPointerMove();
      }
    }
  };

  private handleThrottledPointerMove = (): void => {
    this.pendingPointerMove = false;
    this.pointerMoveRafId = 0;
    if (this.disposed || this.isDragging || this.isPointerOnUI) return;
    const activeTheme = this.coordinator.getActiveTheme();
    if (!activeTheme) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    this.mouse.x = ((this.pendingPointerClientPos.x - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((this.pendingPointerClientPos.y - rect.top) / rect.height) * 2 + 1;

    this.raycastAndRipple(0.18, false);
  };

  private onPointerDown = (e: PointerEvent): void => {
    this.isPointerDown = true;
    this.isDragging = false;
    this.pointerDownPos.set(e.clientX, e.clientY);
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (this.pointerMoveRafId !== 0 && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.pointerMoveRafId);
      this.pointerMoveRafId = 0;
      this.pendingPointerMove = false;
    }
    const activeTheme = this.coordinator.getActiveTheme();
    if (!this.isDragging && !this.isPointerOnUI && activeTheme) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycastAndRipple(0.65, true);
    }
    this.isPointerDown = false;
    this.isDragging = false;
  };

  private raycastAndRipple(baseStrength: number, isSplash: boolean): void {
    const activeTheme = this.coordinator.getActiveTheme();
    const activeState = this.coordinator.getActiveThemeState();
    if (!activeTheme || !activeState || this.isDragging) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    let hitX: number | null = null;
    let hitZ: number | null = null;
    let waterDist = Infinity;

    // 1. Authoritative theme-specific water surface intersection:
    // If the theme provides intersectWater(), its result is the FINAL decision.
    // If it returns null, terminate water interaction immediately without fallback.
    if (activeTheme.intersectWater) {
      const waterHit = activeTheme.intersectWater(this.raycaster.ray);
      if (!waterHit) {
        return;
      }
      hitX = waterHit.point.x;
      hitZ = waterHit.point.z;
      waterDist = waterHit.distance;
    } else {
      // 2. ONLY fallback when theme does NOT provide intersectWater()
      const waterMesh = activeTheme.getWaterMesh?.();
      if (waterMesh && waterMesh.visible) {
        const hits = this.raycaster.intersectObject(waterMesh, false);
        for (const h of hits) {
          // Reject vertical cuts / skirts (normal pointing horizontally)
          if (h.face && Math.abs(h.face.normal.y) < 0.25) continue;
          hitX = h.point.x;
          hitZ = h.point.z;
          waterDist = h.distance;
          break;
        }
      }

      // 3. Mathematical plane intersection fallback ONLY for flat water themes without intersectWater
      if ((hitX === null || hitZ === null) && activeTheme.id !== 'garden') {
        const waterLevel = activeTheme.getWaterLevel?.() ?? 0.3;
        this.waterPlane.set(new THREE.Vector3(0, 1, 0), -waterLevel);
        const planeHit = this.raycaster.ray.intersectPlane(this.waterPlane, this.waterHitPoint);
        if (planeHit && activeTheme.isInWater(planeHit.x, planeHit.z)) {
          hitX = planeHit.x;
          hitZ = planeHit.z;
          waterDist = this.raycaster.ray.origin.distanceTo(planeHit);
        }
      }
    }

    if (hitX !== null && hitZ !== null && activeTheme.isInWater(hitX, hitZ)) {
      // Fast analytical / AABB occlusion check
      const hitPt = this.waterHitPoint.set(hitX, activeTheme.getWaterLevel?.() ?? 0.3, hitZ);
      if (activeTheme.isWaterVisibleAt && !activeTheme.isWaterVisibleAt(hitPt, this.raycaster.ray)) {
        return;
      }

      activeTheme.addRipple(hitX, hitZ, baseStrength * activeState.rippleStrength);
      if (isSplash) {
        activeTheme.reactToSplash(hitX, hitZ);
      }
    }
  }

  setPointerOnUI(v: boolean): void {
    this.isPointerOnUI = v;
  }

  dispose(): void {
    this.disposed = true;
    this.initialized = false;
    this.isRunning = false;
    this.onReadyCallback = null;
    this.onThemeSuccessCallback = null;
    this.onThemeErrorCallback = null;
    if (this.animFrameId !== 0 && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = 0;
    }
    if (this.pointerMoveRafId !== 0 && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.pointerMoveRafId);
      this.pointerMoveRafId = 0;
      this.pendingPointerMove = false;
    }

    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointermove', this.onPointerMove);
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointerup', this.onPointerUp);
    canvas.removeEventListener('webglcontextlost', this.onContextLost);
    canvas.removeEventListener('webglcontextrestored', this.onContextRestored);

    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();

    this.coordinator.dispose();
    this.controls.dispose();
    this.renderer.dispose();
    canvas.remove();
  }
}
