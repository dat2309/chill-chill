import * as THREE from 'three';

/**
 * Natural Diorama Footprint for "Chillax Garden & Stream":
 * Asymmetric mountain glamping valley silhouette:
 * - Wide, organic convex meadow lobe on the West (housing glamping domes, cabin deck, campfire)
 * - Rugged high mountain crest backdrop on the North / Northwest
 * - Mountain pass gorge indentation on the Northeast where the mountain stream originates
 * - Gently rolling knolls and lower slope on the East
 * - Broad foreground stream basin and pebble beach opening on the South / Southeast
 */

export const GARDEN_CENTER = new THREE.Vector2(-0.5, 0.0);

export function getGardenFootprintRadius(theta: number): number {
  let r = 7.9;

  // Lobe 1: Wide Glamping Plateau extension on West (theta ~ PI)
  // Reaches x ~ -9.8, comfortably sheltering all 3 domes, cabin, and picnic area
  const westFactor = Math.max(0, -Math.cos(theta));
  r += 2.1 * Math.pow(westFactor, 1.6);

  // Lobe 2: High Mountain Ridge along North/Northwest (theta ~ PI/2 to 3PI/4, z < 0)
  // In our coordinates, +Z is foreground (South), -Z is rear (North)
  // theta = -PI/2 corresponds to North (-Z)
  const northFactor = Math.max(0, -Math.sin(theta));
  r += 0.85 * Math.pow(northFactor, 1.8);

  // Inset 1: Stream Gorge niche on Northeast (theta ~ -PI/4, x > 0, z < 0)
  const gorgeAngle = -Math.PI * 0.24;
  const dThetaGorge = Math.atan2(Math.sin(theta - gorgeAngle), Math.cos(theta - gorgeAngle));
  r -= 0.85 * Math.exp(-Math.pow(dThetaGorge / 0.36, 2));

  // Lobe 3: Broad stream mouth basin in foreground South (theta ~ +PI/2, z > 0)
  const southFactor = Math.max(0, Math.sin(theta));
  r += 1.35 * Math.pow(southFactor, 1.4);

  // Smooth natural geological undulating lobes (no high frequency noise to prevent spikes)
  r += 0.35 * Math.sin(2 * theta + 0.6) + 0.2 * Math.cos(3 * theta - 0.4);

  return r;
}

export function getGardenBoundaryPoint(theta: number): THREE.Vector2 {
  const r = getGardenFootprintRadius(theta);
  return new THREE.Vector2(
    GARDEN_CENTER.x + r * Math.cos(theta),
    GARDEN_CENTER.y + r * Math.sin(theta)
  );
}

export function isInsideGardenFootprint(x: number, z: number, margin = 0): boolean {
  const dx = x - GARDEN_CENTER.x;
  const dz = z - GARDEN_CENTER.y;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const theta = Math.atan2(dz, dx);
  const maxR = getGardenFootprintRadius(theta) - margin;
  return dist <= maxR;
}

export function getGardenFootprintDistance(x: number, z: number): number {
  const dx = x - GARDEN_CENTER.x;
  const dz = z - GARDEN_CENTER.y;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const theta = Math.atan2(dz, dx);
  const maxR = getGardenFootprintRadius(theta);
  return dist - maxR; // negative inside, positive outside
}

// Precomputed boundary polygon (128 samples) for tessellation, walls, base, and bounds
export const GARDEN_BOUNDARY_SAMPLES = 128;
export const GARDEN_BOUNDARY_POINTS: THREE.Vector2[] = [];

for (let i = 0; i < GARDEN_BOUNDARY_SAMPLES; i++) {
  const theta = (i / GARDEN_BOUNDARY_SAMPLES) * Math.PI * 2;
  GARDEN_BOUNDARY_POINTS.push(getGardenBoundaryPoint(theta));
}

// Bounding box of the footprint
let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
for (const pt of GARDEN_BOUNDARY_POINTS) {
  if (pt.x < minX) minX = pt.x;
  if (pt.x > maxX) maxX = pt.x;
  if (pt.y < minZ) minZ = pt.y;
  if (pt.y > maxZ) maxZ = pt.y;
}

export const GARDEN_FOOTPRINT_BOUNDS = {
  minX,
  maxX,
  minZ,
  maxZ,
  width: maxX - minX,
  depth: maxZ - minZ,
};
