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

import DietPage from "./pages/ebook_indo/ebook_langsing";
import SlimPage from "./pages/usa/usa_ebookslim";

import Page15jt from "./pages/ebook_indo/vip_15jt";
import ELVision3000 from "./pages/usa/usa_3000";
import Pay3000 from "./pages/usa/usa_pay3000";
import Survey3000 from "./pages/usa/usa_3000survey";
import PaypalPaymentPage from "./pages/usa/usa_paypal"; // Import the new PaypalPaymentPage component
import AffiliatePage from "./pages/tools_pages/affiliate"; // Import the new AffiliatePage component
import ArifAffiliate from "./pages/ebook_indo/arifaffiliate"; // Import the ArifAffiliate component
import EbookElvisionPaymentPage from "./pages/ebook_indo/ebook_elvision"; // Import the EbookElvisionPaymentPage component
import EbookHealthLP from "./pages/usa/usa_ebookhealth"; // Import the EbookHealthLP component
import EbookPercayaDiriLP from "./pages/ebook_indo/ebook_percayadiri"; // Import the EbookPercayaDiriLP component
import EbookFeminineLanding from "./pages/ebook_indo/ebook_feminine"; // Import the EbookFeminineLanding component
import UsaEbookFeminine from "./pages/usa/usa_ebookfeminine"; // Import the UsaEbookFeminine component
import UangPanasLanding from "./pages/ebook_indo/uangpanas"; // Import the UangPanasLanding component
import LeadMagnet from "./pages/tools_pages/leadmagnet"; // Import the LeadMagnet component
import PayPalFinish from "./pages/usa/usa_paypal_finish"; // Import the PayPalFinish component
import FitFactorLP from "./pages/brands/fitfactorlp";
import NotFound from "./pages/NotFound";
import { Terms } from "./pages/Terms";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";

import { DeleteAccount } from "./pages/DeleteAccount";
import Formid from "./pages/Formid";

import Pricing from "./pages/Pricing";
import DrelfPaymentPage from "./pages/brands/drelf"; // Import the new DrelfPaymentPage component
import FitfactorPaymentPage from "./pages/brands/fitfactor";
import HungrylaterPaymentPage from "./pages/brands/hungrylater";
import ParfumPaymentPage from "./pages/brands/elroyaleparfum";
import DevPaymentPage from "./pages/dev";
import JewelryPaymentPage from "./pages/brands/elroyaljewelry";
import { WhatIsPro } from "./components/whatispro";
import { Payment } from "./pages/Payment";
import ProUpgradePage from "./pages/prostatus";
import { AudioProvider } from "@/contexts/AudioContext";
import UpdateBanner from "./updatebanner";
import Intro from "./pages/intro";
import DisplayPage from "./pages/display";
import ReportSales from "./pages/tools_pages/reportsales";
import DrelfLpPage from "./pages/brands/drelflp";
import Testimony from "./pages/testimony"; // Import the new Testimony component
import CreatorPage from "./pages/tools_pages/creator_api";
import ResellerLanding from "./pages/tools_pages/reseller";
import Pixels from "./pages/tools_pages/pixels";
import RisetPage from "./pages/tools_pages/riset";

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MeditativeProvider } from "@/contexts/MeditativeContext";
import { supabase } from "@/integrations/supabase/client";
import { setupDebugTools } from "@/utils/debugTools";
import ServiceWorkerUpdater from "@/components/ServiceWorkerUpdater";
import { cleanupStaleServiceWorkers } from "@/utils/cleanupStaleSW";

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
      // Always cleanup stale workers on boot
      await cleanupStaleServiceWorkers();

      // Clear workbox precache if it exists (aggressive cleanup)
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          if (cacheName.includes('workbox-precache')) {
            await caches.delete(cacheName);
            console.log(`Deleted stale cache: ${cacheName}`);
          }
        }
      }

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
                {/* Public & Main routes */}
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/delete" element={<DeleteAccount />} />
                <Route path="/formid" element={<Formid />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/whatispro" element={<WhatIsPro />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/prostatus" element={<ProUpgradePage />} />
                <Route path="/intro" element={<Intro />} />
                <Route path="/display" element={<DisplayPage />} />
                <Route path="/testimony" element={<Testimony />} />

                {/* // SEction Tools_pages */}
                <Route path="/affiliate" element={<AffiliatePage />} />
                <Route path="/reportsales" element={<ReportSales />} />
                <Route path="/creator_api" element={<CreatorPage />} />
                <Route path="/reseller" element={<ResellerLanding />} />
                <Route path="/pixels" element={<Pixels />} />
                <Route path="/riset" element={<RisetPage />} />
                <Route path="/leadmagnet" element={<LeadMagnet />} />

                {/* // Section Brands */}
                <Route path="/drelf" element={<DrelfPaymentPage />} />
                <Route path="/fitfactor" element={<FitfactorPaymentPage />} />
                <Route path="/hungrylater" element={<HungrylaterPaymentPage />} />
                <Route path="/elroyaleparfum" element={<ParfumPaymentPage />} />
                <Route path="/elroyaljewelry" element={<JewelryPaymentPage />} />
                <Route path="/fitfactorlp" element={<FitFactorLP />} />
                <Route path="/drelflp" element={<DrelfLpPage />} />

                {/* // Section ebook_indo */}
                <Route path="/ebook_langsing" element={<DietPage />} />
                <Route path="/ebook_elvision" element={<EbookElvisionPaymentPage />} />
                <Route path="/vip_15jt" element={<Page15jt />} />
                <Route path="/arif9" element={<ArifAffiliate />} />
                <Route path="/ebook_percayadiri" element={<EbookPercayaDiriLP />} />
                <Route path="/ebook_feminine" element={<EbookFeminineLanding />} />
                <Route path="/uangpanas" element={<UangPanasLanding />} />

                {/* // Section USA */}
                <Route path="/usa_ebookslim" element={<SlimPage />} />
                <Route path="/usa_3000" element={<ELVision3000 />} />
                <Route path="/usa_pay3000" element={<Pay3000 />} />
                <Route path="/usa/usa_3000survey" element={<Survey3000 />} />
                <Route path="/usa/usa_paypal" element={<PaypalPaymentPage />} />
                <Route path="/usa_ebookhealth" element={<EbookHealthLP />} />
                <Route path="/usa_ebookfeminine" element={<UsaEbookFeminine />} />
                <Route path="/usa/usa_paypal_finish" element={<PayPalFinish />} />
                
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
