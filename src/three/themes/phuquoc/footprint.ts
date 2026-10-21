import * as THREE from 'three';

/** Marine display bounds, independent of the crescent island shoreline. */
export const PHUQUOC_CENTER = new THREE.Vector2(0.0, 0.2);

// A broad rectangular sea section with softly rounded corners. The island
// shape is defined separately by shoreline.ts, never by this display border.
export function getPhuQuocFootprintRadius(theta: number): number {
  const dx = Math.abs(Math.cos(theta));
  const dz = Math.abs(Math.sin(theta));
  const radius = 2.0;
  const t = Math.min(10 / Math.max(dx, 1e-12), 8.4 / Math.max(dz, 1e-12));
  if (t * dx <= 8 || t * dz <= 6.4) return t;
  const projection = dx * 8 + dz * 6.4;
  return projection + Math.sqrt(Math.max(0, projection * projection - 8 ** 2 - 6.4 ** 2 + radius ** 2));
}

export function getPhuQuocBoundaryPoint(theta: number): THREE.Vector2 {
  const r = getPhuQuocFootprintRadius(theta);
  return new THREE.Vector2(
    PHUQUOC_CENTER.x + r * Math.cos(theta),
    PHUQUOC_CENTER.y + r * Math.sin(theta)
  );
}

export function isInsidePhuQuocFootprint(x: number, z: number, margin = 0): boolean {
  const dx = x - PHUQUOC_CENTER.x;
  const dz = z - PHUQUOC_CENTER.y;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const theta = Math.atan2(dz, dx);
  const maxR = getPhuQuocFootprintRadius(theta) - margin;
  return dist <= maxR;
}

export function getPhuQuocFootprintDistance(x: number, z: number): number {
  const dx = x - PHUQUOC_CENTER.x;
  const dz = z - PHUQUOC_CENTER.y;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const theta = Math.atan2(dz, dx);
  const maxR = getPhuQuocFootprintRadius(theta);
  return dist - maxR; // negative inside, positive outside
}

// Precomputed boundary polygon (256 samples) for dense tessellation, walls, base, and bounds
export const PHUQUOC_BOUNDARY_SAMPLES = 256;
export const PHUQUOC_BOUNDARY_POINTS: THREE.Vector2[] = [];

for (let i = 0; i < PHUQUOC_BOUNDARY_SAMPLES; i++) {
  const theta = (i / PHUQUOC_BOUNDARY_SAMPLES) * Math.PI * 2;
  PHUQUOC_BOUNDARY_POINTS.push(getPhuQuocBoundaryPoint(theta));
}

// Precomputed 2D outward boundary normals
export const PHUQUOC_BOUNDARY_NORMALS: THREE.Vector2[] = [];
for (let it = 0; it < PHUQUOC_BOUNDARY_SAMPLES; it++) {
  const prevPt = PHUQUOC_BOUNDARY_POINTS[(it - 1 + PHUQUOC_BOUNDARY_SAMPLES) % PHUQUOC_BOUNDARY_SAMPLES];
  const nextPt = PHUQUOC_BOUNDARY_POINTS[(it + 1) % PHUQUOC_BOUNDARY_SAMPLES];
  const tangent = new THREE.Vector2().subVectors(nextPt, prevPt);
  const norm = new THREE.Vector2(tangent.y, -tangent.x).normalize();
  PHUQUOC_BOUNDARY_NORMALS.push(norm);
}

// Bounding box of the footprint
let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
for (const pt of PHUQUOC_BOUNDARY_POINTS) {
  if (pt.x < minX) minX = pt.x;
  if (pt.x > maxX) maxX = pt.x;
  if (pt.y < minZ) minZ = pt.y;
  if (pt.y > maxZ) maxZ = pt.y;
}

export const PHUQUOC_FOOTPRINT_BOUNDS = {
  minX,
  maxX,
  minZ,
  maxZ,
  width: maxX - minX,
  depth: maxZ - minZ,
};
