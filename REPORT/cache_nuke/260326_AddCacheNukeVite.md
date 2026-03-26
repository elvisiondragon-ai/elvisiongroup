# Report: Cache Nuke Mechanism for elvisiongroup.com
**Date: 26/03/26**
**Topic: cache_nuke**

## Context
Some users were stuck with an old version of the application, especially on mobile browsers (iOS Safari) which have "sticky" memory cache. Standard `window.location.reload()` was not enough.

## Issues
- iOS Safari cache persistence prevents users from seeing the latest updates.
- Chunk load errors occur when the app tries to load outdated assets that no longer exist on the server.

## Solutions
1.  **Implemented APP_VERSION tracking**: Added a hardcoded `APP_VERSION` ('2026.03.26.01') in `src/main.tsx`.
2.  **Forced Redirect for Cache Busting**: If the `localStorage` version does NOT match the current `APP_VERSION`, the app now:
    - Clears `localStorage` (Cache Nuke).
    - Updates the version in `localStorage`.
    - Redirects to the same page but with a `?v=[VERSION]` parameter to force a fresh fetch from the server.
3.  **Silent URL Cleanup**: If a `v` parameter is detected in the URL (meaning a refresh just happened), it is silently removed using `history.replaceState` to keep the URL clean.
4.  **Auto-Increment**: The version was incremented from `2026.03.25.01` to `2026.03.26.01`.
5.  **Build Verification**: Ran `npm run build` to ensure the project remains stable.

## Timestamps
- 22:20: Planning approved.
- 22:21: Implementation in `src/main.tsx` completed.
- 22:22: `npm run build` completed successfully.
- 22:23: Report generated.
