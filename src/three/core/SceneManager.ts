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

  private clock = new THREE.Clock();
  private animFrameId = 0;
  private isPaused = false;
  private disposed = false;

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
      if (entry?.isIntersecting) {
        this.resume();
      } else {
        this.pause();
      }
    });
    this.intersectionObserver.observe(container);
  }

  getActiveThemeId(): ThemeId {
    return this.activeThemeId;
  }

  getActiveTheme(): ThemeInstance<any> | null {
    return this.activeTheme;
  }

  /**
   * Switch active diorama theme safely with cancellation handling.
   */
  async switchTheme(
    targetThemeId: ThemeId,
    targetState: ThemeState<any>,
    initialCamera?: { position: [number, number, number]; target: [number, number, number]; zoom: number }
  ): Promise<void> {
    if (this.disposed) return;

    const switchToken = ++this.currentSwitchToken;
    this.onThemeLoadingChange?.(true, null);

    try {
      // 1. Dispose old theme if present and remove from scene
      if (this.activeTheme) {
        this.scene.remove(this.activeTheme.group);
        this.activeTheme.dispose();
        this.activeTheme = null;
      }

      // 2. Load target theme factory dynamically
      const loader = THEME_LOADERS[targetThemeId];
      if (!loader) {
        throw new Error(`Unknown theme loader for ID: ${targetThemeId}`);
      }

      const newTheme = await loader(this.renderer);

      // Check if another switch request intervened
      if (switchToken !== this.currentSwitchToken || this.disposed) {
        newTheme.dispose();
        return;
      }

      // 3. Initialize theme
      await newTheme.init();

      if (switchToken !== this.currentSwitchToken || this.disposed) {
        newTheme.dispose();
        return;
      }

      // 4. Attach new theme root group to scene
      this.activeTheme = newTheme;
      this.activeThemeId = targetThemeId;
      this.activeThemeState = { ...targetState };
      this.scene.add(newTheme.group);

      // 5. Apply state to theme
      newTheme.applyState(this.activeThemeState);

      // 6. Restore or calibrate camera
      if (initialCamera) {
        this.camera.position.set(...initialCamera.position);
        this.controls.target.set(...initialCamera.target);
        this.camera.zoom = initialCamera.zoom;
      } else if (newTheme.cameraPreset) {
        this.camera.position.copy(newTheme.cameraPreset.position);
        this.controls.target.copy(newTheme.cameraPreset.target);
        this.camera.zoom = 1.0;
      }
      this.controls.update();

      // 7. Adjust quality settings on renderer
      this.applyQuality(targetState.quality ?? 'high');

      // 8. Fit camera bounds
      this.fitCamera();

      this.onThemeLoadingChange?.(false, null);
    } catch (err: any) {
      console.error('Failed to switch theme:', err);
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
    this.clock.start();
    this.isPaused = false;
    this.animate();
  }

  pause(): void {
    if (this.isPaused) return;
    this.isPaused = true;
    cancelAnimationFrame(this.animFrameId);
    this.clock.stop();
  }

  resume(): void {
    if (!this.isPaused || this.disposed) return;
    this.isPaused = false;
    this.clock.start();
    this.animate();
  }

  private onVisibilityChange = (): void => {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  };

  private onContextLost = (e: Event): void => {
    e.preventDefault();
    this.pause();
    console.warn('WebGL context lost.');
  };

  private onContextRestored = (): void => {
    console.info('WebGL context restored.');
    this.resume();
  };

  private animate = (): void => {
    if (this.disposed || this.isPaused) return;
    this.animFrameId = requestAnimationFrame(this.animate);

    const dt = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

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

    // Update active theme (NO if (theme === ...) branch!)
    if (this.activeTheme && this.activeThemeState) {
      this.activeTheme.update(dt, elapsed, this.activeThemeState);
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
    if (!this.activeTheme || !this.activeThemeState) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    // Raycast against active theme group
    const hits = this.raycaster.intersectObjects(this.activeTheme.group.children, true);
    for (const hit of hits) {
      const pt = hit.point;
      // Delegate to active theme's isInWater
      if (this.activeTheme.isInWater(pt.x, pt.z)) {
        this.activeTheme.addRipple(pt.x, pt.z, baseStrength * this.activeThemeState.rippleStrength);
        if (isSplash) {
          this.activeTheme.reactToSplash(pt.x, pt.z);
        }
        break;
      }
    }
  }

  setPointerOnUI(v: boolean): void {
    this.isPointerOnUI = v;
  }

  dispose(): void {
    this.disposed = true;
    this.currentSwitchToken++;
    cancelAnimationFrame(this.animFrameId);

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
