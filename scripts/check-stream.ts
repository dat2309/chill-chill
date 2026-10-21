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
import { computeRawTerrainHeight } from '../src/three/themes/garden/terrain.js';

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

// 3. Fish spawn positions verification
let fishOk = true;
let fishDetails = '';
for (let i = 0; i < 50; i++) {
  const z = 0.5 + (i / 49) * 6.5; // Fish spawn range [0.5, 7.0]
  const center = getStreamCenter(z);
  const halfW = getStreamHalfWidth(z);
  const x = center + (Math.sin(i * 3.7) * 0.5) * halfW * 0.7;

  const inWater = isInWater(x, z, 0);
  const depth = getWaterDepth(x, z, 0);
  const waterH = getWaterSurfaceHeight(z, 0);
  const terrainH = computeRawTerrainHeight(x, z).height;
  const fishY = (terrainH + waterH) * 0.5;

  if (!inWater || depth <= 0.03 || fishY >= waterH || fishY <= terrainH) {
    fishOk = false;
    fishDetails = `Fish at (${x.toFixed(2)}, ${z.toFixed(2)}): inWater=${inWater}, depth=${depth.toFixed(3)}, fishY=${fishY.toFixed(3)}, waterH=${waterH.toFixed(3)}, terrainH=${terrainH.toFixed(3)}`;
    break;
  }
}
assert(fishOk, 'All spawned fish reside inside water volume and beneath water surface', fishDetails);

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
import * as THREE from 'three';
import { createTerrain } from '../src/three/themes/garden/terrain.js';

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
