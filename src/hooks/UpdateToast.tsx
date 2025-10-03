import { useToast } from "@/hooks/use-toast";
import { useRegisterSW } from 'virtual:pwa-register/react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef } from "react";

export const useUpdateToast = () => {
  const { toast } = useToast();
  const { refreshSession, user } = useAuth();
  const persistentToastInterval = useRef<NodeJS.Timeout | null>(null);
  const toastShownRef = useRef<boolean>(false);

  // Check for success flag after refresh + show pending updates + SW recovery success
  useEffect(() => {
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

    // DON'T show toast on manual refresh - only when onNeedRefresh triggers it
  }, [toast]);

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Function to show update toast with iOS-specific handling
  const showUpdateToast = () => {
    // Prevent duplicate toasts
    if (toastShownRef.current) {
      console.log('🚫 Toast already shown, preventing duplicate');
      return;
    }
    toastShownRef.current = true;
    const toastConfig = {
      title: "🐢 Initiate Update...", 
      description: isIOS ? "IOS Device" : "Android",
      action: (
        <button 
          onClick={async () => {
            console.log('🔵 User clicked update button');
            
            // User clicked update button
            
            // Try to refresh session one more time before update
            if (user) {
              console.log('🔄 Final session refresh before update');
              const refreshResult = await refreshSession();
              
              if (!refreshResult.success) {
                console.warn('⚠️ Final session refresh failed:', refreshResult.error);
                
                // Show warning but continue with update
                toast({
                  title: "Session Warning",
                  description: "Session refresh failed. You may need to login again after update.",
                  duration: 3000,
                });
                
                // Mark for potential logout after update
                localStorage.setItem('update-session-warning', 'true');
              } else {
                console.log('✅ Final session refresh successful');
              }
            }
            
            // Set flag for success toast after refresh
            localStorage.setItem('update-success-flag', 'true');
            
            try {
              console.log('🔄 Starting service worker update...');
              await updateServiceWorker(true);
              console.log('✅ Service worker updated, reloading...');
              window.location.reload();
            } catch (error) {
              console.error('❌ Update failed:', error);
              
              // Show error toast but still try to reload
              toast({
                title: "Update Error",
                description: "Service worker update failed, forcing reload anyway",
                duration: 2000,
              });
              
              // Still reload to get the update
              setTimeout(() => window.location.reload(), 2000);
            }
          }}
          className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 hover:from-purple-900 hover:via-slate-800 hover:to-purple-900 text-amber-100 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation shadow-2xl ring-1 ring-white/10"
          // iOS-specific touch handling
          style={isIOS ? { 
            WebkitTapHighlightColor: 'transparent',
            minHeight: '44px', // iOS recommended touch target
            minWidth: '44px'
          } : {}}
        >
          Double Click Disini
        </button>
      ),
      duration: 0, // Don't auto-dismiss
    };

    // Show toast 
    const toastInstance = toast(toastConfig);
    
    return toastInstance;
  };

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
        
        // Set up periodic update checks every 60 seconds
        setInterval(() => {
          console.log('🔍 Periodic update check');
          r.update();
        }, 60000);
      }
    },
    onRegisterError(error) {
      console.error('❌ SW registration error:', error);
    },
    async onNeedRefresh() {
      console.log('🔄 Update available - latest version ready')
      
      // IMMEDIATE: Clear all service worker caches FIRST (before white screen can occur)
      try {
        if ('serviceWorker' in navigator) {
          const cacheNames = await caches.keys();
          console.log('🗑️ PRE-DEPLOYMENT: Clearing', cacheNames.length, 'SW caches to prevent white screen');
          await Promise.all(cacheNames.map(name => caches.delete(name)));
          console.log('✅ All SW caches cleared - white screen prevented');
        }
      } catch (error) {
        console.error('❌ Failed to clear SW caches:', error);
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
      
      // Show update toast immediately when onNeedRefresh triggers
      showUpdateToast();
    }
  });

  return {
    needRefresh,
    updateServiceWorker,
  };
};