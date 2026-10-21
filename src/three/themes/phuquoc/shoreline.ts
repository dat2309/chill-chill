import * as THREE from 'three';
import {
  DIORAMA_WIDTH,
  DIORAMA_DEPTH,
  SEA_LEVEL_BASE,
  SEA_LEVEL_LOW,
  SEA_LEVEL_HIGH,
} from './constants';
import { fbm2D, SimplexNoise2D } from '../../core/noise';

export const SHORELINE_BOUNDS = {
  minX: -DIORAMA_WIDTH / 2, // -10
  maxX: DIORAMA_WIDTH / 2,  // 10
  minZ: -DIORAMA_DEPTH / 2, // -8
  maxZ: DIORAMA_DEPTH / 2,  // 8
};

/**
 * Analytical Ông Lang double-crescent shoreline curve:
 * Features two connected sand coves separated by a rocky outcrop in the center (x ≈ 0)
 * and rocky headlands at both ends, matching the real geography of Ông Lang.
 * Returns Z coordinate where the dry sand meets base water level.
 */
export function getShoreZ(x: number): number {
  const cx = Math.max(-10, Math.min(10, x));

  // Two connected crescent coves:
  // Base line around Z = 1.9;
  // West cove (x around -3.8) indents to Z ≈ 2.5
  // East cove (x around 3.8) indents to Z ≈ 2.4
  // Center coastal rock spit (x around 0) juts out seaward to Z ≈ 1.1
  const doubleCrescent =
    1.8 - 0.9 * Math.cos(cx * 0.48) + 0.35 * Math.sin(cx * 0.25);

  // Subtle natural undulating grain
  const organicWave = 0.22 * SimplexNoise2D(cx * 0.3, 3.7);

  return doubleCrescent + organicWave;
}

/**
 * Signed distance to shoreline:
 * Positive = dry land (inland towards South/East -Z / +X)
 * Negative = submerged (out to sea towards North/West +Z / -X)
 */
export function getDistanceToShore(x: number, z: number): number {
  const shoreZ = getShoreZ(x);
  return shoreZ - z;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Exact continuous elevation function across Ông Lang terrain and seabed:
 * Guaranteed C0 & C1 continuity at the waterline (dist = 0) and terrace transition (dist = 4.5).
 */
export function getTerrainHeight(x: number, z: number): number {
  const dist = getDistanceToShore(x, z);

  // Base parameters matching continuous boundary values
  const BASE_SLOPE = 0.22;
  const CURVE_EXP = 1.35;
  const CURVE_COEFF = 0.042;
  const TERRACE_DIST = 4.5;

  if (dist <= 0) {
    // === SEABED / MARINE REALM (dist <= 0, z >= shoreZ) ===
    const s = -dist; // submerged distance >= 0
    // Continuous depth function: depth(0) = 0, d(depth)/ds = BASE_SLOPE at s = 0
    const depth = BASE_SLOPE * s + 0.028 * s * s;

    // Subtle gentle underwater sand ripple, fades smoothly to 0 at waterline
    const wRipple = smoothstep(0.08, 0.8, s);
    const ripple = 0.03 * Math.sin(z * 3.5 + x * 1.2) * wRipple;

    // Bed elevation starts precisely at SEA_LEVEL_BASE when s=0
    const bed = SEA_LEVEL_BASE - depth + ripple;
    return Math.max(-1.1, bed);
  } else if (dist < TERRACE_DIST) {
    // === INTERTIDAL & DRY SAND BEACH (0 < dist < 4.5) ===
    // Starts exactly at SEA_LEVEL_BASE when dist=0 with derivative BASE_SLOPE
    let beachH =
      SEA_LEVEL_BASE +
      BASE_SLOPE * dist +
      CURVE_COEFF * Math.pow(dist, CURVE_EXP);

    // Modulation weight: exactly 0 at dist <= 0.05, exactly 0 at dist >= 4.45
    // Derivative is 0 at both boundaries, guaranteeing pristine C0 & C1 continuity
    const wBeach =
      smoothstep(0.05, 0.7, dist) * (1.0 - smoothstep(TERRACE_DIST - 0.7, TERRACE_DIST - 0.05, dist));

    if (wBeach > 0) {
      let mod = 0.05 * SimplexNoise2D(x * 0.35, z * 0.35);

      // Coastal rock spine in the center (x around 0) and flanks (x > 6 or x < -7)
      if (Math.abs(x) < 1.2 || x > 6.0 || x < -7.0) {
        const rockStrength =
          Math.abs(x) < 1.2
            ? (1.2 - Math.abs(x)) / 1.2
            : Math.min(1.0, (Math.abs(x) - 6.0) / 2.5);
        mod += 0.35 * rockStrength * fbm2D(x * 0.4, z * 0.4, 3, 2.0, 0.5);
      }

      beachH += wBeach * mod;
    }

    return beachH;
  } else {
    // === UPPER TERRACE & LOW COASTAL KNOLLS (dist >= 4.5) ===
    // Continuous value at dist = 4.5
    const valAtTerrace =
      SEA_LEVEL_BASE +
      BASE_SLOPE * TERRACE_DIST +
      CURVE_COEFF * Math.pow(TERRACE_DIST, CURVE_EXP); // ≈ 1.57m
    const slopeAtTerrace =
      BASE_SLOPE + CURVE_COEFF * CURVE_EXP * Math.pow(TERRACE_DIST, CURVE_EXP - 1); // ≈ 0.31

    const inland = dist - TERRACE_DIST;
    // Low, gentle coastal rise matching slope at terrace
    let terraceH = valAtTerrace + slopeAtTerrace * (inland / (1.0 + 0.1 * inland));

    // Gentle rear knolls deeper inland (inland > 1.0, behind bungalow terrace)
    const knollT = smoothstep(1.0, 4.5, inland);
    if (knollT > 0) {
      const knollH = (0.6 + 0.4 * fbm2D(x * 0.3, z * 0.3, 3, 2.0, 0.5)) * knollT;
      terraceH += knollH;
    }

    return Math.min(3.6, terraceH);
  }
}

/**
 * Interpolates water surface level from a continuous tide offset [-1.0, 1.0].
 */
export function getWaterLevel(tideOffset: number = 0): number {
  if (tideOffset < 0) {
    return SEA_LEVEL_BASE + tideOffset * (SEA_LEVEL_BASE - SEA_LEVEL_LOW);
  }
  return SEA_LEVEL_BASE + tideOffset * (SEA_LEVEL_HIGH - SEA_LEVEL_BASE);
}

/**
 * Water depth at (x, z) relative to current tide.
 */
export function getWaterDepth(x: number, z: number, tideOffset: number = 0): number {
  const currentWaterLevel = getWaterLevel(tideOffset);
  const terrainH = getTerrainHeight(x, z);
  return Math.max(0, currentWaterLevel - terrainH);
}

/**
 * True if (x, z) is submerged in water under current tide.
 */
export function isInWater(x: number, z: number, tideOffset: number = 0): boolean {
  if (
    x < SHORELINE_BOUNDS.minX ||
    x > SHORELINE_BOUNDS.maxX ||
    z < SHORELINE_BOUNDS.minZ ||
    z > SHORELINE_BOUNDS.maxZ
  ) {
    return false;
  }
  const currentWaterLevel = getWaterLevel(tideOffset);
  return getTerrainHeight(x, z) < currentWaterLevel - 0.005;
}

/**
 * True if (x, z) is in the dry sand beach zone.
 */
export function isOnSand(x: number, z: number, tideOffset: number = 0): boolean {
  const dist = getDistanceToShore(x, z);
  const inWater = isInWater(x, z, tideOffset);
  return !inWater && dist > -0.2 && dist < 4.8;
}

/**
 * True if (x, z) is damp wet sand touched by the current waterline or swash.
 */
export function isWetSand(x: number, z: number, tideOffset: number = 0): boolean {
  const currentWaterLevel = getWaterLevel(tideOffset);
  const terrainH = getTerrainHeight(x, z);
  const diff = terrainH - currentWaterLevel;
  // Swash zone: within 12cm above waterline
  return diff >= -0.01 && diff <= 0.14 && x > -8.5 && x < 8.5;
}

/**
 * True if (x, z) is on a coastal rock cluster.
 */
export function isCoastalRockZone(x: number, z: number): boolean {
  return Math.abs(x) < 1.4 || x > 6.2 || x < -7.2;
}

/**
 * Pier / Jetty layout:
 * Small rustic wooden pier acting as a secondary accent.
 */
export const PIER_CONFIG = {
  startX: -2.0,
  startZ: 1.2,
  endX: -2.0,
  endZ: 5.6,
  width: 0.85,
  deckElevation: SEA_LEVEL_HIGH + 0.22, // 0.66m, safely above high tide
  pilingPairs: 5,
};

/**
 * 3 Bungalow positions:
 * Low thatched bungalows nestled in the upper terrace, with clear sand pathways.
 */
export const BUNGALOW_SPOTS = [
  { x: -5.0, z: -1.6, rotationY: 0.18 }, // West Cove Bungalow
  { x: 2.2,  z: -1.8, rotationY: -0.22 }, // East Cove Bungalow
  { x: 5.5,  z: -2.8, rotationY: -0.38 }, // East Garden Bungalow
];

/**
 * Traditional boat spots floating in calm water:
 */
export const BOAT_SPOTS = {
  thung: { x: 1.8, z: 4.5, draft: 0.10 }, // Thuyền thúng
  ghe:   { x: -4.5, z: 5.2, draft: 0.16 }, // Ghe nhỏ
};

/**
 * Intersects a 3D ray with the horizontal sea surface of Phu Quoc coastal diorama.
 * Follows current waterLevel and tide.
 * Rejects points outside diorama marine bounds or on dry land.
 */
export function intersectPhuQuocWater(
  ray: THREE.Ray,
  waterLevel: number,
  tideOffset: number = 0
): { point: THREE.Vector3; distance: number } | null {
  if (Math.abs(ray.direction.y) < 1e-6) return null;
  const t = (waterLevel - ray.origin.y) / ray.direction.y;
  if (t <= 0) return null;

  const hitX = ray.origin.x + t * ray.direction.x;
  const hitZ = ray.origin.z + t * ray.direction.z;

  if (isInWater(hitX, hitZ, tideOffset)) {
    return {
      point: new THREE.Vector3(hitX, waterLevel, hitZ),
      distance: t,
    };
  }
  return null;
}
