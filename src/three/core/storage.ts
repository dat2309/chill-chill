import {
  ThemeId,
  GardenSeason,
  BeachSeason,
  ThemeState,
  SharedOptions,
  PersistedAppState,
  CameraState,
} from './types';

export const CURRENT_STORAGE_VERSION = 9;
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

export const DEFAULT_BEACH_STATE: ThemeState<'beach'> = {
  themeId: 'beach',
  timeOfDay: 17.75, // 17:45 Sunset
  season: 'dry',
  tide: 'high',
  rippleStrength: 0.5,
  flowSpeed: 0.5,
  windStrength: 0.35,
  autoRotate: false,
};

export const DEFAULT_LANTERN_STATE: ThemeState<'lantern'> = {
  themeId:'lantern',timeOfDay:19.5,season:'night',tide:'high',rippleStrength:.5,
  flowSpeed:.4,windStrength:.3,autoRotate:false,rainIntensity:0,
};
export function sanitizeLanternState(raw:any):ThemeState<'lantern'> {
  const valid=sanitizeBeachState(raw);
  return {...valid,themeId:'lantern',season:raw?.season==='festival'?'festival':'night',
    timeOfDay:Number.isFinite(raw?.timeOfDay)?Math.max(18,valid.timeOfDay):19.5,
    rainIntensity:Number.isFinite(raw?.rainIntensity)?Math.max(0,Math.min(1,raw.rainIntensity)):0};
}
export const DEFAULT_MARKET_STATE: ThemeState<'market'> = {...DEFAULT_BEACH_STATE,themeId:'market',season:'dawn',timeOfDay:6.5};
export function sanitizeMarketState(raw:any):ThemeState<'market'>{return {...sanitizeBeachState(raw),themeId:'market',season:raw?.season==='noon'?'noon':'dawn',timeOfDay:Number.isFinite(raw?.timeOfDay)?Math.max(0,Math.min(24,raw.timeOfDay)):DEFAULT_MARKET_STATE.timeOfDay};}
export const DEFAULT_SAPA_STATE: ThemeState<'sapa'> = {...DEFAULT_BEACH_STATE,themeId:'sapa',season:'flooded',timeOfDay:16};
export function sanitizeSapaState(raw:any):ThemeState<'sapa'>{return {...sanitizeBeachState(raw),themeId:'sapa',season:raw?.season==='ripe'?'ripe':'flooded',timeOfDay:Number.isFinite(raw?.timeOfDay)?Math.max(0,Math.min(24,raw.timeOfDay)):DEFAULT_SAPA_STATE.timeOfDay};}
export const DEFAULT_CYBER_STATE: ThemeState<'cyber'> = {...DEFAULT_BEACH_STATE,themeId:'cyber',season:'rain',timeOfDay:21};
export function sanitizeCyberState(raw:any):ThemeState<'cyber'>{return {...sanitizeBeachState(raw),themeId:'cyber',season:raw?.season==='after'?'after':'rain',timeOfDay:Number.isFinite(raw?.timeOfDay)?Math.max(0,Math.min(24,raw.timeOfDay)):DEFAULT_CYBER_STATE.timeOfDay};}
export const DEFAULT_AURORA_STATE: ThemeState<'aurora'> = {...DEFAULT_BEACH_STATE,themeId:'aurora',season:'clear',timeOfDay:21};
export function sanitizeAuroraState(raw:any):ThemeState<'aurora'>{return {...sanitizeBeachState(raw),themeId:'aurora',season:raw?.season==='blizzard'?'blizzard':'clear',timeOfDay:Number.isFinite(raw?.timeOfDay)?Math.max(0,Math.min(24,raw.timeOfDay)):DEFAULT_AURORA_STATE.timeOfDay};}
export const THEME_STATE_KEYS={aurora:'auroraState',cyber:'cyberState',sapa:'sapaState',market:'marketState',garden:'gardenState',beach:'beachState',lantern:'lanternState'}as const;
export function getPersistedThemeState(state:PersistedAppState,id:ThemeId){return state[THEME_STATE_KEYS[id]];}

export const DEFAULT_SHARED_OPTIONS: SharedOptions = {
  quality: 'high',
  debugTerrain: false,
};

const VALID_GARDEN_SEASONS: GardenSeason[] = ['spring', 'summer', 'autumn', 'winter'];
const VALID_BEACH_SEASONS: BeachSeason[] = ['dry', 'rainy'];

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

export function sanitizeBeachState(raw: any): ThemeState<'beach'> {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_BEACH_STATE };
  const season = VALID_BEACH_SEASONS.includes(raw.season) ? raw.season : DEFAULT_BEACH_STATE.season;
  const timeOfDay = typeof raw.timeOfDay === 'number' && Number.isFinite(raw.timeOfDay)
    ? Math.max(0, Math.min(24, raw.timeOfDay))
    : DEFAULT_BEACH_STATE.timeOfDay;
  const tide = raw.tide === 'low' || raw.tide === 'high' ? raw.tide : DEFAULT_BEACH_STATE.tide;
  const rippleStrength = typeof raw.rippleStrength === 'number' && Number.isFinite(raw.rippleStrength)
    ? Math.max(0, Math.min(1, raw.rippleStrength))
    : DEFAULT_BEACH_STATE.rippleStrength;
  const flowSpeed = typeof raw.flowSpeed === 'number' && Number.isFinite(raw.flowSpeed)
    ? Math.max(0, Math.min(1, raw.flowSpeed))
    : DEFAULT_BEACH_STATE.flowSpeed;
  const windStrength = typeof raw.windStrength === 'number' && Number.isFinite(raw.windStrength)
    ? Math.max(0, Math.min(1, raw.windStrength))
    : DEFAULT_BEACH_STATE.windStrength;
  const autoRotate = Boolean(raw.autoRotate);

  return {
    themeId: 'beach',
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
    beachState: { ...DEFAULT_BEACH_STATE },
    lanternState: {...DEFAULT_LANTERN_STATE},
    marketState: {...DEFAULT_MARKET_STATE},
    sapaState: {...DEFAULT_SAPA_STATE},
    cyberState: {...DEFAULT_CYBER_STATE},
    auroraState: {...DEFAULT_AURORA_STATE},
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

    const activeThemeId: ThemeId = data.activeThemeId==='aurora'?'aurora':data.activeThemeId==='cyber'?'cyber':data.activeThemeId==='sapa'?'sapa':data.activeThemeId==='market'?'market':data.activeThemeId==='lantern'?'lantern':(data.activeThemeId === 'beach' || data.activeThemeId === 'phuquoc') ? 'beach' : 'garden';
    const gardenState = sanitizeGardenState(data.gardenState);
    const beachState = sanitizeBeachState(data.beachState ?? data.phuquocState);
    const lanternState=sanitizeLanternState(data.lanternState);
    const marketState=sanitizeMarketState(data.marketState);
    const sapaState=sanitizeSapaState(data.sapaState);
    const cyberState=sanitizeCyberState(data.cyberState);
    const auroraState=sanitizeAuroraState(data.auroraState);
    const shared: SharedOptions = {
      quality: ['low', 'medium', 'high'].includes(data.shared?.quality) ? data.shared.quality : 'high',
      debugTerrain: Boolean(data.shared?.debugTerrain),
    };

    if (!(data.version >= 4 && data.version <= CURRENT_STORAGE_VERSION)) {
      gardenState.cameraState = undefined;
      beachState.cameraState = undefined;
    }
    const camera: Partial<Record<ThemeId, CameraState>> = {};
    const gardenCam = sanitizeCameraState(data.camera?.garden ?? data.gardenState?.cameraState);
    if ((data.version >= 4 && data.version <= CURRENT_STORAGE_VERSION) && gardenCam) camera.garden = gardenCam;
    const beachCam = sanitizeCameraState(data.camera?.beach ?? data.camera?.phuquoc ?? data.beachState?.cameraState ?? data.phuquocState?.cameraState);
    if ((data.version >= 4 && data.version <= CURRENT_STORAGE_VERSION) && beachCam) camera.beach = beachCam;

    const lanternCam=sanitizeCameraState(data.camera?.lantern??data.lanternState?.cameraState);
    if(data.version>=5&&data.version<=CURRENT_STORAGE_VERSION&&lanternCam)camera.lantern=lanternCam;
    const marketCam=sanitizeCameraState(data.camera?.market??data.marketState?.cameraState);
    if(data.version>=6&&marketCam)camera.market=marketCam;
    const sapaCam=sanitizeCameraState(data.camera?.sapa??data.sapaState?.cameraState);
    if(data.version>=7&&data.version<=CURRENT_STORAGE_VERSION&&sapaCam)camera.sapa=sapaCam;
    const cyberCam=sanitizeCameraState(data.camera?.cyber??data.cyberState?.cameraState);
    if(data.version>=8&&data.version<=CURRENT_STORAGE_VERSION&&cyberCam)camera.cyber=cyberCam;
    const auroraCam=sanitizeCameraState(data.camera?.aurora??data.auroraState?.cameraState);
    if(data.version>=9&&data.version<=CURRENT_STORAGE_VERSION&&auroraCam)camera.aurora=auroraCam;
    return {
      sapaState,
      marketState,
      version: CURRENT_STORAGE_VERSION,
      cyberState,
      auroraState,
      activeThemeId,
      gardenState,
      beachState,
      lanternState,
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
      beachState: state.beachState,
      lanternState: state.lanternState,
      marketState: state.marketState,
      sapaState: state.sapaState,
      cyberState: state.cyberState,
      auroraState: state.auroraState,
      shared: state.shared,
      camera: state.camera,
    });
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.warn('Failed to save state to localStorage:', err);
  }
}

export function getThemeDefaultState(themeId: ThemeId): import('./types').AnyThemeState {
  if(themeId==='market')return {...DEFAULT_MARKET_STATE};
  if(themeId==='sapa')return {...DEFAULT_SAPA_STATE};
  if(themeId==='cyber')return {...DEFAULT_CYBER_STATE};
  if(themeId==='aurora')return {...DEFAULT_AURORA_STATE};
  return themeId==='lantern'?{...DEFAULT_LANTERN_STATE}:themeId === 'garden' ? { ...DEFAULT_GARDEN_STATE } : { ...DEFAULT_BEACH_STATE };
}
