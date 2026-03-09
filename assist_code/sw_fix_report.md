# Stale Service Worker Fix Report

## Issue

The application was experiencing a stale service worker issue on `app.elvisiongroup.com/levelpasrah` after updating `src/pages/levelpasrah.tsx`. The page was not updating, while other pages were working correctly.

## Cause

The root cause of the issue was that the service worker was not configured to handle navigation requests correctly. The `vite-plugin-pwa` was configured to use a `generateSW` strategy, but there was no runtime caching rule for navigation requests. This meant that the service worker was not caching the pages, and the user was always getting the network version. However, if the network failed, or if the user was offline, they would get nothing.

## Fix

To fix this issue, I added a new runtime caching rule to the `vite.config.ts` file. This new rule uses a `NetworkFirst` strategy for navigation requests. This ensures that the service worker always tries to fetch the latest version of the page from the network first. If the network is unavailable, it will fall back to the cached version.

The following code was added to the `vite.config.ts` file:

```typescript
{
  urlPattern: ({ request }) => request.mode === 'navigate',
  handler: 'NetworkFirst',
  options: {
    cacheName: 'navigation-cache',
    networkTimeoutSeconds: 3,
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 60 * 5 // 5 minutes
    }
  }
}
```

After updating the configuration, I rebuilt the application to generate the new service worker. The application is now ready to be deployed.
