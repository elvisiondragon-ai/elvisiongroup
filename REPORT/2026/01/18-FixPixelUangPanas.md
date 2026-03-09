# Fix: Facebook Pixel Duplicate Events on Uang Panas Page

**Date:** 18 January 2026
**Task:** Fix issue where 1 purchase counts as 4 on Facebook Pixel (Pixel ID: 3319324491540889).
**File:** `src/pages/uangpanas.tsx`

## Problem Description
The user reported that for the product "Uang Panas", a single purchase was resulting in 4 conversion events being recorded by the Facebook Pixel.

## Root Cause Analysis
Upon investigation, two main issues were identified:

1.  **Event ID Mismatch (Primary Cause):**
    *   The **Frontend** (Browser Pixel + CAPI) was sending events with `eventID: "purchase-" + tripay_reference`.
    *   The **Backend** (Tripay Callback CAPI) was sending events with `eventID: tripay_reference` (without the prefix).
    *   Because the `eventID`s were different, Facebook treated them as separate, unique events instead of deduplicating them. This immediately doubled the count.

2.  **Potential Re-firing (Secondary Cause):**
    *   The frontend uses a realtime subscription (`supabase.channel`) to listen for status changes (`UNPAID` -> `PAID`).
    *   If the database row was updated multiple times while the user was on the page, or if the listener re-subscribed, it could potentially fire the event again.

## Applied Fix

1.  **Unified Event ID:**
    *   Modified `src/pages/uangpanas.tsx` to use `paymentData.tripay_reference` directly as the `eventID`.
    *   This matches the backend configuration in `supabase/functions/tripay-callback/index.ts`.
    *   **Result:** Facebook will now recognize the Frontend and Backend events as the same event and deduplicate them (reducing count from 2+ to 1).

2.  **Added Deduplication Guard:**
    *   Implemented a `useRef` (`purchaseFiredRef`) in the frontend component.
    *   This ensures the "Purchase" event logic only executes **once** per session, even if the database status update listener triggers multiple times.

## Verification
*   Checked codebase for other conflicting `Purchase` listeners (none found for this specific flow).
*   Verified build success (`npm run build`).

## Next Steps
*   Monitor the Pixel events for the next few purchases.
*   Ensure the backend `tripay-callback` continues to function as the reliable source of truth.
