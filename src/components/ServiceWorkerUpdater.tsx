import { useEffect } from 'react';

function ServiceWorkerUpdater() {
  useEffect(() => {
    // Next.js handles caching differently.
    // If a service worker is needed in the future, it should be implemented 
    // using next-pwa or the native App Router service worker support.
  }, []);

  return null;
}

export default ServiceWorkerUpdater;
