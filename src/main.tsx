import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { initSecurityCacheClear } from './utils/clearAllCaches'

// 🚨 CRITICAL SECURITY: Clear all audio caches on app start
initSecurityCacheClear();

createRoot(document.getElementById("root")!).render(<App />);
