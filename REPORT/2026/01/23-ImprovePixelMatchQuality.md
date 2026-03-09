# Report: Improve Pixel Purchase Match Quality

**Date:** 2026-01-23
**Task:** Improve Meta Pixel "Purchase" event match quality score (currently ~7.0) to match "Add Payment Info" (9.1).

## Problem
The Purchase event is fired Server-Side (via `tripay-callback`). By the time this happens, the server loses access to the user's original IP Address and User Agent, often sending the Server's IP instead. Meta penalizes this mismatch.

## Solution Implemented
We implemented a **"Capture & Store"** strategy:
1.  **Capture:** When the user initiates payment (Browser -> Server), we capture their real IP and User Agent.
2.  **Store:** We save these details in the database alongside the transaction.
3.  **Send:** When the payment is confirmed (Server -> Server), we retrieve the *stored* original IP/Agent and send that to Meta CAPI.

### Files Modified
1.  **Database Migration:** `assist_code/add_tracking_columns.sql`
    *   Added `ip_address` and `user_agent` to `global_product`.
    *   Added `user_agent` to `waiting_payment`.

2.  **Edge Function:** `supabase/functions/tripay-create-payment/index.ts`
    *   Captures `req.headers.get('user-agent')`.
    *   Inserts `ip_address` and `user_agent` into DB.

3.  **Edge Function:** `supabase/functions/tripay-callback/index.ts`
    *   Selects `ip_address` and `user_agent` from DB.
    *   Passes them as `client_ip_address` and `client_user_agent` to `capi-universal`.

## Required Actions
1.  **Execute SQL:** Run `assist_code/add_tracking_columns.sql` in Supabase.
2.  **Deploy Functions:**
    ```bash
    supabase functions deploy tripay-create-payment --no-verify-jwt
    supabase functions deploy tripay-callback --no-verify-jwt
    ```

## Expected Outcome
Meta will now receive the *User's* IP address for the Purchase event, even though it was sent from the server. This should raise the Match Quality Score significantly (closer to 9.0).
