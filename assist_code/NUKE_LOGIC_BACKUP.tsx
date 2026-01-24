// --------------------------------------------------------------------------
// NUKE LOGIC BACKUP (Previously in src/hooks/UpdateToast.tsx)
// --------------------------------------------------------------------------
// This logic was used to aggressively clear all caches, unregister Service Workers,
// and wipe localStorage/sessionStorage on every update detection.
// Use this if you need to revert to the "scorched earth" update strategy.
// --------------------------------------------------------------------------

/*
  // Place this inside onNeedRefresh() in src/hooks/UpdateToast.tsx
  
  // ----------------------------------------------------------------------
  // 1. AGGRESSIVE ANDROID CACHE CLEARING - Fix infinite loading on Android
  // ----------------------------------------------------------------------
  if (isAndroid) {
    console.log('🤖 ANDROID DETECTED - Starting aggressive cache clearing');

    try {
      // 1. Unregister ALL service workers immediately
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log(`🗑️ Unregistering ${registrations.length} service workers`);
        await Promise.all(registrations.map(reg => reg.unregister()));
      }

      // 2. Delete ALL caches (no exceptions for Android)
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log(`🗑️ Deleting ${cacheNames.length} caches:`, cacheNames);
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // 3. Clear ALL localStorage (backup critical data first)
      const authBackup: Record<string, string> = {};
      Object.keys(localStorage).forEach(key => {
        if (
          key.startsWith('sb-') ||
          key.includes('auth') ||
          key.includes('supabase') ||
          key.startsWith('updateBannerDismissed:')
        ) {
          const value = localStorage.getItem(key);
          if (value) authBackup[key] = value;
        }
      });
      localStorage.clear();
      Object.entries(authBackup).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // 4. Clear sessionStorage (except backup)
      const sessionBackup = sessionStorage.getItem('deploy-backup');
      sessionStorage.clear();
      if (sessionBackup) sessionStorage.setItem('deploy-backup', sessionBackup);

      console.log('✅ Android aggressive cache clearing completed');

      // 5. Set flag and force hard reload
      localStorage.setItem('android-sw-cleared', 'true');

      // Force hard reload after a short delay
      setTimeout(() => {
        console.log('🔄 Forcing hard reload for Android...');
        window.location.reload();
      }, 500);

      return; // Exit early for Android
    } catch (error) {
      console.error('❌ Android aggressive clearing failed:', error);
      // Fall through to standard clearing
    }
  }

  // ----------------------------------------------------------------------
  // 2. COMPREHENSIVE: iOS Cache Clearing + SW Cache Clearing
  // ----------------------------------------------------------------------
  try {
    console.log('🧹 Starting comprehensive cache clearing (iOS + SW)');

    // Use iOS cache cleaner for comprehensive clearing
    // Note: Ensure iOSCacheCleaner is imported from "@/utils/iOSCacheCleaner"
    const cleanResult = await iOSCacheCleaner.clearAllCaches();

    if (cleanResult.success) {
      console.log('✅ Comprehensive cache clearing completed:', cleanResult.clearedCaches);
    } else {
      console.warn('⚠️ Cache clearing completed with errors:', cleanResult.errors);
    }

    // Additional SW cache clearing (backup)
    if ('serviceWorker' in navigator) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log('✅ Additional SW cache clearing completed');
    }
  } catch (error) {
    console.error('❌ Comprehensive cache clearing failed, falling back to basic SW clearing:', error);

    // Fallback to basic SW clearing
    try {
      if ('serviceWorker' in navigator) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    } catch (fallbackError) {
      console.error('❌ Fallback SW clearing also failed:', fallbackError);
    }
  }
  
  // ----------------------------------------------------------------------
  // 3. Clear localStorage (General)
  // ----------------------------------------------------------------------
  try {
    const criticalKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('sb-') || 
      key.includes('auth') || 
      key.includes('session') ||
      key.includes('supabase') ||
      key.includes('token') ||
      key.includes('audio') ||
      key.includes('cache') ||
      key.startsWith('updateBannerDismissed:') ||
      key.match(/^supabase\.auth\./) ||
      key === 'update-success-flag' ||
      key === 'sw-update-success' ||
      key === 'update-session-warning'
    );
    
    const backupData: Record<string, string> = {};
    criticalKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) backupData[key] = value;
    });
    
    localStorage.clear();
    console.log('🗑️ PRE-DEPLOYMENT: localStorage cleared, restoring', Object.keys(backupData).length, 'critical items');
    
    Object.entries(backupData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  } catch (error) {
    console.error('❌ Failed to clear localStorage:', error);
  }
*/