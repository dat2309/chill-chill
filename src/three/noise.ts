import { SEED } from './constants';

/**
 * Deterministic pseudorandom number generator using Mulberry32.
 */
export class SeededRandom {
  private state: number;

  constructor(seed: number = 42) {
    this.state = (Math.floor(seed) >>> 0) || 1;
  }

  /**
   * Returns a pseudorandom number in [0, 1).
   */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns a pseudorandom number in [min, max).
   */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Returns a normally distributed number using the Box-Muller transform.
   */
  gaussian(mean: number = 0, std: number = 1): number {
    let u1 = this.next();
    let u2 = this.next();
    while (u1 <= 1e-15) {
      u1 = this.next();
    }
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * std;
  }
}

/** Global random number generator instance initialized with project SEED */
export const rng = new SeededRandom(SEED);

// 12 gradient vectors for 2D and 3D simplex noise
const GRAD3: readonly [number, number, number][] = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1],
];

// Permutation tables initialized with SEED
const perm = new Uint8Array(512);
const permMod12 = new Uint8Array(512);

function initPermutationTables(seed: number): void {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    p[i] = i;
  }
  const shuffleRng = new SeededRandom(seed);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(shuffleRng.next() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = p[i & 255] % 12;
  }
}

initPermutationTables(SEED);

// Simplex constants for 2D
const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

/**
 * 2D Simplex Noise returning value in [-1, 1].
 */
export function simplexNoise2D(x: number, y: number): number {
  let n0 = 0;
  let n1 = 0;
  let n2 = 0;

  // Skew input space to determine simplex cell origin
  const s = (x + y) * F2;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);

  const t = (i + j) * G2;
  const X0 = i - t;
  const Y0 = j - t;
  const x0 = x - X0;
  const y0 = y - Y0;

  // Determine which simplex triangle we are in
  let i1: number;
  let j1: number;
  if (x0 > y0) {
    i1 = 1;
    j1 = 0;
  } else {
    i1 = 0;
    j1 = 1;
  }

  const x1 = x0 - i1 + G2;
  const y1 = y0 - j1 + G2;
  const x2 = x0 - 1.0 + 2.0 * G2;
  const y2 = y0 - 1.0 + 2.0 * G2;

  // Hashed gradient indices
  const ii = i & 255;
  const jj = j & 255;
  const gi0 = permMod12[ii + perm[jj]];
  const gi1 = permMod12[ii + i1 + perm[jj + j1]];
  const gi2 = permMod12[ii + 1 + perm[jj + 1]];

  // Calculate contribution from 3 corners
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) {
    t0 *= t0;
    const g = GRAD3[gi0];
    n0 = t0 * t0 * (g[0] * x0 + g[1] * y0);
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) {
    t1 *= t1;
    const g = GRAD3[gi1];
    n1 = t1 * t1 * (g[0] * x1 + g[1] * y1);
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) {
    t2 *= t2;
    const g = GRAD3[gi2];
    n2 = t2 * t2 * (g[0] * x2 + g[1] * y2);
  }

  // Scale to [-1, 1]
  return 70.0 * (n0 + n1 + n2);
}

// Export capitalized alias matching SimplexNoise2D specification
export const SimplexNoise2D = simplexNoise2D;

// Simplex constants for 3D
const F3 = 1.0 / 3.0;
const G3 = 1.0 / 6.0;

/**
 * 3D Simplex Noise returning value in [-1, 1].
 */
export function simplexNoise3D(x: number, y: number, z: number): number {
  let n0 = 0;
  let n1 = 0;
  let n2 = 0;
  let n3 = 0;

  // Skew input space to determine simplex cell origin
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);

  const t = (i + j + k) * G3;
  const X0 = i - t;
  const Y0 = j - t;
  const Z0 = k - t;
  const x0 = x - X0;
  const y0 = y - Y0;
  const z0 = z - Z0;

  // Determine which simplex tetrahedron we are in
  let i1: number;
  let j1: number;
  let k1: number;
  let i2: number;
  let j2: number;
  let k2: number;

  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    } else if (x0 >= z0) {
      i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1;
    } else {
      i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1;
    }
  } else {
    if (y0 < z0) {
      i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1;
    } else if (x0 < z0) {
      i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1;
    } else {
      i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0;
    }
  }

  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;

  const x2 = x0 - i2 + 2.0 * G3;
  const y2 = y0 - j2 + 2.0 * G3;
  const z2 = z0 - k2 + 2.0 * G3;

  const x3 = x0 - 1.0 + 3.0 * G3;
  const y3 = y0 - 1.0 + 3.0 * G3;
  const z3 = z0 - 1.0 + 3.0 * G3;

  // Hashed gradient indices
  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;

  const gi0 = permMod12[ii + perm[jj + perm[kk]]];
  const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
  const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
  const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];

  // Calculate contribution from 4 corners
  let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 >= 0) {
    t0 *= t0;
    const g = GRAD3[gi0];
    n0 = t0 * t0 * (g[0] * x0 + g[1] * y0 + g[2] * z0);
  }

  let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 >= 0) {
    t1 *= t1;
    const g = GRAD3[gi1];
    n1 = t1 * t1 * (g[0] * x1 + g[1] * y1 + g[2] * z1);
  }

  let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 >= 0) {
    t2 *= t2;
    const g = GRAD3[gi2];
    n2 = t2 * t2 * (g[0] * x2 + g[1] * y2 + g[2] * z2);
  }

  let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 >= 0) {
    t3 *= t3;
    const g = GRAD3[gi3];
    n3 = t3 * t3 * (g[0] * x3 + g[1] * y3 + g[2] * z3);
  }

  // Scale to [-1, 1]
  return 32.0 * (n0 + n1 + n2 + n3);
}

// Export capitalized alias matching SimplexNoise3D specification
export const SimplexNoise3D = simplexNoise3D;

/**
 * Fractal Brownian Motion in 2D using Simplex Noise.
 */
export function fbm2D(
  x: number,
  y: number,
  octaves: number = 4,
  lacunarity: number = 2.0,
  gain: number = 0.5
): number {
  let total = 0;
  let frequency = 1.0;
  let amplitude = 1.0;
  let maxAmp = 0;

  for (let i = 0; i < octaves; i++) {
    total += simplexNoise2D(x * frequency, y * frequency) * amplitude;
    maxAmp += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }

  return maxAmp > 0 ? total / maxAmp : total;
}

/**
 * Fractal Brownian Motion in 3D using Simplex Noise.
 */
export function fbm3D(
  x: number,
  y: number,
  z: number,
  octaves: number = 4,
  lacunarity: number = 2.0,
  gain: number = 0.5
): number {
  let total = 0;
  let frequency = 1.0;
  let amplitude = 1.0;
  let maxAmp = 0;

  for (let i = 0; i < octaves; i++) {
    total += simplexNoise3D(x * frequency, y * frequency, z * frequency) * amplitude;
    maxAmp += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }

  return maxAmp > 0 ? total / maxAmp : total;
}

/**
 * Ridged multifractal 2D noise producing sharp mountain-like ridges.
 */
export function ridged2D(
  x: number,
  y: number,
  octaves: number = 4,
  lacunarity: number = 2.0,
  gain: number = 0.5
): number {
  let total = 0;
  let frequency = 1.0;
  let amplitude = 1.0;
  let weight = 1.0;
  let maxAmp = 0;

  for (let i = 0; i < octaves; i++) {
    let signal = 1.0 - Math.abs(simplexNoise2D(x * frequency, y * frequency));
    signal *= signal;
    signal *= weight;
    weight = Math.min(1.0, Math.max(0.0, signal * 2.0));

    total += signal * amplitude;
    maxAmp += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }

  return maxAmp > 0 ? total / maxAmp : total;
}

/**
 * Voronoi cell computation result.
 */
export interface VoronoiResult {
  dist1: number;
  dist2: number;
  cellId: number;
}

/**
 * Voronoi / cellular noise returning closest cell distances (F1, F2) and closest cell ID.
 */
export function voronoi2D(x: number, y: number): VoronoiResult {
  const xi = Math.floor(x);
  const yi = Math.floor(y);

  let dist1 = Infinity;
  let dist2 = Infinity;
  let cellId = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const cx = xi + dx;
      const cy = yi + dy;

      // Deterministic 32-bit hash based on cell coordinates
      let h = (Math.imul(cx, 374761393) + Math.imul(cy, 668265263) + (SEED * 1013904223)) | 0;
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      const id = (h ^ (h >>> 16)) >>> 0;

      // Jittered feature point in [0, 1)
      const px = (id & 0xffff) / 65536.0;
      const py = ((id >>> 16) & 0xffff) / 65536.0;

      const fx = cx + px;
      const fy = cy + py;
      const dist = Math.hypot(fx - x, fy - y);

      if (dist < dist1) {
        dist2 = dist1;
        dist1 = dist;
        cellId = id;
      } else if (dist < dist2) {
        dist2 = dist;
      }
    }
  }

  return { dist1, dist2, cellId };
}
