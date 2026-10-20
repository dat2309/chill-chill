import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SceneState, DEFAULT_STATE, Season, Quality } from './constants';
import { createTerrain, TerrainSystem } from './terrain';
import { createWater, WaterSystem } from './water';
import { createArchitecture, ArchitectureSystem } from './architecture';
import { createVegetation, VegetationSystem } from './vegetation';
import { createFish, FishSystem } from './fish';
import { createLighting, LightingSystem } from './lighting';

export class SceneManager {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;

  terrain: TerrainSystem | null = null;
  water: WaterSystem | null = null;
  architecture: ArchitectureSystem | null = null;
  vegetation: VegetationSystem | null = null;
  fish: FishSystem | null = null;
  lighting: LightingSystem | null = null;

  state: SceneState = { ...DEFAULT_STATE };
  private clock = new THREE.Clock();
  private animFrameId = 0;
  private isPaused = false;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private isPointerOnUI = false;
  private isPointerDown = false;
  private isDragging = false;
  private pointerDownPos = new THREE.Vector2();

  private frameCount = 0;
  private fpsAccum = 0;
  private currentFps = 60;
  private lowFpsSeconds = 0;
  private qualityDowngraded = false;
  private onFpsUpdate: ((fps: number) => void) | null = null;
  private onQualityChange: ((quality: Quality) => void) | null = null;

  private prevSeason: Season = DEFAULT_STATE.season;
  private seasonBlend = 1;
  private seasonBlendTarget = 1;
  private disposed = false;

  private resizeObserver: ResizeObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;

  // Isometric viewpoint: looking down from (+X, +Y, +Z)
  private initialTarget = new THREE.Vector3(-0.4, 0.45, 0.0);
  private initialCameraPos = new THREE.Vector3(26.0, 23.0, 26.0);

  constructor(
    container: HTMLElement,
    onFps?: (fps: number) => void,
    onQualityChange?: (quality: Quality) => void
  ) {
    this.onFpsUpdate = onFps ?? null;
    this.onQualityChange = onQualityChange ?? null;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.state.autoRotate = false;
      this.state.windStrength = 0.1;
      this.state.flowSpeed = 0.25;
    }

    // Renderer with transparent canvas so CSS paper-cream background shows through
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

    // Initial orthographic camera; will be calibrated precisely via fitCameraToBounds()
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
    this.camera.position.copy(this.initialCameraPos);

    // Orbit Controls with restricted polar angles
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.copy(this.initialTarget);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minZoom = 0.55;
    this.controls.maxZoom = 2.2;
    this.controls.maxPolarAngle = Math.PI * 0.44; // Prevent viewing through bottom
    this.controls.minPolarAngle = Math.PI * 0.16; // Prevent vertical distortion
    this.controls.update();

    // Event listeners
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp);

    const canvas = this.renderer.domElement;
    canvas.addEventListener('webglcontextlost', this.onContextLost, false);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored, false);

    document.addEventListener('visibilitychange', this.onVisibilityChange);

    // ResizeObserver on container for exact fluid viewport tracking
    this.resizeObserver = new ResizeObserver(() => {
      this.fitCameraToBounds();
    });
    this.resizeObserver.observe(container);

    // IntersectionObserver to pause rendering when offscreen
    this.intersectionObserver = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        this.resume();
      } else {
        this.pause();
      }
    });
    this.intersectionObserver.observe(container);
  }

  async init(): Promise<void> {
    try {
      this.terrain = createTerrain(this.scene);
      await new Promise((r) => requestAnimationFrame(r));

      this.water = createWater(
        this.renderer,
        this.scene,
        this.terrain.getHeightAt
      );
      await new Promise((r) => requestAnimationFrame(r));

      this.architecture = createArchitecture(
        this.scene,
        this.terrain.getHeightAt
      );
      await new Promise((r) => requestAnimationFrame(r));

      this.vegetation = createVegetation(
        this.scene,
        this.terrain.getHeightAt,
        this.terrain.getSlopeAt,
        this.terrain.isInStream,
        this.terrain.isOnPlateau
      );
      await new Promise((r) => requestAnimationFrame(r));

      this.fish = createFish(
        this.scene,
        this.terrain.getHeightAt,
        this.terrain.isInStream
      );
      await new Promise((r) => requestAnimationFrame(r));

      this.lighting = createLighting(this.scene);
      this.lighting.setupEmissiveMeshes(this.scene);

      // Apply initial Spring 16:30 state
      this.lighting.update(this.state);
      this.water.setTide(this.state.tide, false);
      this.terrain.updateSeason(this.state.season, 1);
      this.vegetation.updateSeason(this.state.season, 1);
      this.architecture.updateSeason(this.state.season, 1);

      // Fit camera to diorama bounds
      this.fitCameraToBounds();
    } catch (e) {
      console.error('SceneManager init error:', e);
      throw e;
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

      // Auto quality degradation if FPS < 30 for ~3 seconds
      if (this.currentFps < 30) {
        this.lowFpsSeconds += 0.5;
        if (this.lowFpsSeconds >= 3.0 && !this.qualityDowngraded) {
          if (this.state.quality === 'high') {
            this.updateState({ quality: 'medium' });
            this.onQualityChange?.('medium');
            this.lowFpsSeconds = 0;
          } else if (this.state.quality === 'medium') {
            this.updateState({ quality: 'low' });
            this.onQualityChange?.('low');
            this.qualityDowngraded = true;
            this.lowFpsSeconds = 0;
          }
        }
      } else {
        this.lowFpsSeconds = Math.max(0, this.lowFpsSeconds - 0.25);
      }
    }

    // Season blend interpolation
    if (this.seasonBlend < this.seasonBlendTarget) {
      this.seasonBlend = Math.min(this.seasonBlend + dt * 0.9, 1);
      this.terrain?.updateSeason(this.state.season, this.seasonBlend);
      this.vegetation?.updateSeason(this.state.season, this.seasonBlend);
      this.architecture?.updateSeason(this.state.season, this.seasonBlend);
    }

    // Auto rotate
    this.controls.autoRotate = this.state.autoRotate;
    this.controls.autoRotateSpeed = 0.6;
    this.controls.update();

    // Update systems
    this.water?.update(dt, elapsed, this.state);
    this.architecture?.update(dt, elapsed, this.state.timeOfDay);
    this.vegetation?.update(dt, elapsed, this.state.windStrength);
    this.fish?.update(dt, elapsed, this.water?.getWaterLevel() ?? 0.28);
    this.lighting?.update(this.state);

    // Sync water shader sun direction
    if (this.water && this.lighting) {
      const wm = this.water.mesh.material as THREE.ShaderMaterial;
      if (wm.uniforms) {
        wm.uniforms.uSunDirection?.value?.copy(this.lighting.sunDirection);
        wm.uniforms.uSunColor?.value?.copy(this.lighting.sunColor);
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  /**
   * Fits camera frustum precisely to diorama bounding box,
   * leaving comfortable breathing room for header title, time slider, and bottom controls.
   */
  fitCameraToBounds(): void {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w <= 0 || h <= 0) return;
    const aspect = w / h;

    // Calculate content bounding box excluding shadow planes and helpers
    const box = new THREE.Box3();
    let meshCount = 0;
    this.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const name = (mesh.name || '').toLowerCase();
        if (name.includes('shadow') || name.includes('helper')) return;
        if (!mesh.geometry) return;
        if (!mesh.visible) return;
        mesh.geometry.computeBoundingBox();
        if (mesh.geometry.boundingBox) {
          const mBox = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);
          box.union(mBox);
          meshCount++;
        }
      }
    });

    if (meshCount === 0 || box.isEmpty()) {
      box.set(new THREE.Vector3(-10.2, -0.75, -8.2), new THREE.Vector3(10.2, 5.2, 8.2));
    }

    this.camera.updateMatrixWorld();
    const invCamMat = this.camera.matrixWorldInverse;

    const corners = [
      new THREE.Vector3(box.min.x, box.min.y, box.min.z),
      new THREE.Vector3(box.min.x, box.min.y, box.max.z),
      new THREE.Vector3(box.min.x, box.max.y, box.min.z),
      new THREE.Vector3(box.min.x, box.max.y, box.max.z),
      new THREE.Vector3(box.max.x, box.min.y, box.min.z),
      new THREE.Vector3(box.max.x, box.min.y, box.max.z),
      new THREE.Vector3(box.max.x, box.max.y, box.min.z),
      new THREE.Vector3(box.max.x, box.max.y, box.max.z),
    ];

    let minViewX = Infinity;
    let maxViewX = -Infinity;
    let minViewY = Infinity;
    let maxViewY = -Infinity;

    for (const c of corners) {
      c.applyMatrix4(invCamMat);
      if (c.x < minViewX) minViewX = c.x;
      if (c.x > maxViewX) maxViewX = c.x;
      if (c.y < minViewY) minViewY = c.y;
      if (c.y > maxViewY) maxViewY = c.y;
    }

    const viewWidth = maxViewX - minViewX;
    const viewHeight = maxViewY - minViewY;

    // Padding for UI overlays (title top, bottom bar)
    const paddingX = 1.16;
    const paddingY = 1.28;

    const reqHeightFromY = viewHeight * paddingY;
    const reqHeightFromX = (viewWidth * paddingX) / aspect;
    const frustumH = Math.max(reqHeightFromY, reqHeightFromX, 23.5);

    this.camera.left = (-frustumH * aspect) / 2;
    this.camera.right = (frustumH * aspect) / 2;
    this.camera.top = frustumH / 2;
    this.camera.bottom = -frustumH / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h);
  }

  setDebugMode(debug: boolean): void {
    if (debug) {
      this.scene.background = new THREE.Color(0xff00ff);
      this.terrain?.setDebug(true);
      if (this.vegetation) this.vegetation.group.visible = false;
      if (this.architecture) this.architecture.group.visible = false;
      if (this.water) this.water.group.visible = false;
      if (this.fish) this.fish.group.visible = false;
    } else {
      this.scene.background = null;
      this.terrain?.setDebug(false);
      if (this.vegetation) this.vegetation.group.visible = true;
      if (this.architecture) this.architecture.group.visible = true;
      if (this.water) this.water.group.visible = true;
      if (this.fish) this.fish.group.visible = true;
    }
  }

  updateState(patch: Partial<SceneState>): void {
    if (patch.debugTerrain !== undefined && patch.debugTerrain !== this.state.debugTerrain) {
      this.setDebugMode(patch.debugTerrain);
    }
    if (patch.season && patch.season !== this.state.season) {
      this.prevSeason = this.state.season;
      this.seasonBlend = 0;
      this.seasonBlendTarget = 1;
    }
    if (patch.tide && patch.tide !== this.state.tide) {
      this.water?.setTide(patch.tide, true);
    }
    if (patch.quality && patch.quality !== this.state.quality) {
      if (patch.quality === 'low') {
        this.renderer.setPixelRatio(1);
        this.renderer.shadowMap.enabled = false;
      } else if (patch.quality === 'medium') {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
        this.renderer.shadowMap.enabled = true;
      } else {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
      }
    }
    Object.assign(this.state, patch);
  }

  reset(): void {
    this.state = { ...DEFAULT_STATE };
    this.setDebugMode(false);
    this.camera.position.copy(this.initialCameraPos);
    this.camera.zoom = 1.0;
    this.controls.target.copy(this.initialTarget);
    this.controls.update();

    this.water?.setTide(this.state.tide, true);
    this.prevSeason = this.state.season;
    this.seasonBlend = 1;
    this.terrain?.updateSeason(this.state.season, 1);
    this.vegetation?.updateSeason(this.state.season, 1);
    this.architecture?.updateSeason(this.state.season, 1);
    this.lighting?.update(this.state);

    this.fitCameraToBounds();
  }

  private onPointerMove = (e: PointerEvent): void => {
    if (this.isPointerDown) {
      const dx = e.clientX - this.pointerDownPos.x;
      const dy = e.clientY - this.pointerDownPos.y;
      if (dx * dx + dy * dy > 16) this.isDragging = true;
    }
    if (this.isDragging || this.isPointerOnUI) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    if (this.water) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.raycaster.intersectObject(this.water.mesh);
      if (hits.length > 0) {
        const pt = hits[0].point;
        // Verify point is inside submerged water before creating ripple
        if (this.water.isInWater(pt.x, pt.z)) {
          this.water.addRipple(pt.x, pt.z, 0.18 * this.state.rippleStrength);
        }
      }
    }
  };

  private onPointerDown = (e: PointerEvent): void => {
    this.isPointerDown = true;
    this.isDragging = false;
    this.pointerDownPos.set(e.clientX, e.clientY);
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.isDragging && !this.isPointerOnUI && this.water) {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const hits = this.raycaster.intersectObject(this.water.mesh);
      if (hits.length > 0) {
        const pt = hits[0].point;
        // Verify point is inside submerged water before creating ripple
        if (this.water.isInWater(pt.x, pt.z)) {
          this.water.addRipple(pt.x, pt.z, 0.65 * this.state.rippleStrength);
          this.fish?.reactToRipple(pt.x, pt.z);
        }
      }
    }
    this.isPointerDown = false;
    this.isDragging = false;
  };

  setPointerOnUI(v: boolean): void {
    this.isPointerOnUI = v;
  }

  dispose(): void {
    this.disposed = true;
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

    this.terrain?.dispose();
    this.water?.dispose();
    this.architecture?.dispose();
    this.vegetation?.dispose();
    this.fish?.dispose();
    this.lighting?.dispose();

    this.controls.dispose();
    this.renderer.dispose();
    canvas.remove();
  }
}
