import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToast } from "@/hooks/use-toast";
import { Auth } from "./pages/Auth";
import { ResetPassword } from "./pages/ResetPassword";
import Index from "./pages/Index";
import { Tutorial } from "./pages/Tutorial";
import NotFound from "./pages/NotFound";
import type { User } from '@supabase/supabase-js';
import { AudioProvider } from "@/contexts/AudioContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Initialize push notifications for authenticated users
  const { registerForNotifications } = usePushNotifications();

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
          const updateNotificationKey = `update_notification_2025_08_28`;
          if (!localStorage.getItem(updateNotificationKey)) {
            setTimeout(() => {
              toast({
                title: "🚀 Update Telah Tiba!",
                description: "Silahkan bersihkan Cookie dan Cache untuk kenyamanan User yang lebih baik",
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
        <AudioProvider>
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
        </AudioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
