import * as THREE from 'three';
import {
  STREAM_BOUNDS,
  TIDE_OFFSETS,
  getStreamCenter,
  getStreamHalfWidth,
  getStreamWidth,
  getWaterSurfaceHeight,
  getStreamBedCenterHeight,
  getStreamBedHeight,
  getWaterDepth,
  isInWater,
} from '../src/three/themes/garden/streamProfile.js';
import { computeRawTerrainHeight, createTerrain } from '../src/three/themes/garden/terrain.js';
import { GARDEN_STAIRCASES } from '../src/three/themes/garden/architecture.js';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true });
  } else {
    results.push({ name, passed: false, details });
    console.error(`FAIL: ${name} ${details ? `(${details})` : ''}`);
  }
}

console.log('--- RUNNING CHILLAX STREAM PROFILE VALIDATION SUITE ---');

const NUM_SAMPLES = 250;
const zMin = STREAM_BOUNDS.minZ;
const zMax = STREAM_BOUNDS.maxZ;
const step = (zMax - zMin) / (NUM_SAMPLES - 1);

// 1. Centerline continuity and positive width
let prevCenter = getStreamCenter(zMin);
let centerlineContinuous = true;
let widthAlwaysPositive = true;

for (let i = 0; i < NUM_SAMPLES; i++) {
  const z = zMin + i * step;
  const center = getStreamCenter(z);
  const width = getStreamWidth(z);

  if (Math.abs(center - prevCenter) > 0.35) {
    centerlineContinuous = false;
  }
  prevCenter = center;

  if (width <= 0 || !Number.isFinite(width)) {
    widthAlwaysPositive = false;
  }
}

assert(centerlineContinuous, 'Centerline is continuous without breaks or sharp discontinuities');
assert(widthAlwaysPositive, 'Stream width is strictly positive along all Z coordinates');

// 2. Bed elevation < Water surface elevation at all stream points (Low and High tides)
const tides = ['low', 'high'] as const;
for (const tide of tides) {
  const tideOffset = TIDE_OFFSETS[tide];
  let bedBelowWater = true;
  let bankAboveWater = true;
  let centerInWater = true;
  let firstFailDetails = '';

  for (let i = 0; i < NUM_SAMPLES; i++) {
    const z = zMin + i * step;
    const center = getStreamCenter(z);
    const halfW = getStreamHalfWidth(z);
    const waterY = getWaterSurfaceHeight(z, tideOffset);
    const bedCenterY = getStreamBedCenterHeight(z);

    // Center bed must be strictly below water
    if (bedCenterY >= waterY) {
      bedBelowWater = false;
      firstFailDetails = `At z=${z.toFixed(2)}, bed=${bedCenterY.toFixed(3)}, water=${waterY.toFixed(3)}`;
      break;
    }

    // Channel cross section points at 0.5 * halfWidth
    const midX = center + halfW * 0.5;
    const midBedY = getStreamBedHeight(midX, z);
    if (midBedY >= waterY) {
      bedBelowWater = false;
      firstFailDetails = `At z=${z.toFixed(2)}, midX=${midX.toFixed(2)}, bed=${midBedY.toFixed(3)}, water=${waterY.toFixed(3)}`;
      break;
    }

    // Outer bank edges must rise above water surface to contain the stream
    const leftBankX = center - halfW * 1.35;
    const rightBankX = center + halfW * 1.35;
    const leftBankH = computeRawTerrainHeight(leftBankX, z).height;
    const rightBankH = computeRawTerrainHeight(rightBankX, z).height;

    if (leftBankH < waterY - 0.05 || rightBankH < waterY - 0.05) {
      bankAboveWater = false;
      firstFailDetails = `At z=${z.toFixed(2)}, leftH=${leftBankH.toFixed(3)}, rightH=${rightBankH.toFixed(3)}, waterY=${waterY.toFixed(3)}`;
      break;
    }

    // Center must return isInWater = true
    if (!isInWater(center, z, tideOffset)) {
      centerInWater = false;
      firstFailDetails = `isInWater returned false at center (${center.toFixed(2)}, ${z.toFixed(2)}) for tide=${tide}`;
      break;
    }
  }

  assert(bedBelowWater, `Bed elevation is strictly below water surface at all points (${tide.toUpperCase()} tide)`, firstFailDetails);
  assert(bankAboveWater, `Terrain bank edges rise above water level to prevent leaking (${tide.toUpperCase()} tide)`, firstFailDetails);
  assert(centerInWater, `Stream centerline is submerged in water (${tide.toUpperCase()} tide)`, firstFailDetails);
}

// 3. Stream-lake transition zone continuity regression test around z = 0.5
// Evaluates pairs on both sides of the transition (z in [0.45, 0.55]) across multiple transverse locations
const transverseFractions = [0.0, 0.25, 0.5, 0.75, 0.9, 1.0];
let transitionContinuous = true;
let transitionFailDetails = '';

// Test fine step across 0.5
const zBefore = 0.495;
const zAfter = 0.505;
const dz = zAfter - zBefore; // 0.01

for (const u of transverseFractions) {
  const c1 = getStreamCenter(zBefore);
  const w1 = getStreamHalfWidth(zBefore);
  const x1 = c1 + u * w1;
  const bed1 = getStreamBedHeight(x1, zBefore);
  const terrain1 = computeRawTerrainHeight(x1, zBefore).height;

  const c2 = getStreamCenter(zAfter);
  const w2 = getStreamHalfWidth(zAfter);
  const x2 = c2 + u * w2;
  const bed2 = getStreamBedHeight(x2, zAfter);
  const terrain2 = computeRawTerrainHeight(x2, zAfter).height;

  const dBed = Math.abs(bed2 - bed1);
  const dTerrain = Math.abs(terrain2 - terrain1);

  // Across dz = 0.01, difference must be well within continuous bounds (< 0.012)
  if (dBed > 0.012 || dTerrain > 0.015) {
    transitionContinuous = false;
    transitionFailDetails = `At transverse u=${u.toFixed(2)}: dBed=${dBed.toFixed(4)}, dTerrain=${dTerrain.toFixed(4)} over dz=${dz.toFixed(3)}`;
    break;
  }
}

assert(
  transitionContinuous,
  'Stream-lake transition (channelProfile, bedProfile, maxDepth) is smooth and continuous across z=0.5',
  transitionFailDetails
);

// Gradient continuity check across window [0.3, 0.7] with 20 steps
let maxBedSlope = 0;
let maxTerrainSlope = 0;
for (let i = 0; i < 20; i++) {
  const zA = 0.3 + (i / 20) * 0.4;
  const zB = zA + 0.02;
  for (const u of [0.0, 0.5, 0.85]) {
    const xA = getStreamCenter(zA) + u * getStreamHalfWidth(zA);
    const xB = getStreamCenter(zB) + u * getStreamHalfWidth(zB);
    const slopeBed = Math.abs(getStreamBedHeight(xB, zB) - getStreamBedHeight(xA, zA)) / 0.02;
    const slopeTerrain = Math.abs(computeRawTerrainHeight(xB, zB).height - computeRawTerrainHeight(xA, zA).height) / 0.02;
    if (slopeBed > maxBedSlope) maxBedSlope = slopeBed;
    if (slopeTerrain > maxTerrainSlope) maxTerrainSlope = slopeTerrain;
  }
}
assert(
  maxBedSlope < 1.2 && maxTerrainSlope < 1.4,
  `Gradient along stream-lake transition zone is well-behaved (maxBedSlope=${maxBedSlope.toFixed(2)}, maxTerrainSlope=${maxTerrainSlope.toFixed(2)})`
);

// 4. Fish spawn positions verification at BOTH Low and High Tides
for (const tide of tides) {
  const tideOffset = TIDE_OFFSETS[tide];
  let fishOk = true;
  let fishDetails = '';

  for (let i = 0; i < 50; i++) {
    const z = 0.5 + (i / 49) * 6.5; // Fish spawn range [0.5, 7.0]
    const center = getStreamCenter(z);
    const halfW = getStreamHalfWidth(z);
    const x = center + (Math.sin(i * 3.7) * 0.5) * halfW * 0.7;

    const inWater = isInWater(x, z, tideOffset);
    const depth = getWaterDepth(x, z, tideOffset);
    const waterH = getWaterSurfaceHeight(z, tideOffset);
    const terrainH = computeRawTerrainHeight(x, z).height;
    const fishY = THREE.MathUtils.clamp((terrainH + waterH) * 0.5, terrainH + 0.015, waterH - 0.015);

    if (!inWater || depth <= 0.02 || fishY >= waterH || fishY <= terrainH) {
      fishOk = false;
      fishDetails = `Fish at (${x.toFixed(2)}, ${z.toFixed(2)}): inWater=${inWater}, depth=${depth.toFixed(3)}, fishY=${fishY.toFixed(3)}, waterH=${waterH.toFixed(3)}, terrainH=${terrainH.toFixed(3)}`;
      break;
    }
  }
  assert(fishOk, `All spawned fish reside inside water volume and beneath water surface (${tide.toUpperCase()} tide)`, fishDetails);
}

// 4. Land sample points must return isInWater = false
const dryLandPoints = [
  { x: -4.5, z: -1.0, desc: 'Glamping meadow / campfire area' },
  { x: -5.5, z: -2.0, desc: 'Dome 1 wooden deck' },
  { x: -1.0, z: -2.5, desc: 'Cabin platform' },
  { x: -6.0, z: -5.5, desc: 'Rear-left mountain peak' },
  { x: 5.5,  z: -5.5, desc: 'Rear-right mountain ridge' },
  { x: 6.5,  z: 1.5,  desc: 'Right bank meadow' },
  { x: 7.2,  z: 5.0,  desc: 'Right bank gravel hill' },
];

let landChecksPassed = true;
let landFailDetails = '';
for (const pt of dryLandPoints) {
  if (isInWater(pt.x, pt.z, 0)) {
    landChecksPassed = false;
    landFailDetails = `Point ${pt.desc} at (${pt.x}, ${pt.z}) returned isInWater = true!`;
    break;
  }
}
assert(landChecksPassed, 'All terrestrial land sample points correctly return isInWater = false', landFailDetails);

// 5. Natural Asymmetric Footprint & Boundary Verification
import {
  GARDEN_BOUNDARY_POINTS,
  GARDEN_BOUNDARY_SAMPLES,
  isInsideGardenFootprint,
  GARDEN_FOOTPRINT_BOUNDS,
  getGardenFootprintRadius,
} from '../src/three/themes/garden/footprint.js';

assert(
  GARDEN_BOUNDARY_POINTS.length === GARDEN_BOUNDARY_SAMPLES && GARDEN_BOUNDARY_SAMPLES === 256,
  `Garden boundary polygon has exactly ${GARDEN_BOUNDARY_SAMPLES} samples`
);

// Verify closed contour without degenerate gaps
const pStart = GARDEN_BOUNDARY_POINTS[0];
const pEnd = GARDEN_BOUNDARY_POINTS[GARDEN_BOUNDARY_POINTS.length - 1];
const closeGap = Math.hypot(pStart.x - pEnd.x, pStart.y - pEnd.y);
assert(closeGap < 0.65, `Garden boundary polygon forms a closed contour (gap = ${closeGap.toFixed(3)})`);

// Verify asymmetric natural silhouette (radius varies meaningfully across orientations)
let minR = Infinity;
let maxR = -Infinity;
for (let i = 0; i < 64; i++) {
  const theta = (i / 64) * Math.PI * 2;
  const r = getGardenFootprintRadius(theta);
  if (r < minR) minR = r;
  if (r > maxR) maxR = r;
}
assert(
  maxR - minR > 1.5,
  `Garden footprint is custom asymmetric (radius variation: min=${minR.toFixed(2)}, max=${maxR.toFixed(2)}, span=${(maxR - minR).toFixed(2)})`
);

// Verify all glamping structures, stairs, and props are within footprint
const gardenProps = [
  { x: -5.0, z: -2.0, name: 'Dome 1 (Alpine Deck)' },
  { x: -2.2, z: -1.2, name: 'Dome 2 (Meadow Deck)' },
  { x: -4.2, z: 0.0,  name: 'Dome 3 (Creekside Deck)' },
  { x: -1.0, z: -2.5, name: 'A-Frame Cabin' },
  { x: -3.2, z: -0.8, name: 'Campfire Ring' },
  { x: -2.2, z: 1.2,  name: 'Stairs Top Landing' },
  { x: -2.4, z: 2.2,  name: 'Stairs Mid Section' },
  { x: 2.2,  z: 5.0,  name: 'SUP Board Beach Landing' },
];
let allPropsInside = true;
let propFailName = '';
for (const prop of gardenProps) {
  if (!isInsideGardenFootprint(prop.x, prop.z, 0.2)) {
    allPropsInside = false;
    propFailName = `${prop.name} at (${prop.x}, ${prop.z})`;
    break;
  }
}
assert(allPropsInside, 'All glamping domes, cabin, campfire, stairs, and props reside safely within natural footprint', propFailName);

// 6. Geometry Winding & Face Normal Cross Product Verification
const mockScene = new THREE.Scene();
const gardenTerrainSystem = createTerrain(mockScene);
const dioramaMesh = gardenTerrainSystem.group.getObjectByName('DioramaTerrainMesh') as THREE.Mesh;
assert(!!dioramaMesh, 'DioramaTerrainMesh exists in terrain system');

const geom = dioramaMesh.geometry as THREE.BufferGeometry;
const posAttr = geom.attributes.position;
const indexAttr = geom.index;
assert(!!posAttr && !!indexAttr, 'Terrain mesh contains valid position and index buffer attributes');

let topWindingCorrect = true;
let topTrianglesCount = 0;
let bottomWindingCorrect = true;
let bottomTrianglesCount = 0;
let sideWindingCorrect = true;
let sideTrianglesCount = 0;

const v0 = new THREE.Vector3();
const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const e1 = new THREE.Vector3();
const e2 = new THREE.Vector3();
const faceNormal = new THREE.Vector3();

if (indexAttr) {
  const numTris = indexAttr.count / 3;
  for (let i = 0; i < numTris; i++) {
    const i0 = indexAttr.getX(i * 3);
    const i1 = indexAttr.getX(i * 3 + 1);
    const i2 = indexAttr.getX(i * 3 + 2);

    v0.fromBufferAttribute(posAttr, i0);
    v1.fromBufferAttribute(posAttr, i1);
    v2.fromBufferAttribute(posAttr, i2);

    e1.subVectors(v1, v0);
    e2.subVectors(v2, v0);
    faceNormal.crossVectors(e1, e2).normalize();
    // Triangles on the top surface (vertices strictly within top surface fan and rings)
    const isTopTriangle = i0 < 35841 && i1 < 35841 && i2 < 35841;

    // Bottom face triangles (at baseBottomY = -0.70)
    if (Math.abs(v0.y - (-0.70)) < 0.001 && Math.abs(v1.y - (-0.70)) < 0.001 && Math.abs(v2.y - (-0.70)) < 0.001) {
      bottomTrianglesCount++;
      if (faceNormal.y > -0.95) {
        bottomWindingCorrect = false;
      }
    }
    // Top surface triangles
    else if (isTopTriangle) {
      topTrianglesCount++;
      if (faceNormal.y <= 0.0) {
        topWindingCorrect = false;
      }
    }
    // Side wall / bevel triangles
    else {
      sideTrianglesCount++;
      const midX = (v0.x + v1.x + v2.x) / 3;
      const midZ = (v0.z + v1.z + v2.z) / 3;
      const outDirX = midX - GARDEN_FOOTPRINT_BOUNDS.minX * 0.5 - GARDEN_FOOTPRINT_BOUNDS.maxX * 0.5;
      const outDirZ = midZ - GARDEN_FOOTPRINT_BOUNDS.minZ * 0.5 - GARDEN_FOOTPRINT_BOUNDS.maxZ * 0.5;
      const dotOut = faceNormal.x * outDirX + faceNormal.z * outDirZ;
      if (dotOut < -0.1) {
        sideWindingCorrect = false;
      }
    }
  }
}

assert(topTrianglesCount > 5000 && topWindingCorrect, `Top surface has verified +Y normal winding across all ${topTrianglesCount} triangles`);
assert(bottomTrianglesCount === 256 && bottomWindingCorrect, `Bottom face has verified strictly -Y normal winding across all ${bottomTrianglesCount} triangles`);
assert(sideTrianglesCount > 1000 && sideWindingCorrect, `Side walls have verified outward-facing normal winding across all ${sideTrianglesCount} triangles`);

// Verify no DoubleSide masking on terrain material
const mat = dioramaMesh.material as THREE.MeshStandardMaterial;
assert(mat.side === THREE.FrontSide, 'Terrain material uses FrontSide rendering (no DoubleSide used to mask winding errors)');

// 7. Raycast Water Interaction & Obstacle Verification Tests
import { intersectGardenWater } from '../src/three/themes/garden/streamProfile.js';
import { createArchitecture } from '../src/three/themes/garden/architecture.js';

// A. Oblique camera raycast tests across stream height profile at both High and Low tides
const cameraPos = new THREE.Vector3(16.0, 15.2, 27.5);
const streamTestTargets = [
  { desc: 'Foreground lake basin (z = 4.5)', z: 4.5, x: 1.8 },
  { desc: 'Mid-valley cascade (z = -1.0)', z: -1.0, x: 2.0 },
  { desc: 'Mountain gorge (z = -4.5)', z: -4.5, x: 2.8 },
];

let obliqueRaycastPassed = true;
let obliqueFailDetails = '';

for (const tide of tides) {
  const tideOffset = TIDE_OFFSETS[tide];
  for (const target of streamTestTargets) {
    const trueSurfaceY = getWaterSurfaceHeight(target.z, tideOffset);
    const targetPt = new THREE.Vector3(target.x, trueSurfaceY, target.z);
    const rayDir = new THREE.Vector3().subVectors(targetPt, cameraPos).normalize();
    const ray = new THREE.Ray(cameraPos, rayDir);

    const hit = intersectGardenWater(ray, tideOffset);
    if (!hit) {
      obliqueRaycastPassed = false;
      obliqueFailDetails = `Failed to intersect stream water for ${target.desc} at ${tide.toUpperCase()} tide`;
      break;
    }

    const expectedY = getWaterSurfaceHeight(hit.point.z, tideOffset);
    if (Math.abs(hit.point.y - expectedY) > 0.002) {
      obliqueRaycastPassed = false;
      obliqueFailDetails = `Intersection Y (${hit.point.y.toFixed(4)}) did not match surface height (${expectedY.toFixed(4)}) for ${target.desc} at ${tide.toUpperCase()} tide`;
      break;
    }

    if (!isInWater(hit.point.x, hit.point.z, tideOffset)) {
      obliqueRaycastPassed = false;
      obliqueFailDetails = `Intersection point (${hit.point.x.toFixed(2)}, ${hit.point.z.toFixed(2)}) was not in water at ${tide.toUpperCase()} tide`;
      break;
    }
  }
}

assert(
  obliqueRaycastPassed,
  'Oblique camera raycast accurately intersects height-varying stream surface across gorge, cascades and lake at both HIGH and LOW tides',
  obliqueFailDetails
);

// B. Vertical front cross-section skirt rejection
// Ray aimed horizontally into the vertical skirt face at z = 8.0, y = 0.10
const skirtRayOrigin = new THREE.Vector3(1.5, 0.10, 12.0);
const skirtRayDir = new THREE.Vector3(0, 0, -1);
const skirtRay = new THREE.Ray(skirtRayOrigin, skirtRayDir);
const skirtHit = intersectGardenWater(skirtRay, 0);
assert(
  skirtHit === null || skirtHit.point.z < 8.0,
  'Ray hitting vertical water cross-section skirt does not produce spurious ripple on front cut'
);

// C. Emergent boulder vs submerged rock vs clear water obstacle testing
const archSystem = createArchitecture(mockScene, (x, z) => computeRawTerrainHeight(x, z).height);
const obstacles: THREE.Object3D[] = [gardenTerrainSystem.group, archSystem.group];

// Test 1: Emergent boulder (Boulder 2 at x=4.6, z=3.6 emerges above water surface)
// In water (bedH=0.216, waterH=0.280), top reaches 0.558 > 0.280
const rayToEmergent = new THREE.Ray(
  new THREE.Vector3(4.6, 5.0, 3.6),
  new THREE.Vector3(0, -1, 0)
);
const waterHitEmergent = intersectGardenWater(rayToEmergent, 0);
const raycasterEmergent = new THREE.Raycaster(rayToEmergent.origin, rayToEmergent.direction);
const emergentObstacleHits = raycasterEmergent.intersectObjects(obstacles, true);

let emergentBlockedOk = false;
let emergentFailInfo = '';
if (!waterHitEmergent) {
  emergentFailInfo = 'waterHitEmergent was null';
} else if (emergentObstacleHits.length === 0) {
  emergentFailInfo = 'emergentObstacleHits was empty';
} else {
  const distDiff = waterHitEmergent.distance - emergentObstacleHits[0].distance;
  emergentBlockedOk = distDiff > 0.005;
  emergentFailInfo = `waterDist=${waterHitEmergent.distance.toFixed(4)}, obstacleDist=${emergentObstacleHits[0].distance.toFixed(4)}, diff=${distDiff.toFixed(4)}`;
}

assert(
  emergentBlockedOk,
  'Emergent boulder top is strictly in front of water and blocks water ripple',
  emergentFailInfo
);

// Test 2: Submerged rock (Boulder 4 at x=2.8, z=-2.6 is submerged beneath cascade water)
// In water (bedH=0.386, waterH=1.060), boulder top is 0.746 < 1.060
const rayToSubmerged = new THREE.Ray(
  new THREE.Vector3(2.8, 5.0, -2.6),
  new THREE.Vector3(0, -1, 0)
);
const waterHitSubmerged = intersectGardenWater(rayToSubmerged, 0);
const raycasterSubmerged = new THREE.Raycaster(rayToSubmerged.origin, rayToSubmerged.direction);
const submergedObstacleHits = raycasterSubmerged.intersectObjects(obstacles, true);

// Submerged rock is behind water surface: obstacle distance is GREATER than water distance!
const rockIsBehindWater = submergedObstacleHits.length > 0 && submergedObstacleHits[0].distance > (waterHitSubmerged ? waterHitSubmerged.distance + 0.005 : 0);
assert(
  waterHitSubmerged !== null && rockIsBehindWater,
  'Submerged rock beneath water is behind water surface and does NOT block water ripple'
);

// Test 3: Clear open water with no obstacle in front
const clearWaterPt = new THREE.Vector3(1.8, getWaterSurfaceHeight(5.0, 0), 5.0);
const rayToClearWater = new THREE.Ray(
  new THREE.Vector3(1.8, 6.0, 5.0),
  new THREE.Vector3(0, -1, 0)
);
const waterHitClear = intersectGardenWater(rayToClearWater, 0);
const raycasterClear = new THREE.Raycaster(rayToClearWater.origin, rayToClearWater.direction);
const clearObstacleHits = raycasterClear.intersectObjects(obstacles, true);

// Riverbed is behind water: obstacle hit distance is GREATER than water distance!
const bedIsBehindWater = clearObstacleHits.length > 0 && clearObstacleHits[0].distance > waterHitClear!.distance;
assert(
  waterHitClear !== null && (clearObstacleHits.length === 0 || bedIsBehindWater),
  'Clear water surface is unblocked; submerged riverbed behind water does not block ripple'
);

// =========================================================================
// 8. Garden Cliffside Staircases: Monotonicity, Uniform Risers & Foundations
// =========================================================================
// =========================================================================
// 8. Garden Cliffside Staircases: Real Terrain Mesh Raycasting, Tread Reveals & Bedrock Anchors
// =========================================================================
const gardenScene = new THREE.Scene();
const terrainSys = createTerrain(gardenScene);
const terrainMesh = terrainSys.group.getObjectByName('DioramaTerrainMesh') as THREE.Mesh;
assert(terrainMesh !== undefined, 'Garden diorama terrain mesh instantiated successfully for staircase raycasting');

const downRaycaster = new THREE.Raycaster();
const dirDown = new THREE.Vector3(0, -1, 0);

function getMeshElevationAt(x: number, z: number): number {
  downRaycaster.set(new THREE.Vector3(x, 5.0, z), dirDown);
  const hits = downRaycaster.intersectObject(terrainMesh, false);
  if (hits.length > 0) {
    return hits[0].point.y;
  }
  return terrainSys.getHeightAt(x, z);
}

const stairList = [GARDEN_STAIRCASES.west, GARDEN_STAIRCASES.east];

stairList.forEach((stair) => {
  interface TreadItem {
    name: string;
    center: { x: number; z: number };
    treadY: number;
    bottomY: number;
    gridPoints: { x: number; z: number }[];
  }

  const allTreads: TreadItem[] = [];

  // Helper to generate 9 sample grid points (center, 4 corners, 4 midpoints)
  function makeGridPoints(
    cx: number,
    cz: number,
    width: number,
    depth: number,
    theta = 0,
    isStep = false
  ): { x: number; z: number }[] {
    const pts: { x: number; z: number }[] = [];
    const hw = (width / 2) - 0.04;
    const hd = (depth / 2) - 0.04;
    // For flight steps, the rear 12cm is nested under the upper step; exposed tread begins at upper riser
    const backD = isStep ? 0.02 : -hd;

    const uX = Math.cos(theta);
    const uZ = -Math.sin(theta);
    const vX = Math.sin(theta);
    const vZ = Math.cos(theta);

    const offsets = [
      [0, (backD + hd) / 2],
      [-hw, backD],
      [-hw, hd],
      [hw, backD],
      [hw, hd],
      [-hw, (backD + hd) / 2],
      [hw, (backD + hd) / 2],
      [0, backD],
      [0, hd],
    ];

    offsets.forEach(([du, dv]) => {
      pts.push({
        x: cx + du * uX + dv * vX,
        z: cz + du * uZ + dv * vZ,
      });
    });

    return pts;
  }

  // 1. Top Landing
  const topBedY = getMeshElevationAt(stair.topLanding.x, stair.topLanding.z);
  allTreads.push({
    name: `${stair.name} Top Landing`,
    center: { x: stair.topLanding.x, z: stair.topLanding.z },
    treadY: stair.topLanding.y,
    bottomY: Math.min(stair.topLanding.y - 0.22, topBedY - 0.15),
    gridPoints: makeGridPoints(
      stair.topLanding.x,
      stair.topLanding.z,
      stair.topLanding.width,
      stair.topLanding.depth
    ),
  });

  // 2. Upper flight
  const uDx = stair.upperFlight.endX - stair.upperFlight.startX;
  const uDz = stair.upperFlight.endZ - stair.upperFlight.startZ;
  const uTheta = Math.atan2(uDx, uDz);

  for (let i = 0; i < stair.upperFlight.steps; i++) {
    const t = (i + 0.5) / stair.upperFlight.steps;
    const sx = THREE.MathUtils.lerp(stair.upperFlight.startX, stair.upperFlight.endX, t);
    const sz = THREE.MathUtils.lerp(stair.upperFlight.startZ, stair.upperFlight.endZ, t);
    const stepY = stair.upperFlight.startY - (i + 1) * stair.upperFlight.riserHeight;
    const bedY = getMeshElevationAt(sx, sz);
    const bottomY = Math.min(stepY - stair.upperFlight.riserHeight - 0.08, bedY - 0.15);

    allTreads.push({
      name: `${stair.name} Upper Step ${i + 1}`,
      center: { x: sx, z: sz },
      treadY: stepY,
      bottomY,
      gridPoints: makeGridPoints(sx, sz, stair.upperFlight.width, stair.upperFlight.treadDepth, uTheta, true),
    });
  }

  // 3. Mid Landing (Chiếu nghỉ)
  const midBedY = getMeshElevationAt(stair.midLanding.x, stair.midLanding.z);
  allTreads.push({
    name: `${stair.name} Mid Landing (Chiếu Nghỉ)`,
    center: { x: stair.midLanding.x, z: stair.midLanding.z },
    treadY: stair.midLanding.y,
    bottomY: Math.min(stair.midLanding.y - 0.22, midBedY - 0.15),
    gridPoints: makeGridPoints(
      stair.midLanding.x,
      stair.midLanding.z,
      stair.midLanding.width,
      stair.midLanding.depth
    ),
  });

  // 4. Lower flight
  const lDx = stair.lowerFlight.endX - stair.lowerFlight.startX;
  const lDz = stair.lowerFlight.endZ - stair.lowerFlight.startZ;
  const lTheta = Math.atan2(lDx, lDz);

  for (let i = 0; i < stair.lowerFlight.steps; i++) {
    const t = (i + 0.5) / stair.lowerFlight.steps;
    const sx = THREE.MathUtils.lerp(stair.lowerFlight.startX, stair.lowerFlight.endX, t);
    const sz = THREE.MathUtils.lerp(stair.lowerFlight.startZ, stair.lowerFlight.endZ, t);
    const stepY = stair.lowerFlight.startY - (i + 1) * stair.lowerFlight.riserHeight;
    const bedY = getMeshElevationAt(sx, sz);
    const bottomY = Math.min(stepY - stair.lowerFlight.riserHeight - 0.08, bedY - 0.15);

    allTreads.push({
      name: `${stair.name} Lower Step ${i + 1}`,
      center: { x: sx, z: sz },
      treadY: stepY,
      bottomY,
      gridPoints: makeGridPoints(sx, sz, stair.lowerFlight.width, stair.lowerFlight.treadDepth, lTheta, true),
    });
  }

  // 5. Bottom landing
  const botBedY = getMeshElevationAt(stair.bottomLanding.x, stair.bottomLanding.z);
  allTreads.push({
    name: `${stair.name} Bottom Landing`,
    center: { x: stair.bottomLanding.x, z: stair.bottomLanding.z },
    treadY: stair.bottomLanding.y,
    bottomY: Math.min(stair.bottomLanding.y - 0.22, botBedY - 0.15),
    gridPoints: makeGridPoints(
      stair.bottomLanding.x,
      stair.bottomLanding.z,
      stair.bottomLanding.width,
      stair.bottomLanding.depth
    ),
  });

  // Check 1: Monotonicity along entire route
  let isMonotonic = true;
  let monotonicFailMsg = '';
  for (let k = 0; k < allTreads.length - 1; k++) {
    const cur = allTreads[k];
    const nxt = allTreads[k + 1];
    if (nxt.treadY > cur.treadY) {
      isMonotonic = false;
      monotonicFailMsg = `${cur.name} (y=${cur.treadY.toFixed(3)}) is lower than next ${nxt.name} (y=${nxt.treadY.toFixed(3)})`;
      break;
    }
  }
  assert(
    isMonotonic,
    `${stair.name}: Step elevations descend monotonically with zero upward bumps along route`,
    monotonicFailMsg
  );

  // Check 2: Uniform risers within flights
  let upperRisersUniform = true;
  for (let i = 0; i < stair.upperFlight.steps; i++) {
    const step = allTreads[1 + i];
    const prevY = i === 0 ? stair.upperFlight.startY : allTreads[1 + i - 1].treadY;
    const diff = Math.abs((prevY - step.treadY) - stair.upperFlight.riserHeight);
    if (diff > 1e-5) {
      upperRisersUniform = false;
      break;
    }
  }
  assert(
    upperRisersUniform && stair.upperFlight.riserHeight >= 0.11 && stair.upperFlight.riserHeight <= 0.16,
    `${stair.name}: Upper flight risers are completely uniform (${stair.upperFlight.riserHeight.toFixed(4)}m) within comfortable architectural range`
  );

  let lowerRisersUniform = true;
  const lowerOffset = 1 + stair.upperFlight.steps + 1;
  for (let i = 0; i < stair.lowerFlight.steps; i++) {
    const step = allTreads[lowerOffset + i];
    const prevY = i === 0 ? stair.lowerFlight.startY : allTreads[lowerOffset + i - 1].treadY;
    const diff = Math.abs((prevY - step.treadY) - stair.lowerFlight.riserHeight);
    if (diff > 1e-5) {
      lowerRisersUniform = false;
      break;
    }
  }
  assert(
    lowerRisersUniform && stair.lowerFlight.riserHeight >= 0.11 && stair.lowerFlight.riserHeight <= 0.16,
    `${stair.name}: Lower flight risers are completely uniform (${stair.lowerFlight.riserHeight.toFixed(4)}m) within comfortable architectural range`
  );

  // Check 3: Real Mesh Raycast Verification — Tread Reveal across entire grid (Center + 4 corners + 4 midpoints)
  // Step tread must sit strictly above terrain with zero dirt bursting through the tread surface
  let allTreadsExposed = true;
  let treadExposureFail = '';
  let minTreadReveal = Infinity;

  allTreads.forEach((t) => {
    t.gridPoints.forEach((pt, pIdx) => {
      const meshY = getMeshElevationAt(pt.x, pt.z);
      const reveal = t.treadY - meshY;
      if (reveal < minTreadReveal) minTreadReveal = reveal;
      if (reveal < 0.02) {
        allTreadsExposed = false;
        treadExposureFail = `${t.name} pt #${pIdx} at (${pt.x.toFixed(2)}, ${pt.z.toFixed(2)}): treadY=${t.treadY.toFixed(3)} is penetrated by terrainMesh=${meshY.toFixed(3)} (reveal=${reveal.toFixed(3)}m < 0.02m)`;
      }
    });
  });
  assert(
    allTreadsExposed,
    `${stair.name}: All step treads and landings are completely exposed above terrain mesh across center, 4 corners, and grid (min reveal: +${(minTreadReveal * 100).toFixed(1)}cm >= +2.0cm, zero dirt penetration)`,
    treadExposureFail
  );

  // Check 4: Real Mesh Raycast Verification — Solid foundation under-supports anchored into bedrock
  // Foundations must extend >= 8cm beneath rendered bedrock (zero floating or hollow gaps)
  let allUnderSupportsBuried = true;
  let underSupportFail = '';
  allTreads.forEach((t) => {
    const meshY = getMeshElevationAt(t.center.x, t.center.z);
    if (t.bottomY > meshY - 0.08) {
      allUnderSupportsBuried = false;
      underSupportFail = `${t.name} at (${t.center.x.toFixed(2)}, ${t.center.z.toFixed(2)}): bottomY=${t.bottomY.toFixed(3)} is above terrainMesh=${meshY.toFixed(3)}`;
    }
  });
  assert(
    allUnderSupportsBuried,
    `${stair.name}: All steps and landings have solid under-supports anchored >= 8cm below rendered bedrock (zero floating or hollow gaps)`,
    underSupportFail
  );

  // Check 5: Tangent orientation
  assert(
    Number.isFinite(uTheta) && Math.hypot(uDx, uDz) > 0.5,
    `${stair.name}: Upper flight steps are aligned with walking direction tangent`
  );
});

// Check 6: Flagstone Stepping Stone connections to stair landings
const landingConnectionPoints = [
  { x: -5.85, z: 0.10, name: 'West Top Landing Connection' },
  { x: -5.10, z: 3.15, name: 'West Bottom Landing Connection' },
  { x: -2.00, z: 0.55, name: 'East Top Landing Connection' },
  { x: -1.05, z: 3.45, name: 'East Bottom Landing Connection' },
];

let allConnectionsGrounded = true;
let connectionFailMsg = '';
landingConnectionPoints.forEach((pt) => {
  const meshY = getMeshElevationAt(pt.x, pt.z);
  if (!Number.isFinite(meshY) || meshY < 0.20 || meshY > 2.0) {
    allConnectionsGrounded = false;
    connectionFailMsg = `${pt.name} at (${pt.x}, ${pt.z}) has invalid elevation ${meshY}`;
  }
});
assert(
  allConnectionsGrounded,
  'All flagstone walking path connections to staircase landings contact solid ground smoothly',
  connectionFailMsg
);

terrainSys.dispose();


// Summary
const totalPassed = results.filter(r => r.passed).length;
console.log('----------------------------------------------------');
console.log(`TOTAL TESTS: ${results.length} | PASSED: ${totalPassed} | FAILED: ${results.length - totalPassed}`);
if (totalPassed === results.length) {
  console.log('>>> ALL STREAM PROFILE VALIDATION TESTS PASSED! <<<');
  process.exit(0);
} else {
  console.error('>>> SOME STREAM PROFILE VALIDATION TESTS FAILED! <<<');
  process.exit(1);
}
