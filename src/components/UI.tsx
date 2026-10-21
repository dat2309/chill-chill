import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ThemeId, ThemeMetadata, ThemeState, Quality } from '../three/core/types';
import { THEME_LIST, THEME_METADATA_MAP } from '../three/themes/registry';

interface UIProps {
  activeThemeId: ThemeId;
  requestedThemeId?: ThemeId | null;
  state: ThemeState<any>;
  quality: Quality;
  onChange: (patch: Partial<ThemeState<any>>) => void;
  onQualityChange: (quality: Quality) => void;
  onReset: () => void;
  onSelectTheme: (themeId: ThemeId) => void;
  fps: number;
  loading: boolean;
  themeLoading: boolean;
  themeError: string | null;
  onRetryTheme: () => void;
  onCancelThemeError?: () => void;
  webglError: string | null;
}

const SEASON_EMOJIS: Record<string, string> = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
  dry: '☀️',
  rainy: '🌧️',
};

function formatTime(t: number): string {
  const hours = Math.floor(t);
  const minutes = Math.floor((t - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function getTimeIcon(t: number): string {
  if (t >= 5 && t < 8) return '🌅';
  if (t >= 8 && t < 16.5) return '☀️';
  if (t >= 16.5 && t < 19.5) return '🌇';
  return '🌙';
}

// Icons
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

function LayersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, minWidth: 18, minHeight: 18, flexShrink: 0 }}
      aria-hidden="true"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

// Mini SVG illustrations for theme cards
function GardenCardPreview() {
  return (
    <svg viewBox="0 0 280 120" width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dcecf8" />
          <stop offset="100%" stopColor="#f4ede1" />
        </linearGradient>
      </defs>
      <rect width="280" height="120" fill="url(#gardenSky)" />
      {/* Mountain silhouettes */}
      <polygon points="20,120 70,35 120,120" fill="#a4b8ab" />
      <polygon points="85,120 150,25 215,120" fill="#88a192" />
      <polygon points="170,120 230,45 280,120" fill="#a4b8ab" />
      {/* Mountain snow peaks */}
      <polygon points="150,25 138,45 162,45" fill="#f8fafc" />
      {/* Plateau & meadow */}
      <path d="M0,80 Q70,75 140,85 T280,78 L280,120 L0,120 Z" fill="#6d8d47" />
      {/* Glamping Dome */}
      <circle cx="85" cy="85" r="14" fill="#faf5ec" stroke="#d5c8b2" strokeWidth="1.5" />
      {/* Stream */}
      <path d="M160,82 Q190,95 240,120 L270,120 Q220,95 190,82 Z" fill="#4fbdae" />
    </svg>
  );
}

function PhuQuocCardPreview() {
  return (
    <svg viewBox="0 0 280 120" width="100%" height="100%" preserveAspectRatio="none">
      <defs>
        <linearGradient id="phuQuocSunset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fca07d" />
          <stop offset="60%" stopColor="#fde0c8" />
          <stop offset="100%" stopColor="#f5e8d5" />
        </linearGradient>
      </defs>
      <rect width="280" height="120" fill="url(#phuQuocSunset)" />
      {/* Sunset sun */}
      <circle cx="210" cy="55" r="18" fill="#ff7043" opacity="0.85" />
      {/* Back granite hill */}
      <path d="M120,120 Q180,60 280,85 L280,120 Z" fill="#758273" opacity="0.6" />
      {/* Curved beach sand */}
      <path d="M0,75 Q90,70 160,92 T280,95 L280,120 L0,120 Z" fill="#edd6b4" />
      {/* Turquoise Sea Bay */}
      <path d="M110,95 Q170,98 280,105 L280,120 L80,120 Z" fill="#2ebfa5" />
      {/* Coconut Palm */}
      <path d="M45,95 Q65,65 72,40" stroke="#5d4937" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M72,40 Q55,42 42,50 M72,40 Q85,44 95,54 M72,40 Q65,28 50,25 M72,40 Q80,26 95,32" stroke="#2e7d32" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Thatched bungalow */}
      <polygon points="105,75 125,58 145,75" fill="#a48858" />
      <rect x="110" y="75" width="30" height="15" fill="#8d6840" />
      {/* Thuyen thung */}
      <circle cx="230" cy="110" r="7" fill="#222" stroke="#1976d2" strokeWidth="1.5" />
    </svg>
  );
}

// Memoized FPS Display
const FpsBadge = React.memo(({ fps }: { fps: number }) => {
  return <span>{fps} FPS</span>;
});

export default function UI({
  activeThemeId,
  requestedThemeId,
  state,
  quality,
  onChange,
  onQualityChange,
  onReset,
  onSelectTheme,
  fps,
  loading,
  themeLoading,
  themeError,
  onRetryTheme,
  onCancelThemeError,
  webglError,
}: UIProps) {
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showHow, setShowHow] = useState(false);
  const [showTune, setShowTune] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadingFade, setLoadingFade] = useState(true);

  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const themeModalCloseBtnRef = useRef<HTMLButtonElement>(null);
  const howBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const activeMetadata = THEME_METADATA_MAP[activeThemeId];

  // Touch vs pointer detection
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
    if (!loading && !themeLoading) {
      const t = setTimeout(() => setLoadingFade(false), 500);
      return () => clearTimeout(t);
    } else {
      setLoadingFade(true);
    }
  }, [loading, themeLoading]);

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

  // Keyboard escape handlers
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showThemeModal) setShowThemeModal(false);
        if (showHow) setShowHow(false);
        if (showTune) setShowTune(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showThemeModal, showHow, showTune]);

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
      {/* Loading Overlay */}
      {loadingFade && (
        <div className={`loading-screen ${!loading && !themeLoading ? 'fade-out' : ''}`} aria-busy={loading || themeLoading} aria-live="polite">
          <div className="loading-spinner" />
          <div className="loading-text">
            {themeLoading
              ? `Đang chuyển sang ${requestedThemeId ? THEME_METADATA_MAP[requestedThemeId]?.name ?? activeMetadata.name : activeMetadata.name}…`
              : 'Building the diorama from math…'}
          </div>
        </div>
      )}

      {/* Theme Load Error Notification */}
      {themeError && (
        <div className="webgl-error" role="alert" style={{ zIndex: 180 }}>
          <h2>Không thể tải chủ đề</h2>
          <p>{themeError}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="ctrl-btn active" onClick={onRetryTheme}>
              Thử lại
            </button>
            <button
              className="ctrl-btn"
              onClick={() => window.location.reload()}
              title="Tải lại toàn bộ trang web"
            >
              Tải lại trang (F5)
            </button>
            {onCancelThemeError && requestedThemeId && requestedThemeId !== activeThemeId && (
              <button className="ctrl-btn" onClick={onCancelThemeError}>
                Quay lại {activeMetadata.name}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Left Header & Branding */}
      <header className="top-left-panel">
        <div className="logo-row">
          <div className="logo-icon" aria-hidden="true">✦</div>
          <div className="logo-text">chillax<span className="logo-degree">°</span></div>
        </div>
        <div className="eyebrow">{activeMetadata.eyebrow}</div>
        <h1 className="hero-title">
          {activeThemeId === 'garden' ? (
            <>Where the garden<br />meets the <em>stream.</em></>
          ) : (
            <>Where the palms<br />meet the <em>sunset bay.</em></>
          )}
        </h1>
        <div className="top-action-row">
          <button
            ref={themeBtnRef}
            className="theme-switch-btn"
            onClick={() => setShowThemeModal(true)}
            aria-label="Chọn chủ đề diorama"
            aria-haspopup="dialog"
          >
            <LayersIcon />
            <span className="theme-btn-text">{activeMetadata.name}</span>
          </button>
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
            <span>How it's made</span>
          </button>
        </div>
      </header>

      {/* Top Right Controls & Time Slider */}
      <div className="top-right-panel">
        <div className="badge-row">
          {activeThemeId === 'garden' ? (
            <>
              <span className="badge">Chillax Garden</span>
              <span className="badge">Highland Stream</span>
              <span className="badge">Valley Cove</span>
            </>
          ) : (
            <>
              <span className="badge">Phú Quốc Bay</span>
              <span className="badge">Sunset Beach</span>
              <span className="badge">Mái Lá & Cầu Tàu</span>
            </>
          )}
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

        {/* Dynamic Season Selector per active theme */}
        <div className="season-selector" role="group" aria-label="Choose season">
          {activeMetadata.seasons.map(s => {
            const isSelected = state.season === s.id;
            const emoji = SEASON_EMOJIS[s.id] || '🌱';
            return (
              <button
                key={s.id}
                className={`season-btn ${isSelected ? 'active' : ''}`}
                onClick={() => onChange({ season: s.id as any })}
                aria-label={`Mùa: ${s.name}`}
                aria-pressed={isSelected}
              >
                <span aria-hidden="true">{emoji}</span>{' '}
                <span className="season-label">{s.name}</span>
              </button>
            );
          })}
        </div>
        <div className="ctrl-divider" aria-hidden="true" />

        <button
          className={`ctrl-btn ${state.tide === 'high' ? 'active' : ''}`}
          onClick={() => onChange({ tide: state.tide === 'low' ? 'high' : 'low' })}
          aria-label={`Tide level: current is ${state.tide}`}
          aria-pressed={state.tide === 'high'}
        >
          <span className="btn-icon" aria-hidden="true"><WaterIcon /></span>
          {state.tide === 'high' ? 'Triều cao' : 'Triều thấp'}
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
            <label className="tune-label" htmlFor="ripple-strength-slider">Gợn sóng (Ripple)</label>
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
            <label className="tune-label" htmlFor="flow-speed-slider">Tốc độ nước / sóng</label>
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
            <label className="tune-label" htmlFor="wind-strength-slider">Gió (Wind)</label>
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
            <span className="tune-label" id="auto-rotate-label">Tự động xoay</span>
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
            <span className="tune-label" id="quality-selector-label">Chất lượng đồ họa</span>
            <div className="quality-selector" role="group" aria-labelledby="quality-selector-label">
              {(['low', 'medium', 'high'] as Quality[]).map(q => (
                <button
                  key={q}
                  className={`quality-btn ${quality === q ? 'active' : ''}`}
                  onClick={() => onQualityChange(q)}
                  aria-pressed={quality === q}
                  aria-label={`Graphics quality: ${q}`}
                >
                  {q === 'low' ? 'Thấp' : q === 'medium' ? 'Vừa' : 'Cao'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Instructions and Badges */}
      <footer className="footer">
        <div className="footer-left">
          {isTouchDevice ? 'Kéo để xoay góc nhìn · Chạm vào nước để tạo sóng' : 'Kéo chuột để xoay · Di chuột qua mặt nước để tạo gợn sóng · Nhấp để tạo sóng tròn'}
        </div>
        <div className="footer-right">
          <span>{activeMetadata.name}</span>
          <span>{formatTime(state.timeOfDay)}</span>
          <FpsBadge fps={fps} />
        </div>
      </footer>

      {/* Theme Selector Modal Dialog */}
      {showThemeModal && (
        <div className="theme-modal-overlay" onClick={() => setShowThemeModal(false)}>
          <div
            className="theme-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="theme-modal-title"
            onClick={e => e.stopPropagation()}
          >
            <div className="theme-modal-header">
              <div>
                <h2 id="theme-modal-title" className="theme-modal-title">Bộ Sưu Tập Diorama</h2>
                <div className="theme-modal-subtitle">Chọn cảnh quan thu nhỏ 3D được kiến tạo thuần toán học</div>
              </div>
            </div>

            <div className="theme-grid">
              {THEME_LIST.map(theme => {
                const isActive = theme.id === activeThemeId;
                return (
                  <button
                    key={theme.id}
                    className={`theme-card ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      if (!isActive) {
                        onSelectTheme(theme.id);
                      }
                      setShowThemeModal(false);
                    }}
                    aria-label={`Chọn chủ đề: ${theme.name}`}
                  >
                    <div className="theme-card-preview">
                      {theme.id === 'garden' ? <GardenCardPreview /> : <PhuQuocCardPreview />}
                    </div>
                    <div className="theme-card-info">
                      <div className="theme-card-title">{theme.name}</div>
                      <div className="theme-card-desc">{theme.description}</div>
                    </div>
                    <div className="theme-card-meta">
                      <span className="theme-badge">
                        {theme.seasons.length} Mùa ({theme.seasons.map(s => s.name).join(' · ')})
                      </span>
                      {isActive && (
                        <span className="theme-active-pill">
                          <span aria-hidden="true">✓</span> Đang chọn
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="theme-modal-footer">
              <button
                ref={themeModalCloseBtnRef}
                className="close-btn"
                onClick={() => setShowThemeModal(false)}
                aria-label="Đóng bảng chọn chủ đề"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adaptive How It's Made Modal Dialog */}
      {showHow && (
        <div className="how-panel-overlay" onClick={() => setShowHow(false)}>
          <div
            className="how-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-panel-title"
            onClick={e => e.stopPropagation()}
          >
            <h2 id="how-panel-title">How It's Made — {activeMetadata.name}</h2>
            {(activeMetadata.howItMade || []).map((section, idx) => (
              <div key={idx}>
                <h3>{section.icon} {section.title}</h3>
                <p>{section.content}</p>
              </div>
            ))}
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
