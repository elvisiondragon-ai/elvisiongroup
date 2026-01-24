# Verification: Deduplication & FBC Best Practices

**Date:** 2026-01-24
**Status:** ✅ VERIFIED

## 1. Deduplication Assurance
We have verified that the system now strictly adheres to Meta's Deduplication requirements:

*   **Identical Event IDs:** 
    *   **Server Event:** Uses `tripay_reference` (e.g., `T12345...`) as the `event_id` in `tripay-callback`.
    *   **Browser Event:** Uses `paymentData.tripay_reference` (e.g., `T12345...`) as the `eventID` in `ebook_feminine.tsx`.
    *   **Result:** The IDs are identical. Meta will successfully merge these into **1 Purchase**.

*   **Single Server Event:**
    *   The "Optimistic Locking" fix in `tripay-callback` prevents the server from firing multiple times for the same transaction. This eliminates the "3 events" (2 server + 1 browser) issue.

## 2. FBC / FBP Best Practices
We have verified compliance with Meta's technical requirements:

*   **Case Sensitivity:**
    *   **Requirement:** "_fbc is case sensitive; do not normalize or format the _fbc to lowercase."
    *   **Frontend (`fbpixel.tsx`):** The code extracts `fbclid` from the URL and saves it *exactly as is*. It does **NOT** use the `sha256` function (which lowercases input) for `fbc` or `fbp`.
    *   **Backend (`capi-universal`):** The Edge Function passes the received `fbc` string directly to Meta without hashing or casing modification.

*   **Early Capture:**
    *   **Requirement:** "Save the _fbp and _fbc cookies as early as possible... Ideally... when loading your landing page."
    *   **Implementation:** The `ebook_feminine.tsx` page triggers `initFacebookPixelWithLogging` inside the main `useEffect` hook. This immediately parses the URL for `fbclid` and saves the cookies **the moment the page loads**, ensuring the "PageView" event includes the Click ID.

## Conclusion
The system is now fully compliant with Meta's CAPI Best Practices. You can expect:
1.  **Accurate Counts:** 1 Sale = 1 Purchase Event (Deduplicated).
2.  **High Match Quality:** `fbc` is captured on landing and sent with the purchase.
3.  **Resilience:** Browser events cover cookie users; Server events cover ad-blocker users.
