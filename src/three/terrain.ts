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
import { fbm2D, ridged2D, SimplexNoise2D, SeededRandom } from './noise';

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

/**
 * Centerline X of the stream along Z.
 * Curves naturally from mountain foot down to front edge.
 */
export function getStreamCenter(z: number): number {
  if (z < 0.0) {
    const t = (z + 8.0) / 8.0; // 0 at z = -8, 1 at z = 0
    return 3.2 * (1.0 - t) + 1.35 * t + Math.sin(t * Math.PI) * 0.35;
  } else {
    const t = z / 8.0; // 0 at z = 0, 1 at z = 8
    return 1.35 + Math.sin(t * Math.PI * 0.95) * 1.15 + t * 0.65;
  }
}

/**
 * Stream channel half-width along Z.
 * Narrow mountain gorge upstream (0.85 - 1.30), expanding into a wide open alpine basin in foreground (4.40).
 */
export function getStreamHalfWidth(z: number): number {
  if (z < 0.0) {
    const t = (z + 8.0) / 8.0;
    return 0.85 + t * 0.45; // 0.85 in mountain pass, widening to 1.30 at campsite edge
  } else {
    const t = z / 8.0;
    // Widens dramatically in foreground from 1.30 to 4.40 at front edge (occupies ~44% of foreground)
    return 1.30 + t * t * 3.10;
  }
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0.0), 1.0);
  return t * t * (3.0 - 2.0 * t);
}

/**
 * Procedural heightfield creating a natural glamping valley:
 * - High rear mountain ridge (z < -3.5)
 * - Elevated contiguous glamping meadow on the left at PLATEAU_HEIGHT (1.35)
 * - Natural organic rocky cliff (NO horizontal rice terrace steps!)
 * - Continuous stream channel flowing from rear mountain gorge down to wide foreground basin
 * - Lower, gently rolling right bank
 */
export function computeRawTerrainHeight(x: number, z: number): { height: number; zone: ZoneType; distToStream: number } {
  const halfW = DIORAMA_WIDTH * 0.5;
  const halfD = DIORAMA_DEPTH * 0.5;

  if (Math.abs(x) > halfW || Math.abs(z) > halfD) {
    return { height: 0, zone: 'out_of_bounds', distToStream: 99 };
  }

  // 1. Mountain zone (concentrated at rear z < -3.5)
  const mountainWeight = smoothstep(-3.2, -6.5, z);
  const mountainRidge = ridged2D(x * 0.22 + 4.0, z * 0.22 - 3.0, 4, 2.0, 0.48);
  const mountainFbm = fbm2D(x * 0.32 + 10.0, z * 0.32 - 4.0, 3, 2.0, 0.45);
  // Natural peak silhouettes leaving center rear sightline open
  const peakLeft = Math.exp(-Math.pow((x + 4.6) / 3.4, 2) - Math.pow((z + 6.2) / 2.2, 2)) * 1.65;
  const peakRight = Math.exp(-Math.pow((x - 4.5) / 3.2, 2) - Math.pow((z + 6.4) / 2.0, 2)) * 1.45;
  const mountainH = 2.1 + mountainRidge * 1.1 + mountainFbm * 0.25 + peakLeft + peakRight;

  // 2. Glamping Plateau Zone (x: -7.6 to -0.4, z: -3.5 to 0.85)
  // Perfectly leveled contiguous meadow at PLATEAU_HEIGHT (1.35)
  const pMinX = -7.6;
  const pMaxX = -0.4;
  const pMinZ = -3.5;
  const pMaxZ = 0.85;

  const inPlateauBox = x >= pMinX && x <= pMaxX && z >= pMinZ && z <= pMaxZ;
  const distEdgeX = Math.min(x - pMinX, pMaxX - x);
  const distEdgeZ = Math.min(z - pMinZ, pMaxZ - z);
  const distEdge = Math.min(distEdgeX, distEdgeZ);
  const plateauCore = smoothstep(-0.25, 0.45, distEdge);

  const plateauGentle = PLATEAU_HEIGHT + SimplexNoise2D(x * 0.3 + 1.0, z * 0.3 + 1.0) * 0.02;

  // 3. Natural Organic Cliff Face (NO horizontal rice terrace steps!)
  // Drops naturally from meadow down to stream bank with organic rock crags and crevices
  const cliffDrop = smoothstep(0.85, 2.15, z);
  const cragNoise = SimplexNoise2D(x * 1.8, z * 1.8) * 0.06 + SimplexNoise2D(x * 0.8 + 5.0, z * 0.8 + 5.0) * 0.04;
  const naturalCliffH = THREE.MathUtils.lerp(plateauGentle, 0.35, cliffDrop) + cragNoise * (1.0 - cliffDrop) * cliffDrop * 2.2;

  // 4. Right bank: lower and gently rolling (Y ~ 0.38 to 0.65)
  const rightBankH = 0.46 + fbm2D(x * 0.25 + 5.0, z * 0.25 + 5.0, 3, 2.0, 0.4) * 0.22;

  // Combine base height before stream carving
  let baseH: number;
  let currentZone: ZoneType = 'bank';

  if (z < -3.5) {
    const blendToMeadow = smoothstep(-4.2, -3.2, z);
    baseH = THREE.MathUtils.lerp(mountainH, plateauGentle, blendToMeadow * (inPlateauBox ? 1.0 : 0.35));
    currentZone = 'mountain';
  } else if (inPlateauBox && plateauCore > 0.75) {
    baseH = plateauGentle;
    currentZone = 'plateau';
  } else if (inPlateauBox || (x < 0.2 && z <= 2.2)) {
    const isCliff = z >= 0.85 && z <= 2.3 && x <= 0.4;
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

  // 5. Continuous Stream Channel Carving (from mountain pass at z = -7.5 to front edge at z = 8.0)
  const scx = getStreamCenter(z);
  const distToStream = Math.abs(x - scx);
  const shw = getStreamHalfWidth(z);

  // Parabolic channel profile
  const channelProfile = smoothstep(shw * 1.15, shw * 0.18, distToStream);

  // Continuous stream bed descent:
  // Mountain gorge (z = -7.5 to 0.8): descends from Y = 1.75 down to Y = 0.25
  // Lower wide pool (z >= 0.8 to 8.0): sits at Y = 0.11 - 0.13
  let targetBedH: number;
  if (z < 0.9) {
    const tGorge = smoothstep(-7.5, 0.9, z);
    targetBedH = THREE.MathUtils.lerp(1.75, 0.25, tGorge) + SimplexNoise2D(x * 1.2, z * 1.2) * 0.03;
  } else {
    targetBedH = 0.11 + SimplexNoise2D(x * 1.2 + 15.0, z * 1.2 + 15.0) * 0.025;
  }

  let finalH = baseH;
  if (channelProfile > 0.001) {
    finalH = THREE.MathUtils.lerp(baseH, Math.min(baseH, targetBedH), channelProfile);

    if (distToStream < shw * 0.90 && finalH <= WATER_LEVEL + 0.05) {
      currentZone = 'stream';
    } else if (distToStream < shw * 1.20) {
      currentZone = 'bank';
    }
  }

  return { height: Math.max(0.08, finalH), zone: currentZone, distToStream };
}

export function createTerrain(scene: THREE.Scene): TerrainSystem {
  const group = new THREE.Group();
  group.name = 'TerrainSystemGroup';

  const nx = TERRAIN_RES;
  const nz = TERRAIN_RES;
  const gridWidth = DIORAMA_WIDTH;
  const gridDepth = DIORAMA_DEPTH;
  const halfW = gridWidth * 0.5;
  const halfD = gridDepth * 0.5;

  const baseBottomY = BASE_BOTTOM_Y;   // -0.70
  const wallCutoffY = WALL_CUTOFF_Y;   // -0.52
  const bevelRadius = 0.18;

  // Precompute heightfield & zonefield
  const heightfield = new Float32Array((nx + 1) * (nz + 1));
  const zonefield: ZoneType[] = new Array((nx + 1) * (nz + 1));

  for (let iz = 0; iz <= nz; iz++) {
    const z = -halfD + (iz / nz) * gridDepth;
    for (let ix = 0; ix <= nx; ix++) {
      const x = -halfW + (ix / nx) * gridWidth;
      const res = computeRawTerrainHeight(x, z);
      heightfield[iz * (nx + 1) + ix] = res.height;
      zonefield[iz * (nx + 1) + ix] = res.zone;
    }
  }

  function getHeightAt(x: number, z: number): number {
    const u = Math.min(Math.max((x + halfW) / gridWidth, 0.0), 1.0);
    const v = Math.min(Math.max((z + halfD) / gridDepth, 0.0), 1.0);

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

    // Exact triangle interpolation matching the CCW triangles (i00, i01, i11) and (i00, i11, i10)
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
    const inBounds = Math.abs(x) <= halfW - 0.25 && Math.abs(z) <= halfD - 0.25;
    const h = getHeightAt(x, z);
    const norm = getNormalAt(x, z);
    const slope = 1.0 - Math.max(0.0, norm.y);

    const scx = getStreamCenter(z);
    const distToStream = Math.abs(x - scx);
    const shw = getStreamHalfWidth(z);

    let zone: ZoneType = 'bank';
    if (!inBounds) {
      zone = 'out_of_bounds';
    } else if (z < -3.5 && h > 2.0) {
      zone = 'mountain';
    } else if (x >= -7.6 && x <= -0.4 && z >= -3.5 && z <= 0.85 && h >= 1.25 && slope < 0.18) {
      zone = 'plateau';
    } else if (x <= 0.6 && z >= 0.8 && z <= 2.3 && slope > 0.28) {
      zone = 'cliff';
    } else if (z >= 0.8 && distToStream < shw * 0.88 && h <= WATER_LEVEL + 0.05) {
      zone = 'stream';
    } else if (x > 1.2) {
      zone = 'bank';
    }

    return { height: h, normal: norm, slope, zone, inBounds, distToStream };
  }

  function isInStream(x: number, z: number): boolean {
    if (z < 0.8) return false;
    const scx = getStreamCenter(z);
    const dist = Math.abs(x - scx);
    const shw = getStreamHalfWidth(z);
    const h = getHeightAt(x, z);
    return dist < shw * 0.90 || (h <= WATER_LEVEL + 0.03 && z >= 0.85);
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
  const numTopVerts = (nx + 1) * (nz + 1);

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

    // Glamping Plateau Meadow: richer green
    if (x >= -7.6 && x <= -0.4 && z >= -3.5 && z <= 0.85 && slope < 0.20) {
      outCol.lerp(pal.grassTint, 0.40);
    }

    // Stream basin: warm sandy gravel and riverbed tones
    if (z >= 0.75 && distToStream < shw * 1.35) {
      const gravelNoise = SimplexNoise2D(x * 2.0, z * 2.0) * 0.5 + 0.5;
      const gravelCol = COLORS.terrain.sand.clone().lerp(COLORS.water.bedGravel, gravelNoise);
      const shoreBlend = smoothstep(shw * 1.35, shw * 0.70, distToStream);
      outCol.lerp(gravelCol, shoreBlend * 0.90);
    }

    // Rocky cliffs
    if (slope > 0.26) {
      const rockNoise = SimplexNoise2D(x * 1.1, z * 1.1) * 0.5 + 0.5;
      const rockCol = COLORS.terrain.rock.clone().lerp(COLORS.terrain.rockDark, rockNoise);
      if (slope > 0.42 && y > 0.45 && s !== 'winter') {
        rockCol.lerp(COLORS.terrain.moss, 0.38);
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

  // 1. Build Top Surface
  for (let iz = 0; iz <= nz; iz++) {
    const z = -halfD + (iz / nz) * gridDepth;
    for (let ix = 0; ix <= nx; ix++) {
      const x = -halfW + (ix / nx) * gridWidth;
      const y = heightfield[iz * (nx + 1) + ix];
      const norm = getNormalAt(x, z);

      positions.push(x, y, z);
      normals.push(norm.x, norm.y, norm.z);

      const vIdx = iz * (nx + 1) + ix;
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

  // Top surface quads (Counter-Clockwise winding: geometric normal points UP +Y)
  for (let iz = 0; iz < nz; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      const i00 = iz * (nx + 1) + ix;
      const i10 = iz * (nx + 1) + (ix + 1);
      const i01 = (iz + 1) * (nx + 1) + ix;
      const i11 = (iz + 1) * (nx + 1) + (ix + 1);

      indices.push(i00, i01, i11);
      indices.push(i00, i11, i10);
    }
  }

  // 2. Build 4 Cut-Earth Side Walls with organic geological strata (NO rapid stripes!)
  const nySide = 12;
  const colSoil = COLORS.terrain.strataSoil;
  const colSubsoil = new THREE.Color(0x6e563b);
  const colRock = COLORS.terrain.strataRock1;
  const colBase = COLORS.base;

  function addCleanSideWall(
    getPt: (s: number) => { x: number; z: number; yTop: number; u: number },
    normalVec: THREE.Vector3,
    slices: number
  ): void {
    const baseIdx = positions.length / 3;

    for (let iy = 0; iy <= nySide; iy++) {
      const ty = iy / nySide;
      for (let is = 0; is <= slices; is++) {
        const s = is / slices;
        const pt = getPt(s);
        const y = pt.yTop * (1.0 - ty) + wallCutoffY * ty;

        positions.push(pt.x, y, pt.z);
        normals.push(normalVec.x, normalVec.y, normalVec.z);

        // Slow, non-periodic geological strata boundaries
        const bSoil = pt.yTop - 0.16 - SimplexNoise2D(pt.u * 0.18, 5.0) * 0.04;
        const bSubsoil = (pt.yTop + wallCutoffY) * 0.50 + SimplexNoise2D(pt.u * 0.15, 15.0) * 0.06;

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
      for (let is = 0; is < slices; is++) {
        const topLeft = baseIdx + iy * (slices + 1) + is;
        const topRight = topLeft + 1;
        const bottomLeft = baseIdx + (iy + 1) * (slices + 1) + is;
        const bottomRight = bottomLeft + 1;

        indices.push(topLeft, bottomLeft, topRight);
        indices.push(topRight, bottomLeft, bottomRight);
      }
    }
  }

  // South Wall (Z = +halfD, front cut showing wide stream channel)
  addCleanSideWall(
    (s) => {
      const x = -halfW + s * gridWidth;
      const z = halfD;
      const ix = Math.min(Math.round(s * nx), nx);
      const yTop = heightfield[nz * (nx + 1) + ix];
      return { x, z, yTop, u: x };
    },
    new THREE.Vector3(0, 0, 1),
    nx
  );

  // East Wall (X = +halfW, right side)
  addCleanSideWall(
    (s) => {
      const z = halfD - s * gridDepth;
      const x = halfW;
      const iz = Math.min(Math.round((1.0 - s) * nz), nz);
      const yTop = heightfield[iz * (nx + 1) + nx];
      return { x, z, yTop, u: z };
    },
    new THREE.Vector3(1, 0, 0),
    nz
  );

  // North Wall (Z = -halfD, back mountain cut)
  addCleanSideWall(
    (s) => {
      const x = halfW - s * gridWidth;
      const z = -halfD;
      const ix = Math.min(Math.round((1.0 - s) * nx), nx);
      const yTop = heightfield[0 * (nx + 1) + ix];
      return { x, z, yTop, u: x };
    },
    new THREE.Vector3(0, 0, -1),
    nx
  );

  // West Wall (X = -halfW, left side)
  addCleanSideWall(
    (s) => {
      const z = -halfD + s * gridDepth;
      const x = -halfW;
      const iz = Math.min(Math.round(s * nz), nz);
      const yTop = heightfield[iz * (nx + 1) + 0];
      return { x, z, yTop, u: z };
    },
    new THREE.Vector3(-1, 0, 0),
    nz
  );

  // 3. Rounded Cream Pedestal Bevel & Bottom Face
  const innerHalfW = halfW - bevelRadius;
  const innerHalfD = halfD - bevelRadius;
  const nBevelSteps = 3;

  function addBevelStrip(
    p0: THREE.Vector2,
    p1: THREE.Vector2,
    outDir: THREE.Vector2,
    slices: number
  ): void {
    const baseIdx = positions.length / 3;

    for (let ib = 0; ib <= nBevelSteps; ib++) {
      const phi = (ib / nBevelSteps) * (Math.PI * 0.5);
      const y = wallCutoffY - Math.sin(phi) * (wallCutoffY - baseBottomY);
      const outward = bevelRadius * Math.cos(phi);
      const nY = -Math.sin(phi);
      const nOut = Math.cos(phi);

      for (let is = 0; is <= slices; is++) {
        const s = is / slices;
        const curX = p0.x * (1.0 - s) + p1.x * s + outDir.x * outward;
        const curZ = p0.y * (1.0 - s) + p1.y * s + outDir.y * outward;

        positions.push(curX, y, curZ);
        normals.push(outDir.x * nOut, nY, outDir.y * nOut);
        colors.push(colBase.r, colBase.g, colBase.b);
      }
    }

    for (let ib = 0; ib < nBevelSteps; ib++) {
      for (let is = 0; is < slices; is++) {
        const topLeft = baseIdx + ib * (slices + 1) + is;
        const topRight = topLeft + 1;
        const bottomLeft = baseIdx + (ib + 1) * (slices + 1) + is;
        const bottomRight = bottomLeft + 1;

        indices.push(topLeft, bottomLeft, topRight);
        indices.push(topRight, bottomLeft, bottomRight);
      }
    }
  }

  addBevelStrip(new THREE.Vector2(-innerHalfW, innerHalfD), new THREE.Vector2(innerHalfW, innerHalfD), new THREE.Vector2(0, 1), 24);
  addBevelStrip(new THREE.Vector2(innerHalfW, innerHalfD), new THREE.Vector2(innerHalfW, -innerHalfD), new THREE.Vector2(1, 0), 20);
  addBevelStrip(new THREE.Vector2(innerHalfW, -innerHalfD), new THREE.Vector2(-innerHalfW, -innerHalfD), new THREE.Vector2(0, -1), 24);
  addBevelStrip(new THREE.Vector2(-innerHalfW, -innerHalfD), new THREE.Vector2(-innerHalfW, innerHalfD), new THREE.Vector2(-1, 0), 20);

  // 4. Flat Bottom Face at baseBottomY (-0.70)
  const botIdx = positions.length / 3;
  const nGrid = 4;
  for (let iz = 0; iz <= nGrid; iz++) {
    const tz = iz / nGrid;
    const z = -innerHalfD + tz * (2.0 * innerHalfD);
    for (let ix = 0; ix <= nGrid; ix++) {
      const tx = ix / nGrid;
      const x = -innerHalfW + tx * (2.0 * innerHalfW);

      positions.push(x, baseBottomY, z);
      normals.push(0, -1, 0);
      colors.push(colBase.r, colBase.g, colBase.b);
    }
  }

  for (let iz = 0; iz < nGrid; iz++) {
    for (let ix = 0; ix < nGrid; ix++) {
      const i00 = botIdx + iz * (nGrid + 1) + ix;
      const i10 = botIdx + iz * (nGrid + 1) + (ix + 1);
      const i01 = botIdx + (iz + 1) * (nGrid + 1) + ix;
      const i11 = botIdx + (iz + 1) * (nGrid + 1) + (ix + 1);

      indices.push(i00, i11, i10);
      indices.push(i00, i01, i11);
    }
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

  // 5. Contact Shadow Plane below sleek pedestal
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d')!;
  const radGrad = ctx.createRadialGradient(64, 64, 25, 64, 64, 62);
  radGrad.addColorStop(0.0, 'rgba(42, 34, 24, 0.40)');
  radGrad.addColorStop(0.55, 'rgba(55, 46, 36, 0.18)');
  radGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 128, 128);

  const shadowTex = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeom = new THREE.PlaneGeometry(gridWidth * 1.18, gridDepth * 1.22);
  shadowGeom.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    opacity: 0.70,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
  shadowMesh.position.set(0, baseBottomY - 0.02, 0);
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
    color: 0x9c958a, // Warm mountain granite
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

  // 7. Small Riverbed Pebbles (scattered across wide crystal stream channel)
  const pebbleCount = 220;
  const pebbleGeom = new THREE.DodecahedronGeometry(0.16, 1);
  pebbleGeom.scale(1.0, 0.52, 1.0);
  pebbleGeom.computeVertexNormals();

  const pebbleMat = new THREE.MeshStandardMaterial({
    roughness: 0.70,
    metalness: 0.04,
    flatShading: true,
  });

  const pebbleMesh = new THREE.InstancedMesh(pebbleGeom, pebbleMat, pebbleCount);
  pebbleMesh.receiveShadow = true;

  // Luminous riverbed pebbles: warm cream, river tan, amber-tan, soft slate, beige, jasper
  const pebblePalette = [
    new THREE.Color(0xd6ccb8),
    new THREE.Color(0xa89e8e),
    new THREE.Color(0xbeaf96),
    new THREE.Color(0x8a928c),
    new THREE.Color(0xc8baa0),
    new THREE.Color(0x9e9282),
    new THREE.Color(0xb2a288),
  ];

  const pRng = new SeededRandom(2026);
  let pPlaced = 0;
  let pAttempts = 0;
  while (pPlaced < pebbleCount && pAttempts < 1500) {
    pAttempts++;
    const z = pRng.range(1.0, halfD - 0.4);
    const scx = getStreamCenter(z);
    const shw = getStreamHalfWidth(z);
    const x = scx + pRng.range(-shw * 0.82, shw * 0.82);

    const h = getHeightAt(x, z);
    if (h > WATER_LEVEL + 0.03) continue;

    const scale = pRng.range(0.4, 1.1);
    bDummy.position.set(x, h + 0.02 * scale, z);
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
      shadowTex.dispose();
      boulderGeom.dispose();
      boulderMat.dispose();
      pebbleGeom.dispose();
      pebbleMat.dispose();
      group.removeFromParent();
    },
  };
}
