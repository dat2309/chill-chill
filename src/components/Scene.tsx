import React, { useRef, useEffect } from 'react';
import { SceneManager } from '../three/SceneManager';
import { SceneState, Quality } from '../three/constants';

interface SceneProps {
  state: SceneState;
  onReady: () => void;
  onError: (msg: string) => void;
  onFps: (fps: number) => void;
  onQualityChange?: (quality: Quality) => void;
  managerRef: React.MutableRefObject<SceneManager | null>;
}

export default function Scene({
  state,
  onReady,
  onError,
  onFps,
  onQualityChange,
  managerRef,
}: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

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
      manager = new SceneManager(container, onFps, onQualityChange);
      managerRef.current = manager;

      manager
        .init()
        .then(() => {
          manager?.start();
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
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync state changes to manager
  useEffect(() => {
    managerRef.current?.updateState(state);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      role="img"
      aria-label="Chillax Garden & Stream 3D diorama - Khu cắm trại glamping bên suối núi thu nhỏ"
    />
  );
}
