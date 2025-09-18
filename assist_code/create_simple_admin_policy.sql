-- Create a simpler admin_roles access policy that bypasses complex functions

-- Drop the existing complex policies that might be causing issues
DROP POLICY IF EXISTS "Super admins can view admin roles" ON admin_roles;

-- Create a simple policy for reading admin roles (for chat badge feature)
CREATE POLICY "simple_read_admin_roles" ON admin_roles
    FOR SELECT 
    USING (true);

-- Verify the new policy
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'admin_roles';

-- Test the simplified access
SELECT user_id, role, is_active FROM admin_roles WHERE role = 'admin';