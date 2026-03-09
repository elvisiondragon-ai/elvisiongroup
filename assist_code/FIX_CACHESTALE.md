# Report: Stale Cache & MIME Type Errors in SPAs

## The Problem: "Failed to load module script... MIME type 'text/html'"

This error is the hallmark of a **Stale Service Worker / Index Mismatch** in Single Page Applications (SPAs).

### The Root Cause Mechanism

1.  **The Build Process:**
    When you build your Vite/React app, it generates files with hashed names for cache busting:
    -   `index.html` (Points to -> `assets/index-ABC.js`)
    -   `assets/index-ABC.js`

2.  **The Caching (The Trap):**
    -   A user visits your site. The Service Worker (SW) precaches `index.html` and `assets/index-ABC.js`.
    -   The user leaves.

3.  **The Update:**
    -   You deploy a new version.
    -   New build: `index.html` (Points to -> `assets/index-XYZ.js`)
    -   `assets/index-XYZ.js` exists on server.
    -   `assets/index-ABC.js` is **deleted** from the server (or just missing in the new deployment).

4.  **The Stale Visit (The Error):**
    -   The user returns. Their Service Worker serves the **OLD** `index.html` from cache (because it's precached).
    -   The **OLD** `index.html` tries to load `<script src="/assets/index-ABC.js">`.
    -   The Service Worker might try to fetch this from the network if it's missing from cache, OR the browser requests it.
    -   **CRITICAL FAILURE:** The server sees a request for `/assets/index-ABC.js`. It doesn't exist.
    -   Because it's an SPA, the server is configured to "Fallback to index.html" for any 404s.
    -   So, the server returns the **NEW** `index.html` content instead of the JS file.
    -   The browser expects **JavaScript** (MIME `application/javascript`) but receives **HTML** (MIME `text/html`).
    -   **Result:** `Failed to load module script... MIME type 'text/html'`.

---

## The Solution: A Multi-Layered Defense

To fix this robustly, we cannot rely on just one method. We implemented a "Defense in Depth" strategy.

### Layer 1: Configuration (Prevention)
**What:** Updated `vite.config.ts`
-   `skipWaiting: true`: Forces the new Service Worker to activate immediately, kicking out the old one.
-   `clientsClaim: true`: Forces the new Service Worker to take control of all open clients immediately.
-   `cleanupOutdatedCaches: true`: Tells Workbox to delete older precaches.

### Layer 2: Active Polling (Detection)
**What:** Updated `ServiceWorkerUpdater.tsx`
-   The app now actively asks the browser "Is there a new version?" every 60 seconds.
-   If yes, it forces a page reload.

### Layer 3: The "Nuclear" Option (Self-Healing) - **MOST IMPORTANT**
**What:** Added Global Error Handler in `main.tsx`
This is the ultimate safety net. If the app crashes because of a missing chunk, it detects it and fixes itself.

```typescript
window.addEventListener('error', (event) => {
  // Check if the error is related to loading chunks or MIME types
  if (event.message?.includes('Loading chunk') || event.message?.includes('MIME type')) {
    // 1. Unregister all Service Workers immediately
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => r.unregister());
      // 2. Force a hard reload from the server
      window.location.reload(); 
    });
  }
});
```

### Layer 4: Boot Cleanup (Sanitization)
**What:** Updated `App.tsx`
-   On every app launch, we explicitly check for and delete caches named `workbox-precache`. This prevents the "zombie" cache problem where an old cache sticks around despite updates.

---

## Summary for Future Developers

If users complain about white screens or loading errors after a deployment:

1.  **Do not disable the PWA** unless necessary; it provides speed and offline capability.
2.  **Ensure the "Self-Healing" handler is active.** It is the only thing that saves a user who is *already* stuck in a broken state.
3.  **Check Server Headers:** Ideally, your `index.html` should effectively never be cached by the browser (`Cache-Control: no-cache`). This forces the browser to always ask the server for the *pointer* to the latest JS files. The JS files themselves can be cached forever (`immutable`).
