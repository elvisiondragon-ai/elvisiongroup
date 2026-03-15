
// Incremental version to force-clear stale service workers and caches on deployment
// Update this string whenever you want to force a "nuke" of the client-side cache
const CURRENT_APP_VERSION = '2026.03.15.01'; // Updated APK download link to v3

export const cleanupStaleServiceWorkers = async () => {
  if (typeof window === 'undefined') return;

  const savedVersion = localStorage.getItem('app_deployment_version');

  // If version mismatch, perform aggressive cleanup
  if (savedVersion !== CURRENT_APP_VERSION) {
    console.warn('🚀 New deployment detected! Performing aggressive cache cleanup...');

    try {
      // 1. Unregister all service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
          console.log('SW unregistered:', registration);
        }
      }

      // 2. Clear all named caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
          console.log('Cache deleted:', cacheName);
        }
      }

      // 3. Clear specific storage items if needed
      // localStorage.removeItem('some-stale-item');

      // 4. Update the saved version
      localStorage.setItem('app_deployment_version', CURRENT_APP_VERSION);

      console.log('✅ Cleanup complete. Reloading page...');

      // 5. Force a hard reload from server
      window.location.reload();
      return; // Stop execution, page is reloading
    } catch (error) {
      console.error('Failed to perform aggressive cleanup:', error);
    }
  }

  // Fallback: standard update check for existing workers
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.update();
      }
    } catch (error) {
      console.error('Failed to update SW:', error);
    }
  }
};

