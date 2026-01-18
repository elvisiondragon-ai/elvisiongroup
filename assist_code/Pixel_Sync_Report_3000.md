# Facebook Pixel & CAPI Sync Report: 3000 Coaching
**Date:** January 18, 2026

## Objective
Verify synchronization of Pixel ID `1393383179182528` and Deduplication (via `eventID`) across Frontend and Backend.

## Verification Findings

### 1. Pixel ID Consistency
*   **Frontend (`src/pages/3000.tsx` & `src/pages/Pay3000.tsx`):** Hardcoded `PIXEL_ID = '1393383179182528'`. ✅
*   **Frontend (`src/pages/PayPalFinish.tsx`):** Hardcoded `PIXEL_ID = '1393383179182528'`. ✅
*   **Backend (`tripay-callback/index.ts`):** Checks for product name containing "3000 Coaching" and explicitly sets `capiPixelId = '1393383179182528'`. ✅

### 2. Event Deduplication (Purchase Event)
*   **Initiation (`src/pages/Pay3000.tsx`):**
    *   Creates PayPal order.
    *   Does NOT fire Client-Side Purchase (correct, as it redirects).
*   **Completion (Client-Side - `src/pages/PayPalFinish.tsx`):**
    *   Fires `fbq('track', 'Purchase', ...)` with `eventID: token` (where `token` is the PayPal Order ID).
*   **Completion (Server-Side - `tripay-callback/index.ts`):**
    *   Triggered by `action: 'CAPTURE_PAYPAL'` from `PayPalFinish.tsx`.
    *   Fires CAPI `Purchase` event via `capi-universal`.
    *   Uses `tripayReference` as `eventId`, which corresponds to the PayPal Order ID (`token`).
*   **Result:** Client `eventID` matches Server `eventId`. Deduplication is **ACTIVE**.

### 3. Advanced Matching
*   **Client-Side:** `PayPalFinish.tsx` does not have user email/phone available in state to pass to Pixel, but standard Pixel cookies (`_fbp`, `_fbc`) are active.
*   **Server-Side:** `tripay-callback` retrieves user email from `global_product` table and sends hashed email to CAPI.
*   **Result:** Meta will receive user data from the Server event, enhancing match quality.

## Conclusion
The system is fully synchronized. The specific Pixel ID `1393383179182528` is correctly implemented across the entire funnel for the "3000 Coaching" product.
