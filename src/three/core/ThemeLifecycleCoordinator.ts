import {
  ThemeId,
  ThemeInstance,
  ThemeState,
  Quality,
  SwitchThemeResult,
  SavedCameraState,
} from './types';
import { THEME_LOADERS } from '../themes/registry';

export interface ThemeLifecycleCoordinatorOptions<TTheme extends ThemeInstance<any> = ThemeInstance<any>> {
  loaderMap?: Record<ThemeId, (renderer: any) => Promise<TTheme>>;
  renderer?: any;
  initialQuality?: Quality;
  initialThemeId?: ThemeId;
  onThemeLoadingChange?: (loading: boolean, error?: Error | null) => void;
  onMountTheme?: (theme: TTheme) => void;
  onUnmountTheme?: (theme: TTheme) => void;
  onCommitTheme?: (themeId: ThemeId, theme: TTheme, state: ThemeState<any>) => void;
  onRestoreCamera?: (
    themeId: ThemeId,
    theme: TTheme,
    state: ThemeState<any>,
    initialCamera?: SavedCameraState
  ) => void;
  onApplyQuality?: (quality: Quality) => void;
}

export class ThemeLifecycleCoordinator<TTheme extends ThemeInstance<any> = ThemeInstance<any>> {
  private activeTheme: TTheme | null = null;
  private activeThemeId: ThemeId;
  private activeThemeState: ThemeState<any> | null = null;

  private requestedThemeId: ThemeId | null = null;
  private pendingStates = new Map<ThemeId, ThemeState<any>>();
  private currentSwitchToken = 0;
  private currentQuality: Quality = 'high';
  private disposed = false;

  private options: ThemeLifecycleCoordinatorOptions<TTheme>;

  constructor(options: ThemeLifecycleCoordinatorOptions<TTheme> = {}) {
    this.options = options;
    this.activeThemeId = options.initialThemeId ?? 'garden';
    this.currentQuality = options.initialQuality ?? 'high';
  }

  getActiveThemeId(): ThemeId {
    return this.activeThemeId;
  }

  getRequestedThemeId(): ThemeId | null {
    return this.requestedThemeId;
  }

  getActiveTheme(): TTheme | null {
    return this.activeTheme;
  }

  getActiveThemeState(): ThemeState<any> | null {
    return this.activeThemeState ? { ...this.activeThemeState } : null;
  }

  getPendingState(themeId: ThemeId): ThemeState<any> | undefined {
    const s = this.pendingStates.get(themeId);
    return s ? { ...s } : undefined;
  }

  getCurrentQuality(): Quality {
    return this.currentQuality;
  }

  getCurrentSwitchToken(): number {
    return this.currentSwitchToken;
  }

  isDisposed(): boolean {
    return this.disposed;
  }

  setQuality(quality: Quality): void {
    this.currentQuality = quality;
    this.options.onApplyQuality?.(quality);
    if (this.activeTheme?.setQuality) {
      this.activeTheme.setQuality(quality);
    }
  }

  /**
   * Update active theme state with strict runtime themeId boundary checks.
   * If state update belongs to an in-flight requested theme, it is safely buffered in pendingStates.
   */
  updateState(stateOrPatch: Partial<ThemeState<any>>): void {
    const targetThemeId = (stateOrPatch as any).themeId as ThemeId | undefined;

    // Boundary check: foreign state never penetrates active theme
    if (targetThemeId && targetThemeId !== this.activeThemeId) {
      if (targetThemeId === this.requestedThemeId) {
        const cur = this.pendingStates.get(targetThemeId);
        this.pendingStates.set(targetThemeId, { ...(cur ?? {}), ...stateOrPatch } as any);
      }
      return;
    }

    if (!this.activeTheme || !this.activeThemeState) return;

    const prevState = { ...this.activeThemeState };
    Object.assign(this.activeThemeState, stateOrPatch);

    if (stateOrPatch.quality && stateOrPatch.quality !== prevState.quality) {
      this.setQuality(stateOrPatch.quality);
    }

    this.activeTheme.applyState(this.activeThemeState);
  }

  /**
   * Asynchronously switches active diorama theme with strict token-based cancellation,
   * preserving pending updates and guaranteeing atomic commits with zero frame loss.
   */
  async switchTheme(
    targetThemeId: ThemeId,
    targetState: ThemeState<any>,
    initialCamera?: SavedCameraState
  ): Promise<SwitchThemeResult> {
    if (this.disposed) return { status: 'cancelled' };

    const switchToken = ++this.currentSwitchToken;
    this.requestedThemeId = targetThemeId;

    // Merge targetState with any already buffered pending state
    const existingPending = this.pendingStates.get(targetThemeId);
    this.pendingStates.set(targetThemeId, { ...(existingPending ?? {}), ...targetState });
    this.options.onThemeLoadingChange?.(true, null);

    let newTheme: TTheme | null = null;
    try {
      const loader = this.options.loaderMap?.[targetThemeId] ?? (THEME_LOADERS[targetThemeId] as any);
      if (!loader) {
        throw new Error(`Unknown theme loader for ID: ${targetThemeId}`);
      }

      const loadedTheme: TTheme = await loader(this.options.renderer);
      if (!loadedTheme) {
        throw new Error(`Theme loader for ID ${targetThemeId} returned null or undefined`);
      }
      newTheme = loadedTheme;

      if (switchToken !== this.currentSwitchToken || this.disposed) {
        try { loadedTheme.dispose(); } catch {}
        return { status: 'cancelled' };
      }

      await loadedTheme.init();

      if (switchToken !== this.currentSwitchToken || this.disposed) {
        try { loadedTheme.dispose(); } catch {}
        return { status: 'cancelled' };
      }

      const latestState = this.pendingStates.get(targetThemeId) ?? targetState;
      loadedTheme.applyState(latestState);
      if (loadedTheme.setQuality) {
        loadedTheme.setQuality(this.currentQuality);
      }

      if (switchToken !== this.currentSwitchToken || this.disposed) {
        try { loadedTheme.dispose(); } catch {}
        return { status: 'cancelled' };
      }

      // Atomically unmount and dispose old theme
      if (this.activeTheme) {
        this.options.onUnmountTheme?.(this.activeTheme);
        try { this.activeTheme.dispose(); } catch {}
        this.activeTheme = null;
      }

      // Commit new active theme
      this.activeTheme = loadedTheme;
      this.activeThemeId = targetThemeId;
      this.activeThemeState = { ...latestState };

      this.options.onMountTheme?.(loadedTheme);
      this.options.onCommitTheme?.(targetThemeId, loadedTheme, latestState);
      this.options.onRestoreCamera?.(targetThemeId, loadedTheme, latestState, initialCamera);
      this.options.onApplyQuality?.(this.currentQuality);

      if (switchToken === this.currentSwitchToken) {
        this.requestedThemeId = null;
        this.pendingStates.delete(targetThemeId);
        this.options.onThemeLoadingChange?.(false, null);
      }

      return { status: 'success' };
    } catch (err: any) {
      if (newTheme) {
        try { newTheme.dispose(); } catch {}
      }

      // Crucial: Old/outdated request failures must never mutate requestedThemeId or pending state of current requests!
      if (switchToken !== this.currentSwitchToken || this.disposed) {
        return { status: 'cancelled' };
      }

      this.requestedThemeId = null;
      this.pendingStates.delete(targetThemeId);
      const errorObj = err instanceof Error ? err : new Error(String(err));
      this.options.onThemeLoadingChange?.(false, errorObj);
      return { status: 'failed', error: errorObj };
    }
  }

  dispose(): void {
    this.disposed = true;
    this.currentSwitchToken++;
    this.requestedThemeId = null;
    this.pendingStates.clear();

    if (this.activeTheme) {
      this.options.onUnmountTheme?.(this.activeTheme);
      try { this.activeTheme.dispose(); } catch {}
      this.activeTheme = null;
    }
    this.activeThemeState = null;
  }
}
