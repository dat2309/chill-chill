import { DIORAMA_WIDTH, DIORAMA_DEPTH, SEA_LEVEL_BASE, SEA_LEVEL_LOW, SEA_LEVEL_HIGH } from './constants';
import { fbm2D, SimplexNoise2D } from '../../core/noise';

export const SHORELINE_BOUNDS = {
  minX: -DIORAMA_WIDTH / 2, // -10
  maxX: DIORAMA_WIDTH / 2,  // 10
  minZ: -DIORAMA_DEPTH / 2, // -8
  maxZ: DIORAMA_DEPTH / 2,  // 8
};

/**
 * Analytical crescent bay shoreline curve:
 * Returns the Z coordinate where the dry sand meets the water at base sea level.
 * Center bay is scooped inward (smaller Z), while granite headlands flank the sides.
 */
export function getShoreZ(x: number): number {
  // Clamped X in bounds
  const cx = Math.max(-10, Math.min(10, x));
  
  // Base crescent bay equation:
  // Center is scooped back around Z = 1.8; east headland (x > 3) extends toward Z = 3.6; west point (x < -6) slopes at Z = 2.2
  const crescent = 2.0 - 1.2 * Math.cos((cx - 0.5) * 0.22) + 0.6 * Math.sin(cx * 0.35);
  
  // Add subtle natural coastal variations with low-frequency noise
  const variation = 0.35 * SimplexNoise2D(cx * 0.2, 4.2);
  
  return crescent + variation;
}

/**
 * Distance to shoreline:
 * Returns approximate signed distance: positive = dry land (inland), negative = submerged (in sea).
 */
export function getDistanceToShore(x: number, z: number): number {
  const shoreZ = getShoreZ(x);
  // As Z increases towards +8, we move out to sea.
  // Inland is negative Z (towards -8).
  return shoreZ - z;
}

/**
 * Returns base terrain elevation (dry land, beach, granite headlands, and submerged seabed).
 * Continuous function without sudden steps or holes.
 */
export function getTerrainHeight(x: number, z: number): number {
  const shoreZ = getShoreZ(x);
  const distToShore = shoreZ - z; // > 0 inland, < 0 out to sea

  if (distToShore <= 0) {
    // === SEA BED (Z > shoreZ) ===
    // Smoothly slopes down into the crystal sea towards front edge
    const submergedDist = -distToShore; // 0 at waterline up to ~7 at front edge
    
    // Near shore shelf drops gently, then deepens smoothly
    const shelf = Math.min(1.0, submergedDist / 1.5);
    const deepDrop = Math.max(0, submergedDist - 1.5);
    
    // Depth below SEA_LEVEL_BASE
    let depth = shelf * 0.25 + deepDrop * 0.16;
    
    // Add gentle underwater sand ripples and rock outcroppings
    const sandRipple = 0.04 * Math.sin(z * 4.0 + x * 1.5) + 0.03 * SimplexNoise2D(x * 0.5, z * 0.5);
    depth -= sandRipple;

    // Granite underwater reefs on right side (x > 4)
    if (x > 3.5) {
      const rockNoise = Math.max(0, fbm2D(x * 0.4, z * 0.4, 2, 2.0, 0.5) - 0.2);
      depth -= rockNoise * 0.2;
    }

    const bedElevation = SEA_LEVEL_BASE - Math.max(0.04, depth);
    return Math.max(-0.9, bedElevation);
  } else {
    // === INLAND / BEACH / HEADLAND (Z <= shoreZ) ===
    // 1. Intertidal & Dry Sand Beach Zone (distToShore 0 -> 4.5)
    if (distToShore < 4.5) {
      // Natural sand berm slope rising from water level 0.30 to ~1.40
      let beachH = SEA_LEVEL_BASE + 0.24 * distToShore + 0.045 * Math.pow(distToShore, 1.4);
      
      // Gentle beach dune undulation
      beachH += 0.06 * SimplexNoise2D(x * 0.3, z * 0.3);

      // East granite headland slopes up earlier on the right (x > 3.0)
      if (x > 3.0) {
        const headlandWeight = Math.min(1.0, (x - 3.0) / 3.0);
        const graniteH = 0.6 + 1.2 * headlandWeight + 0.4 * fbm2D(x * 0.5, z * 0.5, 3, 2.0, 0.5);
        beachH = beachH * (1 - headlandWeight) + graniteH * headlandWeight;
      }

      return beachH;
    }

    // 2. Coastal Terrace & Bungalow Plateau (distToShore 4.5 -> 7.5, z: -1 to -4)
    const inlandDist = distToShore - 4.5;
    let terraceH = 1.40 + inlandDist * 0.22;

    // Gentle tropical knoll / plateau for bungalows
    const plateauNoise = 0.15 * fbm2D(x * 0.25, z * 0.25, 3, 2.0, 0.5);
    terraceH += plateauNoise;

    // 3. Background Coastal Hills & Granite Promontory (Z < -4)
    if (z < -4) {
      const hillDist = (-4 - z) / 4.0; // 0 to 1
      const hillH = 1.0 + hillDist * 1.8 + 0.6 * fbm2D(x * 0.4, z * 0.4, 4, 2.0, 0.5);
      
      // Blend terrace into backdrop hills
      const blend = Math.min(1.0, hillDist * 1.5);
      terraceH = terraceH * (1 - blend) + (terraceH + hillH) * 0.5 * blend;
    }

    // East headland elevation on right flank
    if (x > 3.5) {
      const rightFlank = Math.min(1.0, (x - 3.5) / 3.0);
      terraceH += rightFlank * (1.2 + 0.5 * SimplexNoise2D(x * 0.6, z * 0.6));
    }

    return Math.min(4.8, terraceH);
  }
}

/**
 * Current sea level given a tide offset (-1.0 to 1.0).
 */
export function getWaterLevel(tideOffset: number = 0): number {
  if (tideOffset < 0) {
    return SEA_LEVEL_BASE + tideOffset * (SEA_LEVEL_BASE - SEA_LEVEL_LOW);
  }
  return SEA_LEVEL_BASE + tideOffset * (SEA_LEVEL_HIGH - SEA_LEVEL_BASE);
}

/**
 * Water depth at (x, z) given tide offset.
 * Returns 0 or negative if terrain is above water.
 */
export function getWaterDepth(x: number, z: number, tideOffset: number = 0): number {
  const currentWaterLevel = getWaterLevel(tideOffset);
  const terrainHeight = getTerrainHeight(x, z);
  return Math.max(0, currentWaterLevel - terrainHeight);
}

/**
 * Is (x, z) submerged in water under current tide?
 */
export function isInWater(x: number, z: number, tideOffset: number = 0): boolean {
  // Must be within diorama bounds
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
 * Is (x, z) on the sand beach area?
 */
export function isOnSand(x: number, z: number): boolean {
  const dist = getDistanceToShore(x, z);
  // Sand spans from shallow water edge to coastal terrace, except steep granite headland
  return dist >= -0.8 && dist <= 5.0 && x < 5.5;
}

/**
 * Is (x, z) damp/wet sand touched by waves or recent high tide?
 */
export function isWetSand(x: number, z: number, tideOffset: number = 0): boolean {
  const depth = getWaterDepth(x, z, tideOffset);
  const dist = getDistanceToShore(x, z);
  // Wet swash zone just above current waterline
  return depth <= 0.05 && dist >= -0.2 && dist <= 1.2;
}

/**
 * Pier / Jetty architectural layout configuration:
 * The wooden jetty starts on the dry sand/terrace and extends into the clear emerald bay.
 */
export const PIER_CONFIG = {
  startX: -1.2,
  startZ: 1.2,
  endX: -1.2,
  endZ: 6.2,
  width: 0.9,
  deckElevation: SEA_LEVEL_HIGH + 0.22, // 0.66, securely above high tide (0.44)
  pilingPairs: 6, // 6 pairs of wooden pilings touching seabed
};

/**
 * Bungalow placement spots:
 * Naturally nestled on dry sand/terrace well above high tide (Z <= 0.0, height >= 0.85).
 */
export const BUNGALOW_SPOTS = [
  { x: -4.8, z: -1.2, rotationY: 0.15 }, // Bungalow 1 (West beach terrace)
  { x: -1.8, z: -2.2, rotationY: -0.10 }, // Bungalow 2 (Center-left garden)
  { x: 1.8, z: -1.5, rotationY: -0.35 },  // Bungalow 3 (East coconut grove)
];

/**
 * Boat anchor / floating positions:
 * Floating in the deep emerald bay, outside wave break zone.
 */
export const BOAT_SPOTS = {
  thung: { x: 1.5, z: 4.8, draft: 0.10 }, // Basket boat bobbing gently
  ghe: { x: -4.2, z: 5.5, draft: 0.16 },   // Vietnamese coastal fishing boat
};
