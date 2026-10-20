import React, { useRef, useEffect, useCallback, useState } from 'react';
import { SceneManager } from '../three/SceneManager';
import { SceneState, DEFAULT_STATE } from '../three/constants';

interface SceneProps {
  state: SceneState;
  onReady: () => void;
  onError: (msg: string) => void;
  onFps: (fps: number) => void;
  managerRef: React.MutableRefObject<SceneManager | null>;
}

export default function Scene({ state, onReady, onError, onFps, managerRef }: SceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) {
      onError('Your browser or device does not support WebGL. Please try a modern browser.');
      return;
    }

    const manager = new SceneManager(container, onFps);
    managerRef.current = manager;

    manager.init().then(() => {
      manager.start();
      onReady();
    }).catch((e: Error) => {
      console.error(e);
      onError(`Failed to initialize 3D scene: ${e.message}`);
    });

    return () => {
      manager.dispose();
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
    />
  );
}
