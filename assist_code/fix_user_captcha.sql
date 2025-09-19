-- Fix for rizakhomsin@yahoo.com CAPTCHA issues
-- Run these queries in order:

-- 1. Check current user status
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'rizakhomsin@yahoo.com';

-- 2. Fix email confirmation if needed
UPDATE auth.users 
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
    updated_at = NOW()
WHERE email = 'rizakhomsin@yahoo.com';

-- 3. Clear any stuck sessions
DELETE FROM auth.sessions 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'rizakhomsin@yahoo.com');

-- 4. Verify fix
SELECT 
    id,
    email,
    email_confirmed_at,
    'FIXED' as status
FROM auth.users 
WHERE email = 'rizakhomsin@yahoo.com';