import * as THREE from 'three';
import { createBeachSurfaceWeather, BeachSurfaceWeather } from './surfaceWeather';
import { getBeachCoverHeight } from './rainExposure';
import { ThemeInstance, ThemeState, BeachSeason, Quality } from '../../core/types';
import { BEACH_METADATA, BEACH_CAMERA_PRESET } from './config';
import { createBeachTerrain, BeachTerrainSystem } from './terrain';
import { createBeachWater, BeachWaterSystem } from './water';
import { createBeachArchitecture, BeachArchitectureSystem } from './architecture';
import { createBeachBoats, BeachBoatsSystem } from './boats';
import { createBeachVegetation, BeachVegetationSystem } from './vegetation';
import { createBeachFish, BeachFishSystem } from './fish';
import { createBeachWeather, BeachWeatherSystem } from './weather';
import { createBeachLighting, BeachLightingSystem } from './lighting';
import { isInWater, intersectBeachWater } from './shoreline';
import { BeachState } from './constants';

export class BeachTheme implements ThemeInstance<'beach'> {
  readonly id = 'beach' as const;
  readonly metadata = BEACH_METADATA;
  readonly cameraPreset = BEACH_CAMERA_PRESET;
  readonly group = new THREE.Group();

  private renderer: THREE.WebGLRenderer;
  private terrain!: BeachTerrainSystem;
  private water!: BeachWaterSystem;
  private architecture!: BeachArchitectureSystem;
  private boats!: BeachBoatsSystem;
  private surfaceWeather?: BeachSurfaceWeather;
  private vegetation!: BeachVegetationSystem;
  private fish!: BeachFishSystem;
  private weather!: BeachWeatherSystem;
  private lighting!: BeachLightingSystem;

  private currentSeason: BeachSeason = 'dry';
  private currentTide: string = 'high';

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.group.name = 'BeachThemeRoot';
  }

  async init(): Promise<void> {
    const nextFrame = () =>
      new Promise((r) => (typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(r) : setTimeout(r, 0)));

    // 1. Terrain & Shoreline
    this.terrain = createBeachTerrain(this.group);
    await nextFrame();

    // 2. Tropical Water
    this.water = createBeachWater(
      this.renderer,
      this.group,
      (x, z) => this.terrain.getHeightAt(x, z)
    );
    await nextFrame();

    // 3. Stilt Bungalows & Pier
    this.architecture = createBeachArchitecture(
      this.group,
      (x, z) => this.terrain.getHeightAt(x, z)
    );
    await nextFrame();

    this.surfaceWeather = createBeachSurfaceWeather(this.group, this.terrain, this.architecture.group);

    // 4. Vietnamese Boats (Thung & Ghe)
    this.boats = createBeachBoats(this.group);
    await nextFrame();

    // 5. Tropical Vegetation (Palms, pines)
    this.vegetation = createBeachVegetation(
      this.group,
      (x, z) => this.terrain.getHeightAt(x, z),
      (x, z) => this.terrain.getSlopeAt(x, z)
    );
    await nextFrame();

    // 6. Tropical Fish
    this.fish = createBeachFish(
      this.group,
      (x, z) => this.terrain.getHeightAt(x, z)
    );
    await nextFrame();

    // 7. Weather & Tropical Rain
    this.weather = createBeachWeather(
      this.group,
      (season, progress) => {
        // Continuous transition factor [0, 1] applied uniformly across all subsystems
        this.architecture.updateSeason(progress);
        this.vegetation.updateSeason(progress);
      },
      (x, z, strength) => {
        if (this.isInWater(x, z) && !this.architecture.isUnderRoof(x, z)) {
          this.water?.addRipple(x, z, strength);
        }
      },
      (x,z) => {
        const cover = getBeachCoverHeight(x,z);
        return cover > -Infinity ? cover : this.terrain.getHeightAt(x,z);
      }
    );

    // 8. Sunset Lighting
    this.lighting = createBeachLighting(this.group);
  }

  setQuality(quality: Quality): void {
    if (this.currentQuality !== quality) {
      this.currentQuality = quality;
      this.weather?.setQuality(quality);
    }
  }

  setForceAnalyticalFallback(force: boolean): void {
    this.water?.setForceAnalyticalFallback?.(force);
  }

  private currentQuality: Quality = 'high';
  private lastWindStrength: number = 0.35;
  private effectiveWind = .35;

  applyState(state: ThemeState<'beach'>, _prevSeason?: BeachSeason, _blendFactor: number = 1): void {
    if (this.currentTide !== state.tide && this.water) {
      this.currentTide = state.tide;
      this.water.setTide(state.tide, true);
    }

    if (this.currentSeason !== state.season && this.weather) {
      this.currentSeason = state.season;
      this.weather.setSeason(state.season);
    }

    if (state.quality && state.quality !== this.currentQuality) {
      this.setQuality(state.quality);
    }
  }

  update(dt: number, elapsed: number, state: ThemeState<'beach'>): void {
    if (state.quality && state.quality !== this.currentQuality) {
      this.setQuality(state.quality);
    }
    this.lastWindStrength = state.windStrength;

    const waterLevel = this.water?.getWaterLevel() ?? 0.3;

    // 1. Advance weather progress over dt first to obtain continuous rain intensity
    this.weather?.updateProgress(dt);
    const rainIntensity = this.weather?.getRainIntensity() ?? 0.0;

    // 2. Compute harmonized effective wind combining user slider and continuous rain preset
    // (creates moderate ocean swell without turning into an exaggerated hurricane)
    const targetWind = THREE.MathUtils.clamp(
      state.windStrength * (1.0 + rainIntensity * 0.50) + rainIntensity * 0.15,
      0.1,
      1.2
    );

    this.effectiveWind += (targetWind - this.effectiveWind) * (1 - Math.exp(-Math.max(0, dt) * 3));
    const effectiveWind = this.effectiveWind;

    // 3. Falling raindrops animated using the unified effectiveWind
    this.weather?.updateRaindrops(dt, elapsed, effectiveWind, waterLevel);

    const beachThemeState: BeachState = {
      timeOfDay: state.timeOfDay,
      season: state.season,
      tide: state.tide,
      rippleStrength: state.rippleStrength,
      flowSpeed: state.flowSpeed,
      windStrength: effectiveWind,
      autoRotate: state.autoRotate,
      quality: this.currentQuality,
    };

    // 4. Subsystem updates with synchronized continuous weather & lighting
    const scene = (this.group.parent as THREE.Scene) || undefined;
    this.lighting?.update(beachThemeState, scene, rainIntensity);
    if (this.lighting && this.water) {
      this.water.setSunLighting(this.lighting.sunDirection, this.lighting.sunColor, this.lighting.skyColor);
    }

    this.water?.update(dt, elapsed, effectiveWind, state.flowSpeed, rainIntensity);
    this.architecture?.update(dt, elapsed, state.timeOfDay);
    this.boats?.update(dt, elapsed, waterLevel, effectiveWind, state.flowSpeed);
    if (this.boats && this.water?.updateBoatCavities) {
      this.water.updateBoatCavities(this.boats.getCavities());
    }
    this.surfaceWeather?.update(dt, elapsed, rainIntensity, this.water?.getWaterLevel() ?? waterLevel,
      this.lighting?.skyColor, this.lighting?.sunDirection);
    this.vegetation?.update(dt, elapsed, effectiveWind, rainIntensity);
    this.fish?.update(dt, elapsed, waterLevel);
  }

  getRainIntensity(): number {
    return this.weather?.getRainIntensity() ?? 0.0;
  }

  getEffectiveWind(): number {
    const rain = this.getRainIntensity();
    return THREE.MathUtils.clamp(
      this.lastWindStrength * (1.0 + rain * 0.50) + rain * 0.15,
      0.1,
      1.2
    );
  }

  getContentBounds(): THREE.Box3 {
    const box = new THREE.Box3();
    let count = 0;
    this.group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        const name = (mesh.name || '').toLowerCase();
        if (name.includes('shadow') || name.includes('helper') || name.includes('rain')) return;
        if (!mesh.geometry) return;
        if (!mesh.visible) return;

        mesh.geometry.computeBoundingBox();
        if (mesh.geometry.boundingBox) {
          const mBox = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);
          box.union(mBox);
          count++;
        }
      }
    });

    if (count === 0 || box.isEmpty()) {
      box.set(new THREE.Vector3(-10.2, -1.5, -8.2), new THREE.Vector3(10.2, 5.0, 8.2));
    }
    return box;
  }

  getTideOffset(): number {
    return this.water ? this.water.getTideOffset() : 0;
  }

  isInWater(worldX: number, worldZ: number): boolean {
    const tideOffset = this.water ? this.water.getTideOffset() : 0;
    return isInWater(worldX, worldZ, tideOffset);
  }

  addRipple(worldX: number, worldZ: number, strength: number): void {
    if (this.isInWater(worldX, worldZ)) {
      this.water?.addRipple(worldX, worldZ, strength);
    }
  }

  reactToSplash(worldX: number, worldZ: number): void {
    if (this.isInWater(worldX, worldZ)) {
      this.fish?.reactToRipple(worldX, worldZ);
    }
  }

  intersectWater(ray: THREE.Ray): { point: THREE.Vector3; distance: number } | null {
    const waterLevel = this.water ? this.water.getWaterLevel() : 0.3;
    const tideOffset = this.water && this.water.getTideOffset ? this.water.getTideOffset() : 0;
    return intersectBeachWater(ray, waterLevel, tideOffset);
  }

  getWaterLevel(): number {
    return this.water ? this.water.getWaterLevel() : 0.3;
  }

  getWaterMesh(): THREE.Mesh | null {
    return this.water?.mesh ?? null;
  }

  getObstacleMeshes(): THREE.Object3D[] {
    const list: THREE.Object3D[] = [];
    if (this.terrain?.group) list.push(this.terrain.group);
    if (this.architecture?.group) list.push(this.architecture.group);
    if (this.vegetation?.group) list.push(this.vegetation.group);
    if (this.boats?.group) list.push(this.boats.group);
    return list;
  }

  onContextRestored(): void {
    this.water?.onContextRestored?.();
  }

  dispose(): void {
    this.terrain?.dispose();
    this.water?.dispose();
    this.architecture?.dispose();
    this.boats?.dispose();
    this.surfaceWeather?.dispose();
    this.surfaceWeather = undefined;
    this.vegetation?.dispose();
    this.fish?.dispose();
    this.weather?.dispose();
    this.lighting?.dispose();
    this.group.clear();
    this.group.removeFromParent();
  }
}

export const PhuQuocTheme = BeachTheme;

export default function createBeachTheme(renderer: THREE.WebGLRenderer): ThemeInstance<'beach'> {
  return new BeachTheme(renderer);
}

export const createPhuQuocTheme = createBeachTheme;
