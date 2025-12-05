import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

function ServiceWorkerUpdater() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      console.log('New content available, updating service worker...');
      updateServiceWorker(true); // This will force a reload
    }
  }, [needRefresh, updateServiceWorker]);

  return null; // This component doesn't render anything
}

export default ServiceWorkerUpdater;
