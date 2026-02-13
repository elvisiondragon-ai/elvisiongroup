# Report: Fix App Pro Subscription Automatic Upgrade
**Date:** 10/02/26 (Tuesday, February 10, 2026)
**Topic:** Pro Subscription Upgrade Logic

## Context
The system was experiencing an issue where users who paid for an app subscription (e.g., Monthly Pro) were not being automatically upgraded to Pro status. The payment was correctly marked as "PAID" in the `waiting_payment` table, but the actual upgrade to the `pro_subscriptions` table and the profile "pro" achievement were not happening.

## Issues Identified
1. **Parameter Mismatch:** The `tripay-callback` Edge Function was calling the database RPC `activate_pro_subscription` with the user's email (`p_user_email`), but the production database function expected the Tripay reference ID (`p_tripay_reference`).
2. **Narrow Subscription Type Check:** The Edge Function only triggered the upgrade if the `subscription_type` was exactly `'subscription'`. However, the app uses specific types like `'1_day'`, `'1_week'`, `'1_month'`, and `'1_year'`. These were being ignored by the upgrade logic.
3. **Ghost Records:** Because the upgrade failed, the record remained in `waiting_payment` (marked as 'paid') instead of being moved/deleted, preventing the "Payment Confirmed" toast from showing in the app (which relies on the record being cleared).

## Solution
1. **Corrected RPC Parameters:** Updated `supabase/functions/tripay-callback/index.ts` to pass `p_tripay_reference: tripayReference` instead of email.
2. **Broadened Type Support:** Updated the logic to handle all pro-related subscription types (anything that isn't `'credit'`) to ensure app subscriptions trigger the upgrade.
3. **Developer Warning:** Added a critical note to the code to prevent future developers from modifying the app subscription logic, as it is separate from the `global_product` flow.

## Code Changes
- Modified `supabase/functions/tripay-callback/index.ts`:
    - Updated RPC call parameter.
    - Simplified `if/else` logic to catch all pro types.
    - Added `// //note to next dev do not touch or edit this code this for app monthly subscription`.

## Outcome
App subscriptions now automatically upgrade the user to Pro status upon payment confirmation. The "Payment Confirmed" toast will now show correctly because the `waiting_payment` record is properly processed and deleted by the `activate_pro_subscription` function.
