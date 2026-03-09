## Report: Fix Meta Deduplication Issues

**Date:** 2026/01/04

**Task:** Address deduplication missing or issue in Meta Pixel events for `assist_code/capi-fitfactor.ts` and `src/pages/fitfactorlp.tsx`.

**Analysis:**

1.  **`assist_code/capi-fitfactor.ts` (Server-Side Conversions API - CAPI):**
    *   This Deno Edge Function correctly processes incoming events for Facebook CAPI.
    *   It explicitly extracts `event_id` from the incoming request body.
    *   It includes `event_id`, `fbp` (Facebook browser ID), and `fbc` (Facebook click ID) in the Facebook CAPI payload, which are crucial for deduplication.
    *   It attempts to retrieve `client_ip_address` and `client_user_agent` from request headers.
    *   Sensitive user data like email and phone are hashed using SHA256 as per best practices.

2.  **`src/pages/fitfactorlp.tsx` (Client-Side React Component):**
    *   **Facebook Pixel Initialization:** The Facebook Pixel is initialized, and a `PageView` event is tracked.
    *   **`eventID` for `PageView`:** A unique `event_id` is generated using `crypto.randomUUID()` and passed to the `fbq("track", "PageView", ..., { eventID: pageViewEventId })` call, enabling client-side deduplication for `PageView`.
    *   **`sendCAPIEvent` Function:** A helper function exists to send events to the CAPI Edge Function. It correctly extracts `_fbp` and `_fbc` cookies.
    *   **Initial Deduplication Gaps Identified:**
        *   `client_user_agent` was not explicitly sent from the client in `sendCAPIEvent`. While the server-side could infer it, explicit client-side sending is more robust.
        *   `event_id` was only explicitly generated and passed for the `PageView` event. Other events, such as `InitiateCheckout`, would lack this crucial parameter for deduplication.

**Changes Made:**

1.  **`src/pages/fitfactorlp.tsx` - `sendCAPIEvent` Function Enhancement:**
    *   The `sendCAPIEvent` function was wrapped in `useCallback` to prevent unnecessary re-renders and resolve a linting warning.
    *   Added `client_user_agent: navigator.userAgent` to the `userData` object passed to the CAPI Edge Function. This ensures the user agent is consistently captured and sent with server events.

2.  **`src/pages/fitfactorlp.tsx` - `useEffect` Hook Update:**
    *   The `sendCAPIEvent` function was added to the dependency array of the main `useEffect` hook to resolve a `react-hooks/exhaustive-deps` linting warning.

3.  **`src/pages/fitfactorlp.tsx` - `handlePay` Function Enhancement:**
    *   The `handlePay` function, responsible for redirection, was enhanced to trigger an `InitiateCheckout` event for both Facebook Pixel and CAPI.
    *   A unique `event_id` is now generated (`crypto.randomUUID()`) specifically for the `InitiateCheckout` event.
    *   This `event_id` is passed consistently to both `fbq('track', 'InitiateCheckout', ...)` and `sendCAPIEvent('InitiateCheckout', ...)` calls, along with relevant custom data (e.g., `value`, `currency`, `content_type`, `content_ids`, `num_items`) for accurate tracking and deduplication.

**Verification Steps for User:**

To confirm that the deduplication issues are resolved and event tracking is functioning as expected, please follow these steps:

1.  **Deploy the updated code:** Ensure the changes I've made are deployed to your hosting environment.
2.  **Access Meta's Test Events Tool:**
    *   Go to your Facebook Events Manager.
    *   Navigate to the "Test Events" tab.
    *   Enter the URL of your deployed FitFactor landing page (`https://app.elvisiongroup.com/fitfactor` or similar).
3.  **Perform Actions on the Landing Page:**
    *   **Load the page:** This should trigger a `PageView` event.
    *   **Click the "Pesan Sekarang" (Order Now) button or any button that triggers `handlePay`:** This should trigger an `InitiateCheckout` event.
4.  **Observe Events in Test Events Tool:**
    *   Verify that both "Browser" and "Server" events are received for `PageView` and `InitiateCheckout`.
    *   Confirm that the `event_id` parameter is present and *identical* for each corresponding browser and server event pair. This is critical for deduplication.
    *   Check for the presence of `client_user_agent` in the server events.
    *   Review the custom data (`value`, `currency`, `content_type`, `content_ids`, `num_items`) for the `InitiateCheckout` events to ensure they are being passed correctly.
    *   **Look for green checks or indicators in the Test Events tool that signify successful event deduplication.**

These changes should significantly improve the accuracy of your Meta Pixel and Conversions API event tracking by ensuring proper deduplication and comprehensive data collection.
