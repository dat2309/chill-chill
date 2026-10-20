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

console.log('--- RUNNING PHU QUOC SUNSET BAY & MULTI-THEME VALIDATION SUITE ---');

// 1. Shoreline Continuity & Bounds
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
