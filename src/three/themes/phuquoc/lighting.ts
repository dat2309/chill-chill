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
  const hemiLight = new THREE.HemisphereLight(0xffa885, 0x1d5c58, 0.7);
  lightGroup.add(hemiLight);

  // Ambient Fill
  const ambientLight = new THREE.AmbientLight(0xffd5b8, 0.25);
  lightGroup.add(ambientLight);

  // Atmosphere palettes
  const cSunNoon = new THREE.Color(0xfff7ea);
  const cSunSunset = new THREE.Color(0xff8438);
  const cSunNight = new THREE.Color(0x6e86a4);

  const cSkyDay = new THREE.Color(0xdcebf7);
  const cSkySunset = new THREE.Color(0xf6cfbc);
  const cSkyNight = new THREE.Color(0x151b27);

  const sunDir = new THREE.Vector3();
  const sunCol = new THREE.Color();
  const skyCol = new THREE.Color();
  const currentBgColor = new THREE.Color();

  // Take ownership of background if scene is provided
  if (boundScene && (!boundScene.background || !(boundScene.background instanceof THREE.Color))) {
    boundScene.background = currentBgColor.clone();
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
      const tod = state.timeOfDay; // 0 - 24

      // 1. Calculate pure sun position
      const sunPos = calculatePhuQuocSunPosition(tod);
      dirLight.position.set(sunPos.x, Math.max(-1.5, sunPos.y), sunPos.z);
      sunDir.copy(dirLight.position).normalize();

      // 2. Atmospheric grading
      if (tod >= 6.0 && tod <= 16.5) {
        // Daytime tropical sun
        const dayT = Math.sin(((tod - 6.0) / 10.5) * Math.PI);
        sunCol.copy(cSunSunset).lerp(cSunNoon, dayT);
        ambientLight.intensity = 0.5;
        dirLight.intensity = 1.5 + 0.4 * dayT;
        hemiLight.color.setHex(0xe8f4fc);
        hemiLight.groundColor.setHex(0x28635c);
        hemiLight.intensity = 0.8;
        skyCol.copy(cSkyDay);
        currentBgColor.copy(cSkyDay);
      } else if (tod > 16.5 && tod <= 19.0) {
        // Sunset golden-hour (17:45 peak)
        const sunsetT = (tod - 16.5) / 2.5;
        sunCol.copy(cSunSunset);
        ambientLight.color.setHex(0xffead5);
        ambientLight.intensity = 0.65;
        dirLight.intensity = 1.8 * (1.0 - sunsetT * 0.4);
        hemiLight.color.setHex(0xffd3b5);
        hemiLight.groundColor.setHex(0x698779);
        hemiLight.intensity = 1.0;
        skyCol.copy(cSkySunset);
        currentBgColor.copy(cSkySunset).lerp(cSkyNight, sunsetT * 0.7);
      } else {
        // Night moonlight
        sunCol.copy(cSunNight);
        ambientLight.intensity = 0.12;
        dirLight.intensity = 0.35;
        hemiLight.color.setHex(0x223048);
        hemiLight.groundColor.setHex(0x0e1b1d);
        hemiLight.intensity = 0.3;
        skyCol.copy(cSkyNight);
        currentBgColor.copy(cSkyNight);
      }

      dirLight.color.copy(sunCol);

      // Monsoon rainy season overcast adjustment
      if (state.season === 'rainy') {
        dirLight.intensity *= 0.65;
        currentBgColor.lerp(new THREE.Color(0xaebdc6), 0.45);
        skyCol.lerp(new THREE.Color(0xb0c0ca), 0.5);
      }

      // Update active scene background
      if (boundScene) {
        if (boundScene.background instanceof THREE.Color) {
          boundScene.background.copy(currentBgColor);
        } else {
          boundScene.background = currentBgColor.clone();
        }
      }
    },
    dispose() {
      // Release background ownership so Garden can restore clean background
      if (boundScene && boundScene.background) {
        boundScene.background = null;
      }
      lightGroup.clear();
      parentGroup.remove(lightGroup);
    },
  };
}
