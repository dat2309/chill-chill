import * as THREE from 'three';
import { DIORAMA_WIDTH, DIORAMA_DEPTH, BeachSeason, PhuQuocSeason } from './constants';
import { Quality } from '../../core/types';

export interface BeachWeatherSystem {
  group: THREE.Group;
  update(dt: number, elapsed: number, windStrength: number, waterLevel?: number): void;
  updateProgress(dt: number): void;
  updateRaindrops(dt: number, elapsed: number, effectiveWind: number, waterLevel?: number): void;
  setSeason(targetSeason: BeachSeason): void;
  setQuality(quality: Quality): void;
  getRainIntensity(): number;
  dispose(): void;
}
export type PhuQuocWeatherSystem = BeachWeatherSystem;

export function createBeachWeather(
  parentGroup: THREE.Group,
  onSeasonProgress: (season: BeachSeason, progress: number) => void,
  onRainSplash?: (x: number, z: number, strength: number) => void,
  getRainHitHeight?: (x: number, z: number) => number
): BeachWeatherSystem {
  const weatherGroup = new THREE.Group();
  weatherGroup.name = 'BeachWeather';
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
    const ry = 8.0 + Math.random() * 2.0;
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

  // Continuous weather transition factor in [0, 1]: 0.0 = dry, 1.0 = rainy
  let currentRainFactor = 0.0;
  let targetRainFactor = 0.0;
  let currentSeason: BeachSeason = 'dry';
  let targetSeason: BeachSeason = 'dry';
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

  function updateProgress(dt: number): void {
    if (Math.abs(currentRainFactor - targetRainFactor) > 0.0001) {
      const step = dt / TRANSITION_DURATION;
      if (currentRainFactor < targetRainFactor) {
        currentRainFactor = Math.min(targetRainFactor, currentRainFactor + step);
      } else {
        currentRainFactor = Math.max(targetRainFactor, currentRainFactor - step);
      }
      if (currentRainFactor === targetRainFactor) {
        currentSeason = targetSeason;
      }
    }
    rainMat.opacity = currentRainFactor * 0.48;
    onSeasonProgress(targetSeason, currentRainFactor);
  }

  function updateRaindrops(dt: number, elapsed: number, effectiveWind: number, waterLevel: number = 0.3): void {
    const shouldRenderRain = rainMat.opacity > 0.005 && !prefersReducedMotion;
    rainLines.visible = shouldRenderRain;

    if (shouldRenderRain) {
      const positions = rainGeo.attributes.position.array as Float32Array;
      const windTilt = effectiveWind * 0.8;

      for (let i = 0; i < activeDropCount; i++) {
        const idx = i * 6;
        const dropDt = rainVelocities[i] * dt;
        const len = streakLengths[i];

        positions[idx + 1] -= dropDt;
        positions[idx] += windTilt * dt * 3.0;

        // Trail vertex
        positions[idx + 3] = positions[idx] - windTilt * 0.25;
        const hitHeight = Math.max(waterLevel, getRainHitHeight?.(positions[idx], positions[idx+2]) ?? waterLevel,
          getRainHitHeight?.(positions[idx+3], positions[idx+5]) ?? waterLevel);
        positions[idx + 4] = Math.max(hitHeight, positions[idx + 1] - len);
        positions[idx + 5] = positions[idx + 2];

        // Stop at the first roof/ground/sea hit; never draw the streak below that surface.
        if (positions[idx + 1] <= hitHeight) {
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
  }

  return {
    group: weatherGroup,
    updateProgress,
    updateRaindrops,
    update(dt: number, elapsed: number, windStrength: number, waterLevel: number = 0.3) {
      updateProgress(dt);
      const rainIntensity = currentRainFactor;
      const effectiveWind = THREE.MathUtils.clamp(
        windStrength * (1.0 + rainIntensity * 0.50) + rainIntensity * 0.15,
        0.1,
        1.2
      );
      updateRaindrops(dt, elapsed, effectiveWind, waterLevel);
    },
    setSeason(newSeason: BeachSeason) {
      targetSeason = newSeason;
      targetRainFactor = newSeason === 'rainy' ? 1.0 : 0.0;
    },
    getRainIntensity(): number {
      return currentRainFactor;
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
          positions[idx + 1] = 8.0 + Math.random() * 2.0;
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

export const createPhuQuocWeather = createBeachWeather;
