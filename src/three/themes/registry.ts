import {MARKET_METADATA} from './market/config';
import * as THREE from 'three';
import { ThemeId, ThemeInstance, ThemeMetadata } from '../core/types';
import { GARDEN_METADATA } from './garden/config';
import {LANTERN_METADATA} from './lantern/config';
import { BEACH_METADATA } from './beach/config';

export const THEME_METADATA_MAP: Record<ThemeId, ThemeMetadata<any>> = {
  market:MARKET_METADATA,
  garden: GARDEN_METADATA,
  beach: BEACH_METADATA,
  lantern:LANTERN_METADATA,
};

export const THEME_LIST: ThemeMetadata<any>[] = [GARDEN_METADATA, BEACH_METADATA,LANTERN_METADATA,MARKET_METADATA];

/**
 * Resilient dynamic import helper with retry and stale-chunk recovery.
 * Handles "Failed to fetch dynamically imported module" errors that occur when
 * new deployments produce new chunk hashes while a client still has stale HTML cached.
 */
export async function loadThemeWithRetry<T>(
  importFn: () => Promise<T>,
  retries = 2,
  delayMs = 600
): Promise<T> {
  try {
    return await importFn();
  } catch (err: any) {
    const errorMsg = String(err?.message || err || '');
    const isDynamicImportError =
      errorMsg.includes('dynamically imported module') ||
      errorMsg.includes('Failed to fetch') ||
      errorMsg.includes('Importing a module script failed');

    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return loadThemeWithRetry(importFn, retries - 1, delayMs * 1.5);
    }

    if (typeof window !== 'undefined' && isDynamicImportError) {
      const reloadKey = 'chillax_chunk_reload_attempted';
      const lastAttempt = sessionStorage.getItem(reloadKey);
      const now = Date.now();
      // Auto-reload once within 10 seconds to fetch fresh index.html with new chunk hashes
      if (!lastAttempt || now - Number(lastAttempt) > 10000) {
        sessionStorage.setItem(reloadKey, String(now));
        window.location.reload();
        return new Promise<never>(() => {});
      }
    }

    const enhancedError = new Error(
      isDynamicImportError
        ? 'Phiên bản ứng dụng đã có cập nhật mới trên máy chủ hoặc mất kết nối mạng. Vui lòng tải lại trang (F5) để tiếp tục.'
        : (err?.message || 'Lỗi khi tải module chủ đề 3D')
    );
    throw enhancedError;
  }
}

export const THEME_LOADERS: Record<
  ThemeId,
  (renderer: THREE.WebGLRenderer) => Promise<ThemeInstance<any>>
> = {
  market:async(renderer)=>{const mod=await loadThemeWithRetry(()=>import('./market/index'));return new mod.MarketTheme(renderer)},
  lantern:async(renderer)=>{const mod=await loadThemeWithRetry(()=>import('./lantern/index'));return new mod.LanternTheme(renderer)},
  garden: async (renderer) => {
    const mod = await loadThemeWithRetry(() => import('./garden/index'));
    return new mod.GardenTheme(renderer);
  },
  beach: async (renderer) => {
    const mod = await loadThemeWithRetry(() => import('./beach/index'));
    return new mod.BeachTheme(renderer);
  },
};
