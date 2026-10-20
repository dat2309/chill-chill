import React, { useRef, useEffect } from 'react';
import { SceneManager } from '../three/core/SceneManager';
import { ThemeId, ThemeState, Quality } from '../three/core/types';

interface SceneProps {
  themeId: ThemeId;
  themeState: ThemeState<any>;
  onReady: () => void;
  onError: (msg: string) => void;
  onFps: (fps: number) => void;
  onQualityChange?: (quality: Quality) => void;
  onThemeLoadingChange?: (loading: boolean, error?: Error | null) => void;
  managerRef: React.MutableRefObject<SceneManager | null>;
}

export default function Scene({
  themeId,
  themeState,
  onReady,
  onError,
  onFps,
  onQualityChange,
  onThemeLoadingChange,
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
      onError('Trình duyệt hoặc phần cứng không hỗ trợ WebGL. Vui lòng bật tăng tốc phần cứng hoặc dùng trình duyệt hiện đại.');
      return;
    }

    // Release preflight context immediately
    const loseContextExt = gl.getExtension('WEBGL_lose_context');
    if (loseContextExt) {
      loseContextExt.loseContext();
    }
    testCanvas.remove();

    let manager: SceneManager | null = null;
    try {
      manager = new SceneManager(container, {
        onFpsUpdate: onFps,
        onQualityChange,
        onThemeLoadingChange,
      });
      managerRef.current = manager;

      manager
        .switchTheme(themeId, themeState)
        .then(() => {
          manager?.start();
          isInitializedRef.current = true;
          onReady();
        })
        .catch((e: Error) => {
          console.error(e);
          onError(`Lỗi khởi tạo cảnh 3D: ${e.message}`);
          manager?.dispose();
          managerRef.current = null;
        });
    } catch (e: any) {
      console.error(e);
      onError(`Không thể khởi tạo WebGL 3D: ${e?.message ?? e}`);
      manager?.dispose();
      managerRef.current = null;
    }

    return () => {
      if (manager) {
        manager.dispose();
      }
      managerRef.current = null;
      isInitializedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle dynamic theme switching
  useEffect(() => {
    if (!isInitializedRef.current || !managerRef.current) return;
    if (currentThemeIdRef.current !== themeId) {
      currentThemeIdRef.current = themeId;
      managerRef.current.switchTheme(themeId, themeState);
    }
  }, [themeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync active theme state updates
  useEffect(() => {
    if (!isInitializedRef.current || !managerRef.current) return;
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
