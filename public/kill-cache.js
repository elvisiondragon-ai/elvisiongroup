// 🚨 NUCLEAR CACHE KILLER - Run this immediately on page load

(async function killAllCaches() {
  console.log('🚨🚨🚨 NUCLEAR CACHE CLEARING INITIATED 🚨🚨🚨');
  
  // 1. Unregister ALL service workers immediately
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      console.log(`Found ${registrations.length} service workers to kill`);
      
      for (const registration of registrations) {
        console.log('💀 KILLING SERVICE WORKER:', registration.scope);
        await registration.unregister();
      }
      
      // Force reload to ensure SW is dead
      if (registrations.length > 0) {
        console.log('🔄 FORCE RELOADING TO KILL SERVICE WORKER');
        setTimeout(() => window.location.reload(true), 1000);
        return;
      }
    } catch (e) {
      console.error('Error killing service workers:', e);
    }
  }
  
  // 2. Delete ALL caches
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      console.log(`Found ${cacheNames.length} caches to delete`);
      
      await Promise.all(
        cacheNames.map(name => {
          console.log('💀 DELETING CACHE:', name);
          return caches.delete(name);
        })
      );
    } catch (e) {
      console.error('Error deleting caches:', e);
    }
  }
  
  // 3. Clear localStorage
  try {
    const keysToDelete = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('audio') || key.includes('cache'))) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      console.log('💀 DELETING LOCALSTORAGE:', key);
      localStorage.removeItem(key);
    });
  } catch (e) {
    console.error('Error clearing localStorage:', e);
  }
  
  console.log('✅ NUCLEAR CACHE CLEARING COMPLETE');
})();