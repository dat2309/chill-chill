import * as THREE from 'three';
import { PhuQuocState } from './constants';

export interface PhuQuocLightingSystem {
  group: THREE.Group;
  dirLight: THREE.DirectionalLight;
  hemiLight: THREE.HemisphereLight;
  ambientLight: THREE.AmbientLight;
  sunDirection: THREE.Vector3;
  sunColor: THREE.Color;
  skyColor: THREE.Color;
  update(state: PhuQuocState, scene: THREE.Scene): void;
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

  // Directional Sun/Moon Light (West is -X)
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

  // Colors
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

      // Western Sunset Arc (-X is West):
      // Sun rises in East (+X), arches high at noon, sets in West (-X) at ~18:00
      const sunProgress = (tod - 6.0) / 12.0; // 0 at 6:00, 0.5 at 12:00, 1.0 at 18:00
      const sunAngle = sunProgress * Math.PI;

      const sunY = Math.sin(sunAngle) * 14.0;
      // At noon (sunProgress 0.5): sunX ≈ 0. At sunset (sunProgress ~0.98): sunX ≈ -15 (West)
      const sunX = -Math.cos(sunAngle) * 16.0;
      const sunZ = Math.sin(sunAngle * 0.4) * 4.0;

      dirLight.position.set(sunX, Math.max(-2, sunY), sunZ);
      sunDir.copy(dirLight.position).normalize();

      // Atmospheric grading
      if (tod >= 6.0 && tod <= 16.5) {
        // Daytime tropical sun
        const dayT = Math.sin(((tod - 6.0) / 10.5) * Math.PI);
        sunCol.copy(cSunSunset).lerp(cSunNoon, dayT);
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
        dirLight.intensity = 1.8 * (1.0 - sunsetT * 0.4);
        hemiLight.color.setHex(0xff9977);
        hemiLight.groundColor.setHex(0x1c4e4a);
        hemiLight.intensity = 0.75;
        skyCol.copy(cSkySunset);
        currentBgColor.copy(cSkySunset).lerp(cSkyNight, sunsetT * 0.7);
      } else {
        // Night moonlight
        sunCol.copy(cSunNight);
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
