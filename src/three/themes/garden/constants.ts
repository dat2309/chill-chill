import * as THREE from 'three';

// Diorama dimensions
export const DIORAMA_WIDTH = 20;
export const DIORAMA_DEPTH = 16;
export const DIORAMA_HEIGHT = 5.5;
export const TERRAIN_RES = 240;
export const WATER_RES = 256;
export const SEED = 42;

import { STREAM_BOUNDS, BASE_WATER_LEVEL, TIDE_OFFSETS, getTideOffset } from './streamProfile';

// Layout zones (world coordinates, origin at center of diorama base)
export const STREAM_Z_START = STREAM_BOUNDS.minZ; // -7.5 (mountain gorge source)
export const STREAM_Z_END = STREAM_BOUNDS.maxZ; // 8.0 (front edge)
export const STREAM_CENTER_X = 1.8;

export const GLAMPING_CENTER_X = -3.5;
export const GLAMPING_CENTER_Z = -1.2;
export const PLATEAU_HEIGHT = 1.35; // Lowered from 2.05 to create gentle, organic valley

export const WATER_LEVEL = BASE_WATER_LEVEL; // 0.28 (base elevation in foreground basin)
export const WATER_LEVEL_LOW = BASE_WATER_LEVEL + TIDE_OFFSETS.low; // 0.19
export const WATER_LEVEL_HIGH = BASE_WATER_LEVEL + TIDE_OFFSETS.high; // 0.35

export { STREAM_BOUNDS, BASE_WATER_LEVEL, TIDE_OFFSETS, getTideOffset };

export const BASE_BOTTOM_Y = -0.70; // Sleek, thin diorama slab (reduced from -1.50)
export const WALL_CUTOFF_Y = -0.52;

/**
 * Returns a smooth factor in [0, 1] representing nightfall:
 * - 0.0 during daytime (06:00 - 18:00)
 * - Rises smoothly from 18:00 to 21:00 (sunset -> night)
 * - 1.0 throughout deep night (21:00 - 04:30)
 * - Fades smoothly from 04:30 to 06:00 (dawn -> sunrise)
 */
export function getNightFactor(timeOfDay: number): number {
  const t = ((timeOfDay % 24) + 24) % 24;
  if (t >= 6.0 && t <= 18.0) {
    return 0.0;
  }
  if (t > 18.0 && t < 21.0) {
    const s = (t - 18.0) / 3.0;
    return s * s * (3.0 - 2.0 * s);
  }
  if (t >= 21.0 || t <= 4.5) {
    return 1.0;
  }
  // Dawn: 4.5 to 6.0
  const s = (6.0 - t) / 1.5;
  return s * s * (3.0 - 2.0 * s);
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type TideLevel = 'low' | 'high';
export type Quality = 'low' | 'medium' | 'high';

export interface SceneState {
  timeOfDay: number; // 0-24 (default 16.5 = 16:30)
  season: Season;
  tide: TideLevel;
  rippleStrength: number;
  flowSpeed: number;
  windStrength: number;
  autoRotate: boolean;
  quality: Quality;
  debugTerrain?: boolean;
}

export const DEFAULT_STATE: SceneState = {
  timeOfDay: 16.5, // 16:30 afternoon golden hour
  season: 'spring',
  tide: 'high',
  rippleStrength: 0.5,
  flowSpeed: 0.5,
  windStrength: 0.3,
  autoRotate: false,
  quality: 'high',
  debugTerrain: false,
};

export interface SeasonPalette {
  canopyPrimary: THREE.Color;
  canopySecondary: THREE.Color;
  pineFoliage: THREE.Color;
  ground: THREE.Color;
  flowerColors: THREE.Color[];
  grassTint: THREE.Color;
  snowAmount: number;
}

export const SEASON_PALETTES: Record<Season, SeasonPalette> = {
  spring: {
    canopyPrimary: new THREE.Color(0x76b240),
    canopySecondary: new THREE.Color(0xa2db50),
    pineFoliage: new THREE.Color(0x387a4c), // Rich vibrant alpine green (never black)
    ground: new THREE.Color(0x739c44),
    flowerColors: [new THREE.Color(0xf48fb1), new THREE.Color(0xffffff), new THREE.Color(0xffeb3b)],
    grassTint: new THREE.Color(0x92cf4f),
    snowAmount: 0.0,
  },
  summer: {
    canopyPrimary: new THREE.Color(0x528b30),
    canopySecondary: new THREE.Color(0x74ad42),
    pineFoliage: new THREE.Color(0x326e44),
    ground: new THREE.Color(0x628740),
    flowerColors: [new THREE.Color(0xef5350), new THREE.Color(0xffd54f), new THREE.Color(0xba68c8)],
    grassTint: new THREE.Color(0x70aa3c),
    snowAmount: 0.0,
  },
  autumn: {
    canopyPrimary: new THREE.Color(0xdf6f1c),
    canopySecondary: new THREE.Color(0xf5a522),
    pineFoliage: new THREE.Color(0x3a6a48),
    ground: new THREE.Color(0x907248),
    flowerColors: [new THREE.Color(0xffb74d), new THREE.Color(0xd84315)],
    grassTint: new THREE.Color(0xaa8c52),
    snowAmount: 0.0,
  },
  winter: {
    canopyPrimary: new THREE.Color(0x5c6a60), // Muted winter deciduous
    canopySecondary: new THREE.Color(0x77877c),
    pineFoliage: new THREE.Color(0x2e583d), // Conifers remain deep evergreen
    ground: new THREE.Color(0x788376), // Muted ground with soil showing
    flowerColors: [],
    grassTint: new THREE.Color(0x869084),
    snowAmount: 0.65, // Selective snow dusting on tops
  },
};

// Procedural Color Palette
export const COLORS = {
  terrain: {
    grass: new THREE.Color(0x739c44),
    grassMeadow: new THREE.Color(0x82b24a),
    rock: new THREE.Color(0x948f88),
    rockDark: new THREE.Color(0x726c64),
    cliffLedge: new THREE.Color(0x9e988e),
    dirt: new THREE.Color(0x9a7b57),
    sand: new THREE.Color(0xcaba94),
    snow: new THREE.Color(0xf6f8fb),
    moss: new THREE.Color(0x557b38),
    strataSoil: new THREE.Color(0x6a4c33),
    strataRock1: new THREE.Color(0x8c867e),
    strataRock2: new THREE.Color(0x6e6860),
  },
  water: {
    shallow: new THREE.Color(0x48d1cc), // Clear mountain turquoise
    deep: new THREE.Color(0x117a70),    // Deep alpine teal
    foam: new THREE.Color(0xf0fbfb),
    bedGravel: new THREE.Color(0x7e786e),
  },
  wood: {
    light: new THREE.Color(0xc7a97a),
    dark: new THREE.Color(0x735230),
    plank: new THREE.Color(0xd5b786),
    beam: new THREE.Color(0x5d3f22),
  },
  architecture: {
    tent: new THREE.Color(0xf6f0e4), // Warm cream dome fabric
    teal: new THREE.Color(0x188074), // Rich teal cabin roof
    cabinWood: new THREE.Color(0x735230),
    windowGlow: new THREE.Color(0xffb547),
    standWood: new THREE.Color(0x825b34),
  },
  base: new THREE.Color(0xf3ece0), // Architectural cream pedestal
};
