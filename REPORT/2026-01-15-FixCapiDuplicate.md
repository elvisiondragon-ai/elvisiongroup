## CAPI Duplicate Event Fix

**Date:** 2026-01-15

**Objective:** Fix duplicate CAPI events being sent from the `uangpanas.tsx` page.

**Analysis:**
The `uangpanas.tsx` component was sending duplicate Facebook CAPI events for 'AddToCart' and 'Purchase' actions. This was caused by firing both a client-side Facebook Pixel event (`fbq('track', ...)` and a server-side CAPI event (`sendCapiEvent(...)`) for the same user action without a mechanism for deduplication. Additionally, `PageView` and `ViewContent` events were only being tracked client-side, and the user requested to extend deduplication to these events as well.

**Changes Made:**

1.  **`handleCreatePayment()` Function:**
    *   Generated a unique `eventId` using a combination of a timestamp and a random string for the 'AddToCart' event.
    *   This `eventId` is now passed to both the `fbq('track', 'AddToCart', ...)` call and the `sendCapiEvent('AddToCart', ...)` call. This allows Facebook to recognize that the browser and server events are the same and deduplicate them.

2.  **`sendCapiEvent()` Function:**
    *   Modified the function to accept an optional `eventId` string.
    *   This `eventId` is now included in the payload sent to the `capi-universal` Supabase function.

3.  **Purchase Event Listener (useEffect):**
    *   When a 'PAID' status is received, a unique `eventId` is created using the `tripay_reference` from the payment data.
    *   This `eventId` is passed to both the `fbq('track', 'Purchase', ...)` call and the `sendCapiEvent('Purchase', ...)` call.

4.  **`PageView` and `ViewContent` Events (main useEffect):**
    *   Introduced `sendCapiEvent` calls for both `PageView` and `ViewContent` events in the main `useEffect` hook.
    *   Generated unique `eventID`s for both `PageView` and `ViewContent` events and passed them to their respective `fbq('track', ...)` and `sendCapiEvent(...)` calls. This ensures proper deduplication for these events as well.

**Result:**
These changes implement Facebook's recommended event deduplication strategy across 'AddToCart', 'Purchase', 'PageView', and 'ViewContent' events. The duplicate events should now be resolved, leading to more accurate conversion tracking and analytics.