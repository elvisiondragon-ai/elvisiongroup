# Report: Add Minimal RLS for admin_payout_queue

**Date:** 23/01/26
**Task:** Add very minimal RLS for `admin_payout_queue`.

## Issue & Resolution
**Initial Attempt:** Tried to enable RLS on `admin_payout_queue` directly.
**Error:** `ERROR: 42809: ALTER action ENABLE ROW SECURITY cannot be performed on relation "admin_payout_queue" DETAIL: This operation is not supported for views.`
**Resolution:** `admin_payout_queue` is a **View**. Security must be applied to the underlying table `withdrawals`.

## Secondary Issue
**User Report:** "it still unrestricted"
**Root Cause:** Likely due to the `withdrawals` table having `GRANT ALL` permissions to `public` or `anon` roles, or having residual permissive policies.
**Final Fix:** `assist_code/fix_unrestricted_withdrawals.sql`

This script performs a complete security hardening:
1.  **Revoke Public Access:** `REVOKE ALL ... FROM anon, public`
2.  **Grant Authenticated Only:** `GRANT ... TO authenticated`
3.  **Reset Policies:** Drops and recreates strict User (Own Data) and Admin (All Data) policies.

### New Policies on `public.withdrawals`
```sql
-- Allow Admins to see EVERYONE's withdrawals
CREATE POLICY "Admins can view all withdrawals"
ON public.withdrawals
FOR SELECT
TO authenticated
USING (public.is_verified_admin(auth.uid()));

-- Allow Admins to update status (Approve/Reject)
CREATE POLICY "Admins can update withdrawals"
ON public.withdrawals
FOR UPDATE
TO authenticated
USING (public.is_verified_admin(auth.uid()))
WITH CHECK (public.is_verified_admin(auth.uid()));
```
