# Report: USA Ebook Feminine CAPI Deduplication Fix
**Date:** 24/01/26-FixUSACAPI

## Issue
Meta Events Manager was not showing server event deduplication for the USA pixel (`1393383179182528`) on the `usa_ebookfeminine.tsx` page, although it worked for the Indonesian version.

## Root Cause
1.  **Frontend:** Missing `await waitForFbp()` in `usa_ebookfeminine.tsx`. CAPI events were being sent before browser cookies were fully ready, causing a mismatch.
2.  **Backend:** The `capi-universal` Edge Function was hardcoded to use a single `METACAPI` token. This token lacked permissions for the USA Pixel ID, which belongs to a different Ad Account/Asset.

## Solutions Implemented
1.  **Frontend Fix (`usa_ebookfeminine.tsx`):**
    *   Added `await waitForFbp()` to `sendCapiEvent` to ensure `fbp` is present for deduplication.
    *   Updated `testCode` to `TEST9597` to match the Indonesian version for consistent testing.
    *   Added real-time logging for CAPI success/failure.
2.  **Backend Fix (`supabase/functions/capi-universal/index.ts`):**
    *   Implemented **Dynamic Token Switching**.
    *   The function now checks the `pixelId` and switches to the `CAPI_USA` environment variable if the USA pixel is detected.

## Verification Required
1.  Ensure the `CAPI_USA` secret is set in Supabase with the correct USA Access Token.
2.  Deploy the updated Edge Function: `supabase functions deploy capi-universal --no-verify-jwt`.
3.  Test in Meta Events Manager using the `TEST15337` code for USA.
