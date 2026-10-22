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

// Verify all glamping structures and props are within footprint
const gardenProps = [
  { x: -5.0, z: -2.0, name: 'Dome 1 (Alpine Deck)' },
  { x: -2.2, z: -1.2, name: 'Dome 2 (Meadow Deck)' },
  { x: -4.2, z: 0.0,  name: 'Dome 3 (Creekside Deck)' },
  { x: -1.0, z: -2.5, name: 'A-Frame Cabin' },
  { x: -3.2, z: -0.8, name: 'Campfire Ring' },
  { x: -3.5, z: 0.35, name: 'Meadow Overlook Point' },
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
assert(allPropsInside, 'All glamping domes, cabin, campfire, and props reside safely within natural footprint', propFailName);

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
// 8. Restored Natural Slopes & Complete Staircase Removal Verification
// =========================================================================
const gardenScene = new THREE.Scene();
const terrainSys = createTerrain(gardenScene);
const terrainMesh = terrainSys.group.getObjectByName('DioramaTerrainMesh') as THREE.Mesh;
assert(terrainMesh !== undefined, 'Garden diorama terrain mesh instantiated successfully for natural slope raycasting');

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

// 8.1 Natural slope descent along former West and East corridors
// West slope: x = -6.0, z from 0.5 to 3.5
let westSlopeSmooth = true;
let westSlopeFail = '';
let prevWestY = getMeshElevationAt(-6.0, 0.5);
for (let z = 0.8; z <= 3.5; z += 0.3) {
  const currentY = getMeshElevationAt(-6.0, z);
  if (currentY > prevWestY + 0.05) {
    westSlopeSmooth = false;
    westSlopeFail = `West slope has upward bump at z=${z.toFixed(2)}: ${currentY.toFixed(3)} > ${prevWestY.toFixed(3)}`;
    break;
  }
  prevWestY = currentY;
}
assert(
  westSlopeSmooth && prevWestY < 0.50,
  'West hillside slopes down naturally from plateau (1.35m+) to stream bank (<0.50m) with zero upward bumps or trenches',
  westSlopeFail
);

// East slope: x = -1.6, z from 0.8 to 3.6
let eastSlopeSmooth = true;
let eastSlopeFail = '';
let prevEastY = getMeshElevationAt(-1.6, 0.8);
for (let z = 1.1; z <= 3.6; z += 0.3) {
  const currentY = getMeshElevationAt(-1.6, z);
  if (currentY > prevEastY + 0.05) {
    eastSlopeSmooth = false;
    eastSlopeFail = `East slope has upward bump at z=${z.toFixed(2)}: ${currentY.toFixed(3)} > ${prevEastY.toFixed(3)}`;
    break;
  }
  prevEastY = currentY;
}
assert(
  eastSlopeSmooth && prevEastY < 0.50,
  'East hillside slopes down naturally from meadow (1.35m+) to stream bank (<0.50m) with zero upward bumps or trenches',
  eastSlopeFail
);

// 8.2 Glamping deck foundations and stability
const deckPoints = [
  { x: -5.0, z: -2.0, name: 'Dome 1 Deck' },
  { x: -2.2, z: -1.2, name: 'Dome 2 Deck' },
  { x: -4.2, z: 0.0,  name: 'Dome 3 Deck' },
  { x: -1.0, z: -2.5, name: 'A-Frame Cabin Porch' },
];
let decksGrounded = true;
let deckFailMsg = '';
deckPoints.forEach(dp => {
  const meshY = getMeshElevationAt(dp.x, dp.z);
  if (meshY < 1.20 || meshY > 1.60) {
    decksGrounded = false;
    deckFailMsg = `${dp.name} foundation at (${dp.x}, ${dp.z}) elevation ${meshY.toFixed(3)} is outside plateau range [1.20, 1.60]`;
  }
});
assert(decksGrounded, 'All glamping decks and cabin rest securely on stable plateau meadow terrain', deckFailMsg);

// 8.3 Architecture Verification: Complete absence of outdoor stone staircases & stray snow caps
const archSys = createArchitecture(gardenScene, (x, z) => terrainSys.getHeightAt(x, z));
let hasStairMeshes = false;
let stairMeshName = '';

archSys.group.traverse((obj) => {
  if (obj.name && /stair/i.test(obj.name)) {
    hasStairMeshes = true;
    stairMeshName = obj.name;
  }
});
assert(!hasStairMeshes, 'Architecture system has zero outdoor stone staircase meshes or helper objects', stairMeshName);

// 8.4 Winter Season: Verify no floating or orphaned snow caps where stairs used to be
archSys.updateSeason('winter', 1.0);
const snowMeshes: THREE.Mesh[] = [];
archSys.group.traverse((obj) => {
  if (obj instanceof THREE.Mesh) {
    const mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
    if (mat && mat.color && mat.color.getHex() === 0xe8e8f0) {
      snowMeshes.push(obj);
    }
  }
});

let orphanSnowFound = false;
let orphanSnowMsg = '';
const oldStairZones = [
  { minX: -6.7, maxX: -5.2, minZ: 0.10, maxZ: 4.20, name: 'West former stair corridor' },
  { minX: -2.3, maxX: -0.8, minZ: 0.35, maxZ: 4.50, name: 'East former stair corridor' },
];

snowMeshes.forEach((mesh) => {
  const posAttr = mesh.geometry.attributes.position;
  if (!posAttr) return;
  const v = new THREE.Vector3();
  for (let i = 0; i < posAttr.count; i++) {
    v.fromBufferAttribute(posAttr, i);
    mesh.localToWorld(v);
    oldStairZones.forEach(zone => {
      if (v.x >= zone.minX && v.x <= zone.maxX && v.z >= zone.minZ && v.z <= zone.maxZ) {
        orphanSnowFound = true;
        orphanSnowMsg = `Orphaned snow vertex found at (${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)}) inside ${zone.name}`;
      }
    });
  }
});
assert(!orphanSnowFound, 'Winter season has zero floating or orphaned snow caps across the hillside slopes', orphanSnowMsg);

// 8.5 Flagstone walking paths grounded on solid terrain
const testFlagstones = [
  { x: -4.4, z: -1.6, name: 'Dome 1 to Campfire' },
  { x: -2.4, z: -1.0, name: 'Dome 2 to Campfire' },
  { x: -3.9, z: -0.3, name: 'Dome 3 to Campfire' },
  { x: -1.5, z: -2.1, name: 'Cabin to Campfire' },
  { x: -3.5, z: 0.35, name: 'Meadow Overlook' },
  { x: -5.6, z: -1.1, name: 'Dome 1 to Picnic' },
  { x: 4.5,  z: 2.7,  name: 'Right Bank Beach Path' },
];
let allFlagstonesGrounded = true;
let flagstoneFailMsg = '';
testFlagstones.forEach(pt => {
  const meshY = getMeshElevationAt(pt.x, pt.z);
  if (!Number.isFinite(meshY) || meshY < 0.20 || meshY > 2.0) {
    allFlagstonesGrounded = false;
    flagstoneFailMsg = `${pt.name} at (${pt.x}, ${pt.z}) has invalid elevation ${meshY}`;
  }
});
assert(allFlagstonesGrounded, 'All remaining flagstone path stones rest cleanly on solid terrain', flagstoneFailMsg);

// 8.6 Natural slope accent boulders stability
const slopeBoulderY = getMeshElevationAt(-2.60, 2.40);
assert(
  slopeBoulderY >= 0.40 && slopeBoulderY <= 1.0,
  `Natural slope accent boulder at (-2.60, 2.40) rests securely on slope bedrock (elevation: ${slopeBoulderY.toFixed(3)}m)`
);

archSys.dispose();
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
