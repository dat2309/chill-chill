import * as THREE from 'three';
import { PhuQuocSeason, PhuQuocState } from './constants';

export interface PhuQuocSunPosition {
  x: number;
  y: number;
  z: number;
  sunProgress: number; // 0 (dawn ~06:00) to 1 (dusk ~18:00)
  isDay: boolean;
  isSunset: boolean;
}

/**
 * Pure calculation for Phu Quoc solar trajectory across sky and sea.
 */
export function calculatePhuQuocSunPosition(timeOfDay: number): PhuQuocSunPosition {
  const tod = Math.max(0, Math.min(24, timeOfDay));
  const isDay = tod >= 5.5 && tod <= 18.5;
  const isSunset = tod > 16.5 && tod <= 19.0;

  if (isDay) {
    const sunProgress = (tod - 6.0) / 12.0; // 0.0 to 1.0
    const sunAngle = Math.max(0, Math.min(Math.PI, sunProgress * Math.PI));

    const y = Math.sin(sunAngle) * 14.5;
    const x = Math.cos(sunAngle) * 16.0; // +X is East, -X is West
    const z = Math.sin(sunAngle * 0.4) * 4.0;

    return { x, y, z, sunProgress, isDay: true, isSunset };
  } else {
    const nightProgress = tod > 18.5 ? (tod - 18.5) / 11.0 : (tod + 5.5) / 11.0;
    const moonAngle = nightProgress * Math.PI;

    const y = Math.max(3.0, Math.sin(moonAngle) * 12.0);
    const x = -Math.cos(moonAngle) * 14.0;
    const z = Math.cos(moonAngle * 0.3) * 5.0;

    return { x, y, z, sunProgress: 0, isDay: false, isSunset: false };
  }
}

// Reusable Color palettes (allocated once, never in update)
const cSkyDayTop = new THREE.Color(0x82b2db);
const cSkyDayMid = new THREE.Color(0xbed9ee);
const cSkyDayBot = new THREE.Color(0xe6f1f8);

const cSkySunsetTop = new THREE.Color(0x383363);
const cSkySunsetMid = new THREE.Color(0xc95882);
const cSkySunsetBot = new THREE.Color(0xfba078);

const cSkyNightTop = new THREE.Color(0x090f1d);
const cSkyNightMid = new THREE.Color(0x101a2d);
const cSkyNightBot = new THREE.Color(0x1a263d);

const cSkyDawnTop = new THREE.Color(0x273650);
const cSkyDawnMid = new THREE.Color(0x8a6e80);
const cSkyDawnBot = new THREE.Color(0xf0aa92);

const cRainyDayTop = new THREE.Color(0x758896);
const cRainyDayMid = new THREE.Color(0x9cb0bd);
const cRainyDayBot = new THREE.Color(0xbcccd5);

const cRainySunsetTop = new THREE.Color(0x43405a);
const cRainySunsetMid = new THREE.Color(0x826779);
const cRainySunsetBot = new THREE.Color(0xdca8a8);

const tmpRainTargetTop = new THREE.Color();
const tmpRainTargetMid = new THREE.Color();
const tmpRainTargetBot = new THREE.Color();

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Pure evaluation of the 3-stop Phu Quoc sky gradient across 24h.
 */
export function getPhuQuocSkyGradient(
  timeOfDay: number,
  season: PhuQuocSeason,
  outTop: THREE.Color,
  outMid: THREE.Color,
  outBot: THREE.Color
): { top: THREE.Color; mid: THREE.Color; bot: THREE.Color } {
  const tod = ((timeOfDay % 24) + 24) % 24;

  // 1. Base dry sky continuous timeline
  if (tod < 4.8) {
    // Deep night
    outTop.copy(cSkyNightTop);
    outMid.copy(cSkyNightMid);
    outBot.copy(cSkyNightBot);
  } else if (tod < 6.2) {
    // Dawn onset
    const t = smoothstep(4.8, 6.2, tod);
    outTop.copy(cSkyNightTop).lerp(cSkyDawnTop, t);
    outMid.copy(cSkyNightMid).lerp(cSkyDawnMid, t);
    outBot.copy(cSkyNightBot).lerp(cSkyDawnBot, t);
  } else if (tod < 7.5) {
    // Dawn into day
    const t = smoothstep(6.2, 7.5, tod);
    outTop.copy(cSkyDawnTop).lerp(cSkyDayTop, t);
    outMid.copy(cSkyDawnMid).lerp(cSkyDayMid, t);
    outBot.copy(cSkyDawnBot).lerp(cSkyDayBot, t);
  } else if (tod <= 16.2) {
    // Daytime clear tropical sky
    outTop.copy(cSkyDayTop);
    outMid.copy(cSkyDayMid);
    outBot.copy(cSkyDayBot);
  } else if (tod < 17.5) {
    // Golden hour transition towards vivid pink sunset
    const t = smoothstep(16.2, 17.5, tod);
    outTop.copy(cSkyDayTop).lerp(cSkySunsetTop, t);
    outMid.copy(cSkyDayMid).lerp(cSkySunsetMid, t);
    outBot.copy(cSkyDayBot).lerp(cSkySunsetBot, t);
  } else if (tod <= 18.25) {
    // Peak vivid sunset (17:30 - 18:15): zenith purple-blue, mid magenta-pink, horizon pink-orange
    outTop.copy(cSkySunsetTop);
    outMid.copy(cSkySunsetMid);
    outBot.copy(cSkySunsetBot);
  } else if (tod < 20.0) {
    // Twilight dusk smoothly fading into night
    const t = smoothstep(18.25, 20.0, tod);
    outTop.copy(cSkySunsetTop).lerp(cSkyNightTop, t);
    outMid.copy(cSkySunsetMid).lerp(cSkyNightMid, t);
    outBot.copy(cSkySunsetBot).lerp(cSkyNightBot, t);
  } else {
    // Night
    outTop.copy(cSkyNightTop);
    outMid.copy(cSkyNightMid);
    outBot.copy(cSkyNightBot);
  }

  // Monsoon Rainy Season Adjustments:
  // Multiply rain blend by daylightFactor so night sky is NEVER pulled towards bright daytime gray
  if (season === 'rainy') {
    const daylightFactor = smoothstep(4.8, 7.5, tod) * (1.0 - smoothstep(16.2, 20.0, tod));
    const sunsetFactor = smoothstep(16.5, 17.6, tod) * (1.0 - smoothstep(18.25, 19.4, tod));

    tmpRainTargetTop.copy(cRainyDayTop).lerp(cRainySunsetTop, sunsetFactor);
    tmpRainTargetMid.copy(cRainyDayMid).lerp(cRainySunsetMid, sunsetFactor);
    tmpRainTargetBot.copy(cRainyDayBot).lerp(cRainySunsetBot, sunsetFactor);

    const rainBlend = (0.45 + 0.10 * sunsetFactor) * daylightFactor;
    outTop.lerp(tmpRainTargetTop, rainBlend);
    outMid.lerp(tmpRainTargetMid, rainBlend);
    outBot.lerp(tmpRainTargetBot, rainBlend);

    const nightDarken = (1.0 - daylightFactor) * 0.12;
    outTop.multiplyScalar(1.0 - nightDarken);
    outMid.multiplyScalar(1.0 - nightDarken);
    outBot.multiplyScalar(1.0 - nightDarken);
  }

  return { top: outTop, mid: outMid, bot: outBot };
}

export interface PhuQuocLightingSystem {
  group: THREE.Group;
  dirLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  ambientLight: THREE.AmbientLight;
  sunDirection: THREE.Vector3;
  sunColor: THREE.Color;
  skyColor: THREE.Color;
  update(state: PhuQuocState, scene?: THREE.Scene): void;
  dispose(): void;
}

export function createPhuQuocLighting(
  parentGroup: THREE.Group,
  initialScene?: THREE.Scene
): PhuQuocLightingSystem {
  const lightGroup = new THREE.Group();
  lightGroup.name = 'PhuQuocLighting';
  parentGroup.add(lightGroup);

  let boundScene: THREE.Scene | undefined = initialScene;

  const dirLight = new THREE.DirectionalLight(0xffb077, 1.8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.near = 0.5;
  dirLight.shadow.camera.far = 40;
  dirLight.shadow.camera.left = -12;
  dirLight.shadow.camera.right = 12;
  dirLight.shadow.camera.top = 10;
  dirLight.shadow.camera.bottom = -10;
  dirLight.shadow.bias = -0.0004;
  lightGroup.add(dirLight);

  const hemiLight = new THREE.HemisphereLight(0xffa885, 0x2b756c, 0.7);
  lightGroup.add(hemiLight);

  const ambientLight = new THREE.AmbientLight(0xffd5b8, 0.25);
  lightGroup.add(ambientLight);

  const cSunNoon = new THREE.Color(0xfff7ea);
  const cSunSunset = new THREE.Color(0xff8438);
  const cSunNight = new THREE.Color(0x6e86a4);

  const cHemiDuskSky = new THREE.Color(0xffd5b8);
  const cHemiNightSky = new THREE.Color(0x223048);
  const cHemiDuskGround = new THREE.Color(0x2b756c);
  const cHemiNightGround = new THREE.Color(0x0e1b1d);

  const tmpTop = new THREE.Color();
  const tmpMid = new THREE.Color();
  const tmpBot = new THREE.Color();
  const sunDir = new THREE.Vector3();
  const sunCol = new THREE.Color();
  const skyCol = new THREE.Color();

  // Cache DOM element and last applied gradient string to prevent per-frame DOM queries and style mutations
  let cachedContainer: HTMLElement | null =
    typeof document !== 'undefined' ? (document.querySelector('.canvas-container') as HTMLElement | null) : null;
  let lastGradientCss = '';

  if (boundScene) {
    boundScene.background = null;
  }

  return {
    group: lightGroup,
    dirLight,
    hemiLight,
    ambientLight,
    sunDirection: sunDir,
    sunColor: sunCol,
    skyColor: skyCol,
    update(state: PhuQuocState, activeScene?: THREE.Scene) {
      if (activeScene) {
        boundScene = activeScene;
      }
      if (boundScene && boundScene.background !== null) {
        boundScene.background = null;
      }

      const tod = state.timeOfDay;

      const sunPos = calculatePhuQuocSunPosition(tod);
      dirLight.position.set(sunPos.x, Math.max(-1.5, sunPos.y), sunPos.z);
      sunDir.copy(dirLight.position).normalize();

      if (tod < 4.8) {
        sunCol.copy(cSunNight);
        ambientLight.intensity = 0.12;
        dirLight.intensity = 0.35;
        hemiLight.color.setHex(0x223048);
        hemiLight.groundColor.setHex(0x0e1b1d);
        hemiLight.intensity = 0.3;
      } else if (tod < 6.2) {
        const t = smoothstep(4.8, 6.2, tod);
        sunCol.copy(cSunNight).lerp(cSunSunset, t);
        ambientLight.intensity = 0.12 + 0.28 * t;
        dirLight.intensity = 0.35 + 0.65 * t;
        hemiLight.color.setHex(0x6b5a7a);
        hemiLight.groundColor.setHex(0x183835);
        hemiLight.intensity = 0.3 + 0.3 * t;
      } else if (tod < 7.5) {
        const t = smoothstep(6.2, 7.5, tod);
        sunCol.copy(cSunSunset).lerp(cSunNoon, t);
        ambientLight.intensity = 0.40 + 0.10 * t;
        dirLight.intensity = 1.0 + 0.5 * t;
        hemiLight.color.setHex(0xe8f4fc);
        hemiLight.groundColor.setHex(0x28635c);
        hemiLight.intensity = 0.6 + 0.2 * t;
      } else if (tod <= 16.2) {
        const dayT = Math.sin(((tod - 7.5) / 8.7) * Math.PI);
        sunCol.copy(cSunNoon);
        ambientLight.intensity = 0.50;
        dirLight.intensity = 1.5 + 0.35 * Math.max(0, dayT);
        hemiLight.color.setHex(0xe8f4fc);
        hemiLight.groundColor.setHex(0x28635c);
        hemiLight.intensity = 0.8;
      } else if (tod < 17.5) {
        const t = smoothstep(16.2, 17.5, tod);
        sunCol.copy(cSunNoon).lerp(cSunSunset, t);
        ambientLight.color.setHex(0xffebd8);
        ambientLight.intensity = 0.50 + 0.22 * t;
        dirLight.intensity = 1.6 + 0.2 * t;
        hemiLight.color.setHex(0xffd5b8);
        hemiLight.groundColor.setHex(0x2b756c);
        hemiLight.intensity = 0.8 + 0.25 * t;
      } else if (tod <= 18.25) {
        sunCol.copy(cSunSunset);
        ambientLight.color.setHex(0xffebd8);
        ambientLight.intensity = 0.72;
        dirLight.intensity = 1.8;
        hemiLight.color.setHex(0xffd5b8);
        hemiLight.groundColor.setHex(0x2b756c);
        hemiLight.intensity = 1.05;
      } else if (tod < 20.0) {
        const t = smoothstep(18.25, 20.0, tod);
        sunCol.copy(cSunSunset).lerp(cSunNight, t);
        ambientLight.intensity = 0.72 * (1.0 - t * 0.833);
        dirLight.intensity = 1.8 * (1.0 - t * 0.805);
        hemiLight.color.lerpColors(cHemiDuskSky, cHemiNightSky, t);
        hemiLight.groundColor.lerpColors(cHemiDuskGround, cHemiNightGround, t);
        hemiLight.intensity = 1.05 * (1.0 - t * 0.714);
      } else {
        sunCol.copy(cSunNight);
        ambientLight.intensity = 0.12;
        dirLight.intensity = 0.35;
        hemiLight.color.setHex(0x223048);
        hemiLight.groundColor.setHex(0x0e1b1d);
        hemiLight.intensity = 0.3;
      }

      dirLight.color.copy(sunCol);

      if (state.season === 'rainy') {
        const daylightFactor = smoothstep(4.8, 7.5, tod) * (1.0 - smoothstep(16.5, 19.8, tod));
        dirLight.intensity *= (1.0 - 0.35 * daylightFactor);
      }

      getPhuQuocSkyGradient(tod, state.season, tmpTop, tmpMid, tmpBot);

      skyCol.copy(tmpMid).lerp(tmpBot, 0.45);

      // Apply dynamic CSS gradient (cached element, only assigns style.background when gradient changes)
      if (typeof document !== 'undefined') {
        if (!cachedContainer) {
          cachedContainer = document.querySelector('.canvas-container') as HTMLElement | null;
        }
        if (cachedContainer) {
          if (!cachedContainer.classList.contains('theme-phuquoc')) {
            cachedContainer.classList.add('theme-phuquoc');
          }
          const topHex = '#' + tmpTop.getHexString();
          const midHex = '#' + tmpMid.getHexString();
          const botHex = '#' + tmpBot.getHexString();
          const nextGradientCss = `linear-gradient(180deg, ${topHex} 0%, ${midHex} 52%, ${botHex} 100%)`;

          if (nextGradientCss !== lastGradientCss) {
            cachedContainer.style.background = nextGradientCss;
            lastGradientCss = nextGradientCss;
          }
        }
      }
    },
    dispose() {
      if (cachedContainer) {
        cachedContainer.style.background = '';
        cachedContainer.classList.remove('theme-phuquoc');
        cachedContainer = null;
      }
      lastGradientCss = '';
      lightGroup.clear();
      parentGroup.remove(lightGroup);
    },
  };
}
