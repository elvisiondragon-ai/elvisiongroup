-- Fixed RLS queries for admin_roles table access
-- Corrected syntax for PostgreSQL

-- Check current RLS status (corrected column name)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_roles';

-- Check existing RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admin_roles';

-- Check if RLS is enabled on admin_roles table
SELECT tablename, 
       CASE WHEN relrowsecurity THEN 'enabled' ELSE 'disabled' END as rls_status
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE c.relname = 'admin_roles' AND n.nspname = 'public';

-- Enable RLS if not already enabled
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read admin roles
CREATE POLICY "Allow authenticated users to read admin roles" ON admin_roles
    FOR SELECT USING (true);

-- Verify the policy was created
SELECT policyname, cmd, permissive, qual, with_check 
FROM pg_policies 
WHERE tablename = 'admin_roles';

-- Test access after creating policy
SELECT user_id, role, is_active, user_email 
FROM admin_roles 
WHERE role = 'admin' AND is_active = true;