import * as THREE from 'three';
import { PhuQuocState } from './constants';

export interface PhuQuocLightingSystem {
  group: THREE.Group;
  dirLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  ambientLight: THREE.AmbientLight;
  update(state: PhuQuocState, scene: THREE.Scene): void;
  dispose(): void;
}

export function createPhuQuocLighting(parentGroup: THREE.Group): PhuQuocLightingSystem {
  const lightGroup = new THREE.Group();
  lightGroup.name = 'PhuQuocLighting';
  parentGroup.add(lightGroup);

  // 1. Directional Sun/Moon Light
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

  // 2. Hemisphere Sky/Ground Light
  const hemiLight = new THREE.HemisphereLight(0xffa885, 0x1d5c58, 0.7);
  lightGroup.add(hemiLight);

  // 3. Ambient Soft Fill
  const ambientLight = new THREE.AmbientLight(0xffd5b8, 0.25);
  lightGroup.add(ambientLight);

  // Cached colors for interpolation
  const cSunNoon = new THREE.Color(0xfff5e6);
  const cSunSunset = new THREE.Color(0xff8c42);
  const cSunNight = new THREE.Color(0x738ba5);

  const cSkySunset = new THREE.Color(0xf6d5c5);
  const cSkyDay = new THREE.Color(0xdcecf8);
  const cSkyNight = new THREE.Color(0x1a2130);

  const currentBgColor = new THREE.Color();

  return {
    group: lightGroup,
    dirLight,
    hemiLight,
    ambientLight,
    update(state: PhuQuocState, scene: THREE.Scene) {
      const tod = state.timeOfDay; // 0-24

      // Sun trajectory across tropical bay sky
      // In Phu Quoc, the sun sets over the Gulf of Thailand in the West (negative X / positive Z)
      const sunProgress = (tod - 6.0) / 12.0; // 0 at 6:00, 0.5 at 12:00, 1.0 at 18:00
      const sunAngle = sunProgress * Math.PI;

      const sunY = Math.sin(sunAngle) * 14.0;
      const sunX = -Math.cos(sunAngle) * 16.0;
      const sunZ = Math.sin(sunAngle * 0.5) * 6.0;

      dirLight.position.set(sunX, Math.max(-2, sunY), sunZ);

      // Color and intensity grading
      if (tod >= 6.0 && tod <= 16.5) {
        // Bright tropical day
        const dayT = Math.sin(((tod - 6.0) / 10.5) * Math.PI);
        dirLight.color.copy(cSunSunset).lerp(cSunNoon, dayT);
        dirLight.intensity = 1.6 + 0.4 * dayT;
        hemiLight.color.setHex(0xe8f4fc);
        hemiLight.groundColor.setHex(0x28635c);
        hemiLight.intensity = 0.8;
        currentBgColor.copy(cSkyDay);
      } else if (tod > 16.5 && tod <= 19.0) {
        // Glorious Phu Quoc sunset (17:45 peak)
        const sunsetT = (tod - 16.5) / 2.5;
        dirLight.color.copy(cSunSunset);
        dirLight.intensity = 1.8 * (1.0 - sunsetT * 0.4);
        hemiLight.color.setHex(0xff9977);
        hemiLight.groundColor.setHex(0x1c4e4a);
        hemiLight.intensity = 0.75;
        currentBgColor.copy(cSkySunset).lerp(cSkyNight, sunsetT * 0.6);
      } else {
        // Night
        dirLight.color.copy(cSunNight);
        dirLight.intensity = 0.35;
        hemiLight.color.setHex(0x223048);
        hemiLight.groundColor.setHex(0x0e1b1d);
        hemiLight.intensity = 0.3;
        currentBgColor.copy(cSkyNight);
      }

      // Rainy season weather grading
      if (state.season === 'rainy') {
        dirLight.intensity *= 0.7;
        currentBgColor.lerp(new THREE.Color(0xb5c3cc), 0.4);
      }

      if (scene.background instanceof THREE.Color) {
        scene.background.copy(currentBgColor);
      }
    },
    dispose() {
      lightGroup.clear();
      parentGroup.remove(lightGroup);
    },
  };
}
