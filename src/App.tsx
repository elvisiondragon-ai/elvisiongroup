import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { useAppUpdates } from "@/hooks/useAppUpdates";
import { useFreeUserNotifications } from "@/hooks/useFreeUserNotifications";
import { FreeUserNotificationModal } from "@/components/FreeUserNotificationModal";
import { useToast } from "@/hooks/use-toast";
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Auth } from "./pages/Auth";
import { Signup } from "./pages/Signup";
import { ResetPassword } from "./pages/ResetPassword";
import Index from "./pages/Index";
import { TutorialVideo } from "./pages/TutorialVideo";
import NotFound from "./pages/NotFound";
import { Terms } from "./pages/Terms";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ArifTestimonial } from "./pages/ArifTestimonial";
import type { User } from '@supabase/supabase-js';
import { AudioProvider } from "@/contexts/AudioContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MeditativeProvider } from "@/contexts/MeditativeContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const [updateClicked, setUpdateClicked] = useState(false);
  const [toastId, setToastId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, loading } = useAuth();

  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // PWA Update Logic
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
    onNeedRefresh() {
      console.log('🔄 Update available - latest version ready')
      
      // iOS-specific: Backup auth IMMEDIATELY when update is detected
      if (isIOS) {
        console.log('📱 iOS deployment detected - backing up auth')
        const authKeys = Object.keys(localStorage).filter(key => 
          key.startsWith('sb-') || 
          key.includes('auth') || 
          key.includes('session') ||
          key.includes('supabase') ||
          key.includes('token') ||
          key.match(/^supabase\.auth\./)
        );
        const authBackup: Record<string, string> = {};
        authKeys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value) authBackup[key] = value;
        });
        
        // Also backup current session from Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            authBackup['_session_backup'] = JSON.stringify(session);
          }
          sessionStorage.setItem('ios-deploy-backup', JSON.stringify(authBackup));
          localStorage.setItem('ios-needs-recovery', 'true');
        });
      }
      
      // Always mark as needing update - this will refresh existing button to latest version
      localStorage.setItem('app-needs-update', 'true')
      localStorage.setItem('update-timestamp', Date.now().toString())
      // Reset blocker so notification can show for new updates  
      localStorage.removeItem('force-refresh-completed')
    }
  })

  // Show soft update notification when available
  useEffect(() => {
    const showSoftUpdateToast = () => {
      // Prevent multiple toasts
      if (toastId) return;
      
      const newToastId = toast({
        title: "🔵 SOFT UPDATE 🛜",
        description: "Klik untuk update ke versi terbaru aplikasi",
        action: (
          <button 
            onClick={(e) => {
              // Prevent double clicks on iOS
              if (updateClicked) return;
              
              // iOS-specific event handling
              e.preventDefault();
              e.stopPropagation();
              setUpdateClicked(true);
              
              console.log('🔵 User clicked SOFT UPDATE button')
              localStorage.removeItem('app-needs-update')
              
              // Backup ALL auth tokens before SW update
              const authKeys = Object.keys(localStorage).filter(key => 
                key.startsWith('sb-') || 
                key.includes('auth') || 
                key.includes('session') ||
                key.includes('supabase') ||
                key.includes('token') ||
                key.match(/^supabase\.auth\./)
              );
              const authBackup: Record<string, string> = {};
              authKeys.forEach(key => {
                const value = localStorage.getItem(key);
                if (value) authBackup[key] = value;
              });
              
              // Also backup current session from Supabase
              supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                  authBackup['_session_backup'] = JSON.stringify(session);
                }
                sessionStorage.setItem('auth-backup', JSON.stringify(authBackup));
              });
              
              sessionStorage.setItem('auth-backup', JSON.stringify(authBackup));
              
              localStorage.setItem('force-refresh-completed', 'true');
              localStorage.setItem('update-success-pending', 'true');
              
              console.log('🔵 SOFT UPDATE: Auth backed up, updating service worker');
              
              // iOS-specific timing adjustments
              const updateDelay = isIOS ? 200 : 50;
              const resetDelay = isIOS ? 2000 : 1500;
              
              setTimeout(() => {
                try {
                  updateServiceWorker(true)
                  setNeedRefresh(false)
                  setToastId(null);
                  
                  // Restore auth after SW update with better timing
                  setTimeout(async () => {
                    const backup = sessionStorage.getItem('auth-backup');
                    if (backup) {
                      const authData = JSON.parse(backup);
                      
                      // Restore localStorage items first
                      Object.keys(authData).forEach(key => {
                        if (key !== '_session_backup' && authData[key]) {
                          localStorage.setItem(key, authData[key]);
                        }
                      });
                      
                      // Then restore session if available
                      if (authData._session_backup) {
                        try {
                          const session = JSON.parse(authData._session_backup);
                          await supabase.auth.setSession(session);
                          console.log('🔄 Session restored from backup');
                        } catch (e) {
                          console.warn('⚠️ Failed to restore session:', e);
                        }
                      }
                      
                      sessionStorage.removeItem('auth-backup');
                    }
                  }, 500);
                  
                  // iOS fallback: Force reload if service worker fails
                  if (isIOS) {
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  }
                } catch (error) {
                  console.error('Service worker update failed:', error);
                  // Restore auth before fallback reload
                  const backup = sessionStorage.getItem('auth-backup');
                  if (backup) {
                    const authData = JSON.parse(backup);
                    Object.keys(authData).forEach(key => {
                      if (key !== '_session_backup' && authData[key]) {
                        localStorage.setItem(key, authData[key]);
                      }
                    });
                  }
                  window.location.reload();
                }
                
                // Always reset state after delay (in case reload fails)
                setTimeout(() => {
                  setUpdateClicked(false);
                  setToastId(null);
                }, resetDelay);
              }, updateDelay);
            }}
            onTouchStart={(e) => {
              // iOS-specific: Handle touch events properly
              e.preventDefault();
            }}
            disabled={updateClicked}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              updateClicked 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80'
            }`}
          >
            Double Click disini untuk update
          </button>
        ),
        duration: 0, // Don't auto-dismiss
      });
      
      setToastId(newToastId);
    }

    // Check if update is available from SW or localStorage
    const hasUpdate = needRefresh || localStorage.getItem('app-needs-update') === 'true'
    const forceRefreshCompleted = localStorage.getItem('force-refresh-completed') === 'true'
    const updateTimestamp = localStorage.getItem('update-timestamp')
    
    if (hasUpdate && !forceRefreshCompleted) {
      // If we already have a toast but there's a newer update, dismiss old one first
      if (toastId && updateTimestamp) {
        console.log('🔄 Newer update available, refreshing notification')
        // The existing toast will be replaced by the new one
      }
      
      if (!toastId || updateTimestamp) {
        console.log('📢 Showing latest update notification')
        showSoftUpdateToast()
      }
    }
    
    // Cleanup toast ID when update completes
    return () => {
      if (!hasUpdate) {
        setToastId(null);
      }
    };
  }, [needRefresh, toast, updateServiceWorker, setNeedRefresh, toastId]);

  // Show success notification after refresh
  useEffect(() => {
    const updateSuccess = localStorage.getItem('update-success-pending');
    if (updateSuccess === 'true') {
      localStorage.removeItem('update-success-pending');
      toast({
        title: "🚀 Update berhasil diperbarui",
        description: "Aplikasi telah diperbarui ke versi terbaru",
        variant: "default"
      });
    }
  }, [toast]);

  const {
    showModal,
    currentReason,
    handleModalNavigate,
    handleModalClose
  } = useFreeUserNotifications();

  // Pro status change notification (persistent like deploy notification)
  useEffect(() => {
    const proStatusChange = localStorage.getItem('pro-status-change');
    if (proStatusChange) {
      const { type } = JSON.parse(proStatusChange);
      
      const showProNotification = () => {
        if (type === 'cancelled') {
          toast({
            title: "⚠️ Status Pro Berakhir!",
            description: "Status Pro anda Telah habis, Klik disini untuk Refresh",
            action: (
              <button 
                onClick={() => {
                  localStorage.removeItem('pro-status-change');
                  localStorage.removeItem('unified_pro_status_cache');
                  window.location.reload();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Refresh Sekarang
              </button>
            ),
            duration: 0, // Never disappear
          });
        } else if (type === 'granted') {
          toast({
            title: "🎉 Status Pro Aktif!",
            description: "Status Pro anda telah aktif, Klik disini untuk Refresh dan Akses Pro",
            action: (
              <button 
                onClick={() => {
                  localStorage.removeItem('pro-status-change');
                  localStorage.removeItem('unified_pro_status_cache');
                  window.location.reload();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                🔄 Refresh dan Akses Pro!
              </button>
            ),
            duration: 0, // Never disappear
          });
        }
      };
      
      showProNotification();
    }
  }, [toast]);


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <AudioProvider>
      <MeditativeProvider>
        <UserProfileProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}>
            <Routes>
              <Route 
                path="/" 
                element={user ? <Index /> : <Auth />} 
              />
              <Route 
                path="/auth" 
                element={<Navigate to="/" replace />} 
              />
              <Route 
                path="/signup" 
                element={user ? <Index /> : <Signup />} 
              />
              <Route 
                path="/tutorial" 
                element={user ? <TutorialVideo /> : <Auth />} 
              />
              <Route
                path="/reset-password"
                element={<ResetPassword />}
              />
              <Route
                path="/terms"
                element={<Terms />}
              />
              <Route
                path="/privacy-policy"
                element={<PrivacyPolicy />}
              />
              <Route 
                path="/testi/arif" 
                element={<ArifTestimonial />}
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>

          {/* Free User Notification Modal */}
          <FreeUserNotificationModal
            isVisible={showModal}
            onClose={handleModalClose}
            onNavigate={handleModalNavigate}
            reason={currentReason}
          />
        </UserProfileProvider>
      </MeditativeProvider>
    </AudioProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
