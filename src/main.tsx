import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Automatically recover when Vite fails to fetch dynamically imported chunks
// due to new deployments or stale browser cache
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    console.warn('Vite dynamic chunk preload error detected. Auto-reloading to fetch newest version...', event);
    const reloadKey = 'chillax_preload_reloaded';
    const lastReload = sessionStorage.getItem(reloadKey);
    const now = Date.now();
    if (!lastReload || now - Number(lastReload) > 10000) {
      sessionStorage.setItem(reloadKey, String(now));
      window.location.reload();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
