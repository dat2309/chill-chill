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
