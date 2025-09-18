-- Debug why database query isn't working despite RLS policies

-- Test 1: Can we access admin_roles at all?
SELECT COUNT(*) as total_admin_roles FROM admin_roles;

-- Test 2: Test the exact query the frontend uses
SELECT user_id FROM admin_roles WHERE role = 'admin' AND is_active = true;

-- Test 3: Check data types (might be causing query issues)
SELECT 
    user_id,
    role,
    is_active,
    pg_typeof(role) as role_type,
    pg_typeof(is_active) as is_active_type
FROM admin_roles 
LIMIT 1;

-- Test 4: Check if there are any triggers or constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'admin_roles';

-- Test 5: Alternative query approaches that might work better
SELECT user_id FROM admin_roles WHERE role = 'admin'::text AND is_active = true;
SELECT user_id FROM admin_roles WHERE role = 'admin' AND is_active::boolean = true;