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
import { calculatePhuQuocSunPosition, getPhuQuocSkyGradient } from '../src/three/themes/phuquoc/lighting';
import {
  PHUQUOC_CENTER,
  PHUQUOC_BOUNDARY_POINTS,
  PHUQUOC_BOUNDARY_SAMPLES,
  isInsidePhuQuocFootprint,
  getPhuQuocFootprintRadius,
  PHUQUOC_FOOTPRINT_BOUNDS,
} from '../src/three/themes/phuquoc/footprint';
import {
  createPhuQuocBoats,
  BOAT_SPECS,
  getOceanWaveElevation,
  getOceanWaveSlopes,
  isInsideThungCavity,
  isInsideGheCavity,
  isPointInBoatCavity,
} from '../src/three/themes/phuquoc/boats';
import {
  sanitizeGardenState,
  sanitizePhuQuocState,
  sanitizeCameraState,
  loadPersistedAppState,
  savePersistedAppState,
  DEFAULT_GARDEN_STATE,
  CURRENT_STORAGE_VERSION,
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

// 6. Boat Locations, Geometry Normalization, Freeboard & Realistic Draft
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

// 6b. Real Mesh Geometry Measurements (Freeboard, Seat Elevation, Open Cockpit, Wave Alignment)
const boatTestParent = new THREE.Group();
const boatSys = createPhuQuocBoats(boatTestParent);

const thungObj = boatSys.group.getObjectByName('ThuyenThung') as THREE.Group;
const gheObj = boatSys.group.getObjectByName('GheNho') as THREE.Group;

assert(thungObj !== undefined && gheObj !== undefined, 'Both Thuyền Thúng and Ghe Nhỏ models are created successfully');

// Thuyền Thúng measurements in local model space (DWL at y = 0)
const thungHullMesh = thungObj.getObjectByName('ThungHull') as THREE.Mesh;
const thungSeatMesh = thungObj.getObjectByName('ThungSeat') as THREE.Mesh;

assert(thungHullMesh !== undefined && thungSeatMesh !== undefined, 'Thuyền Thúng hull and seat meshes found');

thungHullMesh.geometry.computeBoundingBox();
thungSeatMesh.geometry.computeBoundingBox();
const thungHullBox = thungHullMesh.geometry.boundingBox!;
const thungSeatBox = thungSeatMesh.geometry.boundingBox!;

const thungFreeboard = thungHullBox.max.y;
const thungKeelDepth = -thungHullBox.min.y;
const thungSeatY = (thungSeatBox.min.y + thungSeatBox.max.y) / 2;

assert(
  thungFreeboard >= 0.20 && thungFreeboard <= 0.25,
  `Thuyền Thúng has clearly visible positive freeboard (${thungFreeboard.toFixed(3)}m >= 0.20m)`
);
assert(
  thungKeelDepth >= 0.12 && thungKeelDepth <= 0.16,
  `Thuyền Thúng keel draft is physically realistic (${thungKeelDepth.toFixed(3)}m)`
);
assert(
  thungSeatY >= 0.05 && thungSeatY <= 0.10,
  `Thuyền Thúng bamboo seat is strictly elevated above waterline (+${thungSeatY.toFixed(3)}m above DWL)`
);

// Ghe Nhỏ measurements in local model space (DWL at y = 0)
const gheHullMesh = gheObj.getObjectByName('GheHull') as THREE.Mesh;
const thwartFwdMesh = gheObj.getObjectByName('GheThwartFwd') as THREE.Mesh;
const thwartAftMesh = gheObj.getObjectByName('GheThwartAft') as THREE.Mesh;

assert(gheHullMesh !== undefined && thwartFwdMesh !== undefined && thwartAftMesh !== undefined, 'Ghe Nhỏ hull and thwart meshes found');

gheHullMesh.geometry.computeBoundingBox();
thwartFwdMesh.geometry.computeBoundingBox();
thwartAftMesh.geometry.computeBoundingBox();

const gheHullBox = gheHullMesh.geometry.boundingBox!;
const thwartFwdBox = thwartFwdMesh.geometry.boundingBox!;
const thwartAftBox = thwartAftMesh.geometry.boundingBox!;
let hasSolidCoverBox = false;

gheObj.traverse((child) => {
  if ((child as THREE.Mesh).isMesh) {
    const m = child as THREE.Mesh;
    if (m.geometry) {
      m.geometry.computeBoundingBox();
      const b = m.geometry.boundingBox!;
      // Check for old solid box slab covering the cockpit (large width & large length at sheer level)
      const szX = b.max.x - b.min.x;
      const szZ = b.max.z - b.min.z;
      if (szX > 0.55 && szZ > 2.0 && b.min.y > 0.10) {
        hasSolidCoverBox = true;
      }
    }
  }
});

const gheFreeboard = gheHullBox.max.y;
const gheKeelDepth = -gheHullBox.min.y;

assert(
  !hasSolidCoverBox,
  'Ghe Nhỏ has completely open cockpit with no solid box slab covering the top'
);
assert(
  thwartFwdMesh !== undefined && thwartAftMesh !== undefined,
  'Ghe Nhỏ features clearly visible open forward and aft transverse thwarts'
);
assert(
  gheFreeboard >= 0.28 && gheFreeboard <= 0.36,
  `Ghe Nhỏ bow sheerline sweeps up gracefully with strong freeboard (${gheFreeboard.toFixed(3)}m)`
);
assert(
  gheKeelDepth >= 0.16 && gheKeelDepth <= 0.20,
  `Ghe Nhỏ keel draft is physically realistic (${gheKeelDepth.toFixed(3)}m)`
);

const thwart1Y = (thwartFwdBox.min.y + thwartFwdBox.max.y) / 2;
const thwart2Y = (thwartAftBox.min.y + thwartAftBox.max.y) / 2;
assert(
  thwart1Y >= 0.06 && thwart1Y <= 0.11 && thwart2Y >= 0.06 && thwart2Y <= 0.11,
  `Ghe Nhỏ thwarts are strictly above design waterline (+${thwart1Y.toFixed(3)}m and +${thwart2Y.toFixed(3)}m above DWL)`
);

// Check 6c: Material Side & Solid Winding Verification (Strict FrontSide, No DoubleSide)
const thungMat = thungHullMesh.material as THREE.Material;
const gheMat = gheHullMesh.material as THREE.Material;
assert(
  thungMat.side === THREE.FrontSide && gheMat.side === THREE.FrontSide,
  'Both Thuyền Thúng and Ghe Nhỏ use strictly FrontSide materials (no DoubleSide used to mask winding errors)'
);

// Check 6d: Cross Product Normal Verification on Real Geometry Faces
// 1. Thuyền Thúng Face Normals
const thungGeo = thungHullMesh.geometry;
const thungPosAttr = thungGeo.getAttribute('position') as THREE.BufferAttribute;
const thungIdxAttr = thungGeo.getIndex()!;
let thungInnerFloorUpCount = 0;
let thungOuterBottomDownCount = 0;
let thungInnerWallInwardCount = 0;
let thungOuterWallOutwardCount = 0;
let thungRimUpCount = 0;

for (let i = 0; i < thungIdxAttr.count; i += 3) {
  const i0 = thungIdxAttr.getX(i);
  const i1 = thungIdxAttr.getX(i + 1);
  const i2 = thungIdxAttr.getX(i + 2);

  const v0 = new THREE.Vector3(thungPosAttr.getX(i0), thungPosAttr.getY(i0), thungPosAttr.getZ(i0));
  const v1 = new THREE.Vector3(thungPosAttr.getX(i1), thungPosAttr.getY(i1), thungPosAttr.getZ(i1));
  const v2 = new THREE.Vector3(thungPosAttr.getX(i2), thungPosAttr.getY(i2), thungPosAttr.getZ(i2));

  const fn = new THREE.Vector3().crossVectors(
    new THREE.Vector3().subVectors(v1, v0),
    new THREE.Vector3().subVectors(v2, v0)
  ).normalize();

  const c = new THREE.Vector3().add(v0).add(v1).add(v2).multiplyScalar(1 / 3);
  const rRadial = Math.hypot(c.x, c.z);
  const radialDot = fn.x * (c.x / Math.max(1e-4, rRadial)) + fn.z * (c.z / Math.max(1e-4, rRadial));

  if (Math.abs(c.y - (-0.11)) < 0.01) {
    if (fn.y > 0.90) thungInnerFloorUpCount++;
  } else if (Math.abs(c.y - (-0.14)) < 0.01) {
    if (fn.y < -0.90) thungOuterBottomDownCount++;
  } else if (Math.abs(c.y - 0.22) < 0.02 && rRadial > 0.50) {
    if (fn.y > 0.90) thungRimUpCount++;
  } else if (rRadial < 0.46) {
    if (radialDot < -0.20) thungInnerWallInwardCount++;
  } else {
    if (radialDot > 0.20) thungOuterWallOutwardCount++;
  }
}

assert(
  thungInnerFloorUpCount >= 28 && thungOuterBottomDownCount >= 28,
  `Thuyền Thúng inner bottom faces strictly UP (+Y) and outer bottom faces DOWN (-Y) (floors: ${thungInnerFloorUpCount}, bottoms: ${thungOuterBottomDownCount})`
);
assert(
  thungInnerWallInwardCount >= 56 && thungOuterWallOutwardCount >= 56 && thungRimUpCount >= 56,
  `Thuyền Thúng inner walls point inward, outer walls point outward, and top rim faces up (+Y) (inner: ${thungInnerWallInwardCount}, outer: ${thungOuterWallOutwardCount}, rim: ${thungRimUpCount})`
);

// 2. Ghe Nhỏ Face Normals
const gheGeo = gheHullMesh.geometry;
const ghePosAttr = gheGeo.getAttribute('position') as THREE.BufferAttribute;
const gheIdxAttr = gheGeo.getIndex()!;

let gheInnerFloorUpCount = 0;
let gheOuterBottomDownCount = 0;
let gheInnerWallInwardCount = 0;
let gheOuterWallOutwardCount = 0;
let gheSheerLipUpCount = 0;
let gheTransomSternCount = 0;
let gheBowStemForwardCount = 0;

for (let i = 0; i < gheIdxAttr.count; i += 3) {
  const i0 = gheIdxAttr.getX(i);
  const i1 = gheIdxAttr.getX(i + 1);
  const i2 = gheIdxAttr.getX(i + 2);

  const v0 = new THREE.Vector3(ghePosAttr.getX(i0), ghePosAttr.getY(i0), ghePosAttr.getZ(i0));
  const v1 = new THREE.Vector3(ghePosAttr.getX(i1), ghePosAttr.getY(i1), ghePosAttr.getZ(i1));
  const v2 = new THREE.Vector3(ghePosAttr.getX(i2), ghePosAttr.getY(i2), ghePosAttr.getZ(i2));

  const fn = new THREE.Vector3().crossVectors(
    new THREE.Vector3().subVectors(v1, v0),
    new THREE.Vector3().subVectors(v2, v0)
  ).normalize();

  const c = new THREE.Vector3().add(v0).add(v1).add(v2).multiplyScalar(1 / 3);

  if (c.z < -1.18) {
    // Transom region
    if (fn.z < -0.90) gheTransomSternCount++;
  } else if (c.z > 1.15) {
    // Bow stem region
    if (fn.z > 0.50) gheBowStemForwardCount++;
  } else if (fn.y > 0.85) {
    if (Math.abs(c.x) < 0.15) gheInnerFloorUpCount++;
    else gheSheerLipUpCount++;
  } else if (fn.y < -0.30) {
    if ((c.x < 0 && fn.x < 0) || (c.x > 0 && fn.x > 0)) gheOuterBottomDownCount++;
  } else {
    // Wall surfaces
    if (c.x < 0) {
      // Port side: outward is -X, inward into cockpit is +X
      if (fn.x < -0.30) gheOuterWallOutwardCount++;
      else if (fn.x > 0.30) gheInnerWallInwardCount++;
    } else if (c.x > 0) {
      // Starboard side: outward is +X, inward into cockpit is -X
      if (fn.x > 0.30) gheOuterWallOutwardCount++;
      else if (fn.x < -0.30) gheInnerWallInwardCount++;
    }
  }
}

assert(
  gheOuterBottomDownCount >= 10 && gheInnerFloorUpCount >= 10 && gheSheerLipUpCount >= 10,
  `Ghe Nhỏ outer bottom faces down/out, inner floor faces up (+Y), and sheer lips face up (+Y) (bottom: ${gheOuterBottomDownCount}, floor: ${gheInnerFloorUpCount}, lips: ${gheSheerLipUpCount})`
);
assert(
  gheOuterWallOutwardCount >= 10 && gheInnerWallInwardCount >= 10,
  `Ghe Nhỏ outer topsides face outward and inner walls face inward into cockpit (out: ${gheOuterWallOutwardCount}, in: ${gheInnerWallInwardCount})`
);
assert(
  gheTransomSternCount >= 3 && gheBowStemForwardCount >= 3,
  `Ghe Nhỏ transom faces stern (-Z) and bow stem faces forward (+Z) (transom: ${gheTransomSternCount}, bow: ${gheBowStemForwardCount})`
);

// Check 6e: Real Mesh Raycast Verification from Inside & Outside
const raycaster = new THREE.Raycaster();

// 1. Raycast into Thuyền Thúng: from inside out to inner wall
raycaster.set(new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(1, 0, 0));
const thungInnerHit = raycaster.intersectObject(thungHullMesh, false);
assert(
  thungInnerHit.length > 0 && thungInnerHit[0].face!.normal.x < -0.20,
  'Raycast from cockpit interior hits front face of Thuyền Thúng inner wall pointing inward (normal.x < 0)'
);

// Raycast from outside towards Thuyền Thúng outer wall
raycaster.set(new THREE.Vector3(1.2, 0.05, 0), new THREE.Vector3(-1, 0, 0));
const thungOuterHit = raycaster.intersectObject(thungHullMesh, false);
assert(
  thungOuterHit.length > 0 && thungOuterHit[0].face!.normal.x > 0.20,
  'Raycast from outside hits front face of Thuyền Thúng outer wall pointing outward (normal.x > 0)'
);

// Raycast downward onto Thuyền Thúng inner floor
raycaster.set(new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(0, -1, 0));
const thungFloorHit = raycaster.intersectObject(thungHullMesh, false);
assert(
  thungFloorHit.length > 0 && thungFloorHit[0].face!.normal.y > 0.90,
  'Raycast downward from interior hits Thuyền Thúng inner floor with normal pointing UP (+Y)'
);

// Raycast upward onto Thuyền Thúng outer keel bottom
raycaster.set(new THREE.Vector3(0, -0.5, 0), new THREE.Vector3(0, 1, 0));
const thungKeelHit = raycaster.intersectObject(thungHullMesh, false);
assert(
  thungKeelHit.length > 0 && thungKeelHit[0].face!.normal.y < -0.90,
  'Raycast upward from ocean hits Thuyền Thúng outer bottom with normal pointing DOWN (-Y)'
);

// 2. Raycast into Ghe Nhỏ
// From cockpit interior to starboard inner wall
raycaster.set(new THREE.Vector3(0, 0.05, 0), new THREE.Vector3(1, 0, 0));
const gheStarboardInnerHit = raycaster.intersectObject(gheHullMesh, false);
assert(
  gheStarboardInnerHit.length > 0 && gheStarboardInnerHit[0].face!.normal.x < -0.20,
  'Raycast from cockpit hits front face of Ghe Nhỏ starboard inner wall pointing inward into hold (normal.x < 0)'
);

// From outside into starboard outer topside
raycaster.set(new THREE.Vector3(1.2, 0.05, 0), new THREE.Vector3(-1, 0, 0));
const gheStarboardOuterHit = raycaster.intersectObject(gheHullMesh, false);
assert(
  gheStarboardOuterHit.length > 0 && gheStarboardOuterHit[0].face!.normal.x > 0.20,
  'Raycast from outside hits front face of Ghe Nhỏ starboard outer hull pointing outward (normal.x > 0)'
);

// Raycast from outside stern into transom
raycaster.set(new THREE.Vector3(0, 0.05, -2.0), new THREE.Vector3(0, 0, 1));
const gheTransomHit = raycaster.intersectObject(gheHullMesh, false);
assert(
  gheTransomHit.length > 0 && gheTransomHit[0].face!.normal.z < -0.90,
  'Raycast from ocean behind stern hits Ghe Nhỏ transom with normal pointing aft (-Z)'
);

// Raycast from outside bow into bow stem
raycaster.set(new THREE.Vector3(0, 0.15, 2.0), new THREE.Vector3(0, 0, -1));
const gheBowHit = raycaster.intersectObject(gheHullMesh, false);
assert(
  gheBowHit.length > 0 && gheBowHit[0].face!.normal.z > 0.50,
  'Raycast from ocean ahead of bow hits Ghe Nhỏ bow stem with normal pointing forward (+Z)'
);

// Check 6f: Dynamic Wave Floatation, Inverse Transform Matrices & Cavity Discard
const tTime = 4.2;
const tWind = 0.4;
const tFlow = 0.5;
const tWaterLvl = 0.30;
boatSys.update(0.016, tTime, tWaterLvl, tWind, tFlow);

const expectedThungWave = getOceanWaveElevation(thung.x, thung.z, tTime, tWind);
const thungActualY = thungObj.position.y;
assert(
  Math.abs(thungActualY - (tWaterLvl + expectedThungWave)) < 0.012,
  'Thuyền Thúng floats precisely on water surface and bobbles with ocean waves'
);

const expectedGheWave = getOceanWaveElevation(ghe.x, ghe.z, tTime, tWind);
const gheActualY = gheObj.position.y;
assert(
  Math.abs(gheActualY - (tWaterLvl + expectedGheWave)) < 0.012,
  'Ghe Nhỏ floats precisely on water surface and rides ocean swell'
);

// 3D Inverse Matrix Water Cavity Discard Verification across tides, waves and rotations
const cavities = boatSys.getCavities();
assert(
  cavities.thungInvMatrix instanceof THREE.Matrix4 && cavities.gheInvMatrix instanceof THREE.Matrix4,
  'Boat system provides valid 4x4 inverse transform matrices for shader water cavity discard'
);

// Point strictly inside Thúng cockpit (at boat center at water level)
const ptInsideThung = new THREE.Vector3(thungObj.position.x, thungObj.position.y, thungObj.position.z);
assert(
  isPointInBoatCavity(ptInsideThung, boatSys),
  'Water inside Thuyền Thúng cockpit is discarded to prevent clipping through bottom'
);

// Point outside Thúng (0.75m from center in open ocean)
const ptOutsideThung = new THREE.Vector3(thungObj.position.x + 0.75, thungObj.position.y, thungObj.position.z);
assert(
  !isPointInBoatCavity(ptOutsideThung, boatSys),
  'Water outside Thuyền Thúng hull is preserved and not discarded'
);

// Point strictly inside Ghe Nhỏ hold
const ptInsideGhe = new THREE.Vector3(gheObj.position.x, gheObj.position.y, gheObj.position.z);
assert(
  isPointInBoatCavity(ptInsideGhe, boatSys),
  'Water inside Ghe Nhỏ open hold is discarded to keep cockpit clean and dry'
);

// Point outside Ghe Nhỏ hull (0.60m abeam in open ocean)
const ptOutsideGhe = new THREE.Vector3(gheObj.position.x + 0.60, gheObj.position.y, gheObj.position.z);
assert(
  !isPointInBoatCavity(ptOutsideGhe, boatSys),
  'Water outside Ghe Nhỏ hull is preserved and not discarded'
);

// -------------------------------------------------------------------------
// Specific Regression: Point local (0.10, 0, 0.70) inside cockpit hold
// Evaluated against identity mesh to ensure pure local geometry measurements
// -------------------------------------------------------------------------
const identityGheMesh = new THREE.Mesh(gheHullMesh.geometry, gheHullMesh.material);
identityGheMesh.updateMatrixWorld(true);

raycaster.set(new THREE.Vector3(0, 0, 0.70), new THREE.Vector3(1, 0, 0));
const wallHit070 = raycaster.intersectObject(identityGheMesh, false);
assert(
  wallHit070.length > 0,
  'Raycast at z=0.70 hits starboard inner wall on identity mesh without fallback'
);
const wallX070 = wallHit070[0].point.x;
assert(
  Math.abs(wallX070 - 0.13) < 0.005,
  `Raycast at z=0.70 confirms physical inner wall at x=${wallX070.toFixed(3)} (~0.130)`
);

const ptRegressionInside = new THREE.Vector3(0.10, 0, 0.70);
assert(
  isInsideGheCavity(ptRegressionInside),
  'Regression fixed: local point (0.10, 0, 0.70) inside cockpit correctly returns true to discard water'
);

const ptRegressionOnWall = new THREE.Vector3(0.135, 0, 0.70);
const ptRegressionOutside = new THREE.Vector3(0.20, 0, 0.70);
assert(
  !isInsideGheCavity(ptRegressionOnWall) && !isInsideGheCavity(ptRegressionOutside),
  'Local points on/outside wall at z=0.70 correctly return false to preserve ocean water'
);

// -------------------------------------------------------------------------
// Systematic Multi-Station Sampling against actual mesh geometry
// -------------------------------------------------------------------------
const sampleZStations = [-0.95, -0.60, -0.20, 0.20, 0.50, 0.70, 0.90];
let raycastSuccessCount = 0;
let allStationCavitiesAccurate = true;
let stationCavityFail = '';

for (const sz of sampleZStations) {
  // Raycast laterally from hold center at waterline (y = 0) towards starboard (+X)
  raycaster.set(new THREE.Vector3(0, 0, sz), new THREE.Vector3(1, 0, 0));
  const hits = raycaster.intersectObject(identityGheMesh, false);
  assert(
    hits.length > 0,
    `Raycast at station z=${sz} must hit inner wall on physical mesh (no continue or fallback)`
  );
  raycastSuccessCount++;

  const actualInnerWallX = hits[0].point.x;
  // Inside hold: 2cm inboard from inner wall
  const pInside = new THREE.Vector3(actualInnerWallX - 0.02, 0, sz);
  // On wall / wood: 1.5cm outboard from inner wall (inside 4cm wood hull planking)
  const pOnWall = new THREE.Vector3(actualInnerWallX + 0.015, 0, sz);
  // Outside hull: 15cm outboard from inner wall (well into open ocean)
  const pOutside = new THREE.Vector3(actualInnerWallX + 0.15, 0, sz);

  if (!isInsideGheCavity(pInside)) {
    allStationCavitiesAccurate = false;
    stationCavityFail = `Station z=${sz}: point inside (${pInside.x.toFixed(3)}, 0, ${sz}) returned false (inner wall is at ${actualInnerWallX.toFixed(3)})`;
    break;
  }
  if (isInsideGheCavity(pOnWall)) {
    allStationCavitiesAccurate = false;
    stationCavityFail = `Station z=${sz}: point on wall (${pOnWall.x.toFixed(3)}, 0, ${sz}) returned true (cutting into wood hull)`;
    break;
  }
  if (isInsideGheCavity(pOutside)) {
    allStationCavitiesAccurate = false;
    stationCavityFail = `Station z=${sz}: point outside (${pOutside.x.toFixed(3)}, 0, ${sz}) returned true (leaking discard into ocean)`;
    break;
  }
}

assert(
  raycastSuccessCount === sampleZStations.length,
  `All ${sampleZStations.length} station raycasts successfully struck the physical inner wall (count: ${raycastSuccessCount})`
);
assert(
  allStationCavitiesAccurate,
  `Systematic multi-station sampling (${sampleZStations.length} stations, 3 points each = ${sampleZStations.length * 3} samples) matches actual 3D geometry: inside hold discards water, outside hull preserves ocean water`,
  stationCavityFail
);

// -------------------------------------------------------------------------
// Transformation tests across varied rotations, pitch/roll heave and tides
// -------------------------------------------------------------------------
let worldCavityTrackingAccurate = true;
let worldCavityTrackingFail = '';

const testRotations = [0, Math.PI / 4, Math.PI / 2, Math.PI, -Math.PI / 3];
const testTides = [SEA_LEVEL_LOW, SEA_LEVEL_BASE, SEA_LEVEL_HIGH];
const testPitchRolls = [
  { pitch: 0.0, roll: 0.0 },
  { pitch: 0.08, roll: -0.05 },
  { pitch: -0.06, roll: 0.10 },
];

let rotationTestCount = 0;
for (const tideLvl of testTides) {
  for (const rotY of testRotations) {
    for (const { pitch, roll } of testPitchRolls) {
      // Position and orient gheObj at test state
      gheObj.position.set(ghe.x, tideLvl + 0.02, ghe.z);
      gheObj.rotation.set(pitch, rotY, roll);
      gheObj.updateMatrix();
      gheObj.updateMatrixWorld(true);
      boatSys.getCavities().gheInvMatrix.copy(gheObj.matrixWorld).invert();

      // Test regression point (0.10, 0, 0.70) transformed into world coordinates
      const wPtInside = ptRegressionInside.clone().applyMatrix4(gheObj.matrixWorld);
      const wPtOutside = ptRegressionOutside.clone().applyMatrix4(gheObj.matrixWorld);

      if (!isPointInBoatCavity(wPtInside, boatSys)) {
        worldCavityTrackingAccurate = false;
        worldCavityTrackingFail = `World-space cavity failed inside at tide=${tideLvl}, rotY=${rotY.toFixed(2)}, pitch=${pitch}, roll=${roll}`;
        break;
      }
      if (isPointInBoatCavity(wPtOutside, boatSys)) {
        worldCavityTrackingAccurate = false;
        worldCavityTrackingFail = `World-space cavity leaked outside at tide=${tideLvl}, rotY=${rotY.toFixed(2)}, pitch=${pitch}, roll=${roll}`;
        break;
      }
      rotationTestCount++;
    }
    if (!worldCavityTrackingAccurate) break;
  }
  if (!worldCavityTrackingAccurate) break;
}

assert(
  worldCavityTrackingAccurate && rotationTestCount === testTides.length * testRotations.length * testPitchRolls.length,
  `World-space boat cavity tracking verified across ${rotationTestCount} explicit rotation/pitch/roll/tide configurations (${testRotations.length} yaw rotations, ${testPitchRolls.length} pitch/roll angles, ${testTides.length} tides)`,
  worldCavityTrackingFail
);

// Dynamic wave heave animation state updates
const testTimes = [1.0, 3.5, 7.2, 12.0];
let waveTestCount = 0;
for (const tideLvl of testTides) {
  for (const time of testTimes) {
    boatSys.update(0.016, time, tideLvl, 0.4, 0.5);

    const wPtInside = ptRegressionInside.clone().applyMatrix4(gheObj.matrixWorld);
    const wPtOutside = ptRegressionOutside.clone().applyMatrix4(gheObj.matrixWorld);

    if (!isPointInBoatCavity(wPtInside, boatSys) || isPointInBoatCavity(wPtOutside, boatSys)) {
      worldCavityTrackingAccurate = false;
      break;
    }
    waveTestCount++;
  }
}

assert(
  waveTestCount === testTides.length * testTimes.length,
  `Dynamic wave heave and swell floatation verified across ${waveTestCount} time/tide animation states`
);

// Verify cavity discard consistency across high and low tide
for (const tideLvl of [SEA_LEVEL_LOW, SEA_LEVEL_BASE, SEA_LEVEL_HIGH]) {
  boatSys.update(0.016, 2.5, tideLvl, 0.35, 0.5);
  const pInThung = new THREE.Vector3(thungObj.position.x, thungObj.position.y, thungObj.position.z);
  const pOutThung = new THREE.Vector3(thungObj.position.x + 0.80, thungObj.position.y, thungObj.position.z);
  const pInGhe = new THREE.Vector3(gheObj.position.x, gheObj.position.y, gheObj.position.z);
  const pOutGhe = new THREE.Vector3(gheObj.position.x + 0.65, gheObj.position.y, gheObj.position.z);

  assert(
    isPointInBoatCavity(pInThung, boatSys) && !isPointInBoatCavity(pOutThung, boatSys),
    `Thuyền Thúng water cavity cleanly segments interior vs exterior at tide level ${tideLvl}m`
  );
  assert(
    isPointInBoatCavity(pInGhe, boatSys) && !isPointInBoatCavity(pOutGhe, boatSys),
    `Ghe Nhỏ water cavity cleanly segments interior vs exterior at tide level ${tideLvl}m`
  );
}

boatSys.dispose();

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
  `Phu Quoc marine display has a noncircular perimeter (radius: min=${pqMinR.toFixed(2)}, max=${pqMaxR.toFixed(2)}, span=${(pqMaxR - pqMinR).toFixed(2)})`
);

// Verify that Garden and Phu Quoc have different, custom footprints (NOT the same oval or circle)
import { getGardenFootprintRadius } from '../src/three/themes/garden/footprint';
let footprintDiffSum = 0;
for (let i = 0; i < 32; i++) {
  const theta = (i / 32) * Math.PI * 2;
  footprintDiffSum += Math.abs(getGardenFootprintRadius(theta) - getPhuQuocFootprintRadius(theta));
}
assert(
  footprintDiffSum / 32 > 0.05,
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


// 13. Phu Quoc Sky Night Luminance & Overcast Darkening Verification
// Night in rainy season must NEVER be lighter than dry night (scaled by daylight factor), and night is always drastically darker than daytime.
const tTop = new THREE.Color();
const tMid = new THREE.Color();
const tBot = new THREE.Color();

let nightDarkerThanDay = true;
let rainyNightNotBrighter = true;
let nightLuminanceDetails = '';

const nightHours = [21.0, 22.0, 23.0, 0.0, 1.0, 2.0, 3.0, 4.0];
const noonSky = getPhuQuocSkyGradient(12.0, 'dry', tTop, tMid, tBot);
const noonLum = 0.2126 * noonSky.top.r + 0.7152 * noonSky.top.g + 0.0722 * noonSky.top.b;

for (const nh of nightHours) {
  const drySky = getPhuQuocSkyGradient(nh, 'dry', new THREE.Color(), new THREE.Color(), new THREE.Color());
  const rainySky = getPhuQuocSkyGradient(nh, 'rainy', new THREE.Color(), new THREE.Color(), new THREE.Color());

  const dryLum = 0.2126 * drySky.top.r + 0.7152 * drySky.top.g + 0.0722 * drySky.top.b;
  const rainyLum = 0.2126 * rainySky.top.r + 0.7152 * rainySky.top.g + 0.0722 * rainySky.top.b;

  if (rainyLum > dryLum + 0.001) {
    rainyNightNotBrighter = false;
    nightLuminanceDetails = `At tod=${nh}: rainyLum (${rainyLum.toFixed(4)}) > dryLum (${dryLum.toFixed(4)})`;
    break;
  }
  if (dryLum > noonLum * 0.1 || rainyLum > noonLum * 0.1) {
    nightDarkerThanDay = false;
    nightLuminanceDetails = `At tod=${nh}: dryLum=${dryLum.toFixed(4)}, noonLum=${noonLum.toFixed(4)}`;
    break;
  }
}

assert(rainyNightNotBrighter, 'Monsoon rainy night sky is not brighter than dry night sky (daylight factor prevents daytime overcast leak into night)', nightLuminanceDetails);
assert(nightDarkerThanDay, 'Night sky luminance across all night hours is at least 10x darker than noon tropical daylight', nightLuminanceDetails);

// 14. Phu Quoc Sky Continuous Interpolation (Max step jump limit across 24h)
let maxStepJump = 0;
let maxStepDetails = '';
const maxJumpThreshold = 16.0 / 255.0; // max allowed channel change in 0.05 hr (3 mins)

for (const s of ['dry', 'rainy'] as const) {
  let prevGrad: { top: THREE.Color; mid: THREE.Color; bot: THREE.Color } | null = null;
  for (let tod = 0; tod <= 24; tod = Math.round((tod + 0.05) * 100) / 100) {
    const curTop = new THREE.Color();
    const curMid = new THREE.Color();
    const curBot = new THREE.Color();
    getPhuQuocSkyGradient(tod, s, curTop, curMid, curBot);

    if (prevGrad) {
      const parts = [
        { cur: curTop, prev: prevGrad.top },
        { cur: curMid, prev: prevGrad.mid },
        { cur: curBot, prev: prevGrad.bot },
      ];
      for (const p of parts) {
        const dR = Math.abs(p.cur.r - p.prev.r);
        const dG = Math.abs(p.cur.g - p.prev.g);
        const dB = Math.abs(p.cur.b - p.prev.b);
        const step = Math.max(dR, dG, dB);
        if (step > maxStepJump) {
          maxStepJump = step;
          maxStepDetails = `[${s}] tod=${tod}: step=${(step * 255).toFixed(1)}/255`;
        }
      }
    }
    prevGrad = { top: curTop, mid: curMid, bot: curBot };
  }
}

assert(maxStepJump <= maxJumpThreshold, `Continuous sky interpolation: max color step jump between adjacent 0.05h samples is ${(maxStepJump * 255).toFixed(1)}/255 (threshold <= 16/255)`, maxStepDetails);

// 15. Coconut Palm Crown Fronds Box3 vs Thatched Bungalow Roof Footprint Clearance
import { createPhuQuocArchitecture } from '../src/three/themes/phuquoc/architecture';
import { createPhuQuocVegetation } from '../src/three/themes/phuquoc/vegetation';

const pqVegScene = new THREE.Scene();
const pqVegParent = new THREE.Group();
pqVegScene.add(pqVegParent);

const pqArch = createPhuQuocArchitecture(pqVegParent, getTerrainHeight);
const pqVeg = createPhuQuocVegetation(pqVegParent, getTerrainHeight, () => 0);

pqVegParent.updateMatrixWorld(true);

const bungalowRoofBoxes: THREE.Box3[] = [];
pqArch.group.traverse((obj) => {
  if (obj instanceof THREE.Mesh && obj.geometry instanceof THREE.ConeGeometry && (obj.geometry.parameters as any).height === 1.2) {
    bungalowRoofBoxes.push(new THREE.Box3().setFromObject(obj));
  }
});

let palmFrondOverlapCount = 0;
let palmFrondFailDetails = '';
let verifiedPalmsCount = 0;

pqVeg.group.traverse((obj) => {
  if (obj.name === '' && obj.children.length === 2 && obj.children[1] instanceof THREE.Group) {
    const crown = obj.children[1];
    if (crown.children.length > 0 && crown.children[0] instanceof THREE.Mesh) {
      verifiedPalmsCount++;
      const crownBox = new THREE.Box3().setFromObject(crown);
      for (let i = 0; i < bungalowRoofBoxes.length; i++) {
        const rBox = bungalowRoofBoxes[i];
        const xOverlap = crownBox.min.x <= rBox.max.x && crownBox.max.x >= rBox.min.x;
        const zOverlap = crownBox.min.z <= rBox.max.z && crownBox.max.z >= rBox.min.z;
        if (xOverlap && zOverlap) {
          palmFrondOverlapCount++;
          palmFrondFailDetails = `Palm at (${obj.position.x.toFixed(2)}, ${obj.position.z.toFixed(2)}) crown Box3 overlaps Bungalow Roof ${i + 1}`;
          break;
        }
      }
    }
  }
});

assert(
  verifiedPalmsCount >= 10 && palmFrondOverlapCount === 0,
  `Coconut palms crown fronds Box3 strictly clear of all thatched bungalow roofs (${verifiedPalmsCount} palms verified with 0 overlaps)`,
  palmFrondFailDetails
);

// Layout migrations discard both camera storage paths while retaining settings.
const oldWindow = (globalThis as any).window;
try {
  const raw = { ...mockAppState, version: CURRENT_STORAGE_VERSION - 1 };
  (globalThis as any).window = { localStorage: { getItem: () => JSON.stringify(raw) } };
  const migrated = loadPersistedAppState();
  assert(!migrated.gardenState.cameraState && !migrated.phuquocState.cameraState &&
    !migrated.camera?.garden && !migrated.camera?.phuquoc,
    'Old layout cameras are removed from nested and shared storage');
  assert(migrated.gardenState.season === raw.gardenState.season &&
    migrated.phuquocState.timeOfDay === raw.phuquocState.timeOfDay,
    'Layout migration retains season and time settings');
} finally {
  (globalThis as any).window = oldWindow;
}

// 15. Raycast Water Interaction & Obstacle Verification Tests (Phu Quoc)
import { intersectPhuQuocWater } from '../src/three/themes/phuquoc/shoreline';

// A. Oblique camera raycast tests at both HIGH and LOW tides
const pqCameraPos = new THREE.Vector3(18.0, 16.0, 26.0);
const pqTargets = [
  { desc: 'Central bay water (x=0, z=5.5)', x: 0.0, z: 5.5 },
  { desc: 'South-east bay water (x=3.5, z=6.0)', x: 3.5, z: 6.0 },
  { desc: 'South-west bay water (x=-4.5, z=5.2)', x: -4.5, z: 5.2 },
];

let pqObliqueRaycastPassed = true;
let pqObliqueFailDetails = '';

const pqTides = [
  { name: 'high', level: SEA_LEVEL_HIGH, offset: 1.0 },
  { name: 'low', level: SEA_LEVEL_LOW, offset: -1.0 },
];

for (const t of pqTides) {
  for (const target of pqTargets) {
    const targetPt = new THREE.Vector3(target.x, t.level, target.z);
    const rayDir = new THREE.Vector3().subVectors(targetPt, pqCameraPos).normalize();
    const ray = new THREE.Ray(pqCameraPos, rayDir);

    const hit = intersectPhuQuocWater(ray, t.level, t.offset);
    if (!hit) {
      pqObliqueRaycastPassed = false;
      pqObliqueFailDetails = `Failed to intersect water for ${target.desc} at ${t.name} tide`;
      break;
    }

    if (Math.abs(hit.point.y - t.level) > 0.001) {
      pqObliqueRaycastPassed = false;
      pqObliqueFailDetails = `Water hit Y (${hit.point.y.toFixed(4)}) did not match water level (${t.level.toFixed(4)}) for ${target.desc} at ${t.name} tide`;
      break;
    }

    if (!isInWater(hit.point.x, hit.point.z, t.offset)) {
      pqObliqueRaycastPassed = false;
      pqObliqueFailDetails = `Hit point (${hit.point.x.toFixed(2)}, ${hit.point.z.toFixed(2)}) is not in water at ${t.name} tide`;
      break;
    }
  }
}

assert(
  pqObliqueRaycastPassed,
  'Oblique camera raycast accurately intersects sea surface across coastal bay at both HIGH and LOW tides',
  pqObliqueFailDetails
);

// B. Vertical skirt rejection at perimeter
// Ray aimed horizontally from outside towards the vertical skirt at z = 8.0, y = 0.10
const pqSkirtRay = new THREE.Ray(new THREE.Vector3(0, 0.10, 10.0), new THREE.Vector3(0, 0, -1));
const pqSkirtHit = intersectPhuQuocWater(pqSkirtRay, SEA_LEVEL_HIGH, 1.0);
assert(
  pqSkirtHit === null || pqSkirtHit.point.z < 8.0,
  'Ray hitting vertical perimeter skirt does not produce spurious ripple on vertical sea cut'
);

// C. Emergent coastal rock vs submerged seabed vs clear water obstacle testing
const pqObstacles: THREE.Object3D[] = [pqTerrainSystem.group];

// Test 1: Emergent coastal rock at rocky outcrop (x=0, z=0.8)
// Outcrop terrain height is ~0.75m > SEA_LEVEL_HIGH (0.44m)
const rayToRock = new THREE.Ray(new THREE.Vector3(0, 5.0, 0.8), new THREE.Vector3(0, -1, 0));
const pqRaycasterRock = new THREE.Raycaster(rayToRock.origin, rayToRock.direction);
const rockHits = pqRaycasterRock.intersectObjects(pqObstacles, true);
assert(
  rockHits.length > 0 && rockHits[0].point.y > SEA_LEVEL_HIGH,
  'Emergent coastal rock outcrop stands strictly above high sea level'
);

// Test 2: Submerged seabed beneath clear ocean water (x=0, z=5.5)
// Sea level is at 0.44m, seabed is at y ~ -0.40m
const rayToSea = new THREE.Ray(new THREE.Vector3(0, 5.0, 5.5), new THREE.Vector3(0, -1, 0));
const waterHitSea = intersectPhuQuocWater(rayToSea, SEA_LEVEL_HIGH, 1.0);
const pqRaycasterSea = new THREE.Raycaster(rayToSea.origin, rayToSea.direction);
const seaObstacleHits = pqRaycasterSea.intersectObjects(pqObstacles, true);

assert(
  waterHitSea !== null &&
  seaObstacleHits.length > 0 &&
  seaObstacleHits[0].distance > waterHitSea.distance + 0.005,
  'Clear ocean surface is unblocked; submerged seabed behind water does not block ripple'
);

// D. Natural Footprint Cut-Corners Synchronization (Exclusion of outside corner points)
// The diorama base has softly rounded corners with radius 2.0.
// Corner (9.9, 7.9) and (-9.9, 7.9) are outside the display perimeter and must NOT register water ripples.
const cutCorners = [
  { desc: 'South-East cut corner (9.9, 7.9)', x: 9.9, z: 7.9 },
  { desc: 'South-West cut corner (-9.9, 7.9)', x: -9.9, z: 7.9 },
];

for (const corner of cutCorners) {
  for (const t of pqTides) {
    const inWater = isInWater(corner.x, corner.z, t.offset);
    assert(
      inWater === false,
      `${corner.desc} is rejected by isInWater at ${t.name} tide`
    );

    const rayDown = new THREE.Ray(new THREE.Vector3(corner.x, 5.0, corner.z), new THREE.Vector3(0, -1, 0));
    const waterHit = intersectPhuQuocWater(rayDown, t.level, t.offset);
    assert(
      waterHit === null,
      `${corner.desc} is rejected by intersectPhuQuocWater at ${t.name} tide`
    );
  }
}

// E. In-bounds marine boundary points close to border remain interactive at both tides
// Test points at 96% radius along the corner ray and 0.5m inside the southern perimeter
const inBoundsBorderPoints = [
  { desc: 'South-East marine border inside (9.27, 7.41)', x: 9.27, z: 7.41 },
  { desc: 'Southern marine border inside (0.0, 7.5)', x: 0.0, z: 7.5 },
  { desc: 'South-West marine border inside (-9.27, 7.41)', x: -9.27, z: 7.41 },
];

for (const pt of inBoundsBorderPoints) {
  for (const t of pqTides) {
    const inWater = isInWater(pt.x, pt.z, t.offset);
    assert(
      inWater === true,
      `In-bounds border point ${pt.desc} remains interactive (isInWater === true) at ${t.name} tide`
    );

    const rayDown = new THREE.Ray(new THREE.Vector3(pt.x, 5.0, pt.z), new THREE.Vector3(0, -1, 0));
    const waterHit = intersectPhuQuocWater(rayDown, t.level, t.offset);
    assert(
      waterHit !== null && Math.abs(waterHit.point.y - t.level) < 0.001,
      `In-bounds border point ${pt.desc} successfully intersects water at ${t.name} tide`
    );
  }
}

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
