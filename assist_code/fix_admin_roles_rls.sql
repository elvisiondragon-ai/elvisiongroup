-- Fix admin_roles table access for frontend
-- Run these queries to enable proper access

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity, hasrls 
FROM pg_tables 
WHERE tablename = 'admin_roles';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admin_roles';

-- Option 1: Create policy to allow SELECT for authenticated users
CREATE POLICY "Allow authenticated users to read admin roles" ON admin_roles
    FOR SELECT USING (auth.role() = 'authenticated');

-- Option 2: If you want more restrictive, only allow reading own admin status
-- CREATE POLICY "Users can read own admin status" ON admin_roles
--     FOR SELECT USING (auth.uid() = user_id);

-- Option 3: Allow public read access (less secure but simple for this use case)
-- CREATE POLICY "Public read access to admin roles" ON admin_roles
--     FOR SELECT USING (true);

-- Enable RLS if not already enabled
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Test the access after creating policy
SELECT user_id, role, is_active FROM admin_roles WHERE role = 'admin';