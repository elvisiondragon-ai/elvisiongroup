import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUpdateToast } from "@/hooks/UpdateToast";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { VerseToast } from "@/components/VerseToast";
import { FreeUserNotifications } from "@/hooks/useFreeUserNotifications";
import { ProStatusNotifications } from "@/components/ProStatusToast";
import { AppLoader } from "@/components/AppLoader";
import { Auth } from "./pages/Auth";
import { Signup } from "./pages/Signup";
import { ResetPassword } from "./pages/ResetPassword";
import Index from "./pages/Index";

import NotFound from "./pages/NotFound";
import { Terms } from "./pages/Terms";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ArifTestimonial } from "./pages/ArifTestimonial";
import { OldMember } from "./pages/OldMember";
import { DeleteAccount } from "./pages/DeleteAccount";
import { AudioProvider } from "@/contexts/AudioContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MeditativeProvider } from "@/contexts/MeditativeContext";
import { supabase } from "@/integrations/supabase/client";
import { setupDebugTools } from "@/utils/debugTools";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();

  // Initialize real-time notifications
  useRealTimeNotifications(user);

  // Initialize update system (handles all update toasts)
  useUpdateToast();

  // Redirect recovery URLs to clean URLs
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has('recovery') || url.searchParams.has('recovery_manual')) {
      console.log('🔄 Redirecting recovery URL to clean URL');
      // Redirect to clean URL without recovery parameters
      const cleanUrl = `${url.protocol}//${url.host}/`;
      window.location.href = cleanUrl;
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

  // Initialize debug tools for browser console
  useEffect(() => {
    setupDebugTools();
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
                  element={loading ? null : (user ? <Index /> : <Auth />)} 
                />
                <Route 
                  path="/auth" 
                  element={<Navigate to="/" replace />} 
                />
                <Route 
                  path="/signup" 
                  element={loading ? null : (user ? <Index /> : <Signup />)} 
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
                <Route 
                  path="/oldmember" 
                  element={<OldMember />}
                />
                <Route
                  path="/delete"
                  element={<DeleteAccount />}
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
