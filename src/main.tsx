import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'

const APP_VERSION = '2026.03.26.03';
(window as any).APP_VERSION = APP_VERSION;

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
