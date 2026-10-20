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
  private pendingStatesByToken = new Map<number, { themeId: ThemeId; state: ThemeState<any> }>();
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

  getPendingState(themeId?: ThemeId): ThemeState<any> | undefined {
    const entry = this.pendingStatesByToken.get(this.currentSwitchToken);
    if (entry && (!themeId || entry.themeId === themeId)) {
      return { ...entry.state };
    }
    return undefined;
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
   * Update state with strict boundaries and request-scoped pending buffering.
   * - If there is an in-flight request, updates matching requestedThemeId (or unspecific) are buffered into pending state.
   * - If an active instance exists, updates matching activeThemeId (or unspecific) are applied directly.
   * - Foreign state never leaks to active theme or unmatching pending requests.
   */
  updateState(
    themeIdOrPatch: ThemeId | Partial<ThemeState<any>>,
    maybePatch?: Partial<ThemeState<any>>
  ): void {
    let patchThemeId: ThemeId | undefined;
    let stateOrPatch: Partial<ThemeState<any>>;

    if (typeof themeIdOrPatch === 'string') {
      patchThemeId = themeIdOrPatch as ThemeId;
      stateOrPatch = maybePatch || {};
    } else {
      stateOrPatch = themeIdOrPatch || {};
      patchThemeId = (stateOrPatch as any).themeId as ThemeId | undefined;
    }

    // 1. Buffer for in-flight request (even if requestedThemeId === activeThemeId)
    if (this.requestedThemeId && (!patchThemeId || patchThemeId === this.requestedThemeId)) {
      const pendingEntry = this.pendingStatesByToken.get(this.currentSwitchToken);
      if (pendingEntry) {
        pendingEntry.state = { ...pendingEntry.state, ...stateOrPatch };
      }
    }

    // 2. Apply to current active instance if themeId matches active theme
    if (this.activeTheme && this.activeThemeState) {
      if (!patchThemeId || patchThemeId === this.activeThemeId) {
        const prevState = { ...this.activeThemeState };
        Object.assign(this.activeThemeState, stateOrPatch);

        if (stateOrPatch.quality && stateOrPatch.quality !== prevState.quality) {
          this.setQuality(stateOrPatch.quality);
        }

        this.activeTheme.applyState(this.activeThemeState);
      }
    }
  }

  /**
   * Asynchronously switches active diorama theme with full transactional rollback.
   * If any mount, camera, quality, commit, or state step fails:
   * - The new theme is unmounted and disposed cleanly.
   * - The old theme and its state/camera are fully restored.
   * - activeTheme never points to a disposed instance.
   */
  async switchTheme(
    targetThemeId: ThemeId,
    targetState: ThemeState<any>,
    initialCamera?: SavedCameraState
  ): Promise<SwitchThemeResult> {
    if (this.disposed) return { status: 'cancelled' };

    const switchToken = ++this.currentSwitchToken;
    this.requestedThemeId = targetThemeId;

    // Preserve any existing buffered state for this token or seed with targetState
    const existingEntry = this.pendingStatesByToken.get(switchToken);
    this.pendingStatesByToken.set(switchToken, {
      themeId: targetThemeId,
      state: { ...(existingEntry?.state ?? {}), ...targetState },
    });
    this.options.onThemeLoadingChange?.(true, null);

    // Snapshot existing active theme for transactional rollback
    const oldTheme = this.activeTheme;
    const oldThemeId = this.activeThemeId;
    const oldThemeState = this.activeThemeState ? { ...this.activeThemeState } : null;

    let newTheme: TTheme | null = null;
    let newThemeMounted = false;
    let newThemeDisposed = false;

    const disposeNewTheme = () => {
      if (newTheme && !newThemeDisposed) {
        newThemeDisposed = true;
        try {
          newTheme.dispose();
        } catch (e) {
          console.warn('Error disposing new theme:', e);
        }
      }
    };

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
        disposeNewTheme();
        this.pendingStatesByToken.delete(switchToken);
        return { status: 'cancelled' };
      }

      await loadedTheme.init();

      if (switchToken !== this.currentSwitchToken || this.disposed) {
        disposeNewTheme();
        this.pendingStatesByToken.delete(switchToken);
        return { status: 'cancelled' };
      }

      // Handover Transaction Block
      try {
        const reqEntry = this.pendingStatesByToken.get(switchToken);
        const latestState = reqEntry ? reqEntry.state : targetState;

        loadedTheme.applyState(latestState);
        if (loadedTheme.setQuality) {
          loadedTheme.setQuality(this.currentQuality);
        }

        if (switchToken !== this.currentSwitchToken || this.disposed) {
          disposeNewTheme();
          this.pendingStatesByToken.delete(switchToken);
          return { status: 'cancelled' };
        }

        // Unmount old theme without disposing yet
        if (oldTheme) {
          this.options.onUnmountTheme?.(oldTheme);
        }

        // Mount new theme
        this.options.onMountTheme?.(loadedTheme);
        newThemeMounted = true;

        // Restore camera
        this.options.onRestoreCamera?.(targetThemeId, loadedTheme, latestState, initialCamera);

        // Apply quality
        this.options.onApplyQuality?.(this.currentQuality);

        // Commit callback
        this.options.onCommitTheme?.(targetThemeId, loadedTheme, latestState);

        // Final cancellation check before retiring old theme
        if (switchToken !== this.currentSwitchToken || this.disposed) {
          if (newThemeMounted) {
            try { this.options.onUnmountTheme?.(loadedTheme); } catch {}
          }
          disposeNewTheme();

          if (oldTheme) {
            try { this.options.onMountTheme?.(oldTheme); } catch {}
          }
          this.pendingStatesByToken.delete(switchToken);
          return { status: 'cancelled' };
        }

        // Transaction successful: retire old theme cleanly
        if (oldTheme) {
          try { oldTheme.dispose(); } catch (e) {
            console.warn('Error disposing retired theme:', e);
          }
        }

        // Commit active references
        this.activeTheme = loadedTheme;
        this.activeThemeId = targetThemeId;
        this.activeThemeState = { ...latestState };

        if (switchToken === this.currentSwitchToken) {
          this.requestedThemeId = null;
          this.pendingStatesByToken.delete(switchToken);
          this.options.onThemeLoadingChange?.(false, null);
        }

        return { status: 'success' };
      } catch (handoverError: any) {
        // Rollback transaction upon failure during handover
        if (newThemeMounted) {
          try { this.options.onUnmountTheme?.(loadedTheme); } catch {}
        }
        disposeNewTheme();

        if (oldTheme) {
          try {
            this.options.onMountTheme?.(oldTheme);
            // Retain the latest state of the active theme, including updates that arrived while in-flight
            const latestOldState = this.activeThemeState ?? oldThemeState;
            if (latestOldState) {
              oldTheme.applyState(latestOldState);
            }
            this.activeTheme = oldTheme;
            this.activeThemeId = oldThemeId;
            this.activeThemeState = latestOldState ? { ...latestOldState } : null;
            this.options.onRestoreCamera?.(oldThemeId, oldTheme, latestOldState || targetState);
          } catch (rollbackErr) {
            console.error('Fatal: Rollback failed:', rollbackErr);
            try { this.options.onUnmountTheme?.(oldTheme); } catch {}
            try { oldTheme.dispose(); } catch {}
            this.activeTheme = null;
            this.activeThemeState = null;
          }
        } else {
          this.activeTheme = null;
          this.activeThemeState = null;
        }

        throw handoverError;
      }
    } catch (err: any) {
      if (newTheme && newTheme !== this.activeTheme) {
        disposeNewTheme();
      }

      // Outdated requests that fail must never mutate requestedThemeId or pending state of current requests!
      if (switchToken !== this.currentSwitchToken || this.disposed) {
        this.pendingStatesByToken.delete(switchToken);
        return { status: 'cancelled' };
      }

      this.requestedThemeId = null;
      this.pendingStatesByToken.delete(switchToken);
      const errorObj = err instanceof Error ? err : new Error(String(err));
      this.options.onThemeLoadingChange?.(false, errorObj);
      return { status: 'failed', error: errorObj };
    }
  }

  dispose(): void {
    this.disposed = true;
    this.currentSwitchToken++;
    this.requestedThemeId = null;
    this.pendingStatesByToken.clear();

    if (this.activeTheme) {
      this.options.onUnmountTheme?.(this.activeTheme);
      try { this.activeTheme.dispose(); } catch {}
      this.activeTheme = null;
    }
    this.activeThemeState = null;
  }
}
