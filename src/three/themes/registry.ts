import * as THREE from 'three';
import { ThemeId, ThemeInstance, ThemeMetadata } from '../core/types';
import { GARDEN_METADATA } from './garden/config';
import { PHUQUOC_METADATA } from './phuquoc/config';

export const THEME_METADATA_MAP: Record<ThemeId, ThemeMetadata<any>> = {
  garden: GARDEN_METADATA,
  phuquoc: PHUQUOC_METADATA,
};

export const THEME_LIST: ThemeMetadata<any>[] = [GARDEN_METADATA, PHUQUOC_METADATA];

export const THEME_LOADERS: Record<
  ThemeId,
  (renderer: THREE.WebGLRenderer) => Promise<ThemeInstance<any>>
> = {
  garden: async (renderer) => {
    const mod = await import('./garden/index');
    return new mod.GardenTheme(renderer);
  },
  phuquoc: async (renderer) => {
    const mod = await import('./phuquoc/index');
    return new mod.PhuQuocTheme(renderer);
  },
};
