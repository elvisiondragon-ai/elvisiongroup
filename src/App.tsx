import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUpdateToast } from "@/hooks/UpdateToast";
import { VerseToast } from "@/components/VerseToast";
import { FreeUserNotifications } from "@/hooks/useFreeUserNotifications";
import { ProStatusNotifications } from "@/components/ProStatusToast";
import { AppLoader } from "@/components/AppLoader";
import { Auth } from "./pages/Auth";
import { Signup } from "./pages/Signup";
import { ResetPassword } from "./pages/ResetPassword";
import Index from "./pages/Index";
import { TutorialVideo } from "./pages/TutorialVideo";
import NotFound from "./pages/NotFound";
import { Terms } from "./pages/Terms";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ArifTestimonial } from "./pages/ArifTestimonial";
import { AudioProvider } from "@/contexts/AudioContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MeditativeProvider } from "@/contexts/MeditativeContext";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user } = useAuth();
  
  // Initialize update system
  useUpdateToast();

  // Global error handler to prevent blocking failures + service worker cache clear handler
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log('Unhandled promise rejection caught (app continues):', event.reason);
      // Prevent the error from blocking the app
      event.preventDefault();
    };

    const handleError = (event: ErrorEvent) => {
      console.log('Global error caught (app continues):', event.error);
      // Don't prevent default for non-blocking errors
    };

    // Listen for RECOVERY messages from simplified service worker
    const handleMessage = async (event: MessageEvent) => {
      // RECOVERY MODE - Smart session refresh instead of logout
      if (event.data && event.data.type === 'RECOVERY_MODE' && event.data.action === 'clear_and_reload') {
        console.log('🚑 RECOVERY MODE ACTIVATED:', event.data.version);
        
        // Try to refresh session instead of clearing auth
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // User is logged in - refresh their session
            console.log('🚑 Recovery: Refreshing user session');
            await supabase.auth.refreshSession();
            console.log('🚑 Recovery: Session refreshed successfully');
          } else {
            console.log('🚑 Recovery: No active session to refresh');
          }
        } catch (e) {
          console.log('🚑 Recovery: Session refresh failed, continuing without auth clear');
        }
        
        // Clear only non-auth storage
        try {
          // Keep auth-related keys, clear everything else
          const authKeys = Object.keys(localStorage).filter(key => 
            key.includes('supabase') || 
            key.includes('auth') || 
            key.includes('session')
          );
          
          // Clear non-auth localStorage
          Object.keys(localStorage).forEach(key => {
            if (!authKeys.includes(key)) {
              localStorage.removeItem(key);
            }
          });
          
          // Clear sessionStorage (usually non-critical)
          sessionStorage.clear();
          console.log('🚑 Recovery: Cleared non-auth storage, preserved session');
        } catch (e) {
          console.log('🚑 Recovery: Storage clear failed, continuing');
        }
        
        // Force reload with cache bypass - users stay logged in
        console.log('🚑 Recovery: Force reloading with preserved session');
        window.location.href = window.location.origin + '?recovery=' + Date.now();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    navigator.serviceWorker?.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <AppLoader>
      <AudioProvider>
        <MeditativeProvider>
          <UserProfileProvider>
            <VerseToast />
            <FreeUserNotifications />
            <ProStatusNotifications />
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
          </UserProfileProvider>
        </MeditativeProvider>
      </AudioProvider>
    </AppLoader>
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
