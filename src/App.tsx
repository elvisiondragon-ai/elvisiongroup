import React, { useEffect, Suspense } from "react";
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
const Index = React.lazy(() => import("./pages/Index"));

const DietPage = React.lazy(() => import("./pages/ebook_indo/ebook_langsing"));
const SlimPage = React.lazy(() => import("./pages/usa/usa_ebookslim"));

const Page15jt = React.lazy(() => import("./pages/ebook_indo/vip_15jt"));
const ELVision3000 = React.lazy(() => import("./pages/usa/usa_3000"));
const Pay3000 = React.lazy(() => import("./pages/usa/usa_pay3000"));
const Survey3000 = React.lazy(() => import("./pages/usa/usa_3000survey"));
const PaypalPaymentPage = React.lazy(() => import("./pages/usa/usa_paypal"));
const AffiliatePage = React.lazy(() => import("./pages/tools_pages/affiliate"));
const ArifAffiliate = React.lazy(() => import("./pages/ebook_indo/ebook_arif"));
const EbookElvisionPaymentPage = React.lazy(() => import("./pages/ebook_indo/ebook_elvision"));
const EbookHealthLP = React.lazy(() => import("./pages/usa/usa_ebookhealth"));
const EbookPercayaDiriLP = React.lazy(() => import("./pages/ebook_indo/ebook_percayadiri"));
const EbookFeminineLanding = React.lazy(() => import("./pages/ebook_indo/ebook_feminine"));
const UsaEbookFeminine = React.lazy(() => import("./pages/usa/usa_ebookfeminine"));
const UangPanasLanding = React.lazy(() => import("./pages/ebook_indo/uangpanas"));
const LeadMagnet = React.lazy(() => import("./pages/tools_pages/leadmagnet"));
const PayPalFinish = React.lazy(() => import("./pages/usa/usa_paypal_finish"));
const FitFactorLP = React.lazy(() => import("./pages/brands/fitfactorlp"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
import { Terms } from "./pages/Terms";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";

const DeleteAccount = React.lazy(() => import("./pages/DeleteAccount").then(module => ({ default: module.DeleteAccount })));
const Formid = React.lazy(() => import("./pages/Formid"));

import Pricing from "./pages/Pricing";
const DrelfPaymentPage = React.lazy(() => import("./pages/brands/drelf"));
const FitfactorPaymentPage = React.lazy(() => import("./pages/brands/fitfactor"));
const HungrylaterPaymentPage = React.lazy(() => import("./pages/brands/hungrylater"));
const ParfumPaymentPage = React.lazy(() => import("./pages/brands/elroyaleparfum"));
const DevPaymentPage = React.lazy(() => import("./pages/dev"));
const JewelryPaymentPage = React.lazy(() => import("./pages/brands/elroyaljewelry"));
const WhatIsPro = React.lazy(() => import("./components/whatispro").then(module => ({ default: module.WhatIsPro })));
const Payment = React.lazy(() => import("./pages/Payment").then(module => ({ default: module.Payment })));
const ProUpgradePage = React.lazy(() => import("./pages/prostatus"));
import { AudioProvider } from "@/contexts/AudioContext";
import UpdateBanner from "./updatebanner";
const Intro = React.lazy(() => import("./pages/intro"));
const DisplayPage = React.lazy(() => import("./pages/display"));
const ReportSales = React.lazy(() => import("./pages/tools_pages/reportsales"));
const DrelfLpPage = React.lazy(() => import("./pages/brands/drelflp"));
const Testimony = React.lazy(() => import("./pages/testimony"));
const CreatorPage = React.lazy(() => import("./pages/tools_pages/creator_api"));
const ResellerLanding = React.lazy(() => import("./pages/tools_pages/reseller"));
const Pixels = React.lazy(() => import("./pages/tools_pages/pixels"));
const RisetPage = React.lazy(() => import("./pages/tools_pages/riset"));

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { MeditativeProvider } from "@/contexts/MeditativeContext";
import { supabase } from "@/integrations/supabase/client";
import { setupDebugTools } from "@/utils/debugTools";
import ServiceWorkerUpdater from "@/components/ServiceWorkerUpdater";
import { cleanupStaleServiceWorkers } from "@/utils/cleanupStaleSW";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

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
      <SpeedInsights />
      <Analytics />
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
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen bg-background">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              }>
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
              </Suspense>
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
