"use client";

import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Import custom providers
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AudioProvider } from "@/contexts/AudioContext";
import { MeditativeProvider } from "@/contexts/MeditativeContext";

// Import globals/components that were in App.tsx
import { AppLoader } from "@/components/AppLoader";
import { VerseToast } from "@/components/VerseToast";
import { ProStatusNotifications } from "@/components/ProStatusToast";
import { setupDebugTools } from "@/utils/debugTools";
import ServiceWorkerUpdater from "@/components/ServiceWorkerUpdater";
import { cleanupStaleServiceWorkers } from "@/utils/cleanupStaleSW";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { useUpdateToast } from "@/hooks/UpdateToast";
import "../i18n"; // i18n initialization

// We keep a single instance of QueryClient so it is not recreated on every render
const queryClient = new QueryClient();

// Create a component to hold the hooks that require useAuth
const AppHooks = () => {
  const { user } = useAuth();
  useRealTimeNotifications(user);
  useUpdateToast();
  return null;
};

export function Providers({ children }: { children: React.ReactNode }) {
  // Initialize debug tools for browser console
  useEffect(() => {
    setupDebugTools();
  }, []);

  // Cleanup old service workers and audio caches
  useEffect(() => {
    const clearAudioCache = async () => {
      await cleanupStaleServiceWorkers();

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
              console.warn('Old audio cache deletion is blocked.', event);
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppLoader>
            <ServiceWorkerUpdater />
            <AudioProvider>
              <MeditativeProvider>
                <AppHooks />
                <VerseToast />
                <ProStatusNotifications />
                <Toaster />
                <Sonner />
                {children}
              </MeditativeProvider>
            </AudioProvider>
          </AppLoader>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
