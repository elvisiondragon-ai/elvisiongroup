-- Fix permissions to allow updating withdrawal status
-- 1. Grant UPDATE on the withdrawals table to authenticated users (so the admin user can update it)
GRANT UPDATE ON public.withdrawals TO authenticated;

-- 2. Create a policy to specifically allow admins (or anyone for this "simple" fix as requested) to update status
-- First, drop conflicting policies if any
DROP POLICY IF EXISTS "Admins can update withdrawals" ON public.withdrawals;
DROP POLICY IF EXISTS "Anyone can update withdrawals" ON public.withdrawals;

-- Create a permissive policy for updates (CAUTION: specific to user request "anyone can change it")
CREATE POLICY "Anyone can update withdrawals"
ON public.withdrawals
FOR UPDATE
USING (true)
WITH CHECK (true);

-- 3. Also ensure SELECT is allowed so the table can be read
GRANT SELECT ON public.withdrawals TO authenticated;
CREATE POLICY "Anyone can view withdrawals"
ON public.withdrawals
FOR SELECT
USING (true);
