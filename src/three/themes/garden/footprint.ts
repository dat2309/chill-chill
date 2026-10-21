import * as THREE from 'three';

/** Display perimeter only. The meadow and stream retain their own contours. */
export const GARDEN_CENTER = new THREE.Vector2(0, 0);

// Ray intersection with a 20 × 16 rounded rectangle, corner radius 1.2.
// Straight foreground edge coincides with the stream's display cut at z=8.
export function getGardenFootprintRadius(theta: number): number {
  const dx = Math.abs(Math.cos(theta));
  const dz = Math.abs(Math.sin(theta));
  const radius = 1.2;
  const t = Math.min(10 / Math.max(dx, 1e-12), 8 / Math.max(dz, 1e-12));
  if (t * dx <= 10 - radius || t * dz <= 8 - radius) return t;
  const projection = dx * (10 - radius) + dz * (8 - radius);
  return projection + Math.sqrt(Math.max(0, projection * projection - (10 - radius) ** 2 - (8 - radius) ** 2 + radius ** 2));
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
