-- Change mock1@yahoo.com join date to Jan 2024
UPDATE public.profiles
SET created_at = '2024-01-15 10:00:00+00'::timestamptz,
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock1@yahoo.com'
);

-- Also update auth.users created_at for consistency
UPDATE auth.users
SET created_at = '2024-01-15 10:00:00+00'::timestamptz,
    updated_at = now()
WHERE email = 'mock1@yahoo.com';

-- Verify the change
SELECT 
    u.email,
    u.created_at as auth_created_at,
    p.created_at as profile_created_at,
    p.display_name
FROM auth.users u
JOIN profiles p ON u.id = p.user_id
WHERE u.email = 'mock1@yahoo.com';