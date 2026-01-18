# Facebook Pixel & CAPI Refactoring Report
**Date:** January 18, 2026

## Objective
Enhance Facebook Pixel implementation to support **Event Deduplication** (via `eventID`) and **Manual Advanced Matching** (via hashed Customer Information) as per Meta recommendations.

## Changes Implemented

### 1. `src/utils/fbpixel.tsx` (Core Utility)
*   **Added SHA-256 Hashing:** Implemented secure async SHA-256 hashing using `crypto.subtle` to hash PII (Email, Phone, Name, etc.) before sending to Meta.
*   **Manual Advanced Matching:** Created `updatePixelUserData` and `initFacebookPixelWithLogging` to accept and hash user data.
*   **Automatic Cookie Management:** Added `handleFbcCookieManager()` to initialization to ensure `_fbc` and `_fbp` cookies are correctly set.
*   **Tracking Functions:** Updated `trackViewContentEvent`, `trackAddToCartEvent`, `trackPurchaseEvent`, etc., to accept:
    *   `eventID`: For deduplication with CAPI.
    *   `userData`: Object containing `em`, `ph`, `fn`, `ln`, `ct`, `zp`, etc., which triggers a re-initialization of the Pixel with hashed data before tracking.
    *   `pixelId`: To support multi-pixel setups.

### 2. `src/pages/uangpanas.tsx`
*   Replaced manual `window.fbq` calls with `src/utils/fbpixel.tsx` functions.
*   **AddPaymentInfo & Purchase:** Now capture user input (Name, Email, Phone), hash it via the utility, and send it with the event for **100% Match Quality** potential.
*   **Deduplication:** Retained `eventID` generation and ensured it is passed to both Pixel (Client) and CAPI (Server).

### 3. `src/pages/fitfactor.tsx`
*   Replaced manual `fbq` calls with new utility functions.
*   **InitiateCheckout & Purchase:** Updated to pass hashed user data and `eventID`.

### 4. `src/pages/3000.tsx`
*   Replaced manual `fbq` initialization and tracking (`PageView`, `AddToCart`, `AudioPlayed`) with utility functions.
*   Ensured `eventID` consistency.

## Usage Guide
To track an event with user data (for Advanced Matching):

```typescript
import { trackPurchaseEvent, AdvancedMatchingData } from '@/utils/fbpixel';

const userData: AdvancedMatchingData = {
  em: 'user@example.com', // Will be hashed automatically
  ph: '08123456789',      // Will be hashed automatically
  fn: 'John',             // Will be hashed automatically
  external_id: 'user_123'
};

trackPurchaseEvent({
  value: 100000,
  currency: 'IDR'
}, eventId, pixelId, userData);
```

This ensures that Meta receives the hashed customer information alongside the event, significantly improving ad attribution and optimization.
