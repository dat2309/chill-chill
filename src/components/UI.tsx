import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Season, TideLevel, Quality, SceneState, DEFAULT_STATE } from '../three/constants';

interface UIProps {
  state: SceneState;
  onChange: (patch: Partial<SceneState>) => void;
  onReset: () => void;
  fps: number;
  loading: boolean;
  webglError: string | null;
}

/* ==================== ICONS (inline SVG) ==================== */
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const ResetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);
const TuneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);
const FullscreenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);
const WaterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    <path d="M2 7c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
  </svg>
);

function formatTime(t: number): string {
  const h = Math.floor(t) % 24;
  const m = Math.floor((t % 1) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function getTimeIcon(t: number) {
  if (t >= 6 && t < 18) return <SunIcon />;
  return <MoonIcon />;
}

const SEASON_LABELS: Record<Season, string> = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
};

export default function UI({ state, onChange, onReset, fps, loading, webglError }: UIProps) {
  const [showTune, setShowTune] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingFade, setLoadingFade] = useState(true);

  // Handle loading fade
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setLoadingFade(false), 600);
      return () => clearTimeout(t);
    } else {
      setLoadingFade(true);
    }
  }, [loading]);

  // Fullscreen sync
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  if (webglError) {
    return (
      <div className="webgl-error">
        <h2>WebGL Not Available</h2>
        <p>{webglError}</p>
      </div>
    );
  }

  return (
    <>
      {/* Loading */}
      {loadingFade && (
        <div className={`loading-screen ${!loading ? 'fade-out' : ''}`}>
          <div className="loading-spinner" />
          <div className="loading-text">Building the garden from math…</div>
        </div>
      )}

      {/* Top Left */}
      <div className="top-left-panel">
        <div className="logo-row">
          <div className="logo-icon">✦</div>
          <div className="logo-text">chillax<span className="logo-degree">°</span></div>
        </div>
        <div className="eyebrow">GLAMPING AND STREAM, IN MINIATURE</div>
        <h1 className="hero-title">
          Where the garden<br />
          meets the <em>stream.</em>
        </h1>
        <button className="how-btn" onClick={() => setShowHow(true)} aria-label="How it's made">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          How it's made
        </button>
      </div>

      {/* Top Right */}
      <div className="top-right-panel">
        <div className="badge-row">
          <span className="badge">Chillax Garden</span>
          <span className="badge">Highland Stream</span>
          <span className="badge">Valley Cove</span>
        </div>
        <div className="time-control">
          <span className="time-icon">{getTimeIcon(state.timeOfDay)}</span>
          <input
            className="time-slider"
            type="range"
            min="0"
            max="24"
            step="0.1"
            value={state.timeOfDay}
            onChange={e => onChange({ timeOfDay: parseFloat(e.target.value) })}
            aria-label="Time of day"
          />
          <span className="time-label">{formatTime(state.timeOfDay)}</span>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="bottom-bar">
        <button className="ctrl-btn" onClick={onReset} aria-label="Reset view">
          <span className="btn-icon"><ResetIcon /></span>
          Reset
        </button>
        <div className="ctrl-divider" />
        <div className="season-selector">
          {(['spring', 'summer', 'autumn', 'winter'] as Season[]).map(s => (
            <button
              key={s}
              className={`season-btn ${state.season === s ? 'active' : ''}`}
              onClick={() => onChange({ season: s })}
              aria-label={`Season: ${s}`}
            >
              {SEASON_LABELS[s]} <span className="season-label">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
            </button>
          ))}
        </div>
        <div className="ctrl-divider" />
        <button
          className={`ctrl-btn ${state.tide === 'high' ? 'active' : ''}`}
          onClick={() => onChange({ tide: state.tide === 'low' ? 'high' : 'low' })}
          aria-label={`Tide: ${state.tide}`}
        >
          <span className="btn-icon"><WaterIcon /></span>
          {state.tide === 'high' ? 'High' : 'Low'}
        </button>
        <div className="ctrl-divider" />
        <button
          className={`ctrl-btn ${showTune ? 'active' : ''}`}
          onClick={() => setShowTune(!showTune)}
          aria-label="Tune settings"
        >
          <span className="btn-icon"><TuneIcon /></span>
          Tune
        </button>
        <div className="ctrl-divider" />
        <button className="ctrl-btn" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
          <span className="btn-icon"><FullscreenIcon /></span>
          {isFullscreen ? 'Exit' : 'Full'}
        </button>
      </div>

      {/* Tune Panel */}
      {showTune && (
        <div className="tune-panel">
          <h3>Settings</h3>
          <div className="tune-row">
            <span className="tune-label">Ripple strength</span>
            <input
              className="tune-slider"
              type="range"
              min="0" max="1" step="0.05"
              value={state.rippleStrength}
              onChange={e => onChange({ rippleStrength: parseFloat(e.target.value) })}
            />
          </div>
          <div className="tune-row">
            <span className="tune-label">Flow speed</span>
            <input
              className="tune-slider"
              type="range"
              min="0" max="1" step="0.05"
              value={state.flowSpeed}
              onChange={e => onChange({ flowSpeed: parseFloat(e.target.value) })}
            />
          </div>
          <div className="tune-row">
            <span className="tune-label">Wind</span>
            <input
              className="tune-slider"
              type="range"
              min="0" max="1" step="0.05"
              value={state.windStrength}
              onChange={e => onChange({ windStrength: parseFloat(e.target.value) })}
            />
          </div>
          <div className="tune-row">
            <span className="tune-label">Auto rotate</span>
            <div className="tune-toggle">
              <button
                className={`toggle-switch ${state.autoRotate ? 'on' : ''}`}
                onClick={() => onChange({ autoRotate: !state.autoRotate })}
                aria-label="Toggle auto rotate"
              />
            </div>
          </div>
          <div className="tune-row">
            <span className="tune-label">Quality</span>
            <div className="quality-selector">
              {(['low', 'medium', 'high'] as Quality[]).map(q => (
                <button
                  key={q}
                  className={`quality-btn ${state.quality === q ? 'active' : ''}`}
                  onClick={() => onChange({ quality: q })}
                >
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="tune-row">
            <span className="tune-label">Debug Terrain (Magenta)</span>
            <div className="tune-toggle">
              <button
                className={`toggle-switch ${state.debugTerrain ? 'on' : ''}`}
                onClick={() => onChange({ debugTerrain: !state.debugTerrain })}
                aria-label="Toggle terrain debug mode"
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        <div className="footer-left">
          Drag to orbit · Glide cursor on stream for ripples · Click water to splash
        </div>
        <div className="footer-right">
          <span>{state.season.charAt(0).toUpperCase() + state.season.slice(1)}</span>
          <span>{formatTime(state.timeOfDay)}</span>
          <span>{fps} FPS</span>
        </div>
      </div>

      {/* How It's Made Panel */}
      {showHow && (
        <div className="how-panel-overlay" onClick={() => setShowHow(false)}>
          <div className="how-panel" onClick={e => e.stopPropagation()}>
            <h2>How It's Made</h2>
            <h3>🏔️ Terrain</h3>
            <p>
              The terrain is a 240×240 heightfield generated with multi-octave simplex noise (FBM),
              ridged multifractal for mountain ridges, and Voronoi patterns for rock textures.
              The diorama is a floating island with visible geological cross-section layers
              colored via vertex colors — no textures are used.
            </p>
            <h3>💧 Water & Ripples</h3>
            <p>
              Water uses a custom GLSL shader implementing Beer–Lambert light absorption
              for depth-dependent color, Schlick's Fresnel approximation for reflections,
              and animated surface normals. Ripples are simulated on the GPU using a
              256×256 ping-pong render target running the 2D wave equation each frame.
              Mouse interaction injects impulses via raycasting.
            </p>
            <h3>🐟 Fish</h3>
            <p>
              12 procedural fish are generated from mathematical body curves with oscillating
              tail vertices. They follow a simplified Boids algorithm for loose schooling,
              with boundary avoidance and ripple reactions.
            </p>
            <h3>🏕️ Architecture</h3>
            <p>
              Geodesic domes are constructed from subdivided icosahedra (detail level 2),
              hemisphered and framed. The A-frame cabin, furniture, campfire, and all props
              are built entirely from basic THREE.js geometries combined procedurally.
            </p>
            <h3>🌲 Vegetation</h3>
            <p>
              Over 4,500 plant instances use THREE.InstancedMesh for performance. Tree canopies
              are noise-deformed icospheres. Placement uses density maps based on elevation,
              slope, and proximity to water, with exclusion zones around buildings.
            </p>
            <h3>☀️ Lighting</h3>
            <p>
              The sun orbits based on a 0–24h slider, with color temperature shifting from
              warm golden (dawn/dusk) to neutral daylight to cool blue moonlight. Tent and
              cabin interiors glow at night via emissive materials and point lights.
            </p>
            <h3>🍂 Seasons</h3>
            <p>
              Four seasons smoothly interpolate vegetation colors, flower density, and snow
              coverage using per-instance color updates on InstancedMesh.
            </p>
            <button className="close-btn" onClick={() => setShowHow(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
