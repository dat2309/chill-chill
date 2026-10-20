import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SceneState, Season, Quality } from '../three/constants';

interface UIProps {
  state: SceneState;
  onChange: (patch: Partial<SceneState>) => void;
  onReset: () => void;
  fps: number;
  loading: boolean;
  webglError: string | null;
}

const SEASON_LABELS: Record<Season, string> = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
};

function formatTime(t: number): string {
  const hours = Math.floor(t);
  const minutes = Math.floor((t - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function getTimeIcon(t: number): string {
  if (t >= 5 && t < 8) return '🌅';
  if (t >= 8 && t < 17) return '☀️';
  if (t >= 17 && t < 20) return '🌇';
  return '🌙';
}

// Icons as pure SVG components
function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function WaterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function TuneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

// Memoized FPS Display to prevent re-rendering parents
const FpsBadge = React.memo(({ fps }: { fps: number }) => {
  return <span>{fps} FPS</span>;
});

export default function UI({ state, onChange, onReset, fps, loading, webglError }: UIProps) {
  const [showHow, setShowHow] = useState(false);
  const [showTune, setShowTune] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingFade, setLoadingFade] = useState(true);

  const howBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Check URL query param ?debug=1 to show Debug Terrain switch
  const isDebugUrl = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debug') === '1';

  // Pointer coarse detection for touch vs desktop hint
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mql = window.matchMedia('(pointer: coarse)');
      setIsTouchDevice(mql.matches);
      const listener = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
      mql.addEventListener('change', listener);
      return () => mql.removeEventListener('change', listener);
    }
  }, []);

  // Loading screen fade
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
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }, []);

  // Escape key handler and focus trap for "How it's made" dialog
  useEffect(() => {
    if (showHow) {
      closeBtnRef.current?.focus();
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowHow(false);
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        window.removeEventListener('keydown', onKeyDown);
        howBtnRef.current?.focus();
      };
    }
  }, [showHow]);

  if (webglError) {
    return (
      <div className="webgl-error" role="alert">
        <h2>WebGL Không Khả Dụng</h2>
        <p>{webglError}</p>
      </div>
    );
  }

  return (
    <>
      {/* Loading Screen */}
      {loadingFade && (
        <div className={`loading-screen ${!loading ? 'fade-out' : ''}`} aria-busy={loading} aria-live="polite">
          <div className="loading-spinner" />
          <div className="loading-text">Building the garden from math…</div>
        </div>
      )}

      {/* Top Left Title & Branding */}
      <header className="top-left-panel">
        <div className="logo-row">
          <div className="logo-icon" aria-hidden="true">✦</div>
          <div className="logo-text">chillax<span className="logo-degree">°</span></div>
        </div>
        <div className="eyebrow">GLAMPING AND STREAM, IN MINIATURE</div>
        <h1 className="hero-title">
          Where the garden<br />
          meets the <em>stream.</em>
        </h1>
        <button
          ref={howBtnRef}
          className="how-btn"
          onClick={() => setShowHow(true)}
          aria-label="How it's made - Architecture and math breakdown"
          aria-haspopup="dialog"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          How it's made
        </button>
      </header>

      {/* Top Right Controls & Time Slider */}
      <div className="top-right-panel">
        <div className="badge-row">
          <span className="badge">Chillax Garden</span>
          <span className="badge">Highland Stream</span>
          <span className="badge">Valley Cove</span>
        </div>
        <div className="time-control">
          <span className="time-icon" aria-hidden="true">{getTimeIcon(state.timeOfDay)}</span>
          <input
            className="time-slider"
            type="range"
            min="0"
            max="24"
            step="0.1"
            value={state.timeOfDay}
            onChange={e => onChange({ timeOfDay: parseFloat(e.target.value) })}
            aria-label="Time of day in hours"
          />
          <span className="time-label">{formatTime(state.timeOfDay)}</span>
        </div>
      </div>

      {/* Bottom Control Bar */}
      <nav className="bottom-bar" aria-label="Scene controls">
        <button className="ctrl-btn" onClick={onReset} aria-label="Reset camera view and settings">
          <span className="btn-icon" aria-hidden="true"><ResetIcon /></span>
          Reset
        </button>
        <div className="ctrl-divider" aria-hidden="true" />

        <div className="season-selector" role="group" aria-label="Choose season">
          {(['spring', 'summer', 'autumn', 'winter'] as Season[]).map(s => (
            <button
              key={s}
              className={`season-btn ${state.season === s ? 'active' : ''}`}
              onClick={() => onChange({ season: s })}
              aria-label={`Season: ${s}`}
              aria-pressed={state.season === s}
            >
              <span aria-hidden="true">{SEASON_LABELS[s]}</span>{' '}
              <span className="season-label">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
            </button>
          ))}
        </div>
        <div className="ctrl-divider" aria-hidden="true" />

        <button
          className={`ctrl-btn ${state.tide === 'high' ? 'active' : ''}`}
          onClick={() => onChange({ tide: state.tide === 'low' ? 'high' : 'low' })}
          aria-label={`Tide level: current is ${state.tide}`}
          aria-pressed={state.tide === 'high'}
        >
          <span className="btn-icon" aria-hidden="true"><WaterIcon /></span>
          {state.tide === 'high' ? 'High' : 'Low'}
        </button>
        <div className="ctrl-divider" aria-hidden="true" />

        <button
          className={`ctrl-btn ${showTune ? 'active' : ''}`}
          onClick={() => setShowTune(!showTune)}
          aria-label="Tune environment and graphics settings"
          aria-expanded={showTune}
        >
          <span className="btn-icon" aria-hidden="true"><TuneIcon /></span>
          Tune
        </button>
        <div className="ctrl-divider" aria-hidden="true" />

        <button className="ctrl-btn" onClick={toggleFullscreen} aria-label="Toggle fullscreen view">
          <span className="btn-icon" aria-hidden="true"><FullscreenIcon /></span>
          {isFullscreen ? 'Exit' : 'Full'}
        </button>
      </nav>

      {/* Tune Panel */}
      {showTune && (
        <div className="tune-panel" role="region" aria-label="Environment tune settings">
          <h3>Settings</h3>
          <div className="tune-row">
            <label className="tune-label" htmlFor="ripple-strength-slider">Ripple strength</label>
            <input
              id="ripple-strength-slider"
              className="tune-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.rippleStrength}
              onChange={e => onChange({ rippleStrength: parseFloat(e.target.value) })}
              aria-label="Ripple strength"
            />
          </div>
          <div className="tune-row">
            <label className="tune-label" htmlFor="flow-speed-slider">Flow speed</label>
            <input
              id="flow-speed-slider"
              className="tune-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.flowSpeed}
              onChange={e => onChange({ flowSpeed: parseFloat(e.target.value) })}
              aria-label="Water flow speed"
            />
          </div>
          <div className="tune-row">
            <label className="tune-label" htmlFor="wind-strength-slider">Wind</label>
            <input
              id="wind-strength-slider"
              className="tune-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.windStrength}
              onChange={e => onChange({ windStrength: parseFloat(e.target.value) })}
              aria-label="Wind strength"
            />
          </div>
          <div className="tune-row">
            <span className="tune-label" id="auto-rotate-label">Auto rotate</span>
            <div className="tune-toggle">
              <button
                role="switch"
                aria-checked={state.autoRotate}
                aria-labelledby="auto-rotate-label"
                className={`toggle-switch ${state.autoRotate ? 'on' : ''}`}
                onClick={() => onChange({ autoRotate: !state.autoRotate })}
              />
            </div>
          </div>
          <div className="tune-row">
            <span className="tune-label" id="quality-selector-label">Quality</span>
            <div className="quality-selector" role="group" aria-labelledby="quality-selector-label">
              {(['low', 'medium', 'high'] as Quality[]).map(q => (
                <button
                  key={q}
                  className={`quality-btn ${state.quality === q ? 'active' : ''}`}
                  onClick={() => onChange({ quality: q })}
                  aria-pressed={state.quality === q}
                  aria-label={`Graphics quality: ${q}`}
                >
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {isDebugUrl && (
            <div className="tune-row">
              <span className="tune-label" id="debug-terrain-label">Debug Terrain (Magenta)</span>
              <div className="tune-toggle">
                <button
                  role="switch"
                  aria-checked={Boolean(state.debugTerrain)}
                  aria-labelledby="debug-terrain-label"
                  className={`toggle-switch ${state.debugTerrain ? 'on' : ''}`}
                  onClick={() => onChange({ debugTerrain: !state.debugTerrain })}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Instructions and Badges */}
      <footer className="footer">
        <div className="footer-left">
          {isTouchDevice ? 'Drag to orbit · Tap water to splash' : 'Drag to orbit · Glide cursor on stream for ripples · Click water to splash'}
        </div>
        <div className="footer-right">
          <span>{state.season.charAt(0).toUpperCase() + state.season.slice(1)}</span>
          <span>{formatTime(state.timeOfDay)}</span>
          <FpsBadge fps={fps} />
        </div>
      </footer>

      {/* How It's Made Modal Dialog */}
      {showHow && (
        <div className="how-panel-overlay" onClick={() => setShowHow(false)}>
          <div
            className="how-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-panel-title"
            onClick={e => e.stopPropagation()}
          >
            <h2 id="how-panel-title">How It's Made</h2>
            <h3>🏔️ Terrain</h3>
            <p>
              The terrain is a 240×240 heightfield generated with multi-octave simplex noise (FBM),
              ridged multifractal for mountain ridges, and Voronoi patterns for rock textures.
              The diorama is a floating island with visible geological cross-section layers
              colored via vertex colors — no external textures are used.
            </p>
            <h3>💧 Water & Ripples</h3>
            <p>
              Water uses a custom GLSL shader implementing Beer–Lambert light absorption
              for depth-dependent color, Schlick's Fresnel approximation for reflections,
              and animated surface normals. Ripples are simulated on the GPU using a
              ping-pong render target running the 2D wave equation each frame, with an analytical fallback.
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
              hemisphered and framed on individual stilts. The A-frame cabin, furniture, campfire,
              and all props are built entirely from basic THREE.js geometries combined procedurally.
            </p>
            <h3>🌲 Vegetation</h3>
            <p>
              Over 4,500 plant instances use THREE.InstancedMesh for high performance. Tree canopies
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
            <button
              ref={closeBtnRef}
              className="close-btn"
              onClick={() => setShowHow(false)}
              aria-label="Close dialog"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
