# Root Cause Analysis: CAPI "GraphMethodException" Error
**Date:** January 18, 2026
**Issue:** `capi-universal` fails for Pixel `1393383179182528` (3000 Coaching) but works for other pixels.

## 1. The Error
```json
{
  "error": {
    "message": "Unsupported post request. Object with ID '1393383179182528' does not exist, cannot be loaded due to missing permissions...",
    "type": "GraphMethodException",
    "code": 100,
    "error_subcode": 33
  }
}
```

## 2. Root Cause
**Permission Mismatch in Access Token.**

*   **The Code:** The `capi-universal` function uses a single environment secret (`METACAPI`) for authentication.
*   **The Token:** This token belongs to a specific **Meta System User**.
*   **The Conflict:**
    *   This System User **HAS** permission for FitFactor Pixel (`1797...`) ✅ -> *Success*
    *   This System User **DOES NOT** have permission for 3000 Coaching Pixel (`1393...`) ❌ -> *Error 100*

Meta requires explicit asset permission. Even if you own both pixels, the "System User" (the bot account) needs to be manually assigned to the new pixel in Business Settings.

## 3. The Solution Implemented (Code Side)
To bypass the complex Business Manager permission setup, I updated `supabase/functions/capi-universal/index.ts` to support **multi-token architecture**:

```typescript
// Logic added:
if (pixelId === '1393383179182528') {
    const token3000 = Deno.env.get('METACAPI_3000');
    if (token3000) FACEBOOK_ACCESS_TOKEN = token3000;
}
```

## 4. Required Action (User Side)
To resolve the error, you must provide the authorized token:

1.  **Generate Token:** Go to Events Manager > Pixel `1393...` > Settings > Generate Access Token.
2.  **Set Secret:** Run `supabase secrets set METACAPI_3000="EAAG..."`.
3.  **Deploy:** Run `supabase functions deploy capi-universal --no-verify-jwt`.

Once this secret is set, the system will automatically switch to the valid token for this specific pixel.
