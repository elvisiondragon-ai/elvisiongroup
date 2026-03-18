# El Vision Group - Next.js Mandates

## 1. Security & Git
- **NEVER** remove `.next/`, `out/`, or `.env*` from `.gitignore`.
- Before any `git push`, run `git status` to verify `.next/` is not tracked. If it is, stop and fix it immediately.

## 2. Mandatory Build Check
- **Mandatory Rule:** ALWAYS run `npm run build` after any code modification.
- A task is NOT complete until the build passes 100%. Next.js is strict about types and SSR; unverified changes are unacceptable.

## 3. Environment Variables
- All frontend environment variables **MUST** start with `NEXT_PUBLIC_`.
- Current fallback keys are set in `src/integrations/supabase/client.ts`. Do not change Supabase initialization without explicit permission.

## 4. Client vs Server Components
- This is Next.js App Router.
- Any file using `useState`, `useEffect`, or browser APIs (`window`, `navigator`, `localStorage`) **MUST** have `"use client";` at the very top.

## 5. Routing & Assets
- **DO NOT** use `react-router-dom`. Use `next/navigation` (`useRouter`, `usePathname`) and `next/link`.
- Static assets must stay in `public/` and use absolute paths (e.g., `/assets/image.png`).

## 6. Vercel Configuration
- Ensure the **Framework Preset** in the Vercel Dashboard is set to **Next.js**.

## 7. Development Access
- Local Network access is enabled via `npm run dev`.
- The URL for mobile access is dynamically displayed in the console (e.g., `http://192.168.100.152:3002`).
