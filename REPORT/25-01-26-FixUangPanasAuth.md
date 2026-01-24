# Fix Uang Panas Auth, Guest Checkout & Commission Tracking

**Date:** 25 January 2026
**Task:** Fix "Gagal Registrasi" on `uangpanas.tsx`, allow non-auth users to buy, and ensure correct commission/profile data.

## Problem
1.  **Blocking Auth:** Users were stopped from purchasing if auto-registration/login failed.
2.  **Incorrect Metadata:** `signUp` used `full_name` and `phone`, while the DB trigger expected `display_name` and `phone_number`.
3.  **Missing Commission Data:** The `commission_rate` (50% for Uang Panas) was being sent by the frontend but not saved to the database by the edge function.

## Investigation
-   **Backend:** `tripay-create-payment` had `requiresAuth: false` for `ebook_uangpanas`, but the frontend was blocking on auth failure.
-   **Database Trigger:** `handle_new_user` trigger looked for `display_name` and `phone_number` in `raw_user_meta_data`.
-   **Schema:** `global_product` has a `commission_rate` column that was being ignored in the edge function's `insert` call.

## Solution
1.  **Modified `src/pages/ebook_indo/uangpanas.tsx`:**
    -   Removed blocking `return` statements on auth failure (Allows Guest Checkout).
    -   Updated `signUp` metadata keys to `display_name` and `phone_number`.
2.  **Modified `supabase/functions/tripay-create-payment/index.ts`:**
    -   Included `commission_rate` in the `insert` logic for `global_product` and `waiting_payment`.

## Outcome
-   Users can buy as guests if they have existing accounts but forget passwords.
-   New user profiles will correctly capture names and phone numbers.
-   Affiliate commissions (50% for Uang Panas) are now correctly recorded in the database.