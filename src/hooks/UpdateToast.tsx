import { useToast } from "@/hooks/use-toast";
import { useRegisterSW } from 'virtual:pwa-register/react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";
import { iOSCacheCleaner } from "@/utils/iOSCacheCleaner";

export const useUpdateToast = () => {
  const { toast } = useToast();
  const { refreshSession, user } = useAuth();
  const persistentToastInterval = useRef<NodeJS.Timeout | null>(null);
  const toastShownRef = useRef<boolean>(false);

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  // Android detection
  const isAndroid = /Android/.test(navigator.userAgent);

  // Check for success flag after refresh + show pending updates + SW recovery success
  useEffect(() => {
    // Android aggressive clearing success
    const androidCleared = localStorage.getItem('android-sw-cleared');
    if (androidCleared === 'true') {
      localStorage.removeItem('android-sw-cleared');
      setTimeout(() => {
        toast({
          title: "✅ Update Complete",
          description: "Cache cleared, app refreshed",
          duration: 3000,
        });
      }, 1000);
    }

    const updateSuccess = localStorage.getItem('update-success-flag');
    if (updateSuccess === 'true') {
      localStorage.removeItem('update-success-flag');
      toast({
        title: "Updated ☀️",
        duration: 3000,
      });
    }


    // Show success message if coming back from SW update/recovery
    const swUpdated = localStorage.getItem('sw-update-success');
    if (swUpdated === 'true') {
      localStorage.removeItem('sw-update-success');

      // Check if there was a session warning during update
      const sessionWarning = localStorage.getItem('update-session-warning');
      if (sessionWarning === 'true') {
        localStorage.removeItem('update-session-warning');

        setTimeout(() => {
          console.log('⚠️ SW Update completed with session warning');
          toast({
            title: "Update Complete",
            description: "Please check if you're still logged in",
            duration: 4000,
          });
        }, 1000);
      } else {
        setTimeout(() => {
          console.log('✅ SW Update completed successfully');
          toast({
            title: "Success Update",
            duration: 2000,
          });
        }, 1000);
      }
    }

    // RefreshButton Toast - Check Update button from Profile (iOS PWA)
    const wasUpdated = localStorage.getItem('app-updated-flag');
    if (wasUpdated === 'true') {
      localStorage.removeItem('app-updated-flag');
      setTimeout(() => {
        toast({
          title: "✓ Anda di versi terbaru",
          description: "App berhasil diperbarui",
        });
      }, 1000);
    }

    // DON'T show toast on manual refresh - only when onNeedRefresh triggers it
  }, [toast]);

  // Function to show update toast with iOS-specific handling
  const showUpdateToast = () => {
    // Allow latest toast - dismiss any existing and show new one
    console.log('🔄 Showing latest update toast');
    const toastConfig = {
      title: "🐢 Otomatis Update Initiate",
      duration: 3000, // 3 seconds for both iOS and Android
      className: "p-3 pr-4 space-x-3 [&>div>*:first-child]:text-sm",
    };

    // Show toast
    const toastInstance = toast(toastConfig);

    return toastInstance;
  };

  // Expose to window for console testing
  useEffect(() => {
    (window as any).testUpdateToast = showUpdateToast;
    return () => {
      delete (window as any).testUpdateToast;
    };
  }, []);

  // PWA Update Logic
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('✅ SW Registered successfully:', r);
      
      // Check for updates immediately after registration
      if (r) {
        console.log('🔍 Checking for updates immediately after registration');
        r.update();
        
        // Periodic update checks disabled to reduce console spam
      }
    },
    onRegisterError(error) {
      console.error('❌ SW registration error:', error);
    },
    async onNeedRefresh() {
      console.log('🔄 Update available - latest version ready')

      // Start recovery monitoring for potential black screen during update
      if (typeof window.startUpdateRecovery === 'function') {
        window.startUpdateRecovery();
      }

      // AGGRESSIVE ANDROID CACHE CLEARING - Fix infinite loading on Android
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
            if (key.startsWith('sb-') || key.includes('auth') || key.includes('supabase')) {
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

      // COMPREHENSIVE: iOS Cache Clearing + SW Cache Clearing
      try {
        console.log('🧹 Starting comprehensive cache clearing (iOS + SW)');

        // Use iOS cache cleaner for comprehensive clearing
        const cleanResult = await iOSCacheCleaner.clearAllCaches();

        if (cleanResult.success) {
          console.log('✅ Comprehensive cache clearing completed:', cleanResult.clearedCaches);
        } else {
          console.warn('⚠️ Cache clearing completed with errors:', cleanResult.errors);
        }

        // Additional SW cache clearing (your existing logic as backup)
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
      
      // Clear localStorage except critical data (prevent stale data issues)
      try {
        const criticalKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('sb-') || 
          key.includes('auth') || 
          key.includes('session') ||
          key.includes('supabase') ||
          key.includes('token') ||
          key.includes('audio') ||
          key.includes('cache') ||
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
      
      // Try to refresh session via AuthContext before backup
      if (user) {
        console.log('🔒 Refreshing session before deployment backup');
        const refreshResult = await refreshSession();
        
        if (!refreshResult.success) {
          console.warn('⚠️ Session refresh failed before update:', refreshResult.error);
          // Continue with backup even if refresh fails
        }
      }
      
      // CRITICAL: Backup auth AND audio cache for ALL platforms during updates
      console.log('🔒 Deployment detected - securing auth and audio cache')
      
      // Backup auth keys (all platforms)
      const authKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || 
        key.includes('auth') || 
        key.includes('session') ||
        key.includes('supabase') ||
        key.includes('token') ||
        key.match(/^supabase\.auth\./)
      );
      
      // Backup audio cache keys (CRITICAL for user experience)
      const audioCacheKeys = Object.keys(localStorage).filter(key => 
        key.includes('audio') || 
        key.includes('cache') ||
        key.includes('Audio') ||
        key.includes('Cache') ||
        key.startsWith('audio:') ||
        key.startsWith('cache:')
      );
      
      const fullBackup: Record<string, string> = {};
      
      // Backup auth data
      authKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) fullBackup[key] = value;
      });
      
      // Backup audio cache data (NEVER LOSE USER'S DOWNLOADED AUDIO)
      audioCacheKeys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) fullBackup[key] = value;
      });
      
      // Also backup current session from Supabase
      await supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          fullBackup['_session_backup'] = JSON.stringify(session);
        }
        
        // Store comprehensive backup
        if (isIOS) {
          sessionStorage.setItem('ios-deploy-backup', JSON.stringify(fullBackup));
          localStorage.setItem('ios-needs-recovery', 'true');
        } else {
          sessionStorage.setItem('deploy-backup', JSON.stringify(fullBackup));
          localStorage.setItem('needs-recovery', 'true');
        }
        
        console.log('✅ Auth + Audio cache secured for deployment');
      });
      
      // Only show toast if SW is ready (check if registration is active)
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        // Prevent showing update toast multiple times
        if (toastShownRef.current) {
          console.log('🔄 Update toast already shown, skipping');
          return;
        }

        // Toast removed per user request - no longer shows on update
        // showUpdateToast();
        toastShownRef.current = true;
        console.log('✅ Update initiated silently (toast removed)');
      } else {
        console.log('⚠️ Service Worker not ready, skipping toast');
      }
    }
  });


  return {
    needRefresh,
    updateServiceWorker,
  };
};