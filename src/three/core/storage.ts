import {
  ThemeId,
  GardenSeason,
  PhuQuocSeason,
  ThemeState,
  SharedOptions,
  PersistedAppState,
} from './types';

export const CURRENT_STORAGE_VERSION = 2;
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

export function sanitizeGardenState(raw: any): ThemeState<'garden'> {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_GARDEN_STATE };
  const season = VALID_GARDEN_SEASONS.includes(raw.season) ? raw.season : DEFAULT_GARDEN_STATE.season;
  const timeOfDay = typeof raw.timeOfDay === 'number' && Number.isFinite(raw.timeOfDay)
    ? Math.max(0, Math.min(24, raw.timeOfDay))
    : DEFAULT_GARDEN_STATE.timeOfDay;
  const tide = raw.tide === 'low' || raw.tide === 'high' ? raw.tide : DEFAULT_GARDEN_STATE.tide;
  const rippleStrength = typeof raw.rippleStrength === 'number' ? Math.max(0, Math.min(1, raw.rippleStrength)) : DEFAULT_GARDEN_STATE.rippleStrength;
  const flowSpeed = typeof raw.flowSpeed === 'number' ? Math.max(0, Math.min(1, raw.flowSpeed)) : DEFAULT_GARDEN_STATE.flowSpeed;
  const windStrength = typeof raw.windStrength === 'number' ? Math.max(0, Math.min(1, raw.windStrength)) : DEFAULT_GARDEN_STATE.windStrength;
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
    cameraState: raw.cameraState,
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
  const rippleStrength = typeof raw.rippleStrength === 'number' ? Math.max(0, Math.min(1, raw.rippleStrength)) : DEFAULT_PHUQUOC_STATE.rippleStrength;
  const flowSpeed = typeof raw.flowSpeed === 'number' ? Math.max(0, Math.min(1, raw.flowSpeed)) : DEFAULT_PHUQUOC_STATE.flowSpeed;
  const windStrength = typeof raw.windStrength === 'number' ? Math.max(0, Math.min(1, raw.windStrength)) : DEFAULT_PHUQUOC_STATE.windStrength;
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
    cameraState: raw.cameraState,
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

    return {
      version: CURRENT_STORAGE_VERSION,
      activeThemeId,
      gardenState,
      phuquocState,
      shared,
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
    });
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Failed to save state to localStorage:', err);
  }
}

export function getThemeDefaultState(themeId: ThemeId): ThemeState<'garden'> | ThemeState<'phuquoc'> {
  return themeId === 'garden' ? { ...DEFAULT_GARDEN_STATE } : { ...DEFAULT_PHUQUOC_STATE };
}
