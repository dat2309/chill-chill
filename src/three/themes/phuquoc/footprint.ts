import * as THREE from 'three';

/**
 * Natural Diorama Footprint for "Phu Quoc Sunset Bay":
 * Organic coastal headland and bay silhouette:
 * - Prominent granite rocky headland protruding prominently at the Northeast (x > 0, z < 0)
 * - Sweeping crescent bay contour cradling the sea, coral reef, and boats on the South / Southwest
 * - Curved beach spit and sandy backshore hugging the bungalow and coconut palms on the West / Northwest
 * - Asymmetric natural coastal silhouette with clear directional axis (NE headland to SW bay)
 */

export const PHUQUOC_CENTER = new THREE.Vector2(0.0, 0.2);

export function getPhuQuocFootprintRadius(theta: number): number {
  let r = 7.75;

  // Promontory 1: Prominent Granite Rocky Headland protruding at Northeast (theta ~ -PI/4, x > 0, z < 0)
  // In our coordinates, -Z is rear/North, +Z is foreground/South
  // theta = -PI/4 corresponds to x > 0, z < 0 (Northeast)
  const headlandAngle = -Math.PI * 0.25;
  const dThetaHeadland = Math.atan2(Math.sin(theta - headlandAngle), Math.cos(theta - headlandAngle));
  r += 1.95 * Math.exp(-Math.pow(dThetaHeadland / 0.38, 2));

  // Coastal Bay Arc: Wide bay crescent on South & Southwest (theta ~ +PI/3 to +3PI/4, z > 0)
  const bayFactor = Math.max(0, Math.sin(theta));
  r += 1.35 * Math.pow(bayFactor, 1.35);

  // Inland Dune Arc on West / Northwest (theta ~ PI)
  const inlandFactor = Math.max(0, -Math.cos(theta));
  r += 1.05 * Math.pow(inlandFactor, 1.6);

  // Coastal organic undulations along the marine perimeter
  r += 0.38 * Math.sin(2 * theta - 0.7) - 0.22 * Math.cos(4 * theta + 0.3);

  return r;
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
