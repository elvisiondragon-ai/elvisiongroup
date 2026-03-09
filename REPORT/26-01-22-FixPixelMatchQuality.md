# Facebook Pixel & CAPI Match Quality Fix

**Date:** 22/01/2026
**Task:** Fix missing "Meta click ID (fbc)", "Browser ID (fbp)", and "Phone Number" in Facebook Pixel/CAPI Purchase events.

## The Problem
Facebook Purchase events triggered by the backend (CAPI) were missing critical matching parameters:
1.  **fbc (Click ID) & fbp (Browser ID):** These cookies exist in the user's browser but are not automatically available to the server-side callback (`tripay-callback`) that fires the final "Purchase" event after payment is confirmed.
2.  **Phone Number:** Was not being passed correctly to the CAPI function.

This resulted in low "Event Match Quality" scores and poor attribution for ads.

## The Solution
We implemented a full "Pass-Through" strategy to capture these values from the browser at the moment of checkout and store them until the payment is confirmed.

### 1. Database Schema Update
*   **File:** `assist_code/add_fbc_fbp_to_global_product.sql`
*   **Action:** Added `fbc` and `fbp` text columns to the `global_product` table. This table stores all order details.

### 2. Frontend Updates (Browser)
*   **File:** `src/utils/fbpixel.tsx`
    *   Added `getFbcFbpCookies()` helper function to easily retrieve `_fbc` and `_fbp` cookies.
*   **Pages Updated:** 
    *   `src/pages/fitfactor.tsx`
    *   `src/pages/Payment.tsx`
    *   `src/pages/uangpanas.tsx`
    *   `src/pages/ebook_elvision.tsx`
    *   `src/pages/arifaffiliate.tsx`
    *   `src/pages/elroyaleparfum.tsx`
    *   `src/pages/drelf.tsx`
    *   `src/pages/hungrylater.tsx`
    *   `src/pages/ebook_percayadiri.tsx`
    *   `src/pages/ebook_feminine.tsx`
    *   `src/pages/ebook_langsing.tsx`
    *   `src/pages/usa/usa_3000.tsx`
    *   `src/pages/usa/usa_pay3000.tsx`
    *   `src/pages/usa/usa_ebookhealth.tsx`
    *   `src/pages/usa/usa_ebookslim.tsx`
    *   `src/pages/usa/usa_3000survey.tsx`
    *   **Action:** When a user clicks "Buy" or "Checkout", the frontend now reads the cookies and sends them as part of the payload to `tripay-create-payment`.

### 3. Backend Updates (Edge Functions)
*   **Function:** `tripay-create-payment` (`supabase/functions/tripay-create-payment/index.ts`)
    *   **Action:** Now accepts `fbc` and `fbp` from the request body.
    *   **Action:** Inserts these values into the `global_product` (or `waiting_payment`) table when creating the order record.
*   **Function:** `tripay-callback` (`supabase/functions/tripay-callback/index.ts`)
    *   **Action:** When a payment is marked `PAID`, it fetches the transaction details from `global_product`.
    *   **Action:** Crucially, it now selects `fbc`, `fbp`, and `phone` columns.
    *   **Action:** It passes these values to the `capi-universal` function.

### 4. CAPI Universal Update
*   **Function:** `capi-universal` (`supabase/functions/capi-universal/index.ts`)
    *   **Verified:** It already has logic to handle and hash `fbc`, `fbp`, and `phone` (`ph`) if provided in `userData`.

## Result
Now, every backend-triggered "Purchase" event will include:
*   ✅ **fbc (Meta Click ID):** Allowing Facebook to attribute the sale to a specific ad click.
*   ✅ **fbp (Browser ID):** Identifying the specific browser/device.
*   ✅ **Phone Number:** Hashed and sent for advanced matching.
*   ✅ **Email:** (Already present)

This significantly improves the match quality score and helps Facebook optimize ad delivery.
