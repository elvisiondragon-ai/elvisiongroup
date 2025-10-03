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

    // Listen for cache clear messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CACHE_CLEARED' && event.data.action === 'refresh') {
        console.log('🔄 Cache cleared by SW - Force refresh to prevent white/black screen');
        // Small delay to ensure SW is ready, then force refresh
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
      
      // NUCLEAR CACHE CLEAR - Force logout and complete refresh
      if (event.data && event.data.type === 'NUCLEAR_CACHE_CLEAR' && event.data.action === 'nuke_and_logout') {
        console.log('💥 NUCLEAR CACHE CLEAR - Force logout and complete refresh', event.data.version);
        
        // NUKE ALL STORAGE
        try {
          localStorage.clear();
          sessionStorage.clear();
          console.log('💥 NUKE: Cleared localStorage and sessionStorage');
        } catch (e) {
          console.log('Storage clear failed:', e);
        }
        
        // Clear IndexedDB (Supabase auth)
        if (window.indexedDB) {
          try {
            indexedDB.deleteDatabase('supabase-auth-token');
            console.log('💥 NUKE: Cleared IndexedDB auth');
          } catch (e) {
            console.log('IndexedDB clear failed:', e);
          }
        }
        
        // NUCLEAR REFRESH with cache bypass
        setTimeout(() => {
          console.log('💥 NUKE: Force reload with cache bypass');
          window.location.href = window.location.href + '?nuke=' + Date.now();
        }, 200);
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
