import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUpdateToast } from "@/hooks/UpdateToast";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { VerseToast } from "@/components/VerseToast";
import { ProStatusNotifications } from "@/components/ProStatusToast";
import { AppLoader } from "@/components/AppLoader";
import { Auth } from "./pages/Auth";
import { Signup } from "./pages/Signup";
import { ResetPassword } from "./pages/ResetPassword";
import Index from "./pages/Index";
import IncomeDashboard from "./pages/IncomeDashboard";
import DietPage from "./pages/diet";
import SlimPage from "./pages/SlimPage";
import SlimcoPaymentPage from "./pages/slimco";
import LevelPasrahPage from "./pages/levelpasrah";
import BrandFlow from "./pages/brandflow"; // Import the new BrandFlow component
import OnePercentRule from "./pages/1rule"; // Import the new OnePercentRule component
import Page15jt from "./pages/15jt";
import ELVision3000 from "./pages/3000";
import Survey3000 from "./pages/3000survey";
import PaypalPaymentPage from "./pages/paypal"; // Import the new PaypalPaymentPage component
import AffiliatePage from "./pages/affiliate"; // Import the new AffiliatePage component
import ArifAffiliate from "./pages/arifaffiliate"; // Import the ArifAffiliate component
import EbookElvisionPaymentPage from "./pages/ebookelvision"; // Import the EbookElvisionPaymentPage component
import EbookHealthLP from "./pages/ebookhealthlp"; // Import the EbookHealthLP component
import EbookPercayaDiriLP from "./pages/ebookpercayadirilp"; // Import the EbookPercayaDiriLP component
import EbookFeminineLanding from "./pages/ebookfeminine"; // Import the EbookFeminineLanding component
import PayPalFinish from "./pages/PayPalFinish"; // Import the PayPalFinish component
import FitFactorLP from "./pages/fitfactorlp";
import NotFound from "./pages/NotFound";
import { Terms } from "./pages/Terms";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ArifTestimonial } from "./pages/ArifTestimonial";
import { OldMember } from "./pages/OldMember";
import { DeleteAccount } from "./pages/DeleteAccount";
import Kalibrasi from "./pages/Kalibrasi";
import Formid from "./pages/Formid";
import FormAI from "./pages/FormAI";
import Pricing from "./pages/Pricing";
import DrelfPaymentPage from "./pages/drelf"; // Import the new DrelfPaymentPage component
import FitfactorPaymentPage from "./pages/fitfactor";
import HungrylaterPaymentPage from "./pages/hungrylater";
import ParfumPaymentPage from "./pages/parfum";
import DevPaymentPage from "./pages/dev";
import JewelryPaymentPage from "./pages/jewelry";
import { WhatIsPro } from "./components/whatispro";
import { Payment } from "./pages/Payment";
import ProUpgradePage from "./pages/prostatus";
import { AudioProvider } from "@/contexts/AudioContext";
import UpdateBanner from "./updatebanner";
import Intro from "./pages/intro";
import DisplayPage from "./pages/display";
import WatchlistPage from "./pages/watchlist";


import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MeditativeProvider } from "@/contexts/MeditativeContext";
import { supabase } from "@/integrations/supabase/client";
import { setupDebugTools } from "@/utils/debugTools";
import ServiceWorkerUpdater from "@/components/ServiceWorkerUpdater";

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
      const cleanUrl = `${url.protocol}//${url.host}/auth`;
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

  useEffect(() => {
    const clearAudioCache = async () => {
      const cacheCleared = localStorage.getItem('audioCacheCleared_v1');
      if (!cacheCleared) {
        console.log('Attempting to clear old audio cache...');
        try {
          await new Promise<void>((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase('ElVisionAudioCache');
            deleteRequest.onsuccess = () => {
              console.log('Old audio cache (ElVisionAudioCache) deleted successfully.');
              localStorage.setItem('audioCacheCleared_v1', 'true');
              resolve();
            };
            deleteRequest.onerror = (event) => {
              console.error('Error deleting old audio cache:', event);
              reject(new Error('Could not delete database'));
            };
            deleteRequest.onblocked = (event) => {
              console.warn('Old audio cache deletion is blocked. Please close other tabs with this app open.', event);
              reject(new Error('Database deletion blocked'));
            };
          });
        } catch (error) {
          console.error('Failed to clear old audio cache:', error);
        }
      }
    };

    clearAudioCache();
  }, []);

  return (
    <AppLoader>
      <ServiceWorkerUpdater />
      {/* <UpdateBanner /> */}
      <AudioProvider>
        <MeditativeProvider>

            <VerseToast />
            <ProStatusNotifications />
            <Toaster />
            <Sonner />
            <BrowserRouter future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}>
              <Routes>
                {/* Public routes - accessible without authentication */}
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/testi/arif" element={<ArifTestimonial />} />
                <Route path="/oldmember" element={<OldMember />} />
                <Route path="/delete" element={<DeleteAccount />} />
                <Route path="/kalibrasi" element={<Kalibrasi />} />
                <Route path="/formid" element={<Formid />} />
                <Route path="/formai" element={<FormAI />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/drelf" element={<DrelfPaymentPage />} />
                <Route path="/fitfactor" element={<FitfactorPaymentPage />} />
                <Route path="/hungrylater" element={<HungrylaterPaymentPage />} />
                <Route path="/parfum" element={<ParfumPaymentPage />} />
                <Route path="/dev" element={<DevPaymentPage />} />
                <Route path="/jewelry" element={<JewelryPaymentPage />} />
                <Route path="/whatispro" element={<WhatIsPro />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/prostatus" element={<ProUpgradePage />} />
                <Route path="/slim" element={<SlimPage />} />
                <Route path="/slim/co" element={<SlimcoPaymentPage />} />
                <Route path="/diet" element={<DietPage />} />
                <Route path="/ebook_elvision" element={<EbookElvisionPaymentPage />} />
                <Route path="/levelpasrah" element={<LevelPasrahPage />} />
                <Route path="/brandflow" element={<BrandFlow />} />
                <Route path="/1rule" element={<OnePercentRule />} />
                <Route path="/15jt" element={<Page15jt />} />
                <Route path="/3000" element={<ELVision3000 />} />
                <Route path="/3000survey" element={<Survey3000 />} />
                <Route path="/paypal" element={<PaypalPaymentPage />} />
                <Route path="/affiliate" element={<AffiliatePage />} />
                <Route path="/arif9" element={<ArifAffiliate />} />
                <Route path="/fitfactorlp" element={<FitFactorLP />} />
                <Route path="/ebookhealthlp" element={<EbookHealthLP />} />
                <Route path="/ebookpercayadiri" element={<EbookPercayaDiriLP />} />
                <Route path="/ebookfeminine" element={<EbookFeminineLanding />} />
                <Route path="/payment/paypal-finish" element={<PayPalFinish />} />
                <Route path="/income" element={<IncomeDashboard />} />
                <Route path="/intro" element={<Intro />} />
                <Route path="/display" element={<DisplayPage />} />
                <Route path="/watchlist" element={<WatchlistPage />} />
                
                {/* Auth routes */}
                <Route
                  path="/auth"
                  element={loading ? null : (user ? <Navigate to="/" replace /> : <Auth />)}
                />
                <Route
                  path="/signup"
                  element={loading ? null : (user ? <Navigate to="/" replace /> : <Signup />)}
                />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Protected root route - requires authentication */}
                <Route
                  path="/"
                  element={loading ? null : <Index />}
                />
                
                {/* 404 catch-all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>

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
