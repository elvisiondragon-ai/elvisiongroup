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
            onClick={() => {
              console.log('🔄 User clicked update, clearing localStorage')
              localStorage.removeItem('app-needs-update')
              updateServiceWorker(true)
              setNeedRefresh(false)
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
