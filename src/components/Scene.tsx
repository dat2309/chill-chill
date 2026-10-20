import React, { useRef, useEffect } from 'react';
import { SceneManager } from '../three/core/SceneManager';
import { ThemeId, ThemeState, Quality, SavedCameraState } from '../three/core/types';

interface SceneProps {
  themeId: ThemeId;
  themeState: ThemeState<any>;
  initialQuality?: Quality;
  onReady: () => void;
  onWebglError: (msg: string) => void;
  onThemeError?: (err: Error) => void;
  onThemeSuccess?: (themeId: ThemeId) => void;
  onFps: (fps: number) => void;
  onQualityChange?: (quality: Quality) => void;
  onThemeLoadingChange?: (loading: boolean, error?: Error | null) => void;
  onCameraChange?: (themeId: ThemeId, camera: SavedCameraState) => void;
  managerRef: React.MutableRefObject<SceneManager | null>;
}

export default function Scene({
  themeId,
  themeState,
  initialQuality,
  onReady,
  onWebglError,
  onThemeError,
  onThemeSuccess,
  onFps,
  onQualityChange,
  onThemeLoadingChange,
  onCameraChange,
  managerRef,
}: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentThemeIdRef = useRef<ThemeId>(themeId);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // WebGL preflight check
    const testCanvas = document.createElement('canvas');
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    } catch {
      gl = null;
    }

    if (!gl) {
      onWebglError('Trình duyệt hoặc phần cứng không hỗ trợ WebGL. Vui lòng bật tăng tốc phần cứng hoặc dùng trình duyệt hiện đại.');
      return;
    }

    const loseContextExt = gl.getExtension('WEBGL_lose_context');
    if (loseContextExt) {
      loseContextExt.loseContext();
    }
    testCanvas.remove();

    let unmounted = false;
    let manager: SceneManager | null = null;

    try {
      manager = new SceneManager(container, {
        initialQuality,
        onFpsUpdate: onFps,
        onQualityChange,
        onThemeLoadingChange,
        onCameraChange,
      });
      managerRef.current = manager;

      manager
        .switchTheme(themeId, themeState, themeState.cameraState)
        .then((result) => {
          if (unmounted) return;
          if (result.status === 'success') {
            if (!isInitializedRef.current) {
              manager?.start();
              isInitializedRef.current = true;
              onReady();
            }
            onThemeSuccess?.(themeId);
          } else if (result.status === 'failed') {
            onThemeError?.(result.error);
          }
        })
        .catch((e: Error) => {
          if (unmounted) return;
          console.error(e);
          onThemeError?.(e);
        });
    } catch (e: any) {
      if (unmounted) return;
      console.error(e);
      onWebglError(`Không thể khởi tạo WebGL 3D: ${e?.message ?? e}`);
      manager?.dispose();
      managerRef.current = null;
    }

    return () => {
      unmounted = true;
      if (manager) {
        manager.dispose();
      }
      managerRef.current = null;
      isInitializedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle dynamic theme switching
  useEffect(() => {
    if (!managerRef.current) return;
    if (currentThemeIdRef.current !== themeId) {
      currentThemeIdRef.current = themeId;
      managerRef.current
        .switchTheme(themeId, themeState, themeState.cameraState)
        .then((result) => {
          if (result.status === 'success') {
            if (!isInitializedRef.current) {
              managerRef.current?.start();
              isInitializedRef.current = true;
              onReady();
            }
            onThemeSuccess?.(themeId);
          } else if (result.status === 'failed') {
            onThemeError?.(result.error);
          }
        })
        .catch((err) => {
          const errObj = err instanceof Error ? err : new Error(String(err));
          onThemeError?.(errObj);
        });
    }
  }, [themeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync active theme state updates
  useEffect(() => {
    if (!managerRef.current) return;
    managerRef.current.updateState(themeState);
  }, [themeState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      role="img"
      aria-label="3D diorama canvas viewer - Procedural WebGL"
    />
  );
}
