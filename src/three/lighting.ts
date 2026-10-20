import * as THREE from 'three';
import { SceneState } from './constants';

export interface LightingSystem {
  group: THREE.Group;
  sunDirection: THREE.Vector3; // current sun direction for water shader
  sunColor: THREE.Color; // current sun color
  update(state: SceneState): void;
  dispose(): void;
}

interface LightCycleKeyframe {
  time: number;
  sunColor: THREE.Color;
  sunIntensity: number;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiIntensity: number;
  ambientColor: THREE.Color;
  ambientIntensity: number;
  bgColor: THREE.Color;
  fogColor: THREE.Color;
}

// 24-hour day/night cycle keyframes with exact requested colors and intensities
const CYCLE_KEYFRAMES: LightCycleKeyframe[] = [
  // 00:00 - Midnight
  {
    time: 0.0,
    sunColor: new THREE.Color(0x8899cc), // dim blue-white moonlight
    sunIntensity: 0.15,
    hemiSky: new THREE.Color(0x0c1424),
    hemiGround: new THREE.Color(0x040808),
    hemiIntensity: 0.12,
    ambientColor: new THREE.Color(0x101828),
    ambientIntensity: 0.10,
    bgColor: new THREE.Color(0x070b14),
    fogColor: new THREE.Color(0x070b14),
  },
  // 04:00 - Late Night / Pre-dawn (end of night window)
  {
    time: 4.0,
    sunColor: new THREE.Color(0x8899cc),
    sunIntensity: 0.15,
    hemiSky: new THREE.Color(0x0f182c),
    hemiGround: new THREE.Color(0x050a0a),
    hemiIntensity: 0.13,
    ambientColor: new THREE.Color(0x121a2c),
    ambientIntensity: 0.10,
    bgColor: new THREE.Color(0x080d1a),
    fogColor: new THREE.Color(0x080d1a),
  },
  // 05:00 - Early Dawn Twilight
  {
    time: 5.0,
    sunColor: new THREE.Color(0xdd6644),
    sunIntensity: 0.40,
    hemiSky: new THREE.Color(0x382244),
    hemiGround: new THREE.Color(0x121810),
    hemiIntensity: 0.22,
    ambientColor: new THREE.Color(0x281c30),
    ambientIntensity: 0.11,
    bgColor: new THREE.Color(0x24162e),
    fogColor: new THREE.Color(0x24162e),
  },
  // 06:00 - Sunrise (position east, warm golden 0xffaa55)
  {
    time: 6.0,
    sunColor: new THREE.Color(0xffaa55),
    sunIntensity: 0.95,
    hemiSky: new THREE.Color(0xf58a48),
    hemiGround: new THREE.Color(0x4a4436),
    hemiIntensity: 0.52,
    ambientColor: new THREE.Color(0xffbb77),
    ambientIntensity: 0.28,
    bgColor: new THREE.Color(0xee9260),
    fogColor: new THREE.Color(0xdf8454),
  },
  // 08:30 - Morning
  {
    time: 8.5,
    sunColor: new THREE.Color(0xffea88),
    sunIntensity: 1.30,
    hemiSky: new THREE.Color(0x8ed4f5),
    hemiGround: new THREE.Color(0x565244),
    hemiIntensity: 0.65,
    ambientColor: new THREE.Color(0xfff8ee),
    ambientIntensity: 0.32,
    bgColor: new THREE.Color(0x8ecff4),
    fogColor: new THREE.Color(0x8ecff4),
  },
  // 12:00 - Noon (high bright white-warm 0xfff8e8)
  {
    time: 12.0,
    sunColor: new THREE.Color(0xfff8e8),
    sunIntensity: 1.50,
    hemiSky: new THREE.Color(0x78c2f0),
    hemiGround: new THREE.Color(0x5c5648),
    hemiIntensity: 0.72,
    ambientColor: new THREE.Color(0xffffff),
    ambientIntensity: 0.35,
    bgColor: new THREE.Color(0x80c8f8),
    fogColor: new THREE.Color(0x80c8f8),
  },
  // 15:30 - Afternoon
  {
    time: 15.5,
    sunColor: new THREE.Color(0xffeed0),
    sunIntensity: 1.35,
    hemiSky: new THREE.Color(0x84c4ee),
    hemiGround: new THREE.Color(0x686050),
    hemiIntensity: 0.72,
    ambientColor: new THREE.Color(0xfff0e2),
    ambientIntensity: 0.38,
    bgColor: new THREE.Color(0x82c2ee),
    fogColor: new THREE.Color(0x82c2ee),
  },
  // 17:15 - Pre-sunset golden hour
  {
    time: 17.25,
    sunColor: new THREE.Color(0xffaa55),
    sunIntensity: 1.20,
    hemiSky: new THREE.Color(0xf6985a),
    hemiGround: new THREE.Color(0x605646),
    hemiIntensity: 0.65,
    ambientColor: new THREE.Color(0xffc292),
    ambientIntensity: 0.36,
    bgColor: new THREE.Color(0xeb8d58),
    fogColor: new THREE.Color(0xdc7e48),
  },
  // 18:00 - Sunset (position west, warm orange 0xff8844)
  {
    time: 18.0,
    sunColor: new THREE.Color(0xff8844),
    sunIntensity: 1.00,
    hemiSky: new THREE.Color(0xe86030),
    hemiGround: new THREE.Color(0x443e30),
    hemiIntensity: 0.48,
    ambientColor: new THREE.Color(0xff8855),
    ambientIntensity: 0.28,
    bgColor: new THREE.Color(0xd85c2c),
    fogColor: new THREE.Color(0xc65022),
  },
  // 19:30 - Twilight / Dusk
  {
    time: 19.5,
    sunColor: new THREE.Color(0xaa4455),
    sunIntensity: 0.35,
    hemiSky: new THREE.Color(0x322045),
    hemiGround: new THREE.Color(0x141810),
    hemiIntensity: 0.22,
    ambientColor: new THREE.Color(0x30203a),
    ambientIntensity: 0.12,
    bgColor: new THREE.Color(0x241834),
    fogColor: new THREE.Color(0x201430),
  },
  // 21:00 - Nightfall
  {
    time: 21.0,
    sunColor: new THREE.Color(0x8899cc),
    sunIntensity: 0.18,
    hemiSky: new THREE.Color(0x10182b),
    hemiGround: new THREE.Color(0x060c0a),
    hemiIntensity: 0.15,
    ambientColor: new THREE.Color(0x121a2c),
    ambientIntensity: 0.10,
    bgColor: new THREE.Color(0x0a101e),
    fogColor: new THREE.Color(0x0a101e),
  },
  // 22:00 - Deep Night (22:00-4:00 dim blue-white moonlight 0x8899cc, intensity 0.15)
  {
    time: 22.0,
    sunColor: new THREE.Color(0x8899cc),
    sunIntensity: 0.15,
    hemiSky: new THREE.Color(0x0c1424),
    hemiGround: new THREE.Color(0x040808),
    hemiIntensity: 0.12,
    ambientColor: new THREE.Color(0x101828),
    ambientIntensity: 0.10,
    bgColor: new THREE.Color(0x070b14),
    fogColor: new THREE.Color(0x070b14),
  },
  // 24:00 - Midnight wrap-around
  {
    time: 24.0,
    sunColor: new THREE.Color(0x8899cc),
    sunIntensity: 0.15,
    hemiSky: new THREE.Color(0x0c1424),
    hemiGround: new THREE.Color(0x040808),
    hemiIntensity: 0.12,
    ambientColor: new THREE.Color(0x101828),
    ambientIntensity: 0.10,
    bgColor: new THREE.Color(0x070b14),
    fogColor: new THREE.Color(0x070b14),
  },
];

interface InterpolatedLighting {
  sunColor: THREE.Color;
  sunIntensity: number;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiIntensity: number;
  ambientColor: THREE.Color;
  ambientIntensity: number;
  bgColor: THREE.Color;
  fogColor: THREE.Color;
}

function evaluateLightingKeyframe(timeOfDay: number): InterpolatedLighting {
  const normTime = ((timeOfDay % 24) + 24) % 24;

  let idx = 0;
  for (let i = 0; i < CYCLE_KEYFRAMES.length - 1; i++) {
    if (normTime >= CYCLE_KEYFRAMES[i].time && normTime < CYCLE_KEYFRAMES[i + 1].time) {
      idx = i;
      break;
    }
  }

  const k0 = CYCLE_KEYFRAMES[idx];
  const k1 = CYCLE_KEYFRAMES[idx + 1];
  const duration = k1.time - k0.time;
  const fraction = duration > 0 ? (normTime - k0.time) / duration : 0;
  // Smooth hermite interpolation
  const alpha = fraction * fraction * (3.0 - 2.0 * fraction);

  const sunColor = new THREE.Color().lerpColors(k0.sunColor, k1.sunColor, alpha);
  const hemiSky = new THREE.Color().lerpColors(k0.hemiSky, k1.hemiSky, alpha);
  const hemiGround = new THREE.Color().lerpColors(k0.hemiGround, k1.hemiGround, alpha);
  const ambientColor = new THREE.Color().lerpColors(k0.ambientColor, k1.ambientColor, alpha);
  const bgColor = new THREE.Color().lerpColors(k0.bgColor, k1.bgColor, alpha);
  const fogColor = new THREE.Color().lerpColors(k0.fogColor, k1.fogColor, alpha);

  return {
    sunColor,
    sunIntensity: THREE.MathUtils.lerp(k0.sunIntensity, k1.sunIntensity, alpha),
    hemiSky,
    hemiGround,
    hemiIntensity: THREE.MathUtils.lerp(k0.hemiIntensity, k1.hemiIntensity, alpha),
    ambientColor,
    ambientIntensity: THREE.MathUtils.lerp(k0.ambientIntensity, k1.ambientIntensity, alpha),
    bgColor,
    fogColor,
  };
}

export function createLighting(scene: THREE.Scene): LightingSystem {
  const group = new THREE.Group();
  group.name = 'lighting_system';

  // 1. DirectionalLight (sun during day, moon during night)
  const directionalLight = new THREE.DirectionalLight(0xfff8e8, 1.55);
  directionalLight.name = 'sun_moon_light';
  directionalLight.castShadow = true;

  // Shadow camera parameters covering diorama bounds (20 x 16 x 6)
  const shadowBound = 14;
  directionalLight.shadow.camera.left = -shadowBound;
  directionalLight.shadow.camera.right = shadowBound;
  directionalLight.shadow.camera.top = shadowBound;
  directionalLight.shadow.camera.bottom = -shadowBound;
  directionalLight.shadow.camera.near = 1.0;
  directionalLight.shadow.camera.far = 50.0;
  directionalLight.shadow.bias = -0.0005;
  directionalLight.shadow.normalBias = 0.02;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  directionalLight.target.position.set(0, 0, 0);
  group.add(directionalLight);
  group.add(directionalLight.target);

  // 2. HemisphereLight: Sky & ground fill
  const hemisphereLight = new THREE.HemisphereLight(0x78c2f0, 0x3d662c, 0.65);
  hemisphereLight.name = 'hemisphere_light';
  hemisphereLight.position.set(0, 20, 0);
  group.add(hemisphereLight);

  // 3. AmbientLight: Low-intensity base fill (0.1 - 0.2)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.18);
  ambientLight.name = 'ambient_fill_light';
  group.add(ambientLight);

  // Campfire position at center meadow (-3.2, 2.1, -0.8)
  const campfirePos = new THREE.Vector3(-3.2, 2.15, -0.8);

  const campfireLight1 = new THREE.PointLight(0xff6622, 1.4, 6.0, 2.0);
  campfireLight1.name = 'campfire_point_1';
  campfireLight1.position.copy(campfirePos);

  const campfireLight2 = new THREE.PointLight(0xffaa33, 0.9, 4.5, 2.0);
  campfireLight2.name = 'campfire_point_2';
  campfireLight2.position.set(campfirePos.x + 0.08, campfirePos.y + 0.12, campfirePos.z - 0.06);

  group.add(campfireLight1);
  group.add(campfireLight2);

  // Keep scene background null by default so transparent canvas displays paper-cream background
  scene.background = null;
  scene.fog = null;

  scene.add(group);

  const sunDirection = new THREE.Vector3(0, 1, 0);
  const sunColor = new THREE.Color(0xfff8e8);

  let cachedQuality: string | null = null;

  return {
    group,
    sunDirection,
    sunColor,

    update(state: SceneState): void {
      const timeOfDay = ((state.timeOfDay % 24) + 24) % 24;

      // Sun angle calculation as specified:
      // sunAngle = (timeOfDay / 24) * 2 * PI - PI/2  // -PI/2 at midnight, PI/2 at noon
      // sunY = sin(sunAngle)
      // sunX = cos(sunAngle) * 0.5 // east-west
      // sunZ = -cos(sunAngle) * 0.3 // slight north
      const sunAngle = (timeOfDay / 24) * 2 * Math.PI - Math.PI / 2;
      const sunY = Math.sin(sunAngle);
      const sunX = Math.cos(sunAngle) * 0.5;
      const sunZ = -Math.cos(sunAngle) * 0.3;

      const orbitRadius = 26.0;

      if (sunY >= 0) {
        // Sun is above horizon
        const elevation = Math.max(0.08, sunY);
        directionalLight.position.set(sunX, elevation, sunZ).normalize().multiplyScalar(orbitRadius);
      } else {
        // Sun is below horizon: position moonlight from opposite sky hemisphere
        const moonAngle = sunAngle + Math.PI;
        const moonY = Math.max(0.20, Math.sin(moonAngle));
        const moonX = Math.cos(moonAngle) * 0.5;
        const moonZ = -Math.cos(moonAngle) * 0.3;
        directionalLight.position.set(moonX, moonY, moonZ).normalize().multiplyScalar(orbitRadius);
      }

      directionalLight.target.position.set(0, 0, 0);
      directionalLight.target.updateMatrixWorld();

      // Interpolate all lighting components
      const lighting = evaluateLightingKeyframe(timeOfDay);

      directionalLight.color.copy(lighting.sunColor);
      directionalLight.intensity = lighting.sunIntensity;

      hemisphereLight.color.copy(lighting.hemiSky);
      hemisphereLight.groundColor.copy(lighting.hemiGround);
      hemisphereLight.intensity = lighting.hemiIntensity;

      ambientLight.color.copy(lighting.ambientColor);
      ambientLight.intensity = lighting.ambientIntensity;

      // At night (after 20:00 or before 5:00), softly tint background; during day, keep null (transparent paper canvas)
      if (timeOfDay > 20.0 || timeOfDay < 5.0) {
        if (!scene.background) scene.background = new THREE.Color();
        if (scene.background instanceof THREE.Color) {
          scene.background.copy(lighting.bgColor);
        }
      } else {
        scene.background = null;
      }

      // Update exported values for water shader
      sunDirection.copy(directionalLight.position).normalize();
      sunColor.copy(lighting.sunColor);

      // Campfire flicker animation & day/night modulation
      const now = performance.now() * 0.001;
      const flicker1 = 0.82
        + 0.12 * Math.sin(now * 11.3)
        + 0.07 * Math.sin(now * 23.7)
        + 0.04 * Math.cos(now * 41.9);
      const flicker2 = 0.82
        + 0.12 * Math.cos(now * 13.7)
        + 0.07 * Math.sin(now * 29.3)
        + 0.04 * Math.sin(now * 47.1);

      // Campfire is prominent at night/dusk/dawn, dimmer during noon
      let fireGlowFactor = 1.0;
      if (timeOfDay >= 6.0 && timeOfDay < 9.0) {
        fireGlowFactor = THREE.MathUtils.lerp(1.0, 0.35, (timeOfDay - 6.0) / 3.0);
      } else if (timeOfDay >= 9.0 && timeOfDay <= 16.0) {
        fireGlowFactor = 0.35;
      } else if (timeOfDay > 16.0 && timeOfDay < 19.0) {
        fireGlowFactor = THREE.MathUtils.lerp(0.35, 1.0, (timeOfDay - 16.0) / 3.0);
      }

      campfireLight1.intensity = fireGlowFactor * flicker1 * 1.35;
      campfireLight2.intensity = fireGlowFactor * flicker2 * 0.85;

      // Shadow map resolution based on quality setting
      if (state.quality !== cachedQuality) {
        cachedQuality = state.quality;
        const res = state.quality === 'high' ? 2048 : state.quality === 'medium' ? 1024 : 512;
        directionalLight.shadow.mapSize.set(res, res);
        if (directionalLight.shadow.map) {
          directionalLight.shadow.map.dispose();
          directionalLight.shadow.map = null;
        }
      }

      // Handle emissive objects: when timeOfDay > 18 or < 6, increase emissive on tent/cabin meshes
      const nightFactor = (timeOfDay > 18.0 || timeOfDay < 6.0)
        ? Math.min(1.0, Math.abs(timeOfDay > 12.0 ? timeOfDay - 18.0 : 6.0 - timeOfDay) / 2.0)
        : 0.0;

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          const name = (mesh.name || '').toLowerCase();
          const parentName = (mesh.parent?.name || '').toLowerCase();

          const isLanternOrTent =
            name.includes('tent') || name.includes('cabin') ||
            name.includes('lantern') || name.includes('window') || name.includes('lamp') ||
            parentName.includes('tent') || parentName.includes('cabin') ||
            Boolean(mesh.userData.nightEmissive);

          if (isLanternOrTent && mesh.material) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            for (const mat of mats) {
              if ('emissive' in mat && (mat as any).emissive instanceof THREE.Color) {
                const stdMat = mat as THREE.MeshStandardMaterial;
                if (!stdMat.userData._baseEmissive) {
                  stdMat.userData._baseEmissive = stdMat.emissive.clone();
                  stdMat.userData._baseEmissiveIntensity = stdMat.emissiveIntensity ?? 1.0;
                }
                const warmLanternColor = new THREE.Color(0xff9933);
                stdMat.emissive.copy(stdMat.userData._baseEmissive).lerp(warmLanternColor, nightFactor * 0.85);
                if ('emissiveIntensity' in stdMat) {
                  stdMat.emissiveIntensity = THREE.MathUtils.lerp(
                    stdMat.userData._baseEmissiveIntensity,
                    1.2,
                    nightFactor
                  );
                }
              }
            }
          }
        }
      });
    },

    dispose(): void {
      scene.remove(group);
      directionalLight.dispose();
      if (directionalLight.shadow.map) {
        directionalLight.shadow.map.dispose();
      }
      hemisphereLight.dispose();
      ambientLight.dispose();
      campfireLight1.dispose();
      campfireLight2.dispose();
    },
  };
}
