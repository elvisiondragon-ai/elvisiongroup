# Next.js Migration Report
**Date:** March 18, 2026
**Topic:** Migration from Vite to Next.js 14 (App Router)

## 1. Architectural Changes
- **Framework Transition:** Successfully migrated the entire project from Vite + React Router to Next.js 14 with App Router.
- **Routing:** Replaced `react-router-dom` with Next.js file-based routing in `src/app/`.
- **Directory Structure:**
  - Original `src/pages` renamed to `src/views` to avoid Next.js routing conflicts.
  - Page entry points created in `src/app/` using Client Component wrappers for compatibility.
- **Root Layout:** Implemented `src/app/layout.tsx` to handle global providers, styles, and analytics.
- **Client Providers:** Moved all context providers (Auth, Audio, Meditative, QueryClient) to a `Providers.tsx` client component.

## 2. Technical Fixes & Optimizations
- **SSR Compatibility:** 
  - Added `"use client";` to 49 UI components and 46 view components.
  - Wrapped all `localStorage`, `window`, and `navigator` accesses in `useEffect` or `typeof window !== 'undefined'` checks.
  - Protected Supabase client storage initialization for server-side environments.
- **TypeScript & Build:**
  - Resolved numerous strict typing issues with Supabase RPC calls, table insertions, and third-party UI components.
  - Fixed issues with Next.js `StaticImageData` vs string URL imports for images and artworks.
  - Excluded non-build directories (`REPORT`, `assist_code`, `supabase`) from `tsconfig.json` to prevent Deno-style imports from breaking compilation.
- **Static Export for Capacitor:**
  - Enabled `output: 'export'` in `next.config.mjs`.
  - Pointed Capacitor `webDir` to the `out` folder.

## 3. Local Network Access
- **Mobile Connectivity:** Enabled Local Network access for Next.js by adding the `--hostname 0.0.0.0` flag to the dev script.
- **Development Server:** Updated the `dev` script to run on port `3001` and display the mobile access URL: `http://192.168.100.152:3001`.

## 4. Summary of Key File Changes
- `package.json`: Updated dependencies and scripts for Next.js.
- `next.config.mjs`: Configured static export and image optimization.
- `capacitor.config.ts`: Updated for the new `out` build directory.
- `src/app/`: New routing structure.
- `src/views/`: Moved old page components.
- `src/contexts/`: Updated with `"use client"` and SSR protection.

The project is now fully functional on Next.js 14 and ready for both Web and Android (Capacitor) deployment.
