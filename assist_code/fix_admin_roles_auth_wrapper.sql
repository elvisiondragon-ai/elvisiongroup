-- Fix admin_roles policies to properly wrap auth.uid() with SELECT
-- The previous fix didn't properly wrap the auth function

BEGIN;

-- Drop existing policies
DROP POLICY IF EXISTS "Consolidated admin roles access" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins manage admin roles data" ON public.admin_roles;

-- Create corrected policy for SELECT with proper auth wrapper
CREATE POLICY "Consolidated admin roles access" ON public.admin_roles
    FOR SELECT
    TO public
    USING (
        -- Anyone can read
        true
        OR
        -- Super admins can also read (with properly wrapped auth function)
        ((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean
    );

-- Create policy for INSERT/UPDATE/DELETE with proper auth wrapper
CREATE POLICY "Super admins manage admin roles data" ON public.admin_roles
    FOR ALL
    TO public
    USING (((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean)
    WITH CHECK (((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean);

COMMIT;

-- ======================
-- VERIFICATION QUERIES
-- ======================
-- Check admin_roles policies
SELECT 'admin_roles_policies' as test,
       COUNT(*) as policy_count,
       array_agg(policyname) as policy_names
FROM pg_policies
WHERE tablename = 'admin_roles'
  AND schemaname = 'public';

-- Verify auth.uid() is properly wrapped
SELECT 'admin_roles_auth_check' as test,
       policyname,
       qual,
       with_check,
       CASE 
           WHEN qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid())%' THEN 'STILL_HAS_UNWRAPPED_AUTH_IN_QUAL'
           WHEN with_check LIKE '%auth.uid()%' AND with_check NOT LIKE '%(SELECT auth.uid())%' THEN 'STILL_HAS_UNWRAPPED_AUTH_IN_WITH_CHECK'
           ELSE 'OK'
       END as auth_check_status
FROM pg_policies
WHERE tablename = 'admin_roles'
  AND schemaname = 'public';

-- Show the actual policy definitions to debug
SELECT 'admin_roles_policy_details' as test,
       policyname,
       cmd,
       qual,
       with_check
FROM pg_policies
WHERE tablename = 'admin_roles'
  AND schemaname = 'public';