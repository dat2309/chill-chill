import * as THREE from 'three';
import { PhuQuocState } from './constants';

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
 * Convention:
 *   +X: East (sunrise over inland hills)
 *   -X: West (sunset over sea towards Gulf of Thailand)
 *   +Y: Up (zenith)
 *   +Z: North
 *   -Z: South
 * Note: 17:45 (tod = 17.75) is an artistic diorama preset for golden hour, not an astronomical ephemeris.
 */
export function calculatePhuQuocSunPosition(timeOfDay: number): PhuQuocSunPosition {
  const tod = Math.max(0, Math.min(24, timeOfDay));
  const isDay = tod >= 5.5 && tod <= 18.5;
  const isSunset = tod > 16.5 && tod <= 19.0;

  if (isDay) {
    // Daytime trajectory:
    // At 06:00: sunProgress = 0.0 -> sunAngle = 0.0 -> x = +16.0 (East), y = 0.0
    // At 12:00: sunProgress = 0.5 -> sunAngle = PI/2 -> x = 0.0, y = 14.5 (Noon overhead)
    // At 18:00: sunProgress = 1.0 -> sunAngle = PI   -> x = -16.0 (West), y = 0.0
    const sunProgress = (tod - 6.0) / 12.0; // 0.0 to 1.0
    const sunAngle = Math.max(0, Math.min(Math.PI, sunProgress * Math.PI));

    const y = Math.sin(sunAngle) * 14.5;
    const x = Math.cos(sunAngle) * 16.0; // +X is East, -X is West
    const z = Math.sin(sunAngle * 0.4) * 4.0;

    return { x, y, z, sunProgress, isDay: true, isSunset };
  } else {
    // Night-time moonlight:
    const nightProgress = tod > 18.5 ? (tod - 18.5) / 11.0 : (tod + 5.5) / 11.0;
    const moonAngle = nightProgress * Math.PI;

    const y = Math.max(3.0, Math.sin(moonAngle) * 12.0);
    const x = -Math.cos(moonAngle) * 14.0;
    const z = Math.cos(moonAngle * 0.3) * 5.0;

    return { x, y, z, sunProgress: 0, isDay: false, isSunset: false };
  }
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

  // Directional Sun/Moon Light
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

  // Hemisphere Light (Sky & Sea Bounce)
  const hemiLight = new THREE.HemisphereLight(0xffa885, 0x2b756c, 0.7);
  lightGroup.add(hemiLight);

  // Ambient Fill
  const ambientLight = new THREE.AmbientLight(0xffd5b8, 0.25);
  lightGroup.add(ambientLight);

  // Reusable Color palettes (allocated ONCE, never inside update)
  const cSunNoon = new THREE.Color(0xfff7ea);
  const cSunSunset = new THREE.Color(0xff8438);
  const cSunNight = new THREE.Color(0x6e86a4);

  // Sky gradient - Daytime clear tropical
  const cSkyDayTop = new THREE.Color(0x82b2db);
  const cSkyDayMid = new THREE.Color(0xbed9ee);
  const cSkyDayBot = new THREE.Color(0xe6f1f8);

  // Sky gradient - Sunset (17:30 - 18:15):
  // Zenith purple-blue, Mid magenta-pink, Horizon pink-orange
  const cSkySunsetTop = new THREE.Color(0x383363);
  const cSkySunsetMid = new THREE.Color(0xc95882);
  const cSkySunsetBot = new THREE.Color(0xfba078);

  // Sky gradient - Night deep indigo
  const cSkyNightTop = new THREE.Color(0x090f1d);
  const cSkyNightMid = new THREE.Color(0x101a2d);
  const cSkyNightBot = new THREE.Color(0x1a263d);

  // Sky gradient - Dawn
  const cSkyDawnTop = new THREE.Color(0x273650);
  const cSkyDawnMid = new THREE.Color(0x8a6e80);
  const cSkyDawnBot = new THREE.Color(0xf0aa92);

  // Rainy season overcast targets
  const cRainyDayTop = new THREE.Color(0x758896);
  const cRainyDayMid = new THREE.Color(0x9cb0bd);
  const cRainyDayBot = new THREE.Color(0xbcccd5);

  // Rainy sunset retains a soft, gentle pale-pink band at horizon
  const cRainySunsetTop = new THREE.Color(0x43405a);
  const cRainySunsetMid = new THREE.Color(0x826779);
  const cRainySunsetBot = new THREE.Color(0xdca8a8);

  const cHemiDuskSky = new THREE.Color(0xffd5b8);
  const cHemiNightSky = new THREE.Color(0x223048);
  const cHemiDuskGround = new THREE.Color(0x2b756c);
  const cHemiNightGround = new THREE.Color(0x0e1b1d);

  // Working temporary colors (reused every frame, ZERO memory allocations)
  const tmpTop = new THREE.Color();
  const tmpMid = new THREE.Color();
  const tmpBot = new THREE.Color();
  const sunDir = new THREE.Vector3();
  const sunCol = new THREE.Color();
  const skyCol = new THREE.Color();

  // Clear flat scene background to let transparent canvas reveal CSS sky gradient
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

      const tod = state.timeOfDay; // 0 - 24

      // 1. Calculate pure sun position
      const sunPos = calculatePhuQuocSunPosition(tod);
      dirLight.position.set(sunPos.x, Math.max(-1.5, sunPos.y), sunPos.z);
      sunDir.copy(dirLight.position).normalize();

      // 2. Multi-stop sky gradient evaluation based on timeOfDay
      if (tod < 5.0) {
        // Deep night
        tmpTop.copy(cSkyNightTop);
        tmpMid.copy(cSkyNightMid);
        tmpBot.copy(cSkyNightBot);

        sunCol.copy(cSunNight);
        ambientLight.intensity = 0.12;
        dirLight.intensity = 0.35;
        hemiLight.color.setHex(0x223048);
        hemiLight.groundColor.setHex(0x0e1b1d);
        hemiLight.intensity = 0.3;
      } else if (tod < 6.5) {
        // Dawn onset
        const t = (tod - 5.0) / 1.5;
        tmpTop.copy(cSkyNightTop).lerp(cSkyDawnTop, t);
        tmpMid.copy(cSkyNightMid).lerp(cSkyDawnMid, t);
        tmpBot.copy(cSkyNightBot).lerp(cSkyDawnBot, t);

        sunCol.copy(cSunNight).lerp(cSunSunset, t);
        ambientLight.intensity = 0.12 + 0.28 * t;
        dirLight.intensity = 0.35 + 0.65 * t;
        hemiLight.color.setHex(0x6b5a7a);
        hemiLight.groundColor.setHex(0x183835);
        hemiLight.intensity = 0.3 + 0.3 * t;
      } else if (tod < 7.5) {
        // Morning transition to day
        const t = (tod - 6.5) / 1.0;
        tmpTop.copy(cSkyDawnTop).lerp(cSkyDayTop, t);
        tmpMid.copy(cSkyDawnMid).lerp(cSkyDayMid, t);
        tmpBot.copy(cSkyDawnBot).lerp(cSkyDayBot, t);

        sunCol.copy(cSunSunset).lerp(cSunNoon, t);
        ambientLight.intensity = 0.40 + 0.10 * t;
        dirLight.intensity = 1.0 + 0.5 * t;
        hemiLight.color.setHex(0xe8f4fc);
        hemiLight.groundColor.setHex(0x28635c);
        hemiLight.intensity = 0.6 + 0.2 * t;
      } else if (tod <= 16.5) {
        // Daytime tropical sun
        const dayT = Math.sin(((tod - 7.5) / 9.0) * Math.PI);
        tmpTop.copy(cSkyDayTop);
        tmpMid.copy(cSkyDayMid);
        tmpBot.copy(cSkyDayBot);

        sunCol.copy(cSunNoon);
        ambientLight.intensity = 0.50;
        dirLight.intensity = 1.5 + 0.35 * dayT;
        hemiLight.color.setHex(0xe8f4fc);
        hemiLight.groundColor.setHex(0x28635c);
        hemiLight.intensity = 0.8;
      } else if (tod < 17.5) {
        // Golden hour transition (16:30 - 17:30)
        const t = (tod - 16.5) / 1.0;
        tmpTop.copy(cSkyDayTop).lerp(cSkySunsetTop, t);
        tmpMid.copy(cSkyDayMid).lerp(cSkySunsetMid, t);
        tmpBot.copy(cSkyDayBot).lerp(cSkySunsetBot, t);

        sunCol.copy(cSunNoon).lerp(cSunSunset, t);
        ambientLight.color.setHex(0xffebd8);
        ambientLight.intensity = 0.50 + 0.20 * t;
        dirLight.intensity = 1.6 + 0.2 * t;
        hemiLight.color.setHex(0xffd5b8);
        hemiLight.groundColor.setHex(0x2b756c);
        hemiLight.intensity = 0.8 + 0.25 * t;
      } else if (tod <= 18.25) {
        // Peak Vivid Pink Sunset (17:30 - 18:15)
        // Zenith purple-blue, Mid magenta-pink, Horizon pink-orange
        // At 17:45 (tod = 17.75): zero night darkening, full radiant color
        tmpTop.copy(cSkySunsetTop);
        tmpMid.copy(cSkySunsetMid);
        tmpBot.copy(cSkySunsetBot);

        sunCol.copy(cSunSunset);
        ambientLight.color.setHex(0xffebd8);
        ambientLight.intensity = 0.72;
        dirLight.intensity = 1.8;
        hemiLight.color.setHex(0xffd5b8);
        hemiLight.groundColor.setHex(0x2b756c);
        hemiLight.intensity = 1.05;
      } else if (tod < 19.5) {
        // Twilight dusk fading into night (18:15 - 19:30)
        const t = (tod - 18.25) / 1.25;
        tmpTop.copy(cSkySunsetTop).lerp(cSkyNightTop, t);
        tmpMid.copy(cSkySunsetMid).lerp(cSkyNightMid, t);
        tmpBot.copy(cSkySunsetBot).lerp(cSkyNightBot, t);

        sunCol.copy(cSunSunset).lerp(cSunNight, t);
        ambientLight.intensity = 0.72 * (1.0 - t * 0.83);
        dirLight.intensity = 1.8 * (1.0 - t * 0.80);
        hemiLight.color.lerpColors(cHemiDuskSky, cHemiNightSky, t);
        hemiLight.groundColor.lerpColors(cHemiDuskGround, cHemiNightGround, t);
        hemiLight.intensity = 1.05 * (1.0 - t * 0.71);
      } else {
        // Late night
        tmpTop.copy(cSkyNightTop);
        tmpMid.copy(cSkyNightMid);
        tmpBot.copy(cSkyNightBot);

        sunCol.copy(cSunNight);
        ambientLight.intensity = 0.12;
        dirLight.intensity = 0.35;
        hemiLight.color.setHex(0x223048);
        hemiLight.groundColor.setHex(0x0e1b1d);
        hemiLight.intensity = 0.3;
      }

      dirLight.color.copy(sunCol);

      // 3. Monsoon Rainy Season Adjustments
      if (state.season === 'rainy') {
        dirLight.intensity *= 0.65;
        if (tod >= 17.5 && tod <= 18.25) {
          // Rainy sunset maintains a soft pale-pink band at the horizon
          tmpTop.lerp(cRainySunsetTop, 0.55);
          tmpMid.lerp(cRainySunsetMid, 0.55);
          tmpBot.lerp(cRainySunsetBot, 0.45); // Retains soft pink horizon
        } else {
          tmpTop.lerp(cRainyDayTop, 0.45);
          tmpMid.lerp(cRainyDayMid, 0.45);
          tmpBot.lerp(cRainyDayBot, 0.45);
        }
      }

      // 4. Synchronize skyColor for water reflection (uSunsetSkyColor)
      // Captures the radiant mid-to-horizon sunset pink glow
      skyCol.copy(tmpMid).lerp(tmpBot, 0.45);

      // 5. Apply dynamic CSS gradient to container behind transparent canvas
      if (typeof document !== 'undefined') {
        const container = document.querySelector('.canvas-container') as HTMLElement | null;
        if (container) {
          if (!container.classList.contains('theme-phuquoc')) {
            container.classList.add('theme-phuquoc');
          }
          const topHex = '#' + tmpTop.getHexString();
          const midHex = '#' + tmpMid.getHexString();
          const botHex = '#' + tmpBot.getHexString();
          container.style.background = `linear-gradient(180deg, ${topHex} 0%, ${midHex} 52%, ${botHex} 100%)`;
        }
      }
    },
    dispose() {
      // Clear dynamic background when unloading theme so other themes restore cleanly
      if (typeof document !== 'undefined') {
        const container = document.querySelector('.canvas-container') as HTMLElement | null;
        if (container) {
          container.style.background = '';
          container.classList.remove('theme-phuquoc');
        }
      }
      lightGroup.clear();
      parentGroup.remove(lightGroup);
    },
  };
}
