import * as THREE from 'three';

/**
 * Natural Diorama Footprint for "Chillax Garden & Stream":
 * Asymmetric alpine glamping valley silhouette:
 * - Wide, elevated meadow terrace lobe on the West (housing glamping domes, cabin deck, campfire, picnic area)
 * - Towering rear mountain crest wall on the North / Northwest
 * - Mountain gorge cleft niche at Northeast where the stream enters the valley
 * - Rolling pine-forested bank and rocky knolls on the East
 * - Flaring foreground stream delta basin and pebble beach landing on the South / Southeast
 * - Distinct asymmetric valley contours that avoid any resemblance to a generic circular or oval disc.
 */

export const GARDEN_CENTER = new THREE.Vector2(-0.6, 0.0);

export function getGardenFootprintRadius(theta: number): number {
  let r = 7.85;

  // Lobe 1: Wide Glamping Plateau extension on West (theta ~ PI)
  // Reaches x ~ -9.6, giving ample room for all 3 domes, cabin, campfire, and picnic lawn
  const westFactor = Math.max(0, -Math.cos(theta));
  r += 2.25 * Math.pow(westFactor, 1.55);

  // Lobe 2: High Mountain Ridge along North/Northwest (theta ~ -PI/2, -Z is rear/North)
  const northFactor = Math.max(0, -Math.sin(theta));
  r += 1.05 * Math.pow(northFactor, 1.75);

  // Inset 1: Mountain Gorge cleft niche at Northeast (theta ~ -0.26 PI, x > 0, z < 0)
  // Indents naturally into the stream pass where water cuts between granite peaks
  const gorgeAngle = -Math.PI * 0.26;
  const dThetaGorge = Math.atan2(Math.sin(theta - gorgeAngle), Math.cos(theta - gorgeAngle));
  r -= 0.95 * Math.exp(-Math.pow(dThetaGorge / 0.32, 2));

  // Lobe 3: Broad stream mouth basin and pebble shore in foreground South (theta ~ +PI/2, +Z)
  // Flaring river delta cradling SUP board and lower stream pool
  const southFactor = Math.max(0, Math.sin(theta));
  r += 1.45 * Math.pow(southFactor, 1.35);

  // Smooth natural geological undulating lobes along the valley flanks
  r += 0.38 * Math.sin(2 * theta + 0.5) + 0.22 * Math.cos(3 * theta - 0.4);

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

// Precomputed boundary polygon (256 samples) for dense tessellation, walls, base, and bounds
export const GARDEN_BOUNDARY_SAMPLES = 256;
export const GARDEN_BOUNDARY_POINTS: THREE.Vector2[] = [];

for (let i = 0; i < GARDEN_BOUNDARY_SAMPLES; i++) {
  const theta = (i / GARDEN_BOUNDARY_SAMPLES) * Math.PI * 2;
  GARDEN_BOUNDARY_POINTS.push(getGardenBoundaryPoint(theta));
}

// Precomputed 2D outward boundary normals
export const GARDEN_BOUNDARY_NORMALS: THREE.Vector2[] = [];
for (let it = 0; it < GARDEN_BOUNDARY_SAMPLES; it++) {
  const prevPt = GARDEN_BOUNDARY_POINTS[(it - 1 + GARDEN_BOUNDARY_SAMPLES) % GARDEN_BOUNDARY_SAMPLES];
  const nextPt = GARDEN_BOUNDARY_POINTS[(it + 1) % GARDEN_BOUNDARY_SAMPLES];
  // Tangent vector as theta increases (clockwise in X-Z plane where +Z is down)
  const tangent = new THREE.Vector2().subVectors(nextPt, prevPt);
  // Outward normal in X-Z: (+dz, -dx)
  const norm = new THREE.Vector2(tangent.y, -tangent.x).normalize();
  GARDEN_BOUNDARY_NORMALS.push(norm);
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
