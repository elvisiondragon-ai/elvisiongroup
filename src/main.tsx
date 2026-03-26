import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'

const APP_VERSION = '2026.03.26.01';
(window as any).APP_VERSION = APP_VERSION;

// --- Cache Nuke Logic ---
const savedVersion = localStorage.getItem('APP_VERSION');
const urlParams = new URLSearchParams(window.location.search);
const versionParam = urlParams.get('v');

if (savedVersion !== APP_VERSION) {
  console.log('New version detected, clearing cache and redirecting...');
  localStorage.clear();
  localStorage.setItem('APP_VERSION', APP_VERSION);
  // Force redirect with version parameter to bust browser cache
  window.location.href = window.location.pathname + '?v=' + APP_VERSION + window.location.hash;
} else if (versionParam) {
  // Silently remove the version parameter from URL
  const newUrl = window.location.pathname + window.location.hash;
  window.history.replaceState({}, document.title, newUrl);
  console.log('Cache busted, URL cleaned.');
}
// ------------------------

// Global error handler for chunk load failures (stale app)
window.addEventListener('error', (event) => {
  const isChunkError = event.message?.includes('Loading chunk') || 
                       event.message?.includes('importing a module script') ||
                       event.message?.includes('MIME type');
  const isScriptError = event.target instanceof HTMLScriptElement;

  if (isChunkError || isScriptError) {
    console.error('Chunk load error detected. Forcing cache clear and reload.');
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  }
});

createRoot(document.getElementById("root")!).render(<App />);
