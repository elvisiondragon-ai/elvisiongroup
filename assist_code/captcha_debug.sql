-- CAPTCHA Debug and Fix SQL
-- Check for user with email: rizakhomsin@yahoo.com

-- 1. Check if user exists in auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'rizakhomsin@yahoo.com';

-- 2. Check auth attempts/logs (if available)
SELECT *
FROM auth.audit_log_entries 
WHERE payload->>'email' = 'rizakhomsin@yahoo.com'
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check for rate limiting or blocked IPs (if you have such table)
-- SELECT * FROM rate_limit_log WHERE ip_address = 'USER_IP';

-- 4. Verify CAPTCHA configuration
-- Check if Turnstile is properly configured in Supabase Auth settings
-- Dashboard -> Authentication -> Settings -> Security -> Enable Captcha Protection

-- POTENTIAL FIXES:

-- Fix 1: Reset user email confirmation if exists but not confirmed
UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'rizakhomsin@yahoo.com' 
  AND email_confirmed_at IS NULL;

-- Fix 2: Clear any auth sessions for this user
DELETE FROM auth.sessions 
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'rizakhomsin@yahoo.com'
);

-- Fix 3: Remove user completely if needed (CAREFUL!)
-- DELETE FROM auth.users WHERE email = 'rizakhomsin@yahoo.com';

-- VERIFICATION QUERIES:

-- Verify fix worked
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'rizakhomsin@yahoo.com';

-- Check recent auth events
SELECT 
    event_type,
    created_at,
    payload
FROM auth.audit_log_entries 
WHERE payload->>'email' = 'rizakhomsin@yahoo.com'
ORDER BY created_at DESC
LIMIT 5;