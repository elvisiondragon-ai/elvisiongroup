import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { iOSCacheCleaner } from "@/utils/iOSCacheCleaner";

export const useUpdateToast = () => {
  const { toast } = useToast();
  const { refreshSession, user } = useAuth();
  const persistentToastInterval = useRef<NodeJS.Timeout | null>(null);
  const toastShownRef = useRef<boolean>(false);

  // In Next.js, we don't use virtual:pwa-register/react. 
  // We simulate the interface to prevent breaking existing components.
  const [needRefreshValue, setNeedRefreshValue] = useState(false);
  const needRefresh = [needRefreshValue, setNeedRefreshValue] as [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  
  const updateServiceWorker = (reloadPage?: boolean) => {
    if (reloadPage) {
      window.location.reload();
    }
  };

  // iOS detection
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  // Android detection
  const isAndroid = typeof window !== 'undefined' && /Android/.test(navigator.userAgent);

  // Check for success flag after refresh + show pending updates + SW recovery success
  useEffect(() => {
    if (typeof window === 'undefined') return;

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
  }, [toast]);

  // Function to show update toast with iOS-specific handling
  const showUpdateToast = () => {
    console.log('🔄 Showing latest update toast');
    const toastConfig = {
      title: "🎉 Update Januari 2026",
      description: "Audio bisa di download di device anda :)",
      duration: 5000, 
      className: "p-3 pr-4 space-x-3 [&>div>*:first-child]:text-sm",
    };

    return toast(toastConfig);
  };

  // Expose to window for console testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testUpdateToast = showUpdateToast;
      return () => {
        delete (window as any).testUpdateToast;
      };
    }
  }, []);

  return {
    needRefresh,
    updateServiceWorker,
  };
};
