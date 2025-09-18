-- Simple RLS fix for admin_roles - works on all PostgreSQL versions

-- Step 1: Enable RLS on admin_roles table
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Step 2: Create a simple policy to allow reading admin roles
CREATE POLICY "allow_read_admin_roles" ON admin_roles
    FOR SELECT USING (true);

-- Step 3: Test if it works
SELECT user_id, role, is_active FROM admin_roles WHERE role = 'admin';

-- Step 4: Check if policies exist (simpler query)
SELECT * FROM pg_policies WHERE tablename = 'admin_roles';