# Migration Report: Vite to Next.js (App Router)
**Date:** March 18, 2026
**Status:** Completed & Optimized

## 1. Summary of Changes
The project has been migrated from a Client-Side Rendered (CSR) Vite app to a Server-Side Rendered (SSR) Next.js 14+ application. This improves initial load speed, SEO, and eliminates stale Service Worker cache issues.

### Architecture Updates
- **Routing:** Replaced `react-router-dom` with Next.js **File-Based Routing** in the `app/` directory.
- **Root Layout:** Created `app/layout.tsx` to handle global CSS and analytics.
- **Components:** Wrapped all pages in `<Suspense>` boundaries to handle `useSearchParams` without bailing out of static generation.
- **Client Components:** Added `"use client"` to all interactive pages to support React hooks and browser APIs.

## 2. Critical Security: Avoiding ENV Leaks
During migration, a critical security risk was identified and resolved regarding environment variables.

### The Problem:
Next.js generates a `.next/` cache folder. This folder often contains plain-text versions of your environment variables (OpenAI, Gemini, Supabase keys) used during the build. If this folder is pushed to GitHub, your secrets are exposed.

### How to Prevent Leaks:
1. **Strict Gitignore:** Ensure `.next/`, `out/`, and `.env*` are explicitly listed in `.gitignore`.
2. **Key Prefixing:** Only prefix variables with `NEXT_PUBLIC_` if they *must* be accessible in the browser. Keep backend keys (like Chat GPT secret keys) without this prefix.
3. **Manual Verification:** Before pushing, always run `git status` to ensure no build artifacts or `.env` files are staged.
4. **Emergency Cleanup:** If a leak occurs, you must rewrite Git history using `git reset` and `git push --force` to delete the secrets from the server.

## 3. Potential Post-Migration Issues
- **Window is not defined:** Some components try to access `window` or `localStorage` on the server. Always check `if (typeof window !== "undefined")` or use `useEffect`.
- **Search Params:** `useSearchParams()` requires a `<Suspense>` wrapper in Next.js to prevent the whole page from becoming client-side only.
- **Asset Paths:** All images and videos must now be referenced from the `/public` root (e.g., `/assets_migrated/image.png`) rather than relative imports.

## 4. Vercel Deployment Note
To complete the migration, the **Framework Preset** in the Vercel Dashboard must be changed from `Vite` to `Next.js` to ensure the correct build pipeline is used.
