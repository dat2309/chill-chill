import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SceneState, DEFAULT_STATE, Season, TideLevel } from './constants';
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
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private isPointerOnUI = false;
  private isPointerDown = false;
  private isDragging = false;
  private pointerDownPos = new THREE.Vector2();
  private frameCount = 0;
  private fpsAccum = 0;
  private currentFps = 60;
  private onFpsUpdate: ((fps: number) => void) | null = null;
  private prevSeason: Season = DEFAULT_STATE.season;
  private seasonBlend = 1;
  private seasonBlendTarget = 1;
  private disposed = false;

  // Isometric viewpoint: from (+X, +Y, +Z) looking down at model
  // Calibrated reset framing with generous margin around base, trees, mountain peaks, and above bottom toolbar
  private initialTarget = new THREE.Vector3(-0.4, 0.45, 0.0);
  private initialCameraPos = new THREE.Vector3(26.0, 23.0, 26.0);
  private baseFrustumHeight = 25.5;

  constructor(container: HTMLElement, onFps: (fps: number) => void) {
    this.onFpsUpdate = onFps;

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

    // Scene: leave background null for transparent paper canvas
    this.scene = new THREE.Scene();
    this.scene.background = null;

    // Orthographic Camera fitted cleanly to diorama bounds with breathing room
    const aspect = container.clientWidth / container.clientHeight;
    let frustumH = this.baseFrustumHeight;
    if (aspect < 1.35) {
      frustumH = this.baseFrustumHeight / Math.min(1.0, aspect * 0.78);
    }

    this.camera = new THREE.OrthographicCamera(
      (-frustumH * aspect) / 2,
      (frustumH * aspect) / 2,
      frustumH / 2,
      -frustumH / 2,
      -60,
      120
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
    this.controls.minPolarAngle = Math.PI * 0.16; // Prevent vertical top-down distortion
    this.controls.update();

    // Event listeners
    this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('resize', this.onResize);
  }

  async init(): Promise<void> {
    try {
      this.terrain = createTerrain(this.scene);

      this.water = createWater(
        this.renderer,
        this.scene,
        this.terrain.getHeightAt
      );

      this.architecture = createArchitecture(
        this.scene,
        this.terrain.getHeightAt
      );

      this.vegetation = createVegetation(
        this.scene,
        this.terrain.getHeightAt,
        this.terrain.getSlopeAt,
        this.terrain.isInStream,
        this.terrain.isOnPlateau
      );

      this.fish = createFish(
        this.scene,
        this.terrain.getHeightAt,
        this.terrain.isInStream
      );

      this.lighting = createLighting(this.scene);

      // Apply initial Spring 16:30 state
      this.lighting.update(this.state);
      this.water.setTide(this.state.tide, false);
      this.terrain.updateSeason(this.state.season, 1);
      this.vegetation.updateSeason(this.state.season, 1);
      this.architecture.updateSeason(this.state.season, 1);

    } catch (e) {
      console.error('Failed to initialize scene:', e);
      throw e;
    }
  }

  start(): void {
    this.clock.start();
    this.animate();
  }

  private animate = (): void => {
    if (this.disposed) return;
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
    this.fish?.update(dt, elapsed, this.water?.getWaterLevel() ?? 0.35);
    this.lighting?.update(this.state);

    // Sync water shader sun direction
    if (this.water && this.lighting) {
      const wm = this.water.mesh.material as THREE.ShaderMaterial;
      if (wm.uniforms) {
        wm.uniforms.uSunDirection?.value?.copy(this.lighting.sunDirection);
        wm.uniforms.uSunColor?.value?.copy(this.lighting.sunColor);
      }
    }

    // Night emissive lighting on architecture
    if (this.architecture && this.lighting) {
      const nightFactor = this.state.timeOfDay > 18 || this.state.timeOfDay < 6
        ? Math.min(1, Math.abs(this.state.timeOfDay > 12 ? this.state.timeOfDay - 18 : this.state.timeOfDay + 6) / 2)
        : 0;
      for (const mesh of this.architecture.emissiveMeshes) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.emissive) {
          mat.emissiveIntensity = nightFactor * 0.9;
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  setDebugMode(debug: boolean): void {
    if (debug) {
      // Magenta background to immediately expose any missing triangles, holes or gaps
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
    this.camera.updateProjectionMatrix();
    this.controls.target.copy(this.initialTarget);
    this.controls.update();

    this.water?.setTide(this.state.tide, true);
    this.prevSeason = this.state.season;
    this.seasonBlend = 1;
    this.terrain?.updateSeason(this.state.season, 1);
    this.vegetation?.updateSeason(this.state.season, 1);
    this.architecture?.updateSeason(this.state.season, 1);
    this.lighting?.update(this.state);
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
        this.water.addRipple(pt.x, pt.z, 0.18 * this.state.rippleStrength);
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
        this.water.addRipple(pt.x, pt.z, 0.65 * this.state.rippleStrength);
        this.fish?.reactToRipple(pt.x, pt.z);
      }
    }
    this.isPointerDown = false;
    this.isDragging = false;
  };

  setPointerOnUI(v: boolean): void {
    this.isPointerOnUI = v;
  }

  private onResize = (): void => {
    const parent = this.renderer.domElement.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const aspect = w / h;

    let frustumH = this.baseFrustumHeight;
    if (aspect < 1.35) {
      frustumH = this.baseFrustumHeight / Math.min(1.0, aspect * 0.78);
    }

    this.camera.left = (-frustumH * aspect) / 2;
    this.camera.right = (frustumH * aspect) / 2;
    this.camera.top = frustumH / 2;
    this.camera.bottom = -frustumH / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h);
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.animFrameId);
    this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.domElement.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('resize', this.onResize);

    this.terrain?.dispose();
    this.water?.dispose();
    this.architecture?.dispose();
    this.vegetation?.dispose();
    this.fish?.dispose();
    this.lighting?.dispose();

    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
