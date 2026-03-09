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
    // Android aggressive clearing success - Silent (no toast)
    const androidCleared = localStorage.getItem('android-sw-cleared');
    if (androidCleared === 'true') {
      localStorage.removeItem('android-sw-cleared');
      console.log('✅ Android cache cleared and app refreshed (silent update)');
    }

    // Update success - Silent (no toast)
    const updateSuccess = localStorage.getItem('update-success-flag');
    if (updateSuccess === 'true') {
      localStorage.removeItem('update-success-flag');
      console.log('✅ Update completed successfully (silent update)');
    }

    // SW update/recovery success - Silent (no toast)
    const swUpdated = localStorage.getItem('sw-update-success');
    if (swUpdated === 'true') {
      localStorage.removeItem('sw-update-success');

      // Check if there was a session warning during update
      const sessionWarning = localStorage.getItem('update-session-warning');
      if (sessionWarning === 'true') {
        localStorage.removeItem('update-session-warning');
        console.log('⚠️ SW Update completed with session warning (silent update)');
      } else {
        console.log('✅ SW Update completed successfully (silent update)');
      }
    }

    // CheckUpdateButton Profile Manual - Show toast for manual update check
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

    // Silent automatic updates - no toast notifications
  }, [toast]);

  // Function to show update toast with iOS-specific handling
  const showUpdateToast = () => {
    // Allow latest toast - dismiss any existing and show new one
    console.log('🔄 Showing latest update toast');
    const toastConfig = {
      title: "🎉 Update Januari 2026",
      description: "Audio bisa di download di device anda :)",
      duration: 5000, // Increased duration for better visibility
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
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log('!!!!!!!!!! onNeedRefresh FIRED !!!!!!!!!');
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log('🔄 Update available - latest version ready')

      // Start recovery monitoring for potential black screen during update
      if (typeof window.startUpdateRecovery === 'function') {
        window.startUpdateRecovery();
      }

      /* 
      // DISABLED: Aggressive cleaning defeated "Lifetime Cache". 
      // Now we rely on standard SW differential updates. 
      // Caches are only cleared if explicitly requested via recovery/reset.

      // AGGRESSIVE ANDROID CACHE CLEARING - Fix infinite loading on Android
      if (isAndroid) {
        console.log('🤖 ANDROID DETECTED - Starting aggressive cache clearing');
        // ... (removed aggressive clearing logic) ...
      }

      // COMPREHENSIVE: iOS Cache Clearing + SW Cache Clearing
      // ... (removed comprehensive clearing logic) ...
      
      // Clear localStorage except critical data
      // ... (removed localStorage clearing) ...
      */
      
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
        console.log('🔄 SEAMLESS UPDATE: Triggering automatic update...');
        
        // Show a brief, non-intrusive notification (optional, but good for UX so users know why it reloaded)
        toast({
          title: "🚀 Memperbarui App...",
          description: "Mengaktifkan fitur terbaru secara otomatis.",
          duration: 2000,
        });

        // Trigger the update after a tiny delay to allow the toast to be seen
        setTimeout(() => {
          updateServiceWorker(true);
        }, 1000);
        
        console.log('✅ Update initiated seamlessly');
      } else {
        console.log('⚠️ Service Worker not ready, skipping auto-update');
      }
    }
  });


  return {
    needRefresh,
    updateServiceWorker,
  };
};
