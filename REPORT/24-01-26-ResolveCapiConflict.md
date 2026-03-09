# Resolution: CAPI Conflict (Frontend vs Backend)

**Date:** 24/01/26
**Issue:** Double-firing of "Purchase" CAPI events caused by having both Frontend (`sendCapiEvent`) and Backend (`tripay-callback` webhook) active.
**Decision:** "Remove Option B" -> Disable Backend CAPI.

## Actions Taken
1.  **Backend (`tripay-callback/index.ts`):**
    *   Commented out the `capi-universal` invocation block.
    *   The server now processes the payment, updates the database, sends the email, but **stops** before sending the CAPI event.

2.  **Frontend (`ebook_feminine.tsx`):**
    *   Remains active.
    *   Sends **Browser Pixel** Purchase event.
    *   Sends **Server CAPI** Purchase event (via `sendCapiEvent` helper).
    *   Includes `fbc` and `fbp` cookies directly from the browser session.

## Expected Outcome
*   **Deduplication:** Should be robust. The Frontend CAPI and Frontend Pixel use the exact same `eventID` (`tripay_reference`) and fire almost simultaneously.
*   **Cookie Match Quality:** High, because the Frontend CAPI grabs cookies directly from `document.cookie` / `localStorage` at the moment of the event.
*   **Reliability:** Slightly lower than Backend CAPI (if user closes tab immediately after payment but before the success toast appears, the event might be missed), but higher Match Quality.

## Next Steps
Test a purchase. You should see exactly 2 Purchase events in Meta (1 Browser, 1 Server), and they should deduplicate.
