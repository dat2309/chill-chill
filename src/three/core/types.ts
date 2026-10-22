import * as THREE from 'three';

export type ThemeId = 'garden' | 'beach';

export type GardenSeason = 'spring' | 'summer' | 'autumn' | 'winter';
export type BeachSeason = 'dry' | 'rainy';
export type PhuQuocSeason = BeachSeason;

export interface ThemeSeasonMap {
  garden: GardenSeason;
  beach: BeachSeason;
}

export type ThemeSeason<T extends ThemeId> = ThemeSeasonMap[T];
export type Season = GardenSeason | BeachSeason;

export type TideLevel = 'low' | 'high';
export type Quality = 'low' | 'medium' | 'high';

export type SwitchThemeResult =
  | { status: 'success' }
  | { status: 'cancelled' }
  | { status: 'failed'; error: Error };

export interface SavedCameraState {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
  baseFrustumHeight?: number;
}
export type CameraState = SavedCameraState;

export interface ThemeState<T extends ThemeId = ThemeId> {
  themeId: T;
  timeOfDay: number; // 0 - 24
  season: ThemeSeason<T>;
  tide: TideLevel;
  rippleStrength: number;
  flowSpeed: number; // For stream (garden) or ocean waves (phuquoc)
  windStrength: number;
  autoRotate: boolean;
  quality?: Quality;
  cameraState?: SavedCameraState;
  debugTerrain?: boolean;
}

export type AnyThemeState = ThemeState<'garden'> | ThemeState<'beach'>;

export interface SharedOptions {
  quality: Quality;
  debugTerrain?: boolean;
}

export interface PersistedAppState {
  version: number;
  activeThemeId: ThemeId;
  gardenState: ThemeState<'garden'>;
  beachState: ThemeState<'beach'>;
  phuquocState?: ThemeState<'beach'>; // legacy migration alias
  shared: SharedOptions;
  camera?: Partial<Record<ThemeId, SavedCameraState>>;
}

export interface SeasonInfo<S extends string = string> {
  id: S;
  label: string;
  icon: string;
  name: string;
}

export interface HowItMadeSection {
  icon: string;
  title: string;
  content: string;
}

export interface ThemeMetadata<T extends ThemeId = ThemeId> {
  id: T;
  name: string;
  tagline: string;
  eyebrow: string;
  description: string;
  badges: string[];
  seasons: SeasonInfo<ThemeSeason<T>>[];
  defaultTime: number;
  defaultSeason: ThemeSeason<T>;
  previewGradient: string;
  howItMade: HowItMadeSection[];
  howItsMade?: HowItMadeSection[];
}

export interface ThemeCameraPreset {
  position: THREE.Vector3;
  target: THREE.Vector3;
  baseFrustumHeight: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}

export interface ThemeInstance<T extends ThemeId = ThemeId> {
  readonly id: T;
  readonly group: THREE.Group;
  readonly metadata: ThemeMetadata<T>;
  readonly cameraPreset: ThemeCameraPreset;

  init(): Promise<void>;
  update(dt: number, elapsed: number, state: ThemeState<T>): void;
  applyState(state: ThemeState<T>, prevSeason?: ThemeSeason<T>, blendFactor?: number): void;
  getContentBounds(): THREE.Box3;
  isInWater(worldX: number, worldZ: number): boolean;
  addRipple(worldX: number, worldZ: number, strength: number): void;
  reactToSplash(worldX: number, worldZ: number): void;
  intersectWater?(ray: THREE.Ray): { point: THREE.Vector3; distance: number } | null;
  getTideOffset?(): number;
  getWaterLevel?(): number;
  getWaterMesh?(): THREE.Mesh | null;
  getObstacleMeshes?(): THREE.Object3D[];
  setQuality?(quality: Quality): void;
  setForceAnalyticalFallback?(force: boolean): void;
  setDebugMode?(debug: boolean): void;
  dispose(): void;
}
