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
import {
  sanitizeGardenState,
  sanitizePhuQuocState,
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

const ghe = BOAT_SPOTS.ghe;
const gheInWater = isInWater(ghe.x, ghe.z, 0);
const gheDepth = getWaterDepth(ghe.x, ghe.z, 0);
assert(gheInWater && gheDepth > ghe.draft + 0.1, 'Ghe Nhỏ floats freely with sufficient water depth in coastal bay');

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
