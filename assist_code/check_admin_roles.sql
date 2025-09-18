-- Check admin_roles table structure and data
-- Run this to see if admin_roles table exists and contains dragon@yahoo.com

-- Check if admin_roles table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'admin_roles'
) as admin_roles_exists;

-- If table exists, check its structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'admin_roles' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check for dragon@yahoo.com in admin_roles
SELECT * FROM admin_roles;

-- Check if dragon@yahoo.com user exists in profiles
SELECT user_id, display_name, is_admin, level 
FROM profiles 
WHERE display_name ILIKE '%dragon%' OR user_id IN (
    SELECT user_id FROM auth.users WHERE email = 'dragon@yahoo.com'
);

-- Alternative: Find user by email pattern
SELECT p.user_id, p.display_name, p.is_admin, p.level, u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'dragon@yahoo.com';