import * as THREE from 'three';
import { ThemeInstance, ThemeState, PhuQuocSeason } from '../../core/types';
import { PHUQUOC_METADATA, PHUQUOC_CAMERA_PRESET } from './config';
import { createPhuQuocTerrain, PhuQuocTerrainSystem } from './terrain';
import { createPhuQuocWater, PhuQuocWaterSystem } from './water';
import { createPhuQuocArchitecture, PhuQuocArchitectureSystem } from './architecture';
import { createPhuQuocBoats, PhuQuocBoatsSystem } from './boats';
import { createPhuQuocVegetation, PhuQuocVegetationSystem } from './vegetation';
import { createPhuQuocFish, PhuQuocFishSystem } from './fish';
import { createPhuQuocWeather, PhuQuocWeatherSystem } from './weather';
import { createPhuQuocLighting, PhuQuocLightingSystem } from './lighting';
import { isInWater } from './shoreline';
import { PhuQuocState } from './constants';

export class PhuQuocTheme implements ThemeInstance<'phuquoc'> {
  readonly id = 'phuquoc' as const;
  readonly metadata = PHUQUOC_METADATA;
  readonly cameraPreset = PHUQUOC_CAMERA_PRESET;
  readonly group = new THREE.Group();

  private renderer: THREE.WebGLRenderer;
  private terrain!: PhuQuocTerrainSystem;
  private water!: PhuQuocWaterSystem;
  private architecture!: PhuQuocArchitectureSystem;
  private boats!: PhuQuocBoatsSystem;
  private vegetation!: PhuQuocVegetationSystem;
  private fish!: PhuQuocFishSystem;
  private weather!: PhuQuocWeatherSystem;
  private lighting!: PhuQuocLightingSystem;

  private currentSeason: PhuQuocSeason = 'dry';
  private currentTide: string = 'high';

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.group.name = 'PhuQuocThemeRoot';
  }

  async init(): Promise<void> {
    // 1. Terrain & Shoreline
    this.terrain = createPhuQuocTerrain(this.group);
    await new Promise((r) => requestAnimationFrame(r));

    // 2. Tropical Water
    this.water = createPhuQuocWater(
      this.renderer,
      this.group,
      (x, z) => this.terrain.getHeightAt(x, z)
    );
    await new Promise((r) => requestAnimationFrame(r));

    // 3. Stilt Bungalows & Pier
    this.architecture = createPhuQuocArchitecture(
      this.group,
      (x, z) => this.terrain.getHeightAt(x, z)
    );
    await new Promise((r) => requestAnimationFrame(r));

    // 4. Vietnamese Boats (Thung & Ghe)
    this.boats = createPhuQuocBoats(this.group);
    await new Promise((r) => requestAnimationFrame(r));

    // 5. Tropical Vegetation (Palms, pines, bougainvillea)
    this.vegetation = createPhuQuocVegetation(
      this.group,
      (x, z) => this.terrain.getHeightAt(x, z),
      (x, z) => this.terrain.getSlopeAt(x, z)
    );
    await new Promise((r) => requestAnimationFrame(r));

    // 6. Tropical Fish
    this.fish = createPhuQuocFish(
      this.group,
      (x, z) => this.terrain.getHeightAt(x, z)
    );
    await new Promise((r) => requestAnimationFrame(r));

    // 7. Weather & Tropical Rain
    this.weather = createPhuQuocWeather(this.group, (season, progress) => {
      this.terrain.updateSeason(season, progress);
      this.architecture.updateSeason(season, progress);
      this.vegetation.updateSeason(season, progress);
    });

    // 8. Sunset Lighting
    this.lighting = createPhuQuocLighting(this.group);
  }

  applyState(state: ThemeState<'phuquoc'>, _prevSeason?: PhuQuocSeason, _blendFactor: number = 1): void {
    if (this.currentTide !== state.tide && this.water) {
      this.currentTide = state.tide;
      this.water.setTide(state.tide, true);
    }

    if (this.currentSeason !== state.season && this.weather) {
      this.currentSeason = state.season;
      this.weather.setSeason(state.season);
    }
  }

  update(dt: number, elapsed: number, state: ThemeState<'phuquoc'>): void {
    const pqState: PhuQuocState = {
      timeOfDay: state.timeOfDay,
      season: state.season,
      tide: state.tide,
      rippleStrength: state.rippleStrength,
      flowSpeed: state.flowSpeed,
      windStrength: state.windStrength,
      autoRotate: state.autoRotate,
      quality: 'high',
    };

    // Subsystem updates
    this.water?.update(dt, elapsed, state.windStrength, state.flowSpeed);
    this.architecture?.update(dt, elapsed, state.timeOfDay);
    this.boats?.update(
      dt,
      elapsed,
      this.water?.getWaterLevel() ?? 0.3,
      state.windStrength,
      state.flowSpeed
    );
    this.vegetation?.update(dt, elapsed, state.windStrength);
    this.fish?.update(dt, elapsed, this.water?.getWaterLevel() ?? 0.3);
    this.weather?.update(dt, elapsed, state.windStrength);
    this.lighting?.update(pqState, this.group.parent as any || new THREE.Scene());
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

  isInWater(worldX: number, worldZ: number): boolean {
    return isInWater(worldX, worldZ);
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

  getWaterLevel(): number {
    return this.water ? this.water.getWaterLevel() : 0.3;
  }

  dispose(): void {
    this.terrain?.dispose();
    this.water?.dispose();
    this.architecture?.dispose();
    this.boats?.dispose();
    this.vegetation?.dispose();
    this.fish?.dispose();
    this.weather?.dispose();
    this.lighting?.dispose();
    this.group.clear();
    this.group.removeFromParent();
  }
}

export default function createPhuQuocTheme(renderer: THREE.WebGLRenderer): ThemeInstance<'phuquoc'> {
  return new PhuQuocTheme(renderer);
}
