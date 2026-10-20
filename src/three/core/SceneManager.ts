import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {
  ThemeId,
  ThemeInstance,
  ThemeState,
  Quality,
} from './types';
import { THEME_LOADERS } from '../themes/registry';
import { fitOrthographicCameraToBounds } from './camera';

export interface SceneManagerOptions {
  onFpsUpdate?: (fps: number) => void;
  onQualityChange?: (quality: Quality) => void;
  onThemeLoadingChange?: (loading: boolean, error?: Error | null) => void;
}

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.OrthographicCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly controls: OrbitControls;

  private activeTheme: ThemeInstance<any> | null = null;
  private activeThemeId: ThemeId = 'garden';
  private activeThemeState: ThemeState<any> | null = null;
  private themeCameraStates = new Map<
    ThemeId,
    { position: [number, number, number]; target: [number, number, number]; zoom: number }
  >();

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

  // Switch theme cancellation token
  private currentSwitchToken = 0;

  // FPS & Performance
  private frameCount = 0;
  private fpsAccum = 0;
  private currentFps = 60;
  private lowFpsSeconds = 0;
  private qualityDowngraded = false;
  private currentQuality: Quality = 'high';
  private onFpsUpdate: ((fps: number) => void) | null = null;
  private onQualityChange: ((quality: Quality) => void) | null = null;
  private onThemeLoadingChange: ((loading: boolean, error?: Error | null) => void) | null = null;

  // Observers
  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor(container: HTMLElement, options: SceneManagerOptions = {}) {
    this.onFpsUpdate = options.onFpsUpdate ?? null;
    this.onQualityChange = options.onQualityChange ?? null;
    this.onThemeLoadingChange = options.onThemeLoadingChange ?? null;

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(this.renderer.domElement);

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
    this.camera.position.set(26.0, 23.0, 26.0);

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

    // Event listeners
    const canvas = this.renderer.domElement;
    canvas.addEventListener('pointermove', this.onPointerMove);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    canvas.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('webglcontextlost', this.onContextLost, false);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored, false);

    document.addEventListener('visibilitychange', this.onVisibilityChange);

    // Observers
    this.resizeObserver = new ResizeObserver(() => {
      this.fitCamera();
    });
    this.resizeObserver.observe(container);

    this.intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      this.isIntersecting = !!entry?.isIntersecting;
      this.updateLoopState();
    });
    this.intersectionObserver.observe(container);
  }

  getActiveThemeId(): ThemeId {
    return this.activeThemeId;
  }

  getActiveTheme(): ThemeInstance<any> | null {
    return this.activeTheme;
  }

  getCameraState(): { position: [number, number, number]; target: [number, number, number]; zoom: number } {
    return {
      position: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
      target: [this.controls.target.x, this.controls.target.y, this.controls.target.z],
      zoom: this.camera.zoom,
    };
  }

  setCameraState(cam: { position: [number, number, number]; target: [number, number, number]; zoom: number }): void {
    this.camera.position.set(...cam.position);
    this.controls.target.set(...cam.target);
    this.camera.zoom = cam.zoom;
    this.controls.update();
  }

  /**
   * Switch active diorama theme safely with cancellation handling and no blank frames.
   */
  async switchTheme(
    targetThemeId: ThemeId,
    targetState: ThemeState<any>,
    initialCamera?: { position: [number, number, number]; target: [number, number, number]; zoom: number }
  ): Promise<void> {
    if (this.disposed) return;

    const switchToken = ++this.currentSwitchToken;
    this.onThemeLoadingChange?.(true, null);

    // Save current camera for outgoing active theme
    if (this.activeTheme && this.activeThemeId) {
      this.themeCameraStates.set(this.activeThemeId, this.getCameraState());
    }

    let newTheme: ThemeInstance<any> | null = null;
    try {
      // 1. Load target theme factory dynamically (old theme keeps rendering!)
      const loader = THEME_LOADERS[targetThemeId];
      if (!loader) {
        throw new Error(`Unknown theme loader for ID: ${targetThemeId}`);
      }

      newTheme = await loader(this.renderer);

      // Check if cancelled
      if (switchToken !== this.currentSwitchToken || this.disposed) {
        newTheme.dispose();
        return;
      }

      // 2. Initialize new theme asynchronously
      await newTheme.init();

      if (switchToken !== this.currentSwitchToken || this.disposed) {
        newTheme.dispose();
        return;
      }

      // 3. New theme is completely ready: now atomically unmount and dispose old theme
      if (this.activeTheme) {
        this.scene.remove(this.activeTheme.group);
        this.activeTheme.dispose();
        this.activeTheme = null;
      }

      // 4. Attach new theme root group to scene
      this.activeTheme = newTheme;
      this.activeThemeId = targetThemeId;
      this.activeThemeState = { ...targetState };
      this.scene.add(newTheme.group);

      // 5. Apply state to theme
      newTheme.applyState(this.activeThemeState);

      // 6. Restore or calibrate camera
      const savedCam = initialCamera || this.themeCameraStates.get(targetThemeId);
      if (savedCam) {
        this.camera.position.set(...savedCam.position);
        this.controls.target.set(...savedCam.target);
        this.camera.zoom = savedCam.zoom;
      } else if (newTheme.cameraPreset) {
        this.camera.position.copy(newTheme.cameraPreset.position);
        this.controls.target.copy(newTheme.cameraPreset.target);
        this.camera.zoom = 1.0;
      }
      this.controls.update();

      // 7. Adjust quality settings on renderer
      this.applyQuality(targetState.quality ?? 'high');

      // 8. Fit camera bounds if no preset/saved camera was used
      if (!savedCam) {
        this.fitCamera();
      }

      this.onThemeLoadingChange?.(false, null);
    } catch (err: any) {
      console.error('Failed to switch theme:', err);
      if (newTheme) {
        try {
          newTheme.dispose();
        } catch (disposeErr) {
          console.warn('Error disposing aborted theme:', disposeErr);
        }
      }
      // Old theme remains safely active
      if (switchToken === this.currentSwitchToken) {
        this.onThemeLoadingChange?.(false, err instanceof Error ? err : new Error(String(err)));
      }
    }
  }

  /**
   * Apply partial state updates to the currently active theme.
   */
  updateState(patch: Partial<ThemeState<any>>): void {
    if (!this.activeTheme || !this.activeThemeState) return;

    const prevState = { ...this.activeThemeState };
    Object.assign(this.activeThemeState, patch);

    if (patch.quality && patch.quality !== prevState.quality) {
      this.applyQuality(patch.quality);
    }

    this.activeTheme.applyState(this.activeThemeState);
  }

  setQuality(quality: Quality): void {
    this.currentQuality = quality;
    this.applyQuality(quality);
  }

  private applyQuality(quality: Quality): void {
    this.currentQuality = quality;
    if (quality === 'low') {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
    } else if (quality === 'medium') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      this.renderer.shadowMap.enabled = true;
    } else {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
      if (this.animFrameId === 0) {
        this.clock.getDelta(); // flush delta to avoid sudden time jumps
        this.animFrameId = requestAnimationFrame(this.animate);
      }
    } else {
      if (this.animFrameId !== 0) {
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

      // Auto quality step-down if FPS < 30 for 3 continuous seconds
      if (this.currentFps < 30) {
        this.lowFpsSeconds += 0.5;
        if (this.lowFpsSeconds >= 3.0 && !this.qualityDowngraded) {
          if (this.currentQuality === 'high') {
            this.setQuality('medium');
            this.onQualityChange?.('medium');
            this.lowFpsSeconds = 0;
          } else if (this.currentQuality === 'medium') {
            this.setQuality('low');
            this.onQualityChange?.('low');
            this.qualityDowngraded = true;
            this.lowFpsSeconds = 0;
          }
        }
      } else {
        this.lowFpsSeconds = Math.max(0, this.lowFpsSeconds - 0.25);
      }
    }

    // Auto rotate
    if (this.activeThemeState) {
      this.controls.autoRotate = this.activeThemeState.autoRotate;
      this.controls.autoRotateSpeed = 0.6;
    }
    this.controls.update();

    // Update active theme with smooth continuous simulation time
    if (this.activeTheme && this.activeThemeState) {
      this.activeTheme.update(dt, this.simTime, this.activeThemeState);
    }

    this.renderer.render(this.scene, this.camera);
  };

  fitCamera(): void {
    fitOrthographicCameraToBounds(this.camera, this.renderer, this.scene, {
      paddingX: 1.16,
      paddingY: 1.28,
      minFrustumHeight: 23.5,
    });
  }

  resetCurrentTheme(defaultState: ThemeState<any>): void {
    if (!this.activeTheme) return;

    if (this.activeTheme.cameraPreset) {
      this.camera.position.copy(this.activeTheme.cameraPreset.position);
      this.controls.target.copy(this.activeTheme.cameraPreset.target);
      this.camera.zoom = 1.0;
      this.controls.update();
    }

    this.updateState(defaultState);
    this.fitCamera();
  }

  // --- Interaction & Ripple Dispatch ---
  private onPointerMove = (e: PointerEvent): void => {
    if (this.isPointerDown) {
      const dx = e.clientX - this.pointerDownPos.x;
      const dy = e.clientY - this.pointerDownPos.y;
      if (dx * dx + dy * dy > 16) this.isDragging = true;
    }
    if (this.isDragging || this.isPointerOnUI || !this.activeTheme) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycastAndRipple(0.18, false);
  };

  private onPointerDown = (e: PointerEvent): void => {
    this.isPointerDown = true;
    this.isDragging = false;
    this.pointerDownPos.set(e.clientX, e.clientY);
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.isDragging && !this.isPointerOnUI && this.activeTheme) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycastAndRipple(0.65, true);
    }
    this.isPointerDown = false;
    this.isDragging = false;
  };

  private raycastAndRipple(baseStrength: number, isSplash: boolean): void {
    if (!this.activeTheme || !this.activeThemeState || this.isDragging) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.activeTheme.group.children, true);
    if (hits.length === 0) return;

    const waterLevel = this.activeTheme.getWaterLevel?.() ?? 0.3;

    for (const hit of hits) {
      const meshName = (hit.object.name || '').toLowerCase();
      // Ignore helper, sky, or rain objects
      if (meshName.includes('helper') || meshName.includes('rain') || meshName.includes('sky')) {
        continue;
      }

      const pt = hit.point;
      const isWaterSurfaceOrBelow = pt.y <= waterLevel + 0.08;

      if (isWaterSurfaceOrBelow && this.activeTheme.isInWater(pt.x, pt.z)) {
        this.activeTheme.addRipple(pt.x, pt.z, baseStrength * this.activeThemeState.rippleStrength);
        if (isSplash) {
          this.activeTheme.reactToSplash(pt.x, pt.z);
        }
        break;
      }

      // If the top-most solid object is an obstacle above water (pier, bungalow, boat, rock, plateau),
      // it occludes the water beneath it -> do not trigger water ripple underneath
      break;
    }
  }

  setPointerOnUI(v: boolean): void {
    this.isPointerOnUI = v;
  }

  dispose(): void {
    this.disposed = true;
    this.currentSwitchToken++;
    this.isRunning = false;
    if (this.animFrameId !== 0) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = 0;
    }

    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    const canvas = this.renderer.domElement;
    canvas.removeEventListener('pointermove', this.onPointerMove);
    canvas.removeEventListener('pointerdown', this.onPointerDown);
    canvas.removeEventListener('pointerup', this.onPointerUp);
    canvas.removeEventListener('webglcontextlost', this.onContextLost);
    canvas.removeEventListener('webglcontextrestored', this.onContextRestored);

    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();

    if (this.activeTheme) {
      this.scene.remove(this.activeTheme.group);
      this.activeTheme.dispose();
      this.activeTheme = null;
    }

    this.controls.dispose();
    this.renderer.dispose();
    canvas.remove();
  }
}
