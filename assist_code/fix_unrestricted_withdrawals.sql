-- COMPREHENSIVE SECURITY FIX FOR WITHDRAWALS TABLE

-- 1. Revoke public access (Ensure 'anon' cannot touch this table)
REVOKE ALL ON public.withdrawals FROM anon;
REVOKE ALL ON public.withdrawals FROM public;

-- 2. Grant specific permissions to authenticated users only
GRANT SELECT, INSERT ON public.withdrawals TO authenticated;
-- Allow service_role (backend) full access
GRANT ALL ON public.withdrawals TO service_role;

-- 3. Force Enable RLS
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- 4. Reset Policies (Clean Slate)
DROP POLICY IF EXISTS "Users can view own withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Users can request withdrawal" ON public.withdrawals;
DROP POLICY IF EXISTS "Admins can view all withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Admins can update withdrawals" ON public.withdrawals;

-- 5. Re-apply User Policies (Strictly own data)
CREATE POLICY "Users can view own withdrawals" 
ON public.withdrawals 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can request withdrawal" 
ON public.withdrawals 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 6. Re-apply Admin Policies (Verified admins only)
CREATE POLICY "Admins can view all withdrawals"
ON public.withdrawals
FOR SELECT
TO authenticated
USING (public.is_verified_admin(auth.uid()));

CREATE POLICY "Admins can update withdrawals"
ON public.withdrawals
FOR UPDATE
TO authenticated
USING (public.is_verified_admin(auth.uid()))
WITH CHECK (public.is_verified_admin(auth.uid()));

-- 7. Ensure View Permissions are correct (Views don't have RLS, but permissions matter)
GRANT SELECT ON public.admin_payout_queue TO authenticated;
REVOKE ALL ON public.admin_payout_queue FROM anon;
