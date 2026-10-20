import * as THREE from 'three';
import { DIORAMA_WIDTH, DIORAMA_DEPTH, PhuQuocSeason } from './constants';

export interface PhuQuocWeatherSystem {
  group: THREE.Group;
  update(dt: number, elapsed: number, windStrength: number): void;
  setSeason(targetSeason: PhuQuocSeason): void;
  dispose(): void;
}

export function createPhuQuocWeather(
  parentGroup: THREE.Group,
  onSeasonProgress: (season: PhuQuocSeason, progress: number) => void
): PhuQuocWeatherSystem {
  const weatherGroup = new THREE.Group();
  weatherGroup.name = 'PhuQuocWeather';
  parentGroup.add(weatherGroup);

  const RAIN_COUNT = 900;
  const rainGeo = new THREE.BufferGeometry();
  const rainPos = new Float32Array(RAIN_COUNT * 3);
  const rainVel = new Float32Array(RAIN_COUNT);

  const halfW = DIORAMA_WIDTH / 2;
  const halfD = DIORAMA_DEPTH / 2;

  for (let i = 0; i < RAIN_COUNT; i++) {
    rainPos[i * 3] = (Math.random() - 0.5) * DIORAMA_WIDTH * 1.1;
    rainPos[i * 3 + 1] = Math.random() * 8.0 + 0.5;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * DIORAMA_DEPTH * 1.1;
    rainVel[i] = 7.0 + Math.random() * 4.0;
  }

  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));

  const rainMat = new THREE.PointsMaterial({
    color: 0xc8dce8,
    size: 0.08,
    transparent: true,
    opacity: 0.0, // starts invisible in dry season
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const rainPoints = new THREE.Points(rainGeo, rainMat);
  weatherGroup.add(rainPoints);

  // Transition state
  let currentSeason: PhuQuocSeason = 'dry';
  let targetSeason: PhuQuocSeason = 'dry';
  let transitionProgress = 1.0;
  const TRANSITION_DURATION = 1.8; // seconds

  return {
    group: weatherGroup,
    update(dt: number, elapsed: number, windStrength: number) {
      // 1. Progress smooth season blend
      if (transitionProgress < 1.0) {
        transitionProgress += dt / TRANSITION_DURATION;
        if (transitionProgress > 1.0) transitionProgress = 1.0;

        const effectiveT = targetSeason === 'rainy' ? transitionProgress : 1.0 - transitionProgress;
        rainMat.opacity = effectiveT * 0.55;
        onSeasonProgress(targetSeason, transitionProgress);

        if (transitionProgress >= 1.0) {
          currentSeason = targetSeason;
        }
      }

      // 2. Animate raindrops if opacity > 0
      if (rainMat.opacity > 0.01) {
        const positions = rainGeo.attributes.position.array as Float32Array;
        const windTilt = windStrength * 1.8;

        for (let i = 0; i < RAIN_COUNT; i++) {
          positions[i * 3 + 1] -= rainVel[i] * dt;
          positions[i * 3] += windTilt * dt;

          // Recycle raindrop when hitting ground
          if (positions[i * 3 + 1] < -0.5) {
            positions[i * 3 + 1] = 8.0 + Math.random() * 2.0;
            positions[i * 3] = (Math.random() - 0.5) * DIORAMA_WIDTH * 1.1;
            positions[i * 3 + 2] = (Math.random() - 0.5) * DIORAMA_DEPTH * 1.1;
          }
        }
        rainGeo.attributes.position.needsUpdate = true;
      }
    },
    setSeason(newSeason: PhuQuocSeason) {
      if (newSeason === targetSeason) return;
      targetSeason = newSeason;
      transitionProgress = 0.0;
    },
    dispose() {
      rainGeo.dispose();
      rainMat.dispose();
      weatherGroup.clear();
      parentGroup.remove(weatherGroup);
    },
  };
}
