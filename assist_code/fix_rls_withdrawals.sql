-- Fix: admin_payout_queue is a VIEW, so we must secure the underlying 'withdrawals' table.

-- 1. Ensure RLS is enabled on withdrawals table
ALTER TABLE IF EXISTS public.withdrawals ENABLE ROW LEVEL SECURITY;

-- 2. Add Policy: Admins can view ALL withdrawals
-- This automatically enables the admin_payout_queue view to show all data for admins
DROP POLICY IF EXISTS "Admins can view all withdrawals" ON public.withdrawals;

CREATE POLICY "Admins can view all withdrawals"
ON public.withdrawals
FOR SELECT
TO authenticated
USING (public.is_verified_admin(auth.uid()));

-- 3. Add Policy: Admins can update withdrawals (e.g., to approve/reject)
DROP POLICY IF EXISTS "Admins can update withdrawals" ON public.withdrawals;

CREATE POLICY "Admins can update withdrawals"
ON public.withdrawals
FOR UPDATE
TO authenticated
USING (public.is_verified_admin(auth.uid()))
WITH CHECK (public.is_verified_admin(auth.uid()));
