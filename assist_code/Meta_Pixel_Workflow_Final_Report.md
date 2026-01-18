# Facebook Pixel & CAPI Final Implementation Report
**Date:** January 18, 2026
**Status:** ✅ Fully Optimized & Synchronized

## 1. Executive Summary
The tracking system across `elvisiongroup.com` has been refactored to meet **Meta's Best Practices**. We now utilize a **Hybrid Tracking Model** (Browser Pixel + Server-Side API) with strict deduplication logic.

*   **Deduplication:** Active (via unique `eventID`).
*   **Match Quality:** Optimized (Hashing User Data: Email, Phone, Name).
*   **Funnel Tracking:** Full visibility from PageView to Purchase.

---

## 2. Meta Compliance Checklist

| Meta Recommendation | Status | Implementation Details |
| :--- | :--- | :--- |
| **Event Deduplication** | ✅ **Active** | Every critical event generates a unique `eventID` shared between Browser (Pixel) and Server (CAPI). |
| **Advanced Matching** | ✅ **Active** | User Data (Email, Phone, Name) is SHA-256 hashed and sent with `InitiateCheckout`, `AddPaymentInfo`, and `Purchase`. |
| **FBC/FBP Cookies** | ✅ **Active** | Automated handling of `_fbc` (Click ID) and `_fbp` (Browser ID) cookies passed to CAPI. |
| **Signal Resilience** | ✅ **Active** | Even if ad-blockers block the Pixel, the Server-Side (CAPI) event ensures data reaches Meta. |

---

## 3. Workflow by Funnel

### A. "3000 Coaching" (High Ticket Funnel)
**Pixel ID:** `1393383179182528`

1.  **Landing Page (`3000.tsx`)**
    *   **Event:** `PageView`, `AddToCart`.
    *   **Data:** Browser ID, Click ID.
2.  **Survey (`3000survey.tsx`)**
    *   **Event:** `Lead` (formerly Survey Form).
    *   **Data:** Captures user intent.
3.  **Payment Form (`Pay3000.tsx`)**
    *   **Event:** `InitiateCheckout` + `AddPaymentInfo`.
    *   **Advanced Matching:** **Hashed Email** is sent immediately when user clicks "Pay".
    *   **Deduplication:** Random UUID generated here.
4.  **Payment Processing (PayPal)**
    *   User completes payment on PayPal (off-site).
5.  **Completion (`PayPalFinish.tsx` + Server Callback)**
    *   **Client Event:** `Purchase` fired on success page.
    *   **Server Event:** `Purchase` fired via `tripay-callback` (Logic handles PayPal Capture).
    *   **Deduplication Key:** The **PayPal Order ID (Token)** is used as the `eventID` for both. Meta sees two events with the same ID and counts them as **ONE**.

### B. "Uang Panas" (Direct Digital Product)
**Pixel ID:** `3319324491540889`

1.  **Landing Page (`uangpanas.tsx`)**
    *   **Event:** `PageView`, `ViewContent`.
2.  **Checkout Form (`uangpanas.tsx`)**
    *   **Event:** `AddPaymentInfo`.
    *   **Advanced Matching:** Hashed Name, Email, Phone sent when "Beli Sekarang" is clicked.
    *   **Deduplication:** Random UUID shared between Client/Server.
3.  **Payment Success (Realtime Update)**
    *   **Event:** `Purchase`.
    *   **Deduplication Key:** The **Tripay Reference** (e.g., `DEV-123...`) is used as the `eventID`. The server sends the exact same ID when the callback is received.

### C. "FitFactor" (Physical Product)
**Pixel ID:** `1797660474333865`

1.  **Checkout (`fitfactor.tsx`)**
    *   **Event:** `InitiateCheckout`.
    *   **Advanced Matching:** Hashed Customer Info (Name, Email, Phone, City, Zip).
2.  **Payment Success**
    *   **Event:** `Purchase`.
    *   **Deduplication Key:** The **Tripay Reference** is used as the `eventID`.

---

## 4. Technical Implementation

### Core Utility (`src/utils/fbpixel.tsx`)
This is the "Brain" of the tracking. It handles:
*   **`initFacebookPixelWithLogging`**: Initializes Pixel and manages FBC/FBP cookies.
*   **`trackPurchaseEvent`**: Accepting `userData`, hashing it, updating the Pixel state, and firing the event.
*   **`sha256`**: Secure hashing algorithm.

### Backend (`supabase/functions/tripay-callback`)
*   Detects product type by name.
*   Selects the correct `pixelId`.
*   Retrieves customer email from `global_product`.
*   Sends Server-Side `Purchase` event using `capi-universal`.

## 5. Maintenance
*   **New Pages:** Always import `initFacebookPixelWithLogging` and use `track...` functions from `@/utils/fbpixel`.
*   **New Products:** Ensure backend `tripay-callback` has logic to map the new product name to the correct Pixel ID.
