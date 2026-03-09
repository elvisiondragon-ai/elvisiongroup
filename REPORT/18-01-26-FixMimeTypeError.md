# Task Report: Fix MIME Type Error (Stale Cache)

## Date: 18/01/26

## Problem
The user reported a "Failed to load module script" error with a MIME type mismatch ("text/html"). This occurs when the browser/Service Worker tries to load an old JavaScript chunk that no longer exists on the server, and the server falls back to serving `index.html`.

## Changes Made:

### 1. Global Error Handler (`src/main.tsx`)
- Added a global `window.addEventListener('error', ...)` listener.
- Detects errors related to "Loading chunk", "importing a module script", or "MIME type".
- If detected, it:
    1.  Unregisters all Service Workers.
    2.  Forces a page reload (`window.location.reload()`).
- This acts as a "self-healing" mechanism for users stuck on a broken version.

### 2. Aggressive Cache Clearing (`src/App.tsx`)
- Updated the `clearAudioCache` function (which runs on boot) to also iterate through all browser caches.
- Specifically deletes any cache containing `workbox-precache` in its name.
- This ensures that old precached assets are removed, forcing the Service Worker to fetch fresh ones.

## Status: SUCCESS
