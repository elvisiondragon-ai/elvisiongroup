-- Fix admin_roles multiple permissive policies warning
-- Consolidate the two SELECT policies into one

BEGIN;

-- Drop the two separate SELECT policies
DROP POLICY IF EXISTS "Consolidated admin roles access" ON public.admin_roles;
DROP POLICY IF EXISTS "Super admins manage admin roles data" ON public.admin_roles;

-- Create single SELECT policy that combines both conditions
CREATE POLICY "Admin roles read access" ON public.admin_roles
    FOR SELECT
    TO public
    USING (
        -- Anyone can read (was "Consolidated admin roles access")
        true
        OR
        -- Super admins can read (was part of "Super admins manage admin roles data")
        ((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean
    );

-- Create separate policies for INSERT/UPDATE/DELETE (super admins only)
CREATE POLICY "Super admins insert admin roles" ON public.admin_roles
    FOR INSERT
    TO public
    WITH CHECK (((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean);

CREATE POLICY "Super admins update admin roles" ON public.admin_roles
    FOR UPDATE
    TO public
    USING (((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean)
    WITH CHECK (((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean);

CREATE POLICY "Super admins delete admin roles" ON public.admin_roles
    FOR DELETE
    TO public
    USING (((verify_admin_with_failsafe((SELECT auth.uid()), 'super_admin'::text) ->> 'is_admin'::text))::boolean);

COMMIT;

-- Verification
SELECT 
    'admin_roles_final_check' as test,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies
WHERE tablename = 'admin_roles'
    AND schemaname = 'public'
ORDER BY cmd, policyname;