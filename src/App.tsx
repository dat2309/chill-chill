import React, { useState, useCallback, useRef } from 'react';
import Scene from './components/Scene';
import UI from './components/UI';
import { SceneState, DEFAULT_STATE } from './three/constants';
import { SceneManager } from './three/SceneManager';

export default function App() {
  const [state, setState] = useState<SceneState>({ ...DEFAULT_STATE });
  const [loading, setLoading] = useState(true);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [fps, setFps] = useState(60);
  const managerRef = useRef<SceneManager | null>(null);

  const handleChange = useCallback((patch: Partial<SceneState>) => {
    setState(prev => {
      const next = { ...prev, ...patch };
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setState({ ...DEFAULT_STATE });
    managerRef.current?.reset();
  }, []);

  const handleReady = useCallback(() => {
    setLoading(false);
  }, []);

  const handleError = useCallback((msg: string) => {
    setWebglError(msg);
    setLoading(false);
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
        state={state}
        onReady={handleReady}
        onError={handleError}
        onFps={handleFps}
        managerRef={managerRef}
      />
      <div
        onPointerEnter={() => managerRef.current?.setPointerOnUI(true)}
        onPointerLeave={() => managerRef.current?.setPointerOnUI(false)}
      >
        <UI
          state={state}
          onChange={handleChange}
          onReset={handleReset}
          fps={fps}
          loading={loading}
          webglError={webglError}
        />
      </div>
    </div>
  );
}
