import React, { useState, useCallback, useRef, useEffect } from 'react';
import Scene from './components/Scene';
import UI from './components/UI';
import { ThemeId, ThemeState, Quality, SavedCameraState } from './three/core/types';
import {
  loadPersistedAppState,
  savePersistedAppState,
  getThemeDefaultState,
  DEFAULT_GARDEN_STATE,
  DEFAULT_PHUQUOC_STATE,
} from './three/core/storage';
import { SceneManager } from './three/core/SceneManager';
import { THEME_METADATA_MAP } from './three/themes/registry';

export default function App() {
  // Load persisted multi-theme state
  const [persisted, setPersisted] = useState(() => loadPersistedAppState());
  const [loading, setLoading] = useState(true);
  const [themeLoading, setThemeLoading] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [fps, setFps] = useState(60);

  const managerRef = useRef<SceneManager | null>(null);

  const activeThemeId = persisted.activeThemeId;
  const rawThemeState =
    activeThemeId === 'garden' ? persisted.gardenState : persisted.phuquocState;
  const currentThemeState = {
    ...rawThemeState,
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

  // Handle active theme state change
  const handleChange = useCallback((patch: Partial<ThemeState<any>>) => {
    setPersisted((prev) => {
      if (prev.activeThemeId === 'garden') {
        return {
          ...prev,
          gardenState: {
            ...prev.gardenState,
            ...patch,
          },
        };
      } else {
        return {
          ...prev,
          phuquocState: {
            ...prev.phuquocState,
            ...patch,
          },
        };
      }
    });
  }, []);

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
          phuquocState: { ...prev.phuquocState, cameraState: camera },
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
          phuquocState: { ...DEFAULT_PHUQUOC_STATE, cameraState: undefined },
        };
      }
    });
    managerRef.current?.resetCurrentTheme(defaultState);
  }, [activeThemeId]);

  // Theme selection
  const handleSelectTheme = useCallback(
    (newThemeId: ThemeId) => {
      if (newThemeId === activeThemeId) return;
      setThemeLoading(true);
      setThemeError(null);
      setPersisted((prev) => ({
        ...prev,
        activeThemeId: newThemeId,
      }));
    },
    [activeThemeId]
  );

  const handleReady = useCallback(() => {
    setLoading(false);
    setThemeLoading(false);
  }, []);

  const handleError = useCallback((msg: string) => {
    setWebglError(msg);
    setLoading(false);
    setThemeLoading(false);
  }, []);

  const handleThemeLoadingChange = useCallback((isLoading: boolean, err?: Error | null) => {
    setThemeLoading(isLoading);
    if (err) {
      setThemeError(err.message || 'Lỗi khi tải cảnh 3D');
    } else {
      setThemeError(null);
    }
  }, []);

  const handleRetryTheme = useCallback(() => {
    setThemeError(null);
    if (managerRef.current) {
      managerRef.current.switchTheme(activeThemeId, currentThemeState);
    }
  }, [activeThemeId, currentThemeState]);

  const handleFps = useCallback((f: number) => {
    setFps(f);
  }, []);

  return (
    <div
      className="app-container"
      onPointerEnter={() => managerRef.current?.setPointerOnUI(false)}
    >
      <Scene
        themeId={activeThemeId}
        themeState={currentThemeState}
        onReady={handleReady}
        onError={handleError}
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
          state={currentThemeState}
          onChange={handleChange}
          onReset={handleReset}
          onSelectTheme={handleSelectTheme}
          fps={fps}
          loading={loading}
          themeLoading={themeLoading}
          themeError={themeError}
          onRetryTheme={handleRetryTheme}
          webglError={webglError}
        />
      </div>
    </div>
  );
}
