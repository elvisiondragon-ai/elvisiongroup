-- Setup Admin for dragon@yahoo.com
-- Run this after checking admin_roles table structure

-- Option 1: If using admin_roles table approach
-- First find the user_id for dragon@yahoo.com
SELECT 'Finding dragon@yahoo.com user:' as info;
SELECT p.user_id, p.display_name, u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'dragon@yahoo.com';

-- Option 2: Set is_admin = true directly in profiles table
UPDATE profiles 
SET is_admin = true 
WHERE user_id IN (
    SELECT p.user_id 
    FROM profiles p
    JOIN auth.users u ON p.user_id = u.id
    WHERE u.email = 'dragon@yahoo.com'
);

-- Option 3: If admin_roles table exists, insert record there
-- (Uncomment and modify if admin_roles table structure is known)
-- INSERT INTO admin_roles (user_id, role, created_at)
-- SELECT p.user_id, 'admin', NOW()
-- FROM profiles p
-- JOIN auth.users u ON p.user_id = u.id
-- WHERE u.email = 'dragon@yahoo.com'
-- ON CONFLICT DO NOTHING;

-- Verify the admin setup
SELECT 'Verification - Admin users:' as info;
SELECT p.user_id, p.display_name, p.is_admin, p.level, u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE p.is_admin = true OR u.email = 'dragon@yahoo.com';