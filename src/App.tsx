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
import type { User } from '@supabase/supabase-js';
import { AudioProvider } from "@/contexts/AudioContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { MeditativeProvider } from "@/contexts/MeditativeContext";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateClicked, setUpdateClicked] = useState(false);
  const [toastId, setToastId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Initialize push notifications for authenticated users
  const { registerForNotifications } = usePushNotifications();
  
  // Initialize real-time notifications
  useRealTimeNotifications(user);

  // Initialize app updates check
  useAppUpdates(user);

  // Initialize free user daily notifications
  const {
    showModal,
    currentReason,
    handleModalNavigate,
    handleModalClose
  } = useFreeUserNotifications();

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
      console.log('🔄 Update available, saving to localStorage')
      localStorage.setItem('app-needs-update', 'true')
    }
  })

  // Show update notification when available
  useEffect(() => {
    const showUpdateToast = () => {
      // Prevent multiple toasts
      if (toastId) return;
      
      const newToastId = toast({
        title: "🎯 Ada Update Terbaru! - Auto Deploy Notification",
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
              
              console.log('🔄 User clicked update, clearing localStorage')
              localStorage.removeItem('app-needs-update')
              
              // Set flag for success message after reload
              localStorage.setItem('update-success-pending', 'true');
              
              // iOS-specific timing adjustments
              const updateDelay = isIOS ? 200 : 50;
              const resetDelay = isIOS ? 3000 : 2000;
              
              setTimeout(() => {
                updateServiceWorker(true)
                setNeedRefresh(false)
                setToastId(null); // Clear toast reference
                
                // Reset state after update completes
                setTimeout(() => {
                  setUpdateClicked(false);
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
            Tekan disini untuk update otomatis
          </button>
        ),
        duration: 0, // Don't auto-dismiss
      });
      
      setToastId(newToastId);
    }

    // Check if update is available from SW or localStorage
    const hasUpdate = needRefresh || localStorage.getItem('app-needs-update') === 'true'
    
    if (hasUpdate && !toastId) {
      console.log('📢 Showing update notification')
      showUpdateToast()
    }
    
    // Cleanup toast ID when update completes
    return () => {
      if (!hasUpdate) {
        setToastId(null);
      }
    };
  }, [needRefresh, toast, updateServiceWorker, setNeedRefresh, toastId]);

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

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Handle successful sign in (both login and signup)
          setUser(session.user);
          setIsLoading(false);
          
          // Clear OAuth hash and query params from URL after successful login - Safari fix
          if (window.location.hash || window.location.search.includes('access_token')) {
            const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
            window.history.replaceState(null, '', cleanUrl);
          }
          
          // Show login success toast if pending
          if (localStorage.getItem('login-success-pending') === 'true') {
            setTimeout(() => {
              toast({
                title: "Selamat datang kembali!",
                description: "Anda telah berhasil masuk.",
              });
              localStorage.removeItem('login-success-pending');
            }, 1000);
          }

          // Show signup success toast if pending
          if (localStorage.getItem('signup-success-pending') === 'true') {
            setTimeout(() => {
              toast({
                title: "Akun Berhasil Dibuat!",
                description: "Anda berhasil mendaftar dan masuk.",
              });
              localStorage.removeItem('signup-success-pending');
            }, 1000);
          }


          // THROTTLED notification registration to prevent spam
          const registerKey = `register_${session.user.id}`;
          if (!sessionStorage.getItem(registerKey)) {
            setTimeout(() => {
              console.log('User authenticated successfully:', session.user.email);
              registerForNotifications();
              sessionStorage.setItem(registerKey, 'true');
            }, 1000);
          }

          // Track daily login to update last_login_date
          setTimeout(async () => {
            try {
              const { error } = await supabase.rpc('handle_daily_login', {
                p_user_id: session.user.id
              });
              if (error) {
                console.error('Error updating login date:', error);
              } else {
                console.log('Login date updated successfully');
              }
            } catch (error) {
              console.error('Failed to track login:', error);
            }
          }, 500);
          
          // Check for broadcast notifications and unread personal notifications on login (one-time ever)
          // Check database instead of localStorage to survive cache/cookie clear
          setTimeout(async () => {
            try {
              // Check if user has already been shown broadcast notifications
              const { data: hasSeenBroadcasts, error: checkError } = await supabase
                .rpc('check_user_notification_shown', {
                  p_user_id: session.user.id,
                  p_notification_type: 'broadcasts_checked'
                });

              if (checkError) {
                console.error('Error checking notification status:', checkError);
                return;
              }

              // Only show notifications if user hasn't seen them before
              if (!hasSeenBroadcasts) {
                // Check broadcast notifications (global announcements)
                const { data: broadcasts, error: broadcastError } = await supabase
                  .from('broadcast_notifications')
                  .select('*')
                  .gt('expires_at', new Date().toISOString())
                  .order('created_at', { ascending: false });

                // Check personal notifications
                const { data: notifications, error: notificationError } = await supabase
                  .from('notifications')
                  .select('*')
                  .eq('user_id', session.user.id)
                  .eq('read', false)
                  .order('created_at', { ascending: false });

                if (broadcastError) {
                  console.error('Error fetching broadcast notifications:', broadcastError);
                }

                if (notificationError) {
                  console.error('Error fetching notifications:', notificationError);
                }

                // Combine broadcasts and personal notifications
                const allNotifications = [
                  ...(broadcasts || []).map(n => ({ ...n, isBroadcast: true })),
                  ...(notifications || []).map(n => ({ ...n, isBroadcast: false }))
                ];

                // Show each notification only if not shown before
                allNotifications.forEach((notification, index) => {
                  setTimeout(() => {
                    toast({
                      title: notification.title,
                      description: notification.message,
                      variant: notification.type === 'error' ? 'destructive' : 'default',
                      duration: 15000,
                    });
                    
                    // Mark personal notifications as read (broadcasts don't need marking)
                    if (!notification.isBroadcast) {
                      supabase
                        .from('notifications')
                        .update({ read: true })
                        .eq('id', notification.id)
                        .then(() => console.log('Notification marked as read:', notification.id));
                    }
                  }, index * 1000); // Stagger notifications by 1 second each
                });

                // Mark notifications as checked forever in database
                await supabase.rpc('mark_notification_type_shown', {
                  p_user_id: session.user.id,
                  p_notification_type: 'broadcasts_checked'
                });
              }
            } catch (error) {
              console.error('Error checking notifications:', error);
            }
          }, 1500);
          
          // Show one-time update notification
          const updateNotificationKey = `update_notification_2025_08_31`;
          if (!localStorage.getItem(updateNotificationKey)) {
            setTimeout(() => {
              toast({
                title: "🎉 Sukses Update! - Auto Deploy Notification",
                description: "Anda sudah di Versi Terbaru, Selamat menikmati 🚀",
                duration: 8000,
              });
              localStorage.setItem(updateNotificationKey, 'true');
            }, 2000);
          }
          
          // Show update success notification after manual update (iOS fix)
          const updateSuccessPending = localStorage.getItem('update-success-pending');
          if (updateSuccessPending) {
            setTimeout(() => {
              toast({
                title: "🚀 Update Berhasil!",
                description: "Aplikasi berhasil diperbarui ke versi terbaru ✅",
                duration: 6000,
              });
              localStorage.removeItem('update-success-pending');
            }, 1000);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
          // Clear session data on signout
          sessionStorage.clear();
        } else if (event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null);
        }
      }
    );

    // THEN check for existing session - ONLY ONCE
    let hasCheckedSession = false;
    if (!hasCheckedSession) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        hasCheckedSession = true;
      });
    }

    return () => subscription.unsubscribe();
  }, [registerForNotifications]); // FIXED: Add dependency

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AudioProvider>
            <MeditativeProvider>
              <UserProfileProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={user ? <Index /> : <Auth onLogin={setUser} />} 
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
                element={user ? <TutorialVideo /> : <Auth onLogin={setUser} />} 
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
              </UserProfileProvider>
            </MeditativeProvider>
          </AudioProvider>
        </AuthProvider>

        {/* Free User Notification Modal */}
        <FreeUserNotificationModal
          isVisible={showModal}
          onClose={handleModalClose}
          onNavigate={handleModalNavigate}
          reason={currentReason}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
