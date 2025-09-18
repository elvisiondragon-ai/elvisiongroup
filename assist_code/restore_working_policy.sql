-- Restore to working state - add back the working policy

-- Keep the simple policy that was working
-- (The allow_read_admin_roles policy should still be there)

-- Check current policies
SELECT policyname, cmd, permissive, roles, qual 
FROM pg_policies 
WHERE tablename = 'admin_roles';

-- If allow_read_admin_roles is missing, recreate it
CREATE POLICY IF NOT EXISTS "allow_read_admin_roles" ON admin_roles
    FOR SELECT USING (true);

-- Test access
SELECT user_id FROM admin_roles WHERE role = 'admin' AND is_active = true;