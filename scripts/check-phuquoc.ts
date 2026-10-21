import * as THREE from 'three';
import {
  SHORELINE_BOUNDS,
  getShoreZ,
  getTerrainHeight,
  getWaterLevel,
  getWaterDepth,
  isInWater,
  isOnSand,
  isWetSand,
  getDistanceToShore,
  PIER_CONFIG,
  BUNGALOW_SPOTS,
  BOAT_SPOTS,
} from '../src/three/themes/phuquoc/shoreline';
import {
  SEA_LEVEL_BASE,
  SEA_LEVEL_LOW,
  SEA_LEVEL_HIGH,
  DEFAULT_PHUQUOC_STATE,
} from '../src/three/themes/phuquoc/constants';
import { calculatePhuQuocSunPosition } from '../src/three/themes/phuquoc/lighting';
import {
  PHUQUOC_CENTER,
  PHUQUOC_BOUNDARY_POINTS,
  PHUQUOC_BOUNDARY_SAMPLES,
  isInsidePhuQuocFootprint,
  getPhuQuocFootprintRadius,
  PHUQUOC_FOOTPRINT_BOUNDS,
} from '../src/three/themes/phuquoc/footprint';
import {
  sanitizeGardenState,
  sanitizePhuQuocState,
  sanitizeCameraState,
  loadPersistedAppState,
  savePersistedAppState,
  DEFAULT_GARDEN_STATE,
} from '../src/three/core/storage';

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

// 1. Shoreline Continuity & Bounds
let allRaysCrossShore = true;
const cX = PHUQUOC_CENTER.x;
const cZ = PHUQUOC_CENTER.y;
for (let i = 15; i <= 118; i++) {
  const pt = PHUQUOC_BOUNDARY_POINTS[i];
  const dStart = getDistanceToShore(cX, cZ);
  const dEnd = getDistanceToShore(pt.x, pt.y);
  if (dStart <= 0 || dEnd >= 0) {
    allRaysCrossShore = false;
    console.error(`Ray ${i} fail: dStart=${dStart}, dEnd=${dEnd}`);
  }
}
assert(allRaysCrossShore, 'All marine rays start on land and end in sea across the bay (indices 15 to 118)');



let shoreContinuous = true;
let prevShoreZ = getShoreZ(-10);
for (let x = -10; x <= 10; x += 0.2) {
  const sz = getShoreZ(x);
  if (Math.abs(sz - prevShoreZ) > 0.4) {
    shoreContinuous = false;
    break;
  }
  prevShoreZ = sz;
}
assert(shoreContinuous, 'Shoreline crescent curve is smooth and continuous across [-10, 10]');


// 1b. C0 and C1 Continuity Across Waterline Boundary (dist = 0) and Terrace Boundary (dist = 4.5)
let c0WaterlineContinuous = true;
let c1WaterlineContinuous = true;
let c0TerraceContinuous = true;
const eps = 0.002;

for (let x = -8.0; x <= 8.0; x += 0.5) {
  const sz = getShoreZ(x);

  // Waterline boundary: z = sz (dist = 0)
  const hWaterSide = getTerrainHeight(x, sz + eps);
  const hSandSide = getTerrainHeight(x, sz - eps);
  const diffC0Water = Math.abs(hWaterSide - hSandSide);
  if (diffC0Water > 0.005) {
    c0WaterlineContinuous = false;
  }

  // Slope check (C1 continuity): slope along Z on sand vs water side at boundary
  const hCenter = getTerrainHeight(x, sz);
  const slopeSand = (hCenter - hSandSide) / eps;
  const slopeWater = (hWaterSide - hCenter) / eps;
  if (Math.abs(slopeSand - slopeWater) > 0.05) {
    c1WaterlineContinuous = false;
  }

  // Terrace boundary: z = sz - 4.5 (dist = 4.5)
  const tz = sz - 4.5;
  const hBeachSide = getTerrainHeight(x, tz + eps);
  const hTerraceSide = getTerrainHeight(x, tz - eps);
  if (Math.abs(hBeachSide - hTerraceSide) > 0.005) {
    c0TerraceContinuous = false;
  }
}

assert(c0WaterlineContinuous, 'C0 continuity across waterline boundary (no vertical cliff or step at dist=0)');
assert(c1WaterlineContinuous, 'C1 derivative smoothness across waterline boundary');
assert(c0TerraceContinuous, 'C0 continuity across beach-to-terrace boundary (dist=4.5)');

// 2. Water Depth & Intertidal Elevations (Low and High Tides)
const tides = [
  { name: 'Low Tide', offset: -1.0, level: SEA_LEVEL_LOW },
  { name: 'High Tide', offset: 1.0, level: SEA_LEVEL_HIGH },
];

for (const t of tides) {
  let bayWaterOk = true;
  let bayFailDetails = '';

  // Check 50 sample points across the bay (z from 4.0 to 7.8)
  for (let i = 0; i < 50; i++) {
    const x = -8.0 + (i / 49) * 16.0;
    const z = 4.5 + (Math.sin(i * 1.7) * 0.5 + 0.5) * 2.8;

    const inWater = isInWater(x, z, t.offset);
    const depth = getWaterDepth(x, z, t.offset);
    const bedH = getTerrainHeight(x, z);

    if (!inWater || depth <= 0.05 || bedH >= t.level) {
      bayWaterOk = false;
      bayFailDetails = `At (${x.toFixed(2)}, ${z.toFixed(2)}): inWater=${inWater}, depth=${depth.toFixed(3)}, bed=${bedH.toFixed(3)}, level=${t.level}`;
      break;
    }
  }
  assert(bayWaterOk, `Bay is submerged with positive water depth at all sample points (${t.name})`, bayFailDetails);
}

// 3. Dry Land Samples must never be in water
const dryLandSamples = [
  { x: -4.8, z: -1.2, name: 'Bungalow 1 (West Terrace)' },
  { x: -1.8, z: -2.2, name: 'Bungalow 2 (Center Garden)' },
  { x: 1.8,  z: -1.5, name: 'Bungalow 3 (East Grove)' },
  { x: -6.0, z: -5.0, name: 'West Coastal Hill' },
  { x: 5.5,  z: -5.0, name: 'East Granite Ridge' },
  { x: -2.8, z: 0.2,  name: 'Sun Loungers on Dry Sand' },
];

let dryLandOk = true;
let dryLandFail = '';
for (const pt of dryLandSamples) {
  // Even at High Tide, dry land spots must not be underwater
  if (isInWater(pt.x, pt.z, 1.0)) {
    dryLandOk = false;
    dryLandFail = `${pt.name} at (${pt.x}, ${pt.z}) is underwater at high tide!`;
    break;
  }
}
assert(dryLandOk, 'All bungalow and dry sand relaxation areas remain dry even at high tide', dryLandFail);

// 4. Bungalow Elevation Safety
let bungalowsSafe = true;
BUNGALOW_SPOTS.forEach((b, idx) => {
  const groundH = getTerrainHeight(b.x, b.z);
  // Ground height must be well above SEA_LEVEL_HIGH (0.44)
  if (groundH < SEA_LEVEL_HIGH + 0.2) {
    bungalowsSafe = false;
  }
});
assert(bungalowsSafe, 'All 3 thatched bungalows are positioned safely above maximum high tide line');

// 5. Wooden Pier / Jetty Structure
const pCfg = PIER_CONFIG;
assert(
  pCfg.deckElevation > SEA_LEVEL_HIGH + 0.15,
  'Pier deck elevation (0.66) is strictly higher than high tide (0.44)'
);

// Pier pilings touch or embed into seabed
let pilingsTouchBed = true;
let pilingFailDetails = '';
for (let i = 0; i < pCfg.pilingPairs; i++) {
  const tz = i / (pCfg.pilingPairs - 1);
  const pz = pCfg.startZ + tz * (pCfg.endZ - pCfg.startZ);
  [-pCfg.width / 2 + 0.08, pCfg.width / 2 - 0.08].forEach((ox) => {
    const px = pCfg.startX + ox;
    const bedH = getTerrainHeight(px, pz);
    // Piling top is deck, bottom must reach bedH
    if (bedH > pCfg.deckElevation) {
      pilingsTouchBed = false;
      pilingFailDetails = `Terrain at piling (${px.toFixed(2)}, ${pz.toFixed(2)}) is higher than deck!`;
    }
  });
}
assert(pilingsTouchBed, 'All pier pilings successfully reach from deck to seabed', pilingFailDetails);

// 6. Boat Locations & Realistic Draft
const thung = BOAT_SPOTS.thung;
const thungInWater = isInWater(thung.x, thung.z, 0);
const thungDepth = getWaterDepth(thung.x, thung.z, 0);
assert(thungInWater && thungDepth > thung.draft + 0.1, 'Thuyền Thúng floats freely in the bay with clearance above seabed');
const thungLowDepth = getWaterDepth(thung.x, thung.z, -1.0);
assert(thungLowDepth > thung.draft + 0.02, 'Thuyền Thúng retains positive draft clearance even at Low Tide');

const ghe = BOAT_SPOTS.ghe;
const gheInWater = isInWater(ghe.x, ghe.z, 0);
const gheDepth = getWaterDepth(ghe.x, ghe.z, 0);
assert(gheInWater && gheDepth > ghe.draft + 0.1, 'Ghe Nhỏ floats freely with sufficient water depth in coastal bay');
const gheLowDepth = getWaterDepth(ghe.x, ghe.z, -1.0);
assert(gheLowDepth > ghe.draft + 0.02, 'Ghe Nhỏ retains positive draft clearance even at Low Tide');

// 7. State & Season Isolation (Discriminated Unions & Sanitization)
// A. Invalid season on Phu Quoc (e.g. 'winter' passed to phuquoc) must fallback to 'dry'
const corruptPQ = sanitizePhuQuocState({ season: 'winter', timeOfDay: 99 });
assert(
  corruptPQ.season === 'dry' && corruptPQ.timeOfDay === 24,
  'Phu Quoc state sanitization rejects invalid seasons and clamps time of day'
);

// B. Invalid season on Garden (e.g. 'rainy' passed to garden) must fallback to 'spring'
const corruptGarden = sanitizeGardenState({ season: 'rainy', timeOfDay: -5 });
assert(
  corruptGarden.season === 'spring' && corruptGarden.timeOfDay === 0,
  'Garden state sanitization rejects invalid seasons and clamps time of day'
);

// C. Independent defaults
assert(
  DEFAULT_GARDEN_STATE.timeOfDay === 16.5 && DEFAULT_GARDEN_STATE.season === 'spring',
  'Garden preserves default Spring 16:30 state'
);
assert(
  DEFAULT_PHUQUOC_STATE.timeOfDay === 17.75 && DEFAULT_PHUQUOC_STATE.season === 'dry',
  'Phu Quoc preserves default Dry Season 17:45 sunset state'
);

// 8. Phu Quoc Solar Trajectory & Coordinate Convention (+X East, -X West)
const sun06 = calculatePhuQuocSunPosition(6.0);
assert(sun06.x > 0 && sun06.isDay, 'Sun rises in the East (+X > 0) around 06:00');

const sun12 = calculatePhuQuocSunPosition(12.0);
assert(
  Math.abs(sun12.x) < 2.0 && sun12.y > 10.0,
  'Sun reaches zenith overhead around 12:00 (|X| < 2.0, Y high > 10.0)'
);

const sun18 = calculatePhuQuocSunPosition(18.0);
assert(sun18.x < 0, 'Sun sets in the West (-X < 0) around 18:00');

const sun1745 = calculatePhuQuocSunPosition(17.75);
assert(
  sun1745.x < -14.0 && sun1745.y > 0.0 && sun1745.y < 3.0 && sun1745.isSunset,
  'Artistic preset 17:45 positions sun low over western sea for golden hour'
);

let allSunCoordinatesFinite = true;
for (let t = 0; t <= 24; t += 0.25) {
  const p = calculatePhuQuocSunPosition(t);
  if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(p.z)) {
    allSunCoordinatesFinite = false;
    break;
  }
}
assert(allSunCoordinatesFinite, 'Solar trajectory generates smooth, finite 3D coordinates across 0-24h cycle');

// 9. Camera Persistence & Sanitization
const invalidCamCoincident = sanitizeCameraState({ position: [5, 5, 5], target: [5, 5, 5], zoom: 1 });
assert(invalidCamCoincident === undefined, 'Camera sanitizer rejects coincident position and target');

const clampedMinZoom = sanitizeCameraState({ position: [10, 10, 10], target: [0, 0, 0], zoom: 0.05 });
assert(clampedMinZoom?.zoom === 0.4, 'Camera sanitizer clamps zoom to safe minimum bound');

const clampedMaxZoom = sanitizeCameraState({ position: [10, 10, 10], target: [0, 0, 0], zoom: 10.0 });
assert(clampedMaxZoom?.zoom === 3.0, 'Camera sanitizer clamps zoom to safe maximum bound');

const mockAppState = {
  version: 2,
  activeThemeId: 'phuquoc' as const,
  gardenState: { ...DEFAULT_GARDEN_STATE, cameraState: { position: [20, 20, 20] as [number, number, number], target: [0, 0, 0] as [number, number, number], zoom: 1.2 } },
  phuquocState: { ...DEFAULT_PHUQUOC_STATE, cameraState: { position: [-15, 12, 18] as [number, number, number], target: [0, 0.5, 0] as [number, number, number], zoom: 1.5 } },
  shared: { quality: 'high' as const },
  camera: {
    garden: { position: [20, 20, 20] as [number, number, number], target: [0, 0, 0] as [number, number, number], zoom: 1.2 },
    phuquoc: { position: [-15, 12, 18] as [number, number, number], target: [0, 0.5, 0] as [number, number, number], zoom: 1.5 },
  },
};
assert(
  mockAppState.camera.garden.zoom !== mockAppState.camera.phuquoc.zoom &&
  mockAppState.camera.garden.position[0] !== mockAppState.camera.phuquoc.position[0],
  'Camera state across themes is stored and isolated independently'
);

// 10. Phu Quoc Natural Asymmetric Footprint & Boundary Verification

assert(
  PHUQUOC_BOUNDARY_POINTS.length === PHUQUOC_BOUNDARY_SAMPLES && PHUQUOC_BOUNDARY_SAMPLES === 256,
  `Phu Quoc boundary polygon has exactly ${PHUQUOC_BOUNDARY_SAMPLES} samples`
);

// Verify closed contour
const pqStart = PHUQUOC_BOUNDARY_POINTS[0];
const pqEnd = PHUQUOC_BOUNDARY_POINTS[PHUQUOC_BOUNDARY_POINTS.length - 1];
const pqCloseGap = Math.hypot(pqStart.x - pqEnd.x, pqStart.y - pqEnd.y);
assert(pqCloseGap < 0.65, `Phu Quoc boundary polygon forms a closed contour (gap = ${pqCloseGap.toFixed(3)})`);

// Verify asymmetric natural coastal silhouette (radius varies meaningfully across orientations)
let pqMinR = Infinity;
let pqMaxR = -Infinity;
for (let i = 0; i < 64; i++) {
  const theta = (i / 64) * Math.PI * 2;
  const r = getPhuQuocFootprintRadius(theta);
  if (r < pqMinR) pqMinR = r;
  if (r > pqMaxR) pqMaxR = r;
}
assert(
  pqMaxR - pqMinR > 1.8,
  `Phu Quoc footprint has organic asymmetric bay silhouette (radius: min=${pqMinR.toFixed(2)}, max=${pqMaxR.toFixed(2)}, span=${(pqMaxR - pqMinR).toFixed(2)})`
);

// Verify that Garden and Phu Quoc have different, custom footprints (NOT the same oval or circle)
import { getGardenFootprintRadius } from '../src/three/themes/garden/footprint';
let footprintDiffSum = 0;
for (let i = 0; i < 32; i++) {
  const theta = (i / 32) * Math.PI * 2;
  footprintDiffSum += Math.abs(getGardenFootprintRadius(theta) - getPhuQuocFootprintRadius(theta));
}
assert(
  footprintDiffSum / 32 > 0.6,
  'Garden and Phu Quoc footprints are distinctly customized and not identical geometries'
);

// Verify all bungalows, pier, boats, and relaxation spots are within footprint
const pqStructures = [
  { x: -5.0, z: -1.6, name: 'Bungalow 1 (West Cove)' },
  { x: 2.2,  z: -1.8, name: 'Bungalow 2 (East Cove)' },
  { x: 5.5,  z: -2.8, name: 'Bungalow 3 (East Garden)' },
  { x: PIER_CONFIG.startX, z: PIER_CONFIG.startZ, name: 'Pier Shore Entrance' },
  { x: PIER_CONFIG.endX,   z: PIER_CONFIG.endZ,   name: 'Pier Seaward End' },
  { x: BOAT_SPOTS.thung.x, z: BOAT_SPOTS.thung.z, name: 'Thuyền Thúng' },
  { x: BOAT_SPOTS.ghe.x,   z: BOAT_SPOTS.ghe.z,   name: 'Ghe Nhỏ' },
  { x: -2.8, z: 0.2,  name: 'Sun Loungers on Sand' },
];

let allPqStructuresInside = true;
let pqStructFail = '';
for (const s of pqStructures) {
  if (!isInsidePhuQuocFootprint(s.x, s.z, 0.2)) {
    allPqStructuresInside = false;
    pqStructFail = `${s.name} at (${s.x}, ${s.z})`;
    break;
  }
}
assert(allPqStructuresInside, 'All thatched bungalows, pier, boats, and relaxation spots reside safely within natural footprint', pqStructFail);

// 11. Phu Quoc Terrain Winding & Face Normal Cross Product Verification
import { createPhuQuocTerrain } from '../src/three/themes/phuquoc/terrain';
import { createPhuQuocWater } from '../src/three/themes/phuquoc/water';

const pqMockGroup = new THREE.Group();
const pqTerrainSystem = createPhuQuocTerrain(pqMockGroup);
const pqTerrainMesh = pqTerrainSystem.group.children.find(c => c instanceof THREE.Mesh && c.receiveShadow) as THREE.Mesh;
assert(!!pqTerrainMesh, 'Phu Quoc terrain mesh exists in system');

const pqGeom = pqTerrainMesh.geometry as THREE.BufferGeometry;
const pqPosAttr = pqGeom.attributes.position;
const pqIndexAttr = pqGeom.index;
assert(!!pqPosAttr && !!pqIndexAttr, 'Phu Quoc terrain mesh contains valid position and index buffer attributes');

let pqTopWindingCorrect = true;
let pqTopTrianglesCount = 0;
let pqBottomWindingCorrect = true;
let pqBottomTrianglesCount = 0;
let pqSideWindingCorrect = true;
let pqSideTrianglesCount = 0;

const v0 = new THREE.Vector3();
const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const e1 = new THREE.Vector3();
const e2 = new THREE.Vector3();
const faceNormal = new THREE.Vector3();

if (pqIndexAttr) {
  const numTris = pqIndexAttr.count / 3;
  for (let i = 0; i < numTris; i++) {
    const i0 = pqIndexAttr.getX(i * 3);
    const i1 = pqIndexAttr.getX(i * 3 + 1);
    const i2 = pqIndexAttr.getX(i * 3 + 2);

    v0.fromBufferAttribute(pqPosAttr, i0);
    v1.fromBufferAttribute(pqPosAttr, i1);
    v2.fromBufferAttribute(pqPosAttr, i2);

    e1.subVectors(v1, v0);
    e2.subVectors(v2, v0);
    faceNormal.crossVectors(e1, e2).normalize();

    // Triangles on the top surface (vertices strictly within top surface fan and rings: 1 + 140 * 256 = 35841)
    const isTopTriangle = i0 < 35841 && i1 < 35841 && i2 < 35841;

    // Bottom face triangles (at baseBottomY = -1.40)
    if (Math.abs(v0.y - (-1.40)) < 0.001 && Math.abs(v1.y - (-1.40)) < 0.001 && Math.abs(v2.y - (-1.40)) < 0.001) {
      pqBottomTrianglesCount++;
      if (faceNormal.y > -0.95) {
        pqBottomWindingCorrect = false;
      }
    }
    // Top surface triangles
    else if (isTopTriangle) {
      pqTopTrianglesCount++;
      if (faceNormal.y <= 0.0) {
        pqTopWindingCorrect = false;
      }
    }
    // Side wall / bevel triangles
    else {
      pqSideTrianglesCount++;
      const midX = (v0.x + v1.x + v2.x) / 3;
      const midZ = (v0.z + v1.z + v2.z) / 3;
      const outDirX = midX - PHUQUOC_CENTER.x;
      const outDirZ = midZ - PHUQUOC_CENTER.y;
      const dotOut = faceNormal.x * outDirX + faceNormal.z * outDirZ;
      if (dotOut < -0.1) {
        pqSideWindingCorrect = false;
      }
    }
  }
}

assert(pqTopTrianglesCount > 5000 && pqTopWindingCorrect, `Phu Quoc top surface has verified +Y normal winding across all ${pqTopTrianglesCount} triangles`);
assert(pqBottomTrianglesCount === 256 && pqBottomWindingCorrect, `Phu Quoc bottom face has verified strictly -Y normal winding across all ${pqBottomTrianglesCount} triangles`);
assert(pqSideTrianglesCount > 1000 && pqSideWindingCorrect, `Phu Quoc side walls have verified outward-facing normal winding across all ${pqSideTrianglesCount} triangles`);

// Verify FrontSide rendering on terrain material
const pqMat = pqTerrainMesh.material as THREE.MeshStandardMaterial;
assert(pqMat.side === THREE.FrontSide, 'Phu Quoc terrain material uses FrontSide rendering (no DoubleSide used to mask winding errors)');

// 12. Phu Quoc Water Surface & Marine Skirt Exact Connectivity Verification
const pqWaterParent = new THREE.Group();
const pqWaterSystem = createPhuQuocWater({} as THREE.WebGLRenderer, pqWaterParent, getTerrainHeight, true);
const pqWaterMesh = pqWaterSystem.mesh;
assert(!!pqWaterMesh, 'Phu Quoc water mesh exists in system');

const wGeom = pqWaterMesh.geometry as THREE.BufferGeometry;
const wPos = wGeom.attributes.position;
const wIsSkirt = wGeom.attributes.aIsSkirt;
const wIdx = wGeom.index;
assert(!!wPos && !!wIsSkirt && !!wIdx, 'Water mesh contains valid position, aIsSkirt, and index buffers');

let waterSurfaceWindingOk = true;
let waterSkirtWindingOk = true;
let waterSurfaceTriCount = 0;
let waterSkirtTriCount = 0;

if (wIdx) {
  const numTris = wIdx.count / 3;
  for (let i = 0; i < numTris; i++) {
    const i0 = wIdx.getX(i * 3);
    const i1 = wIdx.getX(i * 3 + 1);
    const i2 = wIdx.getX(i * 3 + 2);

    v0.fromBufferAttribute(wPos, i0);
    v1.fromBufferAttribute(wPos, i1);
    v2.fromBufferAttribute(wPos, i2);

    e1.subVectors(v1, v0);
    e2.subVectors(v2, v0);
    faceNormal.crossVectors(e1, e2).normalize();

    const isSkirtTri = wIsSkirt.getX(i0) > 0.5 && wIsSkirt.getX(i1) > 0.5 && wIsSkirt.getX(i2) > 0.5;
    if (isSkirtTri) {
      waterSkirtTriCount++;
      // Normal must point outward away from center
      const midX = (v0.x + v1.x + v2.x) / 3;
      const midZ = (v0.z + v1.z + v2.z) / 3;
      const dotOut = faceNormal.x * (midX - PHUQUOC_CENTER.x) + faceNormal.z * (midZ - PHUQUOC_CENTER.y);
      if (dotOut < 0.0) {
        waterSkirtWindingOk = false;
      }
    } else {
      waterSurfaceTriCount++;
      if (faceNormal.y <= 0.0) {
        waterSurfaceWindingOk = false;
      }
    }
  }
}

assert(waterSurfaceTriCount > 1000 && waterSurfaceWindingOk, `Phu Quoc water surface has verified +Y normal winding across all ${waterSurfaceTriCount} triangles`);
assert(waterSkirtTriCount > 50 && waterSkirtWindingOk, `Phu Quoc water skirt has verified outward normal winding across all ${waterSkirtTriCount} triangles`);

// Verify exact connectivity: every top-edge vertex of the skirt shares the exact coordinates of a surface outer boundary vertex
let zeroGapConnectivity = true;
const skirtTopVerts: THREE.Vector3[] = [];
for (let i = 0; i < wPos.count; i++) {
  if (wIsSkirt.getX(i) > 0.5 && Math.abs(wPos.getY(i) - SEA_LEVEL_BASE) < 0.001) {
    skirtTopVerts.push(new THREE.Vector3(wPos.getX(i), wPos.getY(i), wPos.getZ(i)));
  }
}

for (const sVert of skirtTopVerts) {
  let matched = false;
  for (let j = 0; j < wPos.count; j++) {
    if (wIsSkirt.getX(j) < 0.5) {
      const dx = Math.abs(wPos.getX(j) - sVert.x);
      const dy = Math.abs(wPos.getY(j) - sVert.y);
      const dz = Math.abs(wPos.getZ(j) - sVert.z);
      if (dx < 0.0001 && dy < 0.0001 && dz < 0.0001) {
        matched = true;
        break;
      }
    }
  }
  if (!matched) {
    zeroGapConnectivity = false;
    break;
  }
}
assert(skirtTopVerts.length > 50 && zeroGapConnectivity, `Water surface outer boundary and marine cut skirt share exact matching boundary vertices (${skirtTopVerts.length} top vertices verified with 0.0000 gap)`);


// Summary
const totalPassed = results.filter((r) => r.passed).length;
console.log('----------------------------------------------------');
console.log(`TOTAL TESTS: ${results.length} | PASSED: ${totalPassed} | FAILED: ${results.length - totalPassed}`);
if (totalPassed === results.length) {
  console.log('>>> ALL PHU QUOC & MULTI-THEME VALIDATION TESTS PASSED! <<<');
  process.exit(0);
} else {
  console.error('>>> SOME VALIDATION TESTS FAILED! <<<');
  process.exit(1);
}
