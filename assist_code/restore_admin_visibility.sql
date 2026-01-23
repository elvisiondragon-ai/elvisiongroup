-- RESTORE ADMIN ACCESS (Safe to run after Auto Fix)

-- 1. Ensure Admins can see ALL requests (Auto Fix usually hides them)
DROP POLICY IF EXISTS "Admins can view all withdrawals" ON public.withdrawals;

CREATE POLICY "Admins can view all withdrawals"
ON public.withdrawals
FOR SELECT
TO authenticated
USING (public.is_verified_admin(auth.uid()));

-- 2. Ensure Admins can approve/reject requests
DROP POLICY IF EXISTS "Admins can update withdrawals" ON public.withdrawals;

CREATE POLICY "Admins can update withdrawals"
ON public.withdrawals
FOR UPDATE
TO authenticated
USING (public.is_verified_admin(auth.uid()))
WITH CHECK (public.is_verified_admin(auth.uid()));
