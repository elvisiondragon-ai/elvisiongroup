import { useToast } from "@/hooks/use-toast";
import { useRegisterSW } from 'virtual:pwa-register/react';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";

export const useUpdateToast = () => {
  const { toast } = useToast();
  const persistentToastInterval = useRef<NodeJS.Timeout | null>(null);

  // Check for success flag after refresh + show pending updates
  useEffect(() => {
    const updateSuccess = localStorage.getItem('update-success-flag');
    if (updateSuccess === 'true') {
      localStorage.removeItem('update-success-flag');
      toast({
        title: "Update Berhasil",
        duration: 3000,
      });
    }

    // Check if there's a pending update on every refresh
    const pendingUpdate = localStorage.getItem('pending-update-available');
    if (pendingUpdate === 'true') {
      console.log('🔄 Pending update detected on refresh - showing toast');
      showUpdateToast();
    }
  }, [toast]);

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Function to show update toast
  const showUpdateToast = () => {
    toast({
      title: "🔵 UPDATE TERSEDIA", 
      description: "Double Click Disini",
      action: (
        <button 
          onClick={async () => {
            console.log('🔵 User clicked update button');
            
            // Clear pending update flag
            localStorage.removeItem('pending-update-available');
            
            // Set flag for success toast after refresh
            localStorage.setItem('update-success-flag', 'true');
            
            try {
              console.log('🔄 Starting service worker update...');
              await updateServiceWorker(true);
              console.log('✅ Service worker updated, reloading...');
              window.location.reload();
            } catch (error) {
              console.error('❌ Update failed:', error);
              // Still reload to get the update
              window.location.reload();
            }
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          Update Sekarang
        </button>
      ),
      duration: 0, // Don't auto-dismiss
    });
  };

  // PWA Update Logic
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('✅ SW Registered successfully:', r);
    },
    onRegisterError(error) {
      console.error('❌ SW registration error:', error);
    },
    async onNeedRefresh() {
      console.log('🔄 Update available - latest version ready')
      
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
      
      // Mark update as pending - will show toast on every refresh until user clicks
      localStorage.setItem('pending-update-available', 'true');
      
      // Show initial update toast
      showUpdateToast();
    }
  });

  return {
    needRefresh,
    updateServiceWorker,
  };
};