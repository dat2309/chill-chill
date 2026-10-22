import * as THREE from 'three';
import {
  DIORAMA_WIDTH,
  DIORAMA_DEPTH,
  TERRAIN_RES,
  STREAM_Z_START,
  STREAM_Z_END,
  STREAM_CENTER_X,
  GLAMPING_CENTER_X,
  GLAMPING_CENTER_Z,
  PLATEAU_HEIGHT,
  WATER_LEVEL,
  BASE_BOTTOM_Y,
  WALL_CUTOFF_Y,
  COLORS,
  Season,
  SEASON_PALETTES,
} from './constants';
import {
  GARDEN_CENTER,
  getGardenBoundaryPoint,
  isInsideGardenFootprint,
  GARDEN_BOUNDARY_SAMPLES,
  GARDEN_BOUNDARY_POINTS,
  GARDEN_FOOTPRINT_BOUNDS,
} from './footprint';
import { fbm2D, ridged2D, SimplexNoise2D, SeededRandom } from './noise';

const halfW = DIORAMA_WIDTH / 2;
const halfD = DIORAMA_DEPTH / 2;

export type ZoneType = 'mountain' | 'plateau' | 'cliff' | 'bank' | 'stream' | 'hill' | 'out_of_bounds';

export interface TerrainSample {
  height: number;
  normal: THREE.Vector3;
  slope: number;
  zone: ZoneType;
  inBounds: boolean;
  distToStream: number;
}

export interface TerrainSystem {
  group: THREE.Group;
  sampleTerrain(x: number, z: number): TerrainSample;
  getHeightAt(x: number, z: number): number;
  getNormalAt(x: number, z: number): THREE.Vector3;
  getSlopeAt(x: number, z: number): number;
  isInStream(x: number, z: number): boolean;
  isOnPlateau(x: number, z: number): boolean;
  updateSeason(season: Season, t: number): void;
  setDebug(debug: boolean): void;
  dispose(): void;
}

import {
  getStreamCenter,
  getStreamHalfWidth,
  getStreamWidth,
  getWaterSurfaceHeight,
  getStreamBedHeight,
  isInWater,
  STREAM_BOUNDS,
  BASE_WATER_LEVEL,
} from './streamProfile';

export {
  getStreamCenter,
  getStreamHalfWidth,
  getStreamWidth,
  getWaterSurfaceHeight,
  getStreamBedHeight,
  isInWater,
  STREAM_BOUNDS,
};

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0.0), 1.0);
  return t * t * (3.0 - 2.0 * t);
}

function getWestStairProfile(z: number): { x: number; y: number } {
  if (z <= 0.60) {
    return { x: -5.80, y: 1.48 };
  } else if (z <= 1.25) {
    const t = (z - 0.60) / (1.25 - 0.60);
    return {
      x: THREE.MathUtils.lerp(-5.80, -5.56, t),
      y: THREE.MathUtils.lerp(1.48, 0.94, t),
    };
  } else if (z <= 1.85) {
    return { x: -5.54, y: 0.94 };
  } else if (z <= 2.30) {
    const t = (z - 1.85) / (2.30 - 1.85);
    return {
      x: THREE.MathUtils.lerp(-5.50, -5.28, t),
      y: THREE.MathUtils.lerp(0.94, 0.40, t),
    };
  } else {
    return { x: -5.26, y: 0.40 };
  }
}

function getEastStairProfile(z: number): { x: number; y: number } {
  if (z <= 0.92) {
    return { x: -1.85, y: 1.46 };
  } else if (z <= 1.65) {
    const t = (z - 0.92) / (1.65 - 0.92);
    return {
      x: THREE.MathUtils.lerp(-1.85, -1.50, t),
      y: THREE.MathUtils.lerp(1.46, 0.93, t),
    };
  } else if (z <= 2.15) {
    return { x: -1.48, y: 0.93 };
  } else if (z <= 2.65) {
    const t = (z - 2.15) / (2.65 - 2.15);
    return {
      x: THREE.MathUtils.lerp(-1.42, -1.18, t),
      y: THREE.MathUtils.lerp(0.93, 0.40, t),
    };
  } else {
    return { x: -1.15, y: 0.40 };
  }
}

function applyStaircaseCorridorGrading(x: number, z: number, currentH: number): number {
  let gradedH = currentH;

  // 1. West Staircase Corridor
  // Covers top landing (z: 0.05-0.80), flights, mid landing, and bottom landing (z: 2.30-3.25)
  if (x >= -6.8 && x <= -4.4 && z >= 0.05 && z <= 3.25) {
    const prof = getWestStairProfile(z);
    const distToPath = Math.abs(x - prof.x);
    // Target excavated bedrock 8.5cm beneath the tread surface
    const targetBedH = prof.y - 0.085;
    // Step/landing half-width up to 0.58m; blend smoothly over [0.70m, 1.20m]
    const blend = 1.0 - smoothstep(0.70, 1.20, distToPath);
    if (blend > 0 && targetBedH < gradedH) {
      gradedH = THREE.MathUtils.lerp(gradedH, targetBedH, blend);
    }
  }

  // 2. East Staircase Corridor
  // Covers top landing (z: 0.45-1.20), flights, mid landing, and bottom landing (z: 2.65-3.60)
  if (x >= -2.8 && x <= -0.3 && z >= 0.45 && z <= 3.60) {
    const prof = getEastStairProfile(z);
    const distToPath = Math.abs(x - prof.x);
    const targetBedH = prof.y - 0.085;
    const blend = 1.0 - smoothstep(0.70, 1.20, distToPath);
    if (blend > 0 && targetBedH < gradedH) {
      gradedH = THREE.MathUtils.lerp(gradedH, targetBedH, blend);
    }
  }

  return gradedH;
}

/**
 * Procedural heightfield creating a natural glamping valley:
 * - High rear mountain ridge (z < -3.5)
 * - Elevated soft-contoured glamping meadow on the left at PLATEAU_HEIGHT (1.35)
 * - Natural organic rocky cliff with crags and crevices (no rice terraces)
 * - Continuous stream channel flowing from rear mountain gorge down to wide foreground basin
 * - Lower, gently rolling right bank with small knolls and gravel patches
 */
export function computeRawTerrainHeight(x: number, z: number): { height: number; zone: ZoneType; distToStream: number } {
  // 1. Mountain zone (concentrated at rear z < -3.5)
  const mountainRidge = ridged2D(x * 0.22 + 4.0, z * 0.22 - 3.0, 4, 2.0, 0.48);
  const mountainFbm = fbm2D(x * 0.32 + 10.0, z * 0.32 - 4.0, 3, 2.0, 0.45);
  // Natural peak silhouettes leaving center rear sightline open
  const peakLeft = Math.exp(-Math.pow((x + 4.6) / 3.4, 2) - Math.pow((z + 6.2) / 2.2, 2)) * 1.65;
  const peakRight = Math.exp(-Math.pow((x - 4.5) / 3.2, 2) - Math.pow((z + 6.4) / 2.0, 2)) * 1.45;
  const mountainH = 2.1 + mountainRidge * 1.1 + mountainFbm * 0.25 + peakLeft + peakRight;

  // 2. Glamping Plateau Zone: Softened, natural undulating contour (NOT a rigid rectangle)
  // Curves organically around campsite living area out to x ~ -9.6
  const frontEdgeZ = 1.15 + Math.sin((x + 4.0) * 0.70) * 0.35 + SimplexNoise2D(x * 0.6, 1.5) * 0.22;
  const rightEdgeX = -0.1 + Math.sin((z + 1.2) * 0.80) * 0.45 + SimplexNoise2D(1.5, z * 0.7) * 0.25;
  const backEdgeZ = -3.8 + Math.cos(x * 0.4) * 0.35;
  const leftEdgeX = -9.6 + SimplexNoise2D(z * 0.4, 3.2) * 0.35;

  const inPlateauBox = x >= leftEdgeX && x <= rightEdgeX && z >= backEdgeZ && z <= frontEdgeZ;
  const distEdgeX = Math.min(x - leftEdgeX, rightEdgeX - x);
  const distEdgeZ = Math.min(z - backEdgeZ, frontEdgeZ - z);
  const distEdge = Math.min(distEdgeX, distEdgeZ);
  const plateauCore = smoothstep(-0.35, 0.45, distEdge);

  const plateauGentle = PLATEAU_HEIGHT + SimplexNoise2D(x * 0.3 + 1.0, z * 0.3 + 1.0) * 0.02;

  // 3. Natural Organic Cliff Face (NO horizontal rice terrace steps!)
  // Drops naturally from meadow down to stream bank with organic rock crags and crevices
  const cliffDrop = smoothstep(frontEdgeZ, frontEdgeZ + 1.30, z);
  const cragNoise = SimplexNoise2D(x * 1.8, z * 1.8) * 0.06 + SimplexNoise2D(x * 0.8 + 5.0, z * 0.8 + 5.0) * 0.04;
  const naturalCliffH = THREE.MathUtils.lerp(plateauGentle, 0.35, cliffDrop) + cragNoise * (1.0 - cliffDrop) * cliffDrop * 2.2;

  // 4. Right bank: lower and gently rolling with knolls embracing the wide lake basin
  const rightKnoll1 = Math.exp(-Math.pow((x - 4.8) / 1.9, 2) - Math.pow((z - 2.5) / 1.9, 2)) * 0.28;
  const rightKnoll2 = Math.exp(-Math.pow((x - 6.2) / 1.8, 2) - Math.pow((z - 5.5) / 2.2, 2)) * 0.24;
  const rightEmbrace = smoothstep(0.5, 7.5, z) * smoothstep(3.0, 7.0, x) * 0.10;
  const rightBankH = 0.44 + rightKnoll1 + rightKnoll2 + rightEmbrace + fbm2D(x * 0.35 + 5.0, z * 0.35 + 5.0, 3, 2.0, 0.4) * 0.16;

  // Combine base height before stream carving
  let baseH: number;
  let currentZone: ZoneType = 'bank';

  if (z < -3.5) {
    const mountainBlend = 1.0 - smoothstep(-5.0, -3.5, z);
    const valleyFloor = x < rightEdgeX ? plateauGentle : rightBankH;
    baseH = THREE.MathUtils.lerp(valleyFloor, mountainH, mountainBlend);
    currentZone = 'mountain';
  } else if (inPlateauBox && plateauCore > 0.70) {
    baseH = plateauGentle;
    currentZone = 'plateau';
  } else if (inPlateauBox || (x < rightEdgeX + 0.6 && z <= frontEdgeZ + 1.4)) {
    const isCliff = z >= frontEdgeZ && z <= frontEdgeZ + 1.4 && x <= rightEdgeX + 0.6;
    if (isCliff) {
      baseH = naturalCliffH;
      currentZone = 'cliff';
    } else {
      const pFactor = smoothstep(-0.4, 0.5, distEdge);
      baseH = THREE.MathUtils.lerp(0.55, plateauGentle, pFactor);
      currentZone = pFactor > 0.6 ? 'plateau' : 'cliff';
    }
  } else if (x > 1.0) {
    baseH = rightBankH;
    currentZone = 'bank';
  } else {
    baseH = 0.42 + SimplexNoise2D(x * 0.4, z * 0.4) * 0.05;
    currentZone = 'bank';
  }

  // Apply staircase corridor grading to excavate bedrock along the two descent paths,
  // revealing step treads and intermediate landings with zero ground penetration.
  baseH = applyStaircaseCorridorGrading(x, z, baseH);

  // Ensure gorge and cascade banks rise naturally above stream elevation in upper mountain reaches
  if (z < 0.2) {
    const scx_bank = getStreamCenter(z);
    const shw_bank = getStreamHalfWidth(z);
    const dist_bank = Math.abs(x - scx_bank);
    const waterY_bank = getWaterSurfaceHeight(z);
    if (dist_bank >= shw_bank * 0.90) {
      const liftFactor = smoothstep(shw_bank * 0.90, shw_bank * 1.6, dist_bank);
      const minBankH = waterY_bank + 0.12 + liftFactor * 0.40;
      baseH = Math.max(baseH, minBankH);
    }
  }

  // 5. Continuous Stream Channel & Expansive Foreground Lake Carving
  const scx = getStreamCenter(z);
  const distToStream = Math.abs(x - scx);
  const shw = getStreamHalfWidth(z);
  const waterSurfaceY = getWaterSurfaceHeight(z);

  // Seamless transition from mountain cascade channel to broad foreground lake basin
  // Blend gradually over z in [0.0, 1.0] centered at 0.5 with zero formula discontinuity
  const cascadeChannel = smoothstep(shw * 1.15, shw * 0.18, distToStream);
  const lakeChannel = smoothstep(shw * 1.05, shw * 0.76, distToStream);
  const lakeBlend = smoothstep(0.0, 1.0, z);
  const channelProfile = THREE.MathUtils.lerp(cascadeChannel, lakeChannel, lakeBlend);

  // Riverbed/lakebed sits consistently below water surface along profile
  const targetBedH = getStreamBedHeight(x, z) + SimplexNoise2D(x * 1.4 + 12.0, z * 1.4 + 12.0) * 0.015;

  let finalH = baseH;
  if (channelProfile > 0.001) {
    finalH = THREE.MathUtils.lerp(baseH, Math.min(baseH, targetBedH), channelProfile);

    if (isInWater(x, z, 0) || distToStream < shw * 0.90 || finalH <= waterSurfaceY + 0.02) {
      currentZone = 'stream';
    } else if (distToStream < shw * 1.25) {
      currentZone = 'bank';
    }
  }

  return { height: Math.max(0.08, finalH), zone: currentZone, distToStream };
}

export function createTerrain(scene: THREE.Scene): TerrainSystem {
  const group = new THREE.Group();
  group.name = 'TerrainSystemGroup';

  const nx = 256;
  const nz = 256;
  const minX = GARDEN_FOOTPRINT_BOUNDS.minX - 0.6;
  const maxX = GARDEN_FOOTPRINT_BOUNDS.maxX + 0.6;
  const minZ = GARDEN_FOOTPRINT_BOUNDS.minZ - 0.6;
  const maxZ = GARDEN_FOOTPRINT_BOUNDS.maxZ + 0.6;
  const gridWidth = maxX - minX;
  const gridDepth = maxZ - minZ;

  const baseBottomY = BASE_BOTTOM_Y;   // -0.70
  const wallCutoffY = WALL_CUTOFF_Y;   // -0.52
  const bevelRadius = 0.18;

  // Precompute heightfield & zonefield across full natural footprint
  const heightfield = new Float32Array((nx + 1) * (nz + 1));
  const zonefield: ZoneType[] = new Array((nx + 1) * (nz + 1));

  for (let iz = 0; iz <= nz; iz++) {
    const z = minZ + (iz / nz) * gridDepth;
    for (let ix = 0; ix <= nx; ix++) {
      const x = minX + (ix / nx) * gridWidth;
      const res = computeRawTerrainHeight(x, z);
      heightfield[iz * (nx + 1) + ix] = res.height;
      zonefield[iz * (nx + 1) + ix] = res.zone;
    }
  }

  function getHeightAt(x: number, z: number): number {
    const u = Math.min(Math.max((x - minX) / gridWidth, 0.0), 1.0);
    const v = Math.min(Math.max((z - minZ) / gridDepth, 0.0), 1.0);

    const gx = u * nx;
    const gz = v * nz;
    const ix = Math.min(Math.floor(gx), nx - 1);
    const iz = Math.min(Math.floor(gz), nz - 1);
    const fx = gx - ix;
    const fz = gz - iz;

    const row0 = iz * (nx + 1);
    const row1 = (iz + 1) * (nx + 1);

    const h00 = heightfield[row0 + ix];
    const h10 = heightfield[row0 + (ix + 1)];
    const h01 = heightfield[row1 + ix];
    const h11 = heightfield[row1 + (ix + 1)];

    if (fx <= fz) {
      return h00 + (h01 - h00) * fz + (h11 - h01) * fx;
    } else {
      return h00 + (h10 - h00) * fx + (h11 - h10) * fz;
    }
  }

  function getNormalAt(x: number, z: number): THREE.Vector3 {
    const eps = 0.05;
    const hL = getHeightAt(x - eps, z);
    const hR = getHeightAt(x + eps, z);
    const hD = getHeightAt(x, z - eps);
    const hU = getHeightAt(x, z + eps);
    return new THREE.Vector3(hL - hR, 2.0 * eps, hD - hU).normalize();
  }

  function getSlopeAt(x: number, z: number): number {
    const n = getNormalAt(x, z);
    return 1.0 - Math.min(1.0, Math.max(0.0, n.y));
  }

  function sampleTerrain(x: number, z: number): TerrainSample {
    const inFootprint = isInsideGardenFootprint(x, z);
    const inBounds = inFootprint;
    const h = getHeightAt(x, z);
    const norm = getNormalAt(x, z);
    const slope = 1.0 - Math.max(0.0, norm.y);

    const scx = getStreamCenter(z);
    const distToStream = Math.abs(x - scx);
    const shw = getStreamHalfWidth(z);
    const waterY = getWaterSurfaceHeight(z);

    let zone: ZoneType = 'plateau';
    if (!inBounds) {
      zone = 'out_of_bounds';
    } else if (z < -3.5 && h > 2.0) {
      zone = 'mountain';
    } else if (x >= -7.5 && x <= -0.4 && z >= -3.5 && z <= 1.2 && h >= 1.15 && slope < 0.22) {
      zone = 'plateau';
    } else if (x <= 0.8 && z >= 0.5 && z <= 2.6 && slope > 0.25) {
      zone = 'cliff';
    } else if (isInWater(x, z, 0) || distToStream < shw * 0.92 || h <= waterY + 0.02) {
      zone = 'stream';
    } else if (x > 1.2) {
      zone = 'bank';
    }

    return { height: h, normal: norm, slope, zone, inBounds, distToStream };
  }

  function isInStream(x: number, z: number): boolean {
    if (!isInsideGardenFootprint(x, z)) return false;
    return isInWater(x, z, 0);
  }

  function isOnPlateau(x: number, z: number): boolean {
    return sampleTerrain(x, z).zone === 'plateau';
  }

  // --- Geometry Construction ---
  const positions: number[] = [];
  const normals: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const tempCol = new THREE.Color();
  const numRings = 140;
  const numSegments = GARDEN_BOUNDARY_SAMPLES; // 256
  const numTopVerts = 1 + numRings * numSegments;

  const seasonPalettesData: Record<Season, Float32Array> = {
    spring: new Float32Array(numTopVerts * 3),
    summer: new Float32Array(numTopVerts * 3),
    autumn: new Float32Array(numTopVerts * 3),
    winter: new Float32Array(numTopVerts * 3),
  };
  const seasonsList: Season[] = ['spring', 'summer', 'autumn', 'winter'];

  function evaluateSurfaceColor(x: number, y: number, z: number, norm: THREE.Vector3, s: Season, outCol: THREE.Color): void {
    const pal = SEASON_PALETTES[s];
    const slope = 1.0 - Math.max(0.0, norm.y);
    const scx = getStreamCenter(z);
    const distToStream = Math.abs(x - scx);
    const shw = getStreamHalfWidth(z);

    // Natural grass meadow
    const gNoise = SimplexNoise2D(x * 0.55, z * 0.55) * 0.5 + 0.5;
    outCol.copy(pal.ground).lerp(pal.grassTint, gNoise * 0.55);

    // Glamping Plateau Meadow: richer lush green
    if (x >= -9.0 && x <= -0.6 && z >= -3.5 && z <= 0.85 && slope < 0.20) {
      outCol.lerp(pal.grassTint, 0.40);
    }

    // Stream channel & banks: multi-toned sandy gravel and riverbed stones from mountain gorge to front edge
    if (distToStream < shw * 1.35) {
      const gravelNoise1 = SimplexNoise2D(x * 2.2, z * 2.2) * 0.5 + 0.5;
      const gravelNoise2 = SimplexNoise2D(x * 6.5 + 3.0, z * 6.5 + 3.0) * 0.5 + 0.5;
      const gravelNoise3 = SimplexNoise2D(x * 14.0 + 8.0, z * 14.0 + 8.0) * 0.5 + 0.5;

      const colSandWarm = COLORS.terrain.sand;
      const colGravel = COLORS.water.bedGravel;
      const colPebbleAmber = new THREE.Color(0xbfa57d);
      const colPebbleSlate = new THREE.Color(0x656e6a);
      const colPebbleJasper = new THREE.Color(0x9a6c52);

      const pebbleMix = colSandWarm.clone().lerp(colGravel, gravelNoise1);
      pebbleMix.lerp(colPebbleAmber, gravelNoise2 * 0.45);
      pebbleMix.lerp(colPebbleSlate, (1.0 - gravelNoise2) * 0.35);
      if (gravelNoise3 > 0.65) {
        pebbleMix.lerp(colPebbleJasper, (gravelNoise3 - 0.65) * 1.5);
      }

      const shoreBlend = smoothstep(shw * 1.35, shw * 0.65, distToStream);
      outCol.lerp(pebbleMix, shoreBlend * 0.95);
    }

    // Right bank: add natural dirt patches and warm gravel knolls (reduced uniform flat grass)
    if (x > 1.2 && distToStream >= shw * 1.05) {
      const dirtNoise = SimplexNoise2D(x * 0.75 + 10.0, z * 0.75 + 10.0) * 0.5 + 0.5;
      if (dirtNoise > 0.62) {
        outCol.lerp(COLORS.terrain.dirt, (dirtNoise - 0.62) * 1.3);
      }
    }

    // Rocky cliffs: stratified rock with moss in crevices
    if (slope > 0.26) {
      const rockNoise = SimplexNoise2D(x * 1.1, z * 1.1) * 0.5 + 0.5;
      const rockCol = COLORS.terrain.rock.clone().lerp(COLORS.terrain.rockDark, rockNoise);
      if (slope > 0.40 && y > 0.35 && s !== 'winter') {
        rockCol.lerp(COLORS.terrain.moss, 0.42);
      }
      outCol.lerp(rockCol, smoothstep(0.26, 0.58, slope));
    }

    // Rear mountain rock & snow
    if (z < -3.6 && y > 2.2) {
      const rockFactor = smoothstep(2.2, 3.4, y);
      outCol.lerp(COLORS.terrain.rock, rockFactor * 0.65);
      if (s === 'winter' && norm.y > 0.60) {
        outCol.lerp(COLORS.terrain.snow, smoothstep(2.0, 3.2, y) * 0.85);
      }
    }

    // Winter selective snow
    if (s === 'winter') {
      if (norm.y > 0.75 && y > 0.30 && !(z >= 0.8 && distToStream < shw * 0.75)) {
        outCol.lerp(COLORS.terrain.snow, 0.45);
      }
    }
  }

  // 1. Build Top Surface (Concentric rings connecting center to natural diorama footprint)
  const cX = GARDEN_CENTER.x;
  const cZ = GARDEN_CENTER.y;
  const cY = getHeightAt(cX, cZ);
  const cNorm = getNormalAt(cX, cZ);

  positions.push(cX, cY, cZ);
  normals.push(cNorm.x, cNorm.y, cNorm.z);
  for (const s of seasonsList) {
    evaluateSurfaceColor(cX, cY, cZ, cNorm, s, tempCol);
    seasonPalettesData[s][0] = tempCol.r;
    seasonPalettesData[s][1] = tempCol.g;
    seasonPalettesData[s][2] = tempCol.b;
  }
  colors.push(
    seasonPalettesData.spring[0],
    seasonPalettesData.spring[1],
    seasonPalettesData.spring[2]
  );

  for (let ir = 1; ir <= numRings; ir++) {
    const frac = ir / numRings;
    for (let it = 0; it < numSegments; it++) {
      const bPt = GARDEN_BOUNDARY_POINTS[it];
      const x = cX + frac * (bPt.x - cX);
      const z = cZ + frac * (bPt.y - cZ);
      const y = getHeightAt(x, z);
      const norm = getNormalAt(x, z);

      positions.push(x, y, z);
      normals.push(norm.x, norm.y, norm.z);

      const vIdx = 1 + (ir - 1) * numSegments + it;
      for (const s of seasonsList) {
        evaluateSurfaceColor(x, y, z, norm, s, tempCol);
        seasonPalettesData[s][vIdx * 3] = tempCol.r;
        seasonPalettesData[s][vIdx * 3 + 1] = tempCol.g;
        seasonPalettesData[s][vIdx * 3 + 2] = tempCol.b;
      }

      colors.push(
        seasonPalettesData.spring[vIdx * 3],
        seasonPalettesData.spring[vIdx * 3 + 1],
        seasonPalettesData.spring[vIdx * 3 + 2]
      );
    }
  }

  // Quads for Top Surface (strictly +Y normal winding)
  // Center to ring 1: triangle fan
  for (let it = 0; it < numSegments; it++) {
    const nextIt = (it + 1) % numSegments;
    indices.push(0, 1 + nextIt, 1 + it);
  }

  // Ring k to Ring k + 1: quads
  for (let ir = 1; ir < numRings; ir++) {
    const ringCurr = 1 + (ir - 1) * numSegments;
    const ringNext = 1 + ir * numSegments;

    for (let it = 0; it < numSegments; it++) {
      const nextIt = (it + 1) % numSegments;
      const i00 = ringCurr + it;
      const i10 = ringCurr + nextIt;
      const i01 = ringNext + it;
      const i11 = ringNext + nextIt;

      indices.push(i00, i11, i01);
      indices.push(i00, i10, i11);
    }
  }

  // 2. Continuous Organic Side Walls around Natural Boundary
  const nySide = 12;
  const colSoil = COLORS.terrain.strataSoil;
  const colSubsoil = new THREE.Color(0x6e563b);
  const colRock = COLORS.terrain.strataRock1;
  const colBase = COLORS.base;

  const boundaryNormals: THREE.Vector2[] = [];
  for (let it = 0; it < numSegments; it++) {
    const prevPt = GARDEN_BOUNDARY_POINTS[(it - 1 + numSegments) % numSegments];
    const nextPt = GARDEN_BOUNDARY_POINTS[(it + 1) % numSegments];
    const tangent = new THREE.Vector2().subVectors(nextPt, prevPt);
    const norm = new THREE.Vector2(tangent.y, -tangent.x).normalize();
    boundaryNormals.push(norm);
  }

  const sideBaseIdx = positions.length / 3;
  for (let iy = 0; iy <= nySide; iy++) {
    const ty = iy / nySide;
    for (let it = 0; it < numSegments; it++) {
      const bPt = GARDEN_BOUNDARY_POINTS[it];
      const norm2d = boundaryNormals[it];
      const yTop = getHeightAt(bPt.x, bPt.y);
      const y = yTop * (1.0 - ty) + wallCutoffY * ty;

      positions.push(bPt.x, y, bPt.y);
      normals.push(norm2d.x, 0, norm2d.y);

      const bSoil = yTop - 0.16 - SimplexNoise2D(it * 0.15, 5.0) * 0.04;
      const bSubsoil = (yTop + wallCutoffY) * 0.50 + SimplexNoise2D(it * 0.12, 15.0) * 0.06;

      if (y > bSoil) {
        tempCol.copy(colSoil);
      } else if (y > bSubsoil) {
        tempCol.copy(colSubsoil);
      } else {
        tempCol.copy(colRock);
      }
      colors.push(tempCol.r, tempCol.g, tempCol.b);
    }
  }

  for (let iy = 0; iy < nySide; iy++) {
    const rowCurr = sideBaseIdx + iy * numSegments;
    const rowNext = sideBaseIdx + (iy + 1) * numSegments;

    for (let it = 0; it < numSegments; it++) {
      const nextIt = (it + 1) % numSegments;
      const i00 = rowCurr + it;
      const i10 = rowCurr + nextIt;
      const i01 = rowNext + it;
      const i11 = rowNext + nextIt;

      indices.push(i00, i10, i11);
      indices.push(i00, i11, i01);
    }
  }

  // 3. Rounded Cream Pedestal Bevel following the natural perimeter
  const nBevelSteps = 3;
  const bevelBaseIdx = positions.length / 3;
  for (let ib = 0; ib <= nBevelSteps; ib++) {
    const phi = (ib / nBevelSteps) * (Math.PI * 0.5);
    const y = wallCutoffY - Math.sin(phi) * (wallCutoffY - baseBottomY);
    const outward = bevelRadius * (1.0 - Math.cos(phi));
    const nY = -Math.sin(phi);
    const nOut = Math.cos(phi);

    for (let it = 0; it < numSegments; it++) {
      const bPt = GARDEN_BOUNDARY_POINTS[it];
      const norm2d = boundaryNormals[it];
      const curX = bPt.x + norm2d.x * outward;
      const curZ = bPt.y + norm2d.y * outward;

      positions.push(curX, y, curZ);
      normals.push(norm2d.x * nOut, nY, norm2d.y * nOut);
      colors.push(colBase.r, colBase.g, colBase.b);
    }
  }

  for (let ib = 0; ib < nBevelSteps; ib++) {
    const rowCurr = bevelBaseIdx + ib * numSegments;
    const rowNext = bevelBaseIdx + (ib + 1) * numSegments;

    for (let it = 0; it < numSegments; it++) {
      const nextIt = (it + 1) % numSegments;
      const i00 = rowCurr + it;
      const i10 = rowCurr + nextIt;
      const i01 = rowNext + it;
      const i11 = rowNext + nextIt;

      indices.push(i00, i10, i11);
      indices.push(i00, i11, i01);
    }
  }

  // 4. Flat Sealed Bottom Face at baseBottomY (-0.70)
  const bottomCenterIdx = positions.length / 3;
  positions.push(cX, baseBottomY, cZ);
  normals.push(0, -1, 0);
  colors.push(colBase.r, colBase.g, colBase.b);

  const bottomRingIdx = bevelBaseIdx + nBevelSteps * numSegments;
  for (let it = 0; it < numSegments; it++) {
    const nextIt = (it + 1) % numSegments;
    indices.push(bottomCenterIdx, bottomRingIdx + it, bottomRingIdx + nextIt);
  }

  // Assemble Terrain Mesh
  const terrainGeom = new THREE.BufferGeometry();
  terrainGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  terrainGeom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  terrainGeom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  terrainGeom.setIndex(indices);
  terrainGeom.computeVertexNormals();
  terrainGeom.computeBoundingBox();
  terrainGeom.computeBoundingSphere();

  const terrainMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.88,
    metalness: 0.04,
    flatShading: false,
    side: THREE.FrontSide,
  });

  const debugMaterial = new THREE.MeshBasicMaterial({
    color: 0x8c8c8c,
    side: THREE.FrontSide,
    wireframe: false,
  });

  const terrainMesh: THREE.Mesh = new THREE.Mesh(terrainGeom, terrainMaterial);
  terrainMesh.name = 'DioramaTerrainMesh';
  terrainMesh.receiveShadow = true;
  terrainMesh.castShadow = true;
  group.add(terrainMesh);

  // 5. Contact Shadow conforming directly to natural diorama perimeter
  const shadowRings = 4;
  const shadowPos: number[] = [];
  const shadowAlpha: number[] = [];
  const shadowIdx: number[] = [];
  const shadowBaseY = baseBottomY - 0.015;

  shadowPos.push(cX, shadowBaseY, cZ);
  shadowAlpha.push(0.38);

  for (let ir = 1; ir <= shadowRings; ir++) {
    const frac = ir / shadowRings;
    const expand = frac * 0.50;
    const ringAlpha = 0.38 * Math.pow(1.0 - frac, 1.4);

    for (let it = 0; it < numSegments; it++) {
      const bPt = GARDEN_BOUNDARY_POINTS[it];
      const norm2d = boundaryNormals[it];
      const sx = bPt.x + norm2d.x * expand;
      const sz = bPt.y + norm2d.y * expand;

      shadowPos.push(sx, shadowBaseY, sz);
      shadowAlpha.push(ringAlpha);
    }
  }

  for (let it = 0; it < numSegments; it++) {
    const nextIt = (it + 1) % numSegments;
    shadowIdx.push(0, 1 + nextIt, 1 + it);
  }

  for (let ir = 1; ir < shadowRings; ir++) {
    const rowCurr = 1 + (ir - 1) * numSegments;
    const rowNext = 1 + ir * numSegments;

    for (let it = 0; it < numSegments; it++) {
      const nextIt = (it + 1) % numSegments;
      const i00 = rowCurr + it;
      const i10 = rowCurr + nextIt;
      const i01 = rowNext + it;
      const i11 = rowNext + nextIt;

      shadowIdx.push(i00, i11, i01);
      shadowIdx.push(i00, i10, i11);
    }
  }

  const shadowGeom = new THREE.BufferGeometry();
  shadowGeom.setAttribute('position', new THREE.Float32BufferAttribute(shadowPos, 3));
  const shadowColors = new Float32Array(shadowAlpha.length * 3);
  const shadowColorAlpha = new Float32Array(shadowAlpha.length);
  for (let i = 0; i < shadowAlpha.length; i++) {
    shadowColors[i * 3 + 0] = 0.09;
    shadowColors[i * 3 + 1] = 0.08;
    shadowColors[i * 3 + 2] = 0.07;
    shadowColorAlpha[i] = shadowAlpha[i];
  }
  shadowGeom.setAttribute('color', new THREE.Float32BufferAttribute(shadowColors, 3));
  shadowGeom.setAttribute('alpha', new THREE.Float32BufferAttribute(shadowColorAlpha, 1));
  shadowGeom.setIndex(shadowIdx);

  const shadowMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: `
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(0.09, 0.08, 0.07, vAlpha);
      }
    `,
  });

  const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
  shadowMesh.renderOrder = -1;
  group.add(shadowMesh);

  // 6. Natural Rounded River Boulders (volume, diverse sizes, clustered along margins)
  const boulderGeom = new THREE.DodecahedronGeometry(1.0, 2);
  // Round and deform vertices for smooth water-worn river stones
  const bPosAttr = boulderGeom.attributes.position;
  const bTempV = new THREE.Vector3();
  for (let i = 0; i < bPosAttr.count; i++) {
    bTempV.fromBufferAttribute(bPosAttr, i);
    const n = SimplexNoise2D(bTempV.x * 1.5, bTempV.z * 1.5) * 0.12;
    bTempV.multiplyScalar(1.0 + n);
    bTempV.y *= 0.68; // Naturally squashed river boulder
    bPosAttr.setXYZ(i, bTempV.x, bTempV.y, bTempV.z);
  }
  boulderGeom.computeVertexNormals();

  const boulderMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White base so instanceColor reflects exact rock tint without double-multiplying
    roughness: 0.82,
    metalness: 0.02,
    flatShading: false,
  });

  // ONLY 5 natural weathered accent boulders scattered organically (NO enclosing wall or pond ring!)
  const boulderSpots = [
    // Boulder 1: At foot of left cliff partly submerged in crystal water
    { x: -1.3, z: 3.2, scale: 0.42, col: new THREE.Color(0x9e968b) },
    // Boulder 2: On right gravel spit, weathered river stone
    { x: 4.6, z: 3.6, scale: 0.38, col: new THREE.Color(0xaba092) },
    // Boulder 3: Near lower stairs landing, flat stepping stone
    { x: -2.3, z: 2.5, scale: 0.35, col: new THREE.Color(0x8e877c) },
    // Boulder 4: Mountain gorge cascade boulder upstream
    { x: 2.8, z: -2.6, scale: 0.40, col: new THREE.Color(0xb0a696) },
    // Boulder 5: Downstream right bank, sand-washed boulder
    { x: 5.2, z: 5.8, scale: 0.34, col: new THREE.Color(0xa89e8e) },
  ];

  const boulderMesh = new THREE.InstancedMesh(boulderGeom, boulderMat, boulderSpots.length);
  boulderMesh.castShadow = true;
  boulderMesh.receiveShadow = true;

  const bDummy = new THREE.Object3D();
  for (let i = 0; i < boulderSpots.length; i++) {
    const s = boulderSpots[i];
    const h = getHeightAt(s.x, s.z);
    bDummy.position.set(s.x, h + s.scale * 0.22, s.z);
    bDummy.rotation.set(0.1, (i * 1.7) % (Math.PI * 2), 0.1);
    bDummy.scale.set(s.scale, s.scale, s.scale);
    bDummy.updateMatrix();

    boulderMesh.setMatrixAt(i, bDummy.matrix);
    boulderMesh.setColorAt(i, s.col);
  }
  boulderMesh.instanceMatrix.needsUpdate = true;
  if (boulderMesh.instanceColor) boulderMesh.instanceColor.needsUpdate = true;
  group.add(boulderMesh);

  // 7. Small Riverbed Pebbles (scattered across wide crystal stream & lake basin)
  const pebbleCount = 480;
  const pebbleGeom = new THREE.DodecahedronGeometry(0.15, 1);
  pebbleGeom.scale(1.15, 0.48, 0.95);
  pebbleGeom.computeVertexNormals();

  const pebbleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White base so instanceColor reflects exact pebble palette
    roughness: 0.65,
    metalness: 0.04,
    flatShading: true,
  });

  const pebbleMesh = new THREE.InstancedMesh(pebbleGeom, pebbleMat, pebbleCount);
  pebbleMesh.receiveShadow = true;

  // Luminous riverbed pebbles: warm cream, river tan, amber-gold, river slate, jasper terracotta, mossy rock
  const pebblePalette = [
    new THREE.Color(0xf0ebd8), // Warm cream quartzite
    new THREE.Color(0xd6ccb8), // River stone light
    new THREE.Color(0xc8baa0), // River tan
    new THREE.Color(0xd4a359), // Amber river gold
    new THREE.Color(0x9e9282), // Warm river gray
    new THREE.Color(0x6a7775), // River slate green
    new THREE.Color(0xb3634c), // Jasper terracotta
    new THREE.Color(0x5e734b), // Mossy river pebble
    new THREE.Color(0x485250), // Dark river slate
  ];

  const pRng = new SeededRandom(2026);
  let pPlaced = 0;
  let pAttempts = 0;
  while (pPlaced < pebbleCount && pAttempts < 4500) {
    pAttempts++;
    const z = pRng.range(STREAM_BOUNDS.minZ + 0.4, halfD - 0.35);
    const scx = getStreamCenter(z);
    const shw = getStreamHalfWidth(z);
    // Cover the full submerged width of the stream and lake
    const x = scx + pRng.range(-shw * 0.88, shw * 0.88);

    const waterY = getWaterSurfaceHeight(z);
    const h = getHeightAt(x, z);
    if (h > waterY + 0.02) continue;

    const scale = pRng.range(0.35, 1.25);
    bDummy.position.set(x, h + 0.015 * scale, z);
    bDummy.rotation.set(pRng.range(0, Math.PI), pRng.range(0, Math.PI * 2), pRng.range(0, Math.PI));
    bDummy.scale.set(scale, scale, scale);
    bDummy.updateMatrix();

    pebbleMesh.setMatrixAt(pPlaced, bDummy.matrix);
    pebbleMesh.setColorAt(pPlaced, pebblePalette[Math.floor(pRng.next() * pebblePalette.length)]);
    pPlaced++;
  }
  pebbleMesh.instanceMatrix.needsUpdate = true;
  if (pebbleMesh.instanceColor) pebbleMesh.instanceColor.needsUpdate = true;
  group.add(pebbleMesh);

  scene.add(group);

  function updateSeason(season: Season, t: number): void {
    const colAttr = terrainGeom.attributes.color as THREE.BufferAttribute;
    const targetData = seasonPalettesData[season];
    const curArray = colAttr.array as Float32Array;

    for (let i = 0; i < numTopVerts * 3; i++) {
      curArray[i] = THREE.MathUtils.lerp(curArray[i], targetData[i], t);
    }
    colAttr.needsUpdate = true;
  }

  function setDebug(debug: boolean): void {
    terrainMesh.material = debug ? debugMaterial : terrainMaterial;
    shadowMesh.visible = !debug;
    boulderMesh.visible = !debug;
    pebbleMesh.visible = !debug;
  }

  return {
    group,
    sampleTerrain,
    getHeightAt,
    getNormalAt,
    getSlopeAt,
    isInStream,
    isOnPlateau,
    updateSeason,
    setDebug,
    dispose() {
      terrainGeom.dispose();
      terrainMaterial.dispose();
      debugMaterial.dispose();
      shadowGeom.dispose();
      shadowMat.dispose();
      boulderGeom.dispose();
      boulderMat.dispose();
      pebbleGeom.dispose();
      pebbleMat.dispose();
      group.removeFromParent();
    },
  };
}
