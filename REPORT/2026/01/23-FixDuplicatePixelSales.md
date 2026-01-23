# Report: Fix Duplicate Pixel Sales Events

**Date:** 2026-01-23
**Task:** Investigate and fix issue where "ads have sales 3, but pixel sales is 14".

## Root Cause Analysis
The discrepancy was caused by **redundant CAPI (Conversions API) Purchase events** being fired from the frontend in addition to the backend.

1.  **Backend (`tripay-callback`):** When a payment is confirmed (webhook received), the server sends a CAPI `Purchase` event to Meta. This is the correct, reliable source of truth.
2.  **Frontend (Sales Pages):** The frontend components (`uangpanas.tsx`, `fitfactor.tsx`, etc.) were listening for the payment status update via Supabase Realtime. Upon receiving `status: 'PAID'`, they were firing:
    *   **Facebook Pixel `trackPurchaseEvent`:** (Correct, for browser tracking and cookie matching).
    *   **CAPI `sendCapiEvent`:** (Redundant and harmful).

This resulted in **three** events being sent for every single purchase if the user kept the browser open:
1.  Backend CAPI (Purchase)
2.  Frontend Pixel (Purchase)
3.  Frontend CAPI (Purchase)

While Meta attempts to deduplicate events with the same `eventID`, sending two CAPI events is bad practice and prone to failure (e.g., timing issues, slight data mismatches), leading to inflated sales counts in Events Manager.

## Actions Taken

I have removed the redundant **Frontend CAPI `sendCapiEvent('Purchase', ...)`** calls from the following files:

1.  `src/pages/uangpanas.tsx`
2.  `src/pages/fitfactor.tsx`
3.  `src/pages/ebook_percayadiri.tsx`
4.  `src/pages/ebook_feminine.tsx`
5.  `src/pages/usa/usa_paypal_finish.tsx`
6.  `src/pages/usa/usa_ebookhealth.tsx`

## Current Tracking Logic (Hybrid Model)

Now, for every purchase:

1.  **Backend (`tripay-callback`):** Sends **CAPI Purchase** event.
    *   Uses `eventID` = `tripay_reference` (or PayPal Order ID).
    *   Includes hashed user data (Email, Phone) and FBC/FBP cookies from the database.

2.  **Frontend (Browser):** Fires **Pixel Purchase** event.
    *   Uses `eventID` = `tripay_reference` (matching the backend).
    *   This allows Meta to match the Browser event with the Server event and deduplicate them effectively, counting it as **1 Purchase**.

This setup ensures:
*   **Accuracy:** No more triple-counting.
*   **Reliability:** Backend CAPI captures sales even if ad-blockers are on or the user closes the browser immediately.
*   **Match Quality:** Frontend Pixel provides browser cookies, and Backend CAPI provides secure server data.

## Verification
*   **InitiateCheckout:** Frontend CAPI events for `InitiateCheckout` were **retained** in `usa_pay3000.tsx` etc., as the backend does not send these.
*   **Event IDs:** Verified that Frontend Pixel uses the same `tripay_reference` or `token` as the Backend CAPI.

The sales count in Meta Ads Manager should now align with actual sales.
