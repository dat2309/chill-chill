import * as THREE from 'three';
import { DIORAMA_WIDTH, DIORAMA_DEPTH, PhuQuocSeason } from './constants';
import { Quality } from '../../core/types';

export interface PhuQuocWeatherSystem {
  group: THREE.Group;
  update(dt: number, elapsed: number, windStrength: number, waterLevel?: number): void;
  setSeason(targetSeason: PhuQuocSeason): void;
  setQuality(quality: Quality): void;
  getRainIntensity(): number;
  dispose(): void;
}

export function createPhuQuocWeather(
  parentGroup: THREE.Group,
  onSeasonProgress: (season: PhuQuocSeason, progress: number) => void,
  onRainSplash?: (x: number, z: number, strength: number) => void
): PhuQuocWeatherSystem {
  const weatherGroup = new THREE.Group();
  weatherGroup.name = 'PhuQuocWeather';
  parentGroup.add(weatherGroup);

  const MAX_RAINDROPS = 900;
  let activeDropCount = 850;

  // Slender line segments for realistic tropical rain streaks
  const rainGeo = new THREE.BufferGeometry();
  const linePositions = new Float32Array(MAX_RAINDROPS * 2 * 3); // 2 vertices per streak
  const rainVelocities = new Float32Array(MAX_RAINDROPS);
  const streakLengths = new Float32Array(MAX_RAINDROPS);

  for (let i = 0; i < MAX_RAINDROPS; i++) {
    const rx = (Math.random() - 0.5) * DIORAMA_WIDTH * 1.1;
    const ry = Math.random() * 8.0 + 0.5;
    const rz = (Math.random() - 0.5) * DIORAMA_DEPTH * 1.1;
    const len = 0.25 + Math.random() * 0.2;

    const idx0 = i * 6;
    linePositions[idx0] = rx;
    linePositions[idx0 + 1] = ry;
    linePositions[idx0 + 2] = rz;

    linePositions[idx0 + 3] = rx;
    linePositions[idx0 + 4] = ry - len;
    linePositions[idx0 + 5] = rz;

    rainVelocities[i] = 8.5 + Math.random() * 4.5;
    streakLengths[i] = len;
  }

  rainGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  rainGeo.setDrawRange(0, activeDropCount * 2);

  const rainMat = new THREE.LineBasicMaterial({
    color: 0xc4d8e8,
    transparent: true,
    opacity: 0.0, // starts invisible in dry season
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const rainLines = new THREE.LineSegments(rainGeo, rainMat);
  weatherGroup.add(rainLines);

  // Transition state: snapshot-based smooth blend
  let currentSeason: PhuQuocSeason = 'dry';
  let targetSeason: PhuQuocSeason = 'dry';
  let transitionProgress = 1.0;
  let startOpacity = 0.0;
  let targetOpacity = 0.0;
  const TRANSITION_DURATION = 1.8;

  let lastSplashSimTime = 0;

  // Reduced motion media query listener
  let prefersReducedMotion = false;
  let motionMediaQuery: MediaQueryList | null = null;
  let motionListener: ((e: MediaQueryListEvent) => void) | null = null;

  if (typeof window !== 'undefined' && window.matchMedia) {
    try {
      motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion = motionMediaQuery.matches;
      motionListener = (e: MediaQueryListEvent) => {
        prefersReducedMotion = e.matches;
        rainLines.visible = !prefersReducedMotion && rainMat.opacity > 0.005;
      };
      motionMediaQuery.addEventListener('change', motionListener);
    } catch {
      // Ignore if matchMedia unsupported
    }
  }

  // Update initial visibility
  rainLines.visible = !prefersReducedMotion && rainMat.opacity > 0.005;

  return {
    group: weatherGroup,
    update(dt: number, elapsed: number, windStrength: number, waterLevel: number = 0.3) {
      // 1. Progress smooth season blend from snapshot
      if (transitionProgress < 1.0) {
        transitionProgress += dt / TRANSITION_DURATION;
        if (transitionProgress >= 1.0) {
          transitionProgress = 1.0;
          currentSeason = targetSeason;
        }

        const t = transitionProgress;
        rainMat.opacity = startOpacity + (targetOpacity - startOpacity) * (t * t * (3 - 2 * t));
        onSeasonProgress(targetSeason, transitionProgress);
      }

      const shouldRenderRain = rainMat.opacity > 0.005 && !prefersReducedMotion;
      rainLines.visible = shouldRenderRain;

      // 2. Animate raindrops if visible
      if (shouldRenderRain) {
        const positions = rainGeo.attributes.position.array as Float32Array;
        const windTilt = windStrength * 0.8;

        for (let i = 0; i < activeDropCount; i++) {
          const idx = i * 6;
          const dropDt = rainVelocities[i] * dt;
          const len = streakLengths[i];

          positions[idx + 1] -= dropDt;
          positions[idx] += windTilt * dt * 3.0;

          // Trail vertex
          positions[idx + 3] = positions[idx] - windTilt * 0.25;
          positions[idx + 4] = positions[idx + 1] - len;
          positions[idx + 5] = positions[idx + 2];

          // Check hit against physical sea level (waterLevel)
          if (positions[idx + 1] <= waterLevel) {
            // Splash ripple using engine simulation time
            if (onRainSplash && elapsed - lastSplashSimTime > 0.14 && Math.random() < 0.28) {
              onRainSplash(positions[idx], positions[idx + 2], 0.16);
              lastSplashSimTime = elapsed;
            }

            // Recycle raindrop to top
            positions[idx] = (Math.random() - 0.5) * DIORAMA_WIDTH * 1.1;
            positions[idx + 1] = 8.0 + Math.random() * 2.0;
            positions[idx + 2] = (Math.random() - 0.5) * DIORAMA_DEPTH * 1.1;

            positions[idx + 3] = positions[idx];
            positions[idx + 4] = positions[idx + 1] - len;
            positions[idx + 5] = positions[idx + 2];
          }
        }
        rainGeo.attributes.position.needsUpdate = true;
      }
    },
    setSeason(newSeason: PhuQuocSeason) {
      if (newSeason === targetSeason) return;
      targetSeason = newSeason;
      startOpacity = rainMat.opacity;
      targetOpacity = newSeason === 'rainy' ? 0.48 : 0.0;
      transitionProgress = 0.0;
    },
    getRainIntensity(): number {
      return THREE.MathUtils.clamp(rainMat.opacity / 0.48, 0.0, 1.0);
    },
    setQuality(quality: Quality) {
      const prevCount = activeDropCount;
      if (quality === 'low') {
        activeDropCount = 250;
      } else if (quality === 'medium') {
        activeDropCount = 550;
      } else {
        activeDropCount = 850;
      }

      // If increasing quality, initialize newly activated raindrops above scene
      if (activeDropCount > prevCount) {
        const positions = rainGeo.attributes.position.array as Float32Array;
        for (let i = prevCount; i < activeDropCount; i++) {
          const idx = i * 6;
          const len = streakLengths[i];
          positions[idx] = (Math.random() - 0.5) * DIORAMA_WIDTH * 1.1;
          positions[idx + 1] = 4.0 + Math.random() * 6.0;
          positions[idx + 2] = (Math.random() - 0.5) * DIORAMA_DEPTH * 1.1;
          positions[idx + 3] = positions[idx];
          positions[idx + 4] = positions[idx + 1] - len;
          positions[idx + 5] = positions[idx + 2];
        }
        rainGeo.attributes.position.needsUpdate = true;
      }

      rainGeo.setDrawRange(0, activeDropCount * 2);
    },
    dispose() {
      if (motionMediaQuery && motionListener) {
        try {
          motionMediaQuery.removeEventListener('change', motionListener);
        } catch {
          // Ignore
        }
      }
      rainGeo.dispose();
      rainMat.dispose();
      weatherGroup.clear();
      parentGroup.remove(weatherGroup);
    },
  };
}
