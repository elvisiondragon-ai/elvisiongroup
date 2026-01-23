# Report: Fix Duplicate Pixel Sales Events

**Date:** 2026-01-23
**Task:** Investigate and fix issue where "ads have sales 3, but pixel sales is 14".

## Root Cause Analysis
The discrepancy was caused by **redundant CAPI (Conversions API) Purchase events** being fired from multiple sources.

1.  **Backend (`tripay-callback`):** When a payment is confirmed (webhook received or PayPal captured), the server sends a CAPI `Purchase` event to Meta. This is the correct, reliable source of truth.
2.  **Frontend (Sales Pages):** The frontend components (`uangpanas.tsx`, `fitfactor.tsx`, `ebook_*.tsx`) were listening for the payment status update via Supabase Realtime and firing a **redundant** CAPI event.
3.  **Frontend (PayPal Finish Page):** `usa_paypal_finish.tsx` was also firing a **redundant** CAPI event upon successful capture.

**Why "3 from Server"?**
The user reported seeing "1 from browser, 3 from server". This was likely caused by:
1.  **Backend Event:** The `tripay-callback` function sending the valid Server Event.
2.  **Frontend-initiated Server Event (Page):** The sales page (e.g., `usa_ebookhealth.tsx`) sending a CAPI event via `capi-universal`.
3.  **Frontend-initiated Server Event (Finish):** The finish page (`usa_paypal_finish.tsx`) sending *another* CAPI event via `capi-universal`.

This resulted in 3 Server Events + 1 Browser Pixel Event = 4 Events total per sale (or more if retries occurred).

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

1.  **Backend (`tripay-callback`):** Sends **ONE CAPI Purchase** event.
    *   Uses `eventID` = `tripay_reference` (or PayPal Order ID).
    *   Includes hashed user data (Email, Phone) and FBC/FBP cookies from the database.
    *   Includes Idempotency check (`neq('status', 'PAID')`) to prevent double-firing if both Capture and IPN occur.

2.  **Frontend (Browser):** Fires **Pixel Purchase** event.
    *   Uses `eventID` = `tripay_reference` (matching the backend).
    *   This allows Meta to match the Browser event with the Server event and deduplicate them effectively.

This setup ensures:
*   **Accuracy:** Eliminates triple-counting from server side.
*   **Reliability:** Backend CAPI captures sales even if ad-blockers are on.
*   **Match Quality:** Frontend Pixel provides browser cookies, and Backend CAPI provides secure server data.

## Verification
*   **InitiateCheckout:** Frontend CAPI events for `InitiateCheckout` were **retained** in `usa_pay3000.tsx` etc., as the backend does not send these.
*   **Event IDs:** Verified that Frontend Pixel uses the same `tripay_reference` or `token` as the Backend CAPI.

The sales count in Meta Ads Manager should now align with actual sales (1 event per sale after deduplication).