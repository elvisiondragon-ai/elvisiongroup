// Emergency cache clearing utility - SECURITY CRITICAL
// This function clears ALL caches to prevent audio URL exposure

export const clearAllAudioCaches = async (): Promise<void> => {
  console.log('🚨 CLEARING ALL AUDIO CACHES FOR SECURITY');
  
  try {
    // 1. Clear all Cache API caches
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(async (cacheName) => {
        console.log(`Deleting cache: ${cacheName}`);
        await caches.delete(cacheName);
      })
    );
    
    // 2. Clear localStorage audio metadata
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('audio_meta_') || key.includes('audio') || key.includes('cache')) {
        console.log(`Removing localStorage: ${key}`);
        localStorage.removeItem(key);
      }
    });
    
    // 3. Clear sessionStorage 
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('audio') || key.includes('cache')) {
        console.log(`Removing sessionStorage: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
    
    // 4. COMPLETELY UNREGISTER service worker for security
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        console.log('🚨 UNREGISTERING SERVICE WORKER FOR SECURITY');
        await registration.unregister();
      }
      
      // Clear any service worker caches directly
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => {
            console.log('🚨 Force deleting cache:', name);
            return caches.delete(name);
          })
        );
      }
    }
    
    console.log('✅ ALL AUDIO CACHES CLEARED SUCCESSFULLY');
    
  } catch (error) {
    console.error('❌ Error clearing caches:', error);
  }
};

// Auto-clear caches on app load for security
export const initSecurityCacheClear = (): void => {
  // Clear caches immediately when this module loads
  clearAllAudioCaches();
  
  // Set up periodic clearing every 5 minutes for security
  setInterval(clearAllAudioCaches, 5 * 60 * 1000);
  
  // Clear on page visibility change (when user returns to app)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      clearAllAudioCaches();
    }
  });
};