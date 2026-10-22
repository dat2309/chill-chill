import * as THREE from 'three';

/** Marine display bounds, independent of the crescent island shoreline. */
export const BEACH_CENTER = new THREE.Vector2(0.0, 0.2);
export const PHUQUOC_CENTER = BEACH_CENTER;

// A broad rectangular sea section with softly rounded corners. The island
// shape is defined separately by shoreline.ts, never by this display border.
export function getBeachFootprintRadius(theta: number): number {
  const dx = Math.abs(Math.cos(theta));
  const dz = Math.abs(Math.sin(theta));
  const radius = 2.0;
  const t = Math.min(10 / Math.max(dx, 1e-12), 8.4 / Math.max(dz, 1e-12));
  if (t * dx <= 8 || t * dz <= 6.4) return t;
  const projection = dx * 8 + dz * 6.4;
  return projection + Math.sqrt(Math.max(0, projection * projection - 8 ** 2 - 6.4 ** 2 + radius ** 2));
}
export const getPhuQuocFootprintRadius = getBeachFootprintRadius;

export function getBeachBoundaryPoint(theta: number): THREE.Vector2 {
  const r = getBeachFootprintRadius(theta);
  return new THREE.Vector2(
    BEACH_CENTER.x + r * Math.cos(theta),
    BEACH_CENTER.y + r * Math.sin(theta)
  );
}
export const getPhuQuocBoundaryPoint = getBeachBoundaryPoint;

export function isInsideBeachFootprint(x: number, z: number, margin = 0): boolean {
  const dx = x - BEACH_CENTER.x;
  const dz = z - BEACH_CENTER.y;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const theta = Math.atan2(dz, dx);
  const maxR = getBeachFootprintRadius(theta) - margin;
  return dist <= maxR;
}
export const isInsidePhuQuocFootprint = isInsideBeachFootprint;

export function getBeachFootprintDistance(x: number, z: number): number {
  const dx = x - BEACH_CENTER.x;
  const dz = z - BEACH_CENTER.y;
  const dist = Math.sqrt(dx * dx + dz * dz);
  const theta = Math.atan2(dz, dx);
  const maxR = getBeachFootprintRadius(theta);
  return dist - maxR; // negative inside, positive outside
}
export const getPhuQuocFootprintDistance = getBeachFootprintDistance;

// Precomputed boundary polygon (256 samples) for dense tessellation, walls, base, and bounds
export const BEACH_BOUNDARY_SAMPLES = 256;
export const PHUQUOC_BOUNDARY_SAMPLES = BEACH_BOUNDARY_SAMPLES;
export const BEACH_BOUNDARY_POINTS: THREE.Vector2[] = [];

for (let i = 0; i < BEACH_BOUNDARY_SAMPLES; i++) {
  const theta = (i / BEACH_BOUNDARY_SAMPLES) * Math.PI * 2;
  BEACH_BOUNDARY_POINTS.push(getBeachBoundaryPoint(theta));
}
export const PHUQUOC_BOUNDARY_POINTS = BEACH_BOUNDARY_POINTS;

// Precomputed 2D outward boundary normals
export const BEACH_BOUNDARY_NORMALS: THREE.Vector2[] = [];
for (let it = 0; it < BEACH_BOUNDARY_SAMPLES; it++) {
  const prevPt = BEACH_BOUNDARY_POINTS[(it - 1 + BEACH_BOUNDARY_SAMPLES) % BEACH_BOUNDARY_SAMPLES];
  const nextPt = BEACH_BOUNDARY_POINTS[(it + 1) % BEACH_BOUNDARY_SAMPLES];
  const tangent = new THREE.Vector2().subVectors(nextPt, prevPt);
  const norm = new THREE.Vector2(tangent.y, -tangent.x).normalize();
  BEACH_BOUNDARY_NORMALS.push(norm);
}
export const PHUQUOC_BOUNDARY_NORMALS = BEACH_BOUNDARY_NORMALS;

// Bounding box of the footprint
let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
for (const pt of BEACH_BOUNDARY_POINTS) {
  if (pt.x < minX) minX = pt.x;
  if (pt.x > maxX) maxX = pt.x;
  if (pt.y < minZ) minZ = pt.y;
  if (pt.y > maxZ) maxZ = pt.y;
}

export const BEACH_FOOTPRINT_BOUNDS = {
  minX,
  maxX,
  minZ,
  maxZ,
  width: maxX - minX,
  depth: maxZ - minZ,
};
export const PHUQUOC_FOOTPRINT_BOUNDS = BEACH_FOOTPRINT_BOUNDS;
