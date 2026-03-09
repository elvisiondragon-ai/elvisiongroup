-- DEBUG AUTH SESSION ISSUE
-- User appears logged in but auth.uid() returns NULL

-- 1. CHECK CURRENT AUTH STATE IN DATABASE
-- This will show what the database sees for auth context
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role,
    auth.email() as current_email;

-- 2. CHECK AUTH.USERS TABLE FOR RECENT LOGINS
-- See if users exist and when they last signed in
SELECT 
    id,
    email,
    email_confirmed_at,
    last_sign_in_at,
    created_at,
    confirmation_sent_at,
    recovery_sent_at,
    email_change_sent_at,
    CASE 
        WHEN last_sign_in_at > NOW() - INTERVAL '1 hour' THEN 'RECENT_LOGIN'
        WHEN last_sign_in_at > NOW() - INTERVAL '1 day' THEN 'TODAY_LOGIN'
        WHEN last_sign_in_at IS NULL THEN 'NEVER_LOGGED_IN'
        ELSE 'OLD_LOGIN'
    END as login_status
FROM auth.users 
ORDER BY last_sign_in_at DESC NULLS LAST
LIMIT 10;

-- 3. CHECK AUTH.SESSIONS TABLE 
-- Look for active sessions that should provide auth.uid()
SELECT 
    id,
    user_id,
    created_at,
    updated_at,
    factor_id,
    aal,
    CASE 
        WHEN updated_at > NOW() - INTERVAL '1 hour' THEN 'ACTIVE'
        WHEN updated_at > NOW() - INTERVAL '1 day' THEN 'RECENT'
        ELSE 'EXPIRED'
    END as session_status
FROM auth.sessions 
WHERE updated_at > NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;

-- 4. CHECK FOR JWT CONFIGURATION ISSUES
-- Verify auth schema and functions exist
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'auth' 
AND routine_name IN ('uid', 'role', 'email', 'jwt')
ORDER BY routine_name;

-- 5. TEST IF WE CAN BYPASS AUTH TEMPORARILY
-- Create temporary policy to see if data access works without auth
-- WARNING: This is for debugging only, remove after testing

-- Temporarily allow all access to chat_messages (for testing)
CREATE POLICY "DEBUG_TEMP_allow_all_chat_messages" 
ON chat_messages 
FOR SELECT 
TO public 
USING (true);

-- Temporarily allow all access to profiles (for testing)  
CREATE POLICY "DEBUG_TEMP_allow_all_profiles"
ON profiles 
FOR SELECT 
TO public 
USING (true);

-- 6. TEST QUERIES WITHOUT AUTH
-- These should work with temporary policies above
-- SELECT COUNT(*) as total_messages FROM chat_messages;
-- SELECT COUNT(*) as total_profiles FROM profiles;

-- 7. CHECK SUPABASE SETTINGS TABLE
-- Look for configuration that might affect auth
SELECT 
    name,
    value
FROM auth.config 
WHERE name IN ('site_url', 'jwt_secret', 'jwt_exp', 'refresh_token_rotation_enabled');

-- CLEANUP COMMANDS (RUN AFTER TESTING):
-- DROP POLICY IF EXISTS "DEBUG_TEMP_allow_all_chat_messages" ON chat_messages;
-- DROP POLICY IF EXISTS "DEBUG_TEMP_allow_all_profiles" ON profiles;