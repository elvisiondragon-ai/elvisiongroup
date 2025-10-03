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
  
  // Initialize update system (handles all update toasts)
  useUpdateToast();

  // Clean up recovery URL parameter
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('recovery')) {
      console.log('🧹 Cleaning recovery parameter from URL');
      url.searchParams.delete('recovery');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

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

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
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
