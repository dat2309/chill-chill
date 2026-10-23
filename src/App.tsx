import React, { useState, useCallback, useRef, useEffect } from 'react';
import Scene from './components/Scene';
import UI from './components/UI';
import { ThemeId, ThemeState, Quality, SavedCameraState } from './three/core/types';
import {
  loadPersistedAppState,
  savePersistedAppState,
  getThemeDefaultState,
  DEFAULT_GARDEN_STATE,
  DEFAULT_BEACH_STATE,
} from './three/core/storage';
import { SceneManager } from './three/core/SceneManager';
import { THEME_METADATA_MAP } from './three/themes/registry';

export default function App() {
  // Load persisted multi-theme state
  const [persisted, setPersisted] = useState(() => {
    const loaded = loadPersistedAppState();
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const themeParam = urlParams.get('theme');
      if (themeParam === 'garden' || themeParam === 'beach' || themeParam === 'phuquoc') {
        loaded.activeThemeId = themeParam === 'phuquoc' ? 'beach' : themeParam;
      }
      const cameraParam = urlParams.get('camera');
      if (cameraParam === 'top') {
        const topCam: SavedCameraState = { position: [0.001, 38, 0], target: [0, 0, 0], zoom: 1 };
        loaded.gardenState.cameraState = topCam;
        loaded.beachState.cameraState = topCam;
      } else if (cameraParam === 'side') {
        const sideCam: SavedCameraState = { position: [35, 8, 0], target: [0, 0, 0], zoom: 1 };
        loaded.gardenState.cameraState = sideCam;
        loaded.beachState.cameraState = sideCam;
      } else if (cameraParam === 'default') {
        delete loaded.gardenState.cameraState;
        delete loaded.beachState.cameraState;
        if (loaded.camera) {
          delete loaded.camera.garden;
          delete loaded.camera.beach;
          delete (loaded.camera as Record<string, any>).phuquoc;
        }
      }
    }
    return loaded;
  });
  const [requestedThemeId, setRequestedThemeId] = useState<ThemeId | null>(null);
  const [loading, setLoading] = useState(true);
  const [themeLoading, setThemeLoading] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [fps, setFps] = useState(60);

  const managerRef = useRef<SceneManager | null>(null);

  // Active theme is strictly what is currently committed and active in 3D
  const activeThemeId = persisted.activeThemeId;
  const rawThemeState =
    activeThemeId === 'garden' ? persisted.gardenState : persisted.beachState;
  const currentThemeState = {
    ...rawThemeState,
    quality: persisted.shared.quality,
  };

  // Target theme for Scene component (in-flight request or committed active)
  const targetThemeId = requestedThemeId || activeThemeId;
  const rawTargetThemeState =
    targetThemeId === 'garden' ? persisted.gardenState : persisted.beachState;
  const sceneThemeState = {
    ...rawTargetThemeState,
    quality: persisted.shared.quality,
  };

  // Persist state on change
  useEffect(() => {
    savePersistedAppState(persisted);
  }, [persisted]);

  // Update document title per active theme
  useEffect(() => {
    const meta = THEME_METADATA_MAP[activeThemeId];
    if (meta) {
      document.title = `${meta.name} — Chillax Diorama Built from Math`;
    }
  }, [activeThemeId]);

  const handleQualityChange = useCallback((quality: Quality) => {
    setPersisted((prev) => ({
      ...prev,
      shared: {
        ...prev.shared,
        quality,
      },
    }));
    managerRef.current?.setQuality(quality);
  }, []);

  // Handle active theme state change: strip quality so it never pollutes theme-specific states
  const handleChange = useCallback(
    (patch: Partial<ThemeState<any>>) => {
      const { quality, ...themePatch } = patch;
      if (quality) {
        handleQualityChange(quality);
      }
      setPersisted((prev) => {
        if (prev.activeThemeId === 'garden') {
          return {
            ...prev,
            gardenState: {
              ...prev.gardenState,
              ...themePatch,
            },
          };
        } else {
          return {
            ...prev,
            beachState: {
              ...prev.beachState,
              ...themePatch,
            },
          };
        }
      });
    },
    [handleQualityChange]
  );

  const handleCameraChange = useCallback((themeId: ThemeId, camera: SavedCameraState) => {
    setPersisted((prev) => {
      const nextCamera = { ...prev.camera, [themeId]: camera };
      if (themeId === 'garden') {
        return {
          ...prev,
          camera: nextCamera,
          gardenState: { ...prev.gardenState, cameraState: camera },
        };
      } else {
        return {
          ...prev,
          camera: nextCamera,
          beachState: { ...prev.beachState, cameraState: camera },
        };
      }
    });
  }, []);

  // Theme-isolated reset: only resets the ACTIVE theme to its default state
  const handleReset = useCallback(() => {
    const defaultState = getThemeDefaultState(activeThemeId);
    setPersisted((prev) => {
      const nextCamera = { ...prev.camera };
      delete nextCamera[activeThemeId];
      if (prev.activeThemeId === 'garden') {
        return {
          ...prev,
          camera: nextCamera,
          gardenState: { ...DEFAULT_GARDEN_STATE, cameraState: undefined },
        };
      } else {
        return {
          ...prev,
          camera: nextCamera,
          beachState: { ...DEFAULT_BEACH_STATE, cameraState: undefined },
        };
      }
    });
    managerRef.current?.resetCurrentTheme(defaultState);
  }, [activeThemeId]);

  // Request theme switch: does NOT immediately overwrite persisted.activeThemeId
  const handleSelectTheme = useCallback(
    (newThemeId: ThemeId) => {
      if (newThemeId === activeThemeId && !themeError) return;
      setRequestedThemeId(newThemeId);
      setThemeLoading(true);
      setThemeError(null);
    },
    [activeThemeId, themeError]
  );

  const handleThemeSuccess = useCallback((committedThemeId: ThemeId) => {
    setPersisted((prev) => ({
      ...prev,
      activeThemeId: committedThemeId,
    }));
    setRequestedThemeId(null);
    setLoading(false);
    setThemeLoading(false);
    setThemeError(null);
  }, []);

  const handleReady = useCallback(() => {
    setLoading(false);
    setThemeLoading(false);
  }, []);

  const handleWebglError = useCallback((msg: string) => {
    setWebglError(msg);
    setLoading(false);
    setThemeLoading(false);
  }, []);

  const handleThemeError = useCallback((err: Error) => {
    setLoading(false);
    setThemeLoading(false);
    setThemeError(err.message || 'Lỗi khi tải cảnh 3D');
  }, []);

  const handleThemeLoadingChange = useCallback((isLoading: boolean, err?: Error | null) => {
    setThemeLoading(isLoading);
    if (err) {
      setLoading(false);
      setThemeError(err.message || 'Lỗi khi tải cảnh 3D');
    } else {
      setThemeError(null);
    }
  }, []);

  const handleRetryTheme = useCallback(() => {
    setThemeError(null);
    setThemeLoading(true);
    const targetId = requestedThemeId || activeThemeId;
    const targetState =
      targetId === 'garden'
        ? { ...persisted.gardenState, quality: persisted.shared.quality }
        : { ...persisted.beachState, quality: persisted.shared.quality };

    managerRef.current?.switchTheme(targetId, targetState);
  }, [requestedThemeId, activeThemeId, persisted]);

  const handleCancelThemeError = useCallback(() => {
    setRequestedThemeId(null);
    setThemeError(null);
    setThemeLoading(false);
  }, []);

  const handleFps = useCallback((f: number) => {
    setFps(f);
  }, []);

  return (
    <div
      className="app-container"
      onPointerEnter={() => managerRef.current?.setPointerOnUI(false)}
    >
      <Scene
        themeId={targetThemeId}
        themeState={sceneThemeState}
        initialQuality={persisted.shared.quality}
        onReady={handleReady}
        onWebglError={handleWebglError}
        onThemeError={handleThemeError}
        onThemeSuccess={handleThemeSuccess}
        onFps={handleFps}
        onQualityChange={handleQualityChange}
        onThemeLoadingChange={handleThemeLoadingChange}
        onCameraChange={handleCameraChange}
        managerRef={managerRef}
      />
      <div
        onPointerEnter={() => managerRef.current?.setPointerOnUI(true)}
        onPointerLeave={() => managerRef.current?.setPointerOnUI(false)}
      >
        <UI
          activeThemeId={activeThemeId}
          requestedThemeId={requestedThemeId}
          state={currentThemeState}
          quality={persisted.shared.quality}
          onChange={handleChange}
          onQualityChange={handleQualityChange}
          onReset={handleReset}
          onSelectTheme={handleSelectTheme}
          fps={fps}
          loading={loading}
          themeLoading={themeLoading}
          themeError={themeError}
          onRetryTheme={handleRetryTheme}
          onCancelThemeError={handleCancelThemeError}
          webglError={webglError}
        />
      </div>
    </div>
  );
}
