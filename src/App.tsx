import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { useToast } from "@/hooks/use-toast";
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useXPSystem } from "@/hooks/useXPSystem";
import { Auth } from "./pages/Auth";
import { ResetPassword } from "./pages/ResetPassword";
import Index from "./pages/Index";
import { Tutorial } from "./pages/Tutorial";
import NotFound from "./pages/NotFound";
import type { User } from '@supabase/supabase-js';
import { AudioProvider } from "@/contexts/AudioContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { MeditativeProvider } from "@/contexts/MeditativeContext";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { awardXP } = useXPSystem();
  
  // Initialize push notifications for authenticated users
  const { registerForNotifications } = usePushNotifications();
  
  // Initialize real-time notifications
  useRealTimeNotifications(user);

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
      toast({
        title: "🎯 Ada Update Terbaru!",
        description: "Klik untuk update ke versi terbaru aplikasi",
        action: (
          <button 
            onClick={async () => {
              console.log('🔄 User clicked update, clearing localStorage')
              localStorage.removeItem('app-needs-update')
              updateServiceWorker(true)
              setNeedRefresh(false)
              // Award XP for updating app
              if (user) {
                await awardXP('bonus_exp', 10, 'Update aplikasi ke versi terbaru');
              }
            }}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Tekan disini untuk update otomatis
          </button>
        ),
        duration: 0, // Don't auto-dismiss
      });
    }

    // Check if update is available from SW or localStorage
    const hasUpdate = needRefresh || localStorage.getItem('app-needs-update') === 'true'
    
    if (hasUpdate) {
      console.log('📢 Showing update notification')
      showUpdateToast()
    }
  }, [needRefresh, toast, updateServiceWorker, setNeedRefresh]);

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
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
          
          // THROTTLED notification registration to prevent spam
          const registerKey = `register_${session.user.id}`;
          if (!sessionStorage.getItem(registerKey)) {
            setTimeout(() => {
              console.log('User authenticated successfully:', session.user.email);
              registerForNotifications();
              sessionStorage.setItem(registerKey, 'true');
            }, 1000);
          }
          
          // Check for broadcast notifications and unread personal notifications on login
          setTimeout(async () => {
            try {
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

              // Show each notification
              allNotifications.forEach((notification, index) => {
                setTimeout(() => {
                  toast({
                    title: notification.title,
                    description: notification.message,
                    variant: notification.type === 'error' ? 'destructive' : 'default',
                    duration: notification.type === 'error' ? 8000 : 5000,
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
            } catch (error) {
              console.error('Error checking notifications:', error);
            }
          }, 1500);
          
          // Show one-time update notification
          const updateNotificationKey = `update_notification_2025_08_31`;
          if (!localStorage.getItem(updateNotificationKey)) {
            setTimeout(() => {
              toast({
                title: "🎉 Sukses Update!",
                description: "Anda sudah di Versi Terbaru, Selamat menikmati 🚀",
                duration: 8000,
              });
              localStorage.setItem(updateNotificationKey, 'true');
            }, 2000);
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
                element={user ? <Index /> : <Auth onLogin={setUser} />} 
              />
              <Route 
                path="/tutorial" 
                element={user ? <Tutorial /> : <Auth onLogin={setUser} />} 
              />
              <Route 
                path="/reset-password" 
                element={<ResetPassword />} 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
              </UserProfileProvider>
            </MeditativeProvider>
          </AudioProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
