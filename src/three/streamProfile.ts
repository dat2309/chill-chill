import * as THREE from 'three';
import { TideLevel } from './constants';

/**
 * STREAM PROFILE MODULE (Shared across terrain, water mesh, fish, ripples and physics)
 * 
 * DESIGN DECISION:
 * Continuous stream surface with natural mountain cascades:
 * - Upper mountain gorge (z in [-7.5, -2.5]): Narrow, elevated alpine stream (Y: 1.55 -> 1.05)
 * - Mid-valley cascades (z in [-2.5, 0.5]): Steeper rapid descent along rocky ledges (Y: 1.05 -> 0.28)
 * - Expansive foreground basin (z in [0.5, 8.0]): Calm, wide crystal pool (Y: 0.28)
 * 
 * This gives visual flow dynamics from mountain to valley, ensures water is strictly above
 * the carved riverbed at every cross-section (depth 0.16m - 0.28m), prevents bank penetration,
 * and maintains continuous water surface across the entire diorama length.
 */

export interface StreamBounds {
  minZ: number;
  maxZ: number;
  minX: number;
  maxX: number;
}

export const STREAM_BOUNDS: StreamBounds = {
  minZ: -7.5,
  maxZ: 8.0,
  minX: -2.6,
  maxX: 7.2,
};

export const BASE_WATER_LEVEL = 0.28;

// Tide offsets relative to base profile (instead of arbitrary absolute heights)
export const TIDE_OFFSETS: Record<TideLevel, number> = {
  low: -0.09,
  high: 0.07,
};

export function getTideOffset(tide: TideLevel): number {
  return TIDE_OFFSETS[tide] ?? 0.0;
}

/**
 * Centerline X of the stream along Z.
 * Smoothly curves from rear mountain gorge (-7.5) through the valley to front edge (+8.0).
 */
export function getStreamCenter(z: number): number {
  if (z <= -2.5) {
    // Gorge: runs along right mountain foot
    const t = (z - (-7.5)) / 5.0; // 0 at z=-7.5, 1 at z=-2.5
    return THREE.MathUtils.lerp(3.2, 2.2, t) + Math.sin(t * Math.PI) * 0.15;
  } else if (z <= 0.5) {
    // Cascades: transitions from 2.2 down to 1.5
    const t = (z - (-2.5)) / 3.0; // 0 at z=-2.5, 1 at z=0.5
    const s = t * t * (3.0 - 2.0 * t);
    return THREE.MathUtils.lerp(2.2, 1.45, s);
  } else {
    // Wide foreground basin
    const t = (z - 0.5) / 7.5; // 0 at z=0.5, 1 at z=8.0
    return 1.45 + Math.sin(t * Math.PI * 0.90) * 0.95 + t * 0.35;
  }
}

/**
 * Stream channel half-width along Z.
 * Tightly bounded in mountain pass (0.85 - 1.25m), opening into a spacious 4.2m wide pool in foreground.
 */
export function getStreamHalfWidth(z: number): number {
  if (z <= -2.5) {
    const t = (z - (-7.5)) / 5.0;
    return 0.85 + t * 0.40; // 0.85m to 1.25m
  } else if (z <= 0.5) {
    const t = (z - (-2.5)) / 3.0;
    return 1.25 + t * 0.55; // 1.25m to 1.80m
  } else {
    const t = (z - 0.5) / 7.5;
    // Expands smoothly into foreground basin
    return 1.80 + t * t * 2.45; // 1.80m to 4.25m
  }
}

export function getStreamWidth(z: number): number {
  return getStreamHalfWidth(z) * 2.0;
}

/**
 * Base water surface height Y along Z (tideOffset = 0).
 */
export function getBaseWaterSurfaceHeight(z: number): number {
  if (z >= 0.5) {
    return BASE_WATER_LEVEL;
  } else if (z >= -2.5) {
    // Cascades descent from 1.05 down to 0.28
    const t = (z - (-2.5)) / 3.0;
    const s = t * t * (3.0 - 2.0 * t);
    return THREE.MathUtils.lerp(1.05, BASE_WATER_LEVEL, s);
  } else {
    // Upper mountain gorge descent from 1.55 down to 1.05
    const t = Math.max(0.0, Math.min(1.0, (z - (-7.5)) / 5.0));
    return THREE.MathUtils.lerp(1.55, 1.05, t);
  }
}

/**
 * Water surface height Y along Z including tide offset.
 */
export function getWaterSurfaceHeight(z: number, tideOffset: number = 0): number {
  return getBaseWaterSurfaceHeight(z) + tideOffset;
}

/**
 * Maximum water depth at the center of the stream channel.
 */
export function getStreamMaxDepth(z: number): number {
  if (z <= -2.5) {
    return 0.20;
  } else if (z <= 0.5) {
    return 0.18;
  } else {
    return 0.25;
  }
}

/**
 * Centerline riverbed elevation Y along Z.
 * Always strictly below water surface by getStreamMaxDepth(z).
 */
export function getStreamBedCenterHeight(z: number): number {
  return getBaseWaterSurfaceHeight(z) - getStreamMaxDepth(z);
}

/**
 * Cross-section parabolic riverbed elevation Y at (x, z).
 * Reaches water surface at the banks (|x - center| = halfWidth).
 */
export function getStreamBedHeight(x: number, z: number): number {
  const center = getStreamCenter(z);
  const halfW = getStreamHalfWidth(z);
  const dist = Math.abs(x - center);
  const u = Math.min(1.0, dist / halfW);
  const baseWaterY = getBaseWaterSurfaceHeight(z);
  const maxDepth = getStreamMaxDepth(z);
  // Parabolic channel profile
  return baseWaterY - maxDepth * (1.0 - u * u);
}

/**
 * Depth of water at (x, z) for a given tide offset.
 * Returns 0 if point is outside the water body or on dry land.
 */
export function getWaterDepth(x: number, z: number, tideOffset: number = 0): number {
  if (z < STREAM_BOUNDS.minZ || z > STREAM_BOUNDS.maxZ) return 0.0;
  const center = getStreamCenter(z);
  const halfW = getStreamHalfWidth(z);
  const dist = Math.abs(x - center);

  const waterY = getWaterSurfaceHeight(z, tideOffset);
  const bedY = getStreamBedHeight(x, z);

  const depth = waterY - bedY;
  // Account for tide expanding or narrowing the water edge
  if (dist > halfW * 1.05 && depth <= 0.01) return 0.0;
  return Math.max(0.0, depth);
}

/**
 * Verifies if (x, z) is currently submerged under water with the specified tide offset.
 * Useful for raycast ripple filtering, fish boundary containment, and vegetation exclusion.
 */
export function isInWater(x: number, z: number, tideOffset: number = 0): boolean {
  if (z < STREAM_BOUNDS.minZ - 0.05 || z > STREAM_BOUNDS.maxZ + 0.05) return false;
  const center = getStreamCenter(z);
  const halfW = getStreamHalfWidth(z);
  const dist = Math.abs(x - center);

  // High tide slightly expands water margin, low tide exposes shallow gravel
  const tideWidthFactor = 1.0 + (tideOffset / 0.28) * 0.12;
  const effectiveHalfWidth = halfW * tideWidthFactor;

  if (dist >= effectiveHalfWidth) return false;

  const depth = getWaterDepth(x, z, tideOffset);
  return depth > 0.015;
}
