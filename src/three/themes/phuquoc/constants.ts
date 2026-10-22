import * as THREE from 'three';
import { Quality, TideLevel } from '../../core/types';

export type { Quality, TideLevel };

// Diorama dimensions
export const DIORAMA_WIDTH = 20;
export const DIORAMA_DEPTH = 16;
export const DIORAMA_HEIGHT = 6;
export const TERRAIN_RES = 240;
export const WATER_RES = 256;
export const SEED = 88;

// Sea Levels & Tides
export const SEA_LEVEL_BASE = 0.30;
export const SEA_LEVEL_LOW = 0.16;
export const SEA_LEVEL_HIGH = 0.44;

export type PhuQuocSeason = 'dry' | 'rainy';

export interface PhuQuocState {
  timeOfDay: number; // 0-24, default 17:45 (17.75)
  season: PhuQuocSeason;
  tide: TideLevel;
  rippleStrength: number;
  flowSpeed: number; // swell / wave speed
  windStrength: number;
  autoRotate: boolean;
  quality: Quality;
}

export const DEFAULT_PHUQUOC_STATE: PhuQuocState = {
  timeOfDay: 17.75, // 17:45 sunset
  season: 'dry',
  tide: 'high',
  rippleStrength: 0.5,
  flowSpeed: 0.45,
  windStrength: 0.35,
  autoRotate: false,
  quality: 'high',
};

// Tropical Bay Color Palette
export const PHUQUOC_COLORS = {
  sand: {
    dry: new THREE.Color(0xf2e3c6), // Pale golden dry sand
    wet: new THREE.Color(0xc7ab80), // Darker damp sand near waterline
    deep: new THREE.Color(0x9e855c), // Submerged seabed sand
  },
  rock: {
    graniteLight: new THREE.Color(0xa39d94),
    graniteDark: new THREE.Color(0x6e6860),
    graniteWarm: new THREE.Color(0xbab2a4),
  },
  water: {
    shallow: new THREE.Color(0x38d9c0), // Crystal turquoise
    deep: new THREE.Color(0x0e6b7a), // Deep emerald/teal
    foam: new THREE.Color(0xf4ffff), // Surf wave foam
  },
  wood: {
    thatch: new THREE.Color(0xbca371), // Dried golden palm thatch (mái lá)
    thatchWet: new THREE.Color(0x826c45), // Rain-soaked darker thatch
    bamboo: new THREE.Color(0xd5ba82), // Light bamboo stalks
    weathered: new THREE.Color(0x736357), // Weathered jetty timber
    deck: new THREE.Color(0x9a8062),
  },
  boats: {
    thungBamboo: new THREE.Color(0xd8be85),
    thungPitch: new THREE.Color(0x222222), // Tar / pitch waterproof coating
    thungRimBlue: new THREE.Color(0x1976d2),
    gheHull: new THREE.Color(0x26a69a), // Vietnamese turquoise fishing boat
    gheWood: new THREE.Color(0x8d5b2d),
    gheRedTrim: new THREE.Color(0xd32f2f),
    gheYellowEye: new THREE.Color(0xffca28),
  },
  vegetation: {
    palmTrunk: new THREE.Color(0x6b5744),
    palmFrond: new THREE.Color(0x2e7d32),
    palmFrondLight: new THREE.Color(0x4caf50),
    casuarina: new THREE.Color(0x2d5a37), // Phi lao deep blue-green
  },
  architecture: {
    lanternWarm: new THREE.Color(0xffaa33),
    lanternGlow: new THREE.Color(0xff8811),
    supBoard: new THREE.Color(0x00bcd4),
    umbrellaStripe1: new THREE.Color(0xff5722),
    umbrellaStripe2: new THREE.Color(0xffffff),
  },
  base: new THREE.Color(0xf5ede0), // Elegant diorama slab pedestal
};
