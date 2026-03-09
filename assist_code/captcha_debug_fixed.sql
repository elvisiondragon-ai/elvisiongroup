-- CAPTCHA Debug and Fix SQL (Fixed Schema)
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

-- 2. Check auth audit log structure first
\d auth.audit_log_entries;

-- 3. Check auth attempts/logs with correct columns
SELECT 
    id,
    created_at,
    payload
FROM auth.audit_log_entries 
WHERE payload->>'email' = 'rizakhomsin@yahoo.com'
ORDER BY created_at DESC
LIMIT 10;

-- 4. Alternative: Check all recent auth events to see structure
SELECT 
    id,
    created_at,
    payload
FROM auth.audit_log_entries 
ORDER BY created_at DESC
LIMIT 5;

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

-- Verify user status after fix
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at
FROM auth.users 
WHERE email = 'rizakhomsin@yahoo.com';

-- Check if CAPTCHA is causing issues by looking at recent payloads
SELECT 
    created_at,
    payload
FROM auth.audit_log_entries 
WHERE payload::text ILIKE '%captcha%' 
   OR payload::text ILIKE '%turnstile%'
ORDER BY created_at DESC
LIMIT 10;