import {
  ThemeId,
  GardenSeason,
  PhuQuocSeason,
  ThemeState,
  SharedOptions,
  PersistedAppState,
  CameraState,
} from './types';

export const CURRENT_STORAGE_VERSION = 3;
export const STORAGE_KEY = 'chillax_diorama_state_v2';

export const DEFAULT_GARDEN_STATE: ThemeState<'garden'> = {
  themeId: 'garden',
  timeOfDay: 16.5, // 16:30
  season: 'spring',
  tide: 'high',
  rippleStrength: 0.5,
  flowSpeed: 0.5,
  windStrength: 0.3,
  autoRotate: false,
};

export const DEFAULT_PHUQUOC_STATE: ThemeState<'phuquoc'> = {
  themeId: 'phuquoc',
  timeOfDay: 17.75, // 17:45 Sunset
  season: 'dry',
  tide: 'high',
  rippleStrength: 0.5,
  flowSpeed: 0.5,
  windStrength: 0.35,
  autoRotate: false,
};

export const DEFAULT_SHARED_OPTIONS: SharedOptions = {
  quality: 'high',
  debugTerrain: false,
};

const VALID_GARDEN_SEASONS: GardenSeason[] = ['spring', 'summer', 'autumn', 'winter'];
const VALID_PHUQUOC_SEASONS: PhuQuocSeason[] = ['dry', 'rainy'];

export function sanitizeCameraState(raw: any): CameraState | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  if (!Array.isArray(raw.position) || raw.position.length !== 3) return undefined;
  if (!Array.isArray(raw.target) || raw.target.length !== 3) return undefined;
  if (typeof raw.zoom !== 'number' || !Number.isFinite(raw.zoom) || raw.zoom <= 0) return undefined;
  const isFiniteArr = (arr: any[]) => arr.every(n => typeof n === 'number' && Number.isFinite(n));
  if (!isFiniteArr(raw.position) || !isFiniteArr(raw.target)) return undefined;

  // Ensure camera position does not coincide with orbit target or drift off-diorama
  const dx = raw.position[0] - raw.target[0];
  const dy = raw.position[1] - raw.target[1];
  const dz = raw.position[2] - raw.target[2];
  const distSq = dx * dx + dy * dy + dz * dz;
  if (distSq < 1.0 || distSq > 10000) return undefined;

  // Orbit target must reside within plausible diorama bounds
  if (Math.abs(raw.target[0]) > 14 || Math.abs(raw.target[2]) > 14 || raw.target[1] < -5 || raw.target[1] > 20) {
    return undefined;
  }

  const zoom = Math.max(0.4, Math.min(3.0, raw.zoom));
  const baseFrustumHeight =
    typeof raw.baseFrustumHeight === 'number' &&
    Number.isFinite(raw.baseFrustumHeight) &&
    raw.baseFrustumHeight >= 5 &&
    raw.baseFrustumHeight <= 100
      ? raw.baseFrustumHeight
      : undefined;

  return {
    position: [raw.position[0], raw.position[1], raw.position[2]],
    target: [raw.target[0], raw.target[1], raw.target[2]],
    zoom,
    ...(baseFrustumHeight !== undefined ? { baseFrustumHeight } : {}),
  };
}

export function sanitizeGardenState(raw: any): ThemeState<'garden'> {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_GARDEN_STATE };
  const season = VALID_GARDEN_SEASONS.includes(raw.season) ? raw.season : DEFAULT_GARDEN_STATE.season;
  const timeOfDay = typeof raw.timeOfDay === 'number' && Number.isFinite(raw.timeOfDay)
    ? Math.max(0, Math.min(24, raw.timeOfDay))
    : DEFAULT_GARDEN_STATE.timeOfDay;
  const tide = raw.tide === 'low' || raw.tide === 'high' ? raw.tide : DEFAULT_GARDEN_STATE.tide;
  const rippleStrength = typeof raw.rippleStrength === 'number' && Number.isFinite(raw.rippleStrength)
    ? Math.max(0, Math.min(1, raw.rippleStrength))
    : DEFAULT_GARDEN_STATE.rippleStrength;
  const flowSpeed = typeof raw.flowSpeed === 'number' && Number.isFinite(raw.flowSpeed)
    ? Math.max(0, Math.min(1, raw.flowSpeed))
    : DEFAULT_GARDEN_STATE.flowSpeed;
  const windStrength = typeof raw.windStrength === 'number' && Number.isFinite(raw.windStrength)
    ? Math.max(0, Math.min(1, raw.windStrength))
    : DEFAULT_GARDEN_STATE.windStrength;
  const autoRotate = Boolean(raw.autoRotate);

  return {
    themeId: 'garden',
    timeOfDay,
    season,
    tide,
    rippleStrength,
    flowSpeed,
    windStrength,
    autoRotate,
    cameraState: sanitizeCameraState(raw.cameraState),
    debugTerrain: Boolean(raw.debugTerrain),
  };
}

export function sanitizePhuQuocState(raw: any): ThemeState<'phuquoc'> {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_PHUQUOC_STATE };
  const season = VALID_PHUQUOC_SEASONS.includes(raw.season) ? raw.season : DEFAULT_PHUQUOC_STATE.season;
  const timeOfDay = typeof raw.timeOfDay === 'number' && Number.isFinite(raw.timeOfDay)
    ? Math.max(0, Math.min(24, raw.timeOfDay))
    : DEFAULT_PHUQUOC_STATE.timeOfDay;
  const tide = raw.tide === 'low' || raw.tide === 'high' ? raw.tide : DEFAULT_PHUQUOC_STATE.tide;
  const rippleStrength = typeof raw.rippleStrength === 'number' && Number.isFinite(raw.rippleStrength)
    ? Math.max(0, Math.min(1, raw.rippleStrength))
    : DEFAULT_PHUQUOC_STATE.rippleStrength;
  const flowSpeed = typeof raw.flowSpeed === 'number' && Number.isFinite(raw.flowSpeed)
    ? Math.max(0, Math.min(1, raw.flowSpeed))
    : DEFAULT_PHUQUOC_STATE.flowSpeed;
  const windStrength = typeof raw.windStrength === 'number' && Number.isFinite(raw.windStrength)
    ? Math.max(0, Math.min(1, raw.windStrength))
    : DEFAULT_PHUQUOC_STATE.windStrength;
  const autoRotate = Boolean(raw.autoRotate);

  return {
    themeId: 'phuquoc',
    timeOfDay,
    season,
    tide,
    rippleStrength,
    flowSpeed,
    windStrength,
    autoRotate,
    cameraState: sanitizeCameraState(raw.cameraState),
    debugTerrain: Boolean(raw.debugTerrain),
  };
}

export function loadPersistedAppState(): PersistedAppState {
  const fallback: PersistedAppState = {
    version: CURRENT_STORAGE_VERSION,
    activeThemeId: 'garden',
    gardenState: { ...DEFAULT_GARDEN_STATE },
    phuquocState: { ...DEFAULT_PHUQUOC_STATE },
    shared: { ...DEFAULT_SHARED_OPTIONS },
  };

  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }

  try {
    const rawStr = window.localStorage.getItem(STORAGE_KEY);
    if (!rawStr) return fallback;

    const data = JSON.parse(rawStr);
    if (!data || typeof data !== 'object') return fallback;

    const activeThemeId: ThemeId = data.activeThemeId === 'phuquoc' ? 'phuquoc' : 'garden';
    const gardenState = sanitizeGardenState(data.gardenState);
    const phuquocState = sanitizePhuQuocState(data.phuquocState);
    const shared: SharedOptions = {
      quality: ['low', 'medium', 'high'].includes(data.shared?.quality) ? data.shared.quality : 'high',
      debugTerrain: Boolean(data.shared?.debugTerrain),
    };

    if (data.version !== CURRENT_STORAGE_VERSION) {
      gardenState.cameraState = undefined;
      phuquocState.cameraState = undefined;
    }
    const camera: Partial<Record<ThemeId, CameraState>> = {};
    const gardenCam = sanitizeCameraState(data.camera?.garden ?? data.gardenState?.cameraState);
    if (data.version === CURRENT_STORAGE_VERSION && gardenCam) camera.garden = gardenCam;
    const phuquocCam = sanitizeCameraState(data.camera?.phuquoc ?? data.phuquocState?.cameraState);
    if (data.version === CURRENT_STORAGE_VERSION && phuquocCam) camera.phuquoc = phuquocCam;

    return {
      version: CURRENT_STORAGE_VERSION,
      activeThemeId,
      gardenState,
      phuquocState,
      shared,
      camera,
    };
  } catch (err) {
    console.warn('Failed to parse localStorage app state, using fallback:', err);
    return fallback;
  }
}

export function savePersistedAppState(state: PersistedAppState): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const serialized = JSON.stringify({
      version: CURRENT_STORAGE_VERSION,
      activeThemeId: state.activeThemeId,
      gardenState: state.gardenState,
      phuquocState: state.phuquocState,
      shared: state.shared,
      camera: state.camera,
    });
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Failed to save state to localStorage:', err);
  }
}

export function getThemeDefaultState(themeId: ThemeId): ThemeState<'garden'> | ThemeState<'phuquoc'> {
  return themeId === 'garden' ? { ...DEFAULT_GARDEN_STATE } : { ...DEFAULT_PHUQUOC_STATE };
}
