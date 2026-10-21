import * as THREE from 'three';
import {
  ThemeInstance,
  ThemeState,
  GardenSeason,
} from '../../core/types';
import { GARDEN_METADATA, GARDEN_CAMERA_PRESET } from './config';
import { createTerrain, TerrainSystem } from './terrain';
import { createWater, WaterSystem } from './water';
import { createArchitecture, ArchitectureSystem } from './architecture';
import { createVegetation, VegetationSystem } from './vegetation';
import { createFish, FishSystem } from './fish';
import { createLighting, LightingSystem } from './lighting';

export class GardenTheme implements ThemeInstance<'garden'> {
  readonly id = 'garden' as const;
  readonly metadata = GARDEN_METADATA;
  readonly cameraPreset = GARDEN_CAMERA_PRESET;
  readonly group = new THREE.Group();

  private renderer: THREE.WebGLRenderer;
  private terrain: TerrainSystem | null = null;
  private water: WaterSystem | null = null;
  private architecture: ArchitectureSystem | null = null;
  private vegetation: VegetationSystem | null = null;
  private fish: FishSystem | null = null;
  private lighting: LightingSystem | null = null;

  private currentTide: string = 'high';
  private currentSeason: GardenSeason = 'spring';

  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
    this.group.name = 'GardenThemeRoot';
  }

  async init(): Promise<void> {
    // 1. Terrain
    this.terrain = createTerrain(this.group as any);
    await new Promise((r) => requestAnimationFrame(r));

    // 2. Water
    this.water = createWater(
      this.renderer,
      this.group as any,
      this.terrain.getHeightAt
    );
    await new Promise((r) => requestAnimationFrame(r));

    // 3. Architecture
    this.architecture = createArchitecture(
      this.group as any,
      this.terrain.getHeightAt
    );
    await new Promise((r) => requestAnimationFrame(r));

    // 4. Vegetation
    this.vegetation = createVegetation(
      this.group as any,
      this.terrain.getHeightAt,
      this.terrain.getSlopeAt,
      this.terrain.isInStream,
      this.terrain.isOnPlateau
    );
    await new Promise((r) => requestAnimationFrame(r));

    // 5. Fish
    this.fish = createFish(
      this.group as any,
      this.terrain.getHeightAt,
      this.terrain.isInStream
    );
    await new Promise((r) => requestAnimationFrame(r));

    // 6. Lighting & Emissive Cache
    this.lighting = createLighting(this.group as any);
    this.lighting.setupEmissiveMeshes(this.group as any);
  }

  applyState(state: ThemeState<'garden'>, _prevSeason?: GardenSeason, blendFactor: number = 1): void {
    if (this.currentTide !== state.tide && this.water) {
      this.currentTide = state.tide;
      this.water.setTide(state.tide, true);
    }

    if (state.season && this.terrain && this.vegetation && this.architecture) {
      this.currentSeason = state.season;
      this.terrain.updateSeason(state.season, blendFactor);
      this.vegetation.updateSeason(state.season, blendFactor);
      this.architecture.updateSeason(state.season, blendFactor);
    }
  }

  update(dt: number, elapsed: number, state: ThemeState<'garden'>): void {
    // Systems update
    this.water?.update(dt, elapsed, state as any);
    this.architecture?.update(dt, elapsed, state.timeOfDay);
    this.vegetation?.update(dt, elapsed, state.windStrength);
    this.fish?.update(dt, elapsed, this.water?.getWaterLevel() ?? 0.28);
    this.lighting?.update(state as any);

    // Sync water shader sun direction
    if (this.water && this.lighting) {
      const wm = this.water.mesh.material as THREE.ShaderMaterial;
      if (wm.uniforms) {
        wm.uniforms.uSunDirection?.value?.copy(this.lighting.sunDirection);
        wm.uniforms.uSunColor?.value?.copy(this.lighting.sunColor);
      }
    }
  }

  getContentBounds(): THREE.Box3 {
    const box = new THREE.Box3();
    let count = 0;
    this.group.traverse((obj) => {
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
          count++;
        }
      }
    });

    if (count === 0 || box.isEmpty()) {
      box.set(new THREE.Vector3(-10.2, -0.75, -8.2), new THREE.Vector3(10.2, 5.2, 8.2));
    }
    return box;
  }

  isInWater(worldX: number, worldZ: number): boolean {
    return this.water ? this.water.isInWater(worldX, worldZ) : false;
  }

  addRipple(worldX: number, worldZ: number, strength: number): void {
    this.water?.addRipple(worldX, worldZ, strength);
  }

  reactToSplash(worldX: number, worldZ: number): void {
    this.fish?.reactToRipple(worldX, worldZ);
  }

  getWaterLevel(): number {
    return this.water?.getWaterLevel() ?? 0.3;
  }

  getWaterMesh(): THREE.Mesh | null {
    return this.water?.mesh ?? null;
  }

  getObstacleMeshes(): THREE.Object3D[] {
    const list: THREE.Object3D[] = [];
    if (this.architecture?.group) list.push(this.architecture.group);
    if (this.vegetation?.group) list.push(this.vegetation.group);
    return list;
  }

  setDebugMode(debug: boolean): void {
    this.terrain?.setDebug(debug);
    if (this.vegetation) this.vegetation.group.visible = !debug;
    if (this.architecture) this.architecture.group.visible = !debug;
    if (this.water) this.water.group.visible = !debug;
    if (this.fish) this.fish.group.visible = !debug;
  }

  dispose(): void {
    this.terrain?.dispose();
    this.water?.dispose();
    this.architecture?.dispose();
    this.vegetation?.dispose();
    this.fish?.dispose();
    this.lighting?.dispose();
    this.group.clear();
    this.group.removeFromParent();
  }
}

export default function createGardenTheme(renderer: THREE.WebGLRenderer): ThemeInstance<'garden'> {
  return new GardenTheme(renderer);
}
