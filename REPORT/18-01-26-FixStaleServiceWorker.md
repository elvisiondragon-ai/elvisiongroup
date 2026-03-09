# Task Report: Fix Stale Service Worker

## Date: 18/01/26

## Changes Made:

### 1. Vite Config (`vite.config.ts`)
- Added `clientsClaim: true` and `skipWaiting: true` to the `workbox` configuration. This forces the service worker to activate immediately and take control of the page, ensuring users don't get stuck on an old version.

### 2. Service Worker Updater (`src/components/ServiceWorkerUpdater.tsx`)
- Added a periodic check (every 60 seconds) to query for service worker updates.
- Ensured that `updateServiceWorker(true)` is called immediately when an update is found, forcing a page reload.

### 3. Stale SW Cleanup (`src/utils/cleanupStaleSW.ts` & `src/App.tsx`)
- Created a utility function `cleanupStaleServiceWorkers` that attempts to update any existing service worker registrations.
- Integrated this cleanup function into `src/App.tsx` to run on application mount, ensuring that even if the automatic update fails, we force a check on every visit.

## Status: SUCCESS
