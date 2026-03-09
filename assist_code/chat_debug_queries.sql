-- CHAT.TSX DEBUG QUERIES
-- User cannot chat - requires login but users already signed in

-- 1. CHECK AUTH.USERS TABLE
-- Verify users exist and have valid sessions
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    updated_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
ORDER BY last_sign_in_at DESC NULLS LAST
LIMIT 10;

-- 2. CHECK PROFILES TABLE (Chat.tsx lines 56-84)
-- Chat.tsx tries to get/create user profile after auth
SELECT 
    user_id,
    display_name,
    level,
    experience_points,
    streak_days,
    created_at,
    updated_at
FROM profiles 
ORDER BY created_at DESC
LIMIT 10;

-- 3. CHECK CHAT_MESSAGES TABLE STRUCTURE (Chat.tsx lines 119-122, 438-446)
-- Verify table exists and has correct columns
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. CHECK CHAT_MESSAGES PERMISSIONS
-- Verify RLS policies allow authenticated users to read/insert
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'chat_messages';

-- 5. CHECK RECENT CHAT MESSAGES
-- See if messages are being stored properly
SELECT 
    id,
    user_id,
    user_name,
    user_level,
    is_pro,
    message,
    created_at
FROM chat_messages 
ORDER BY created_at DESC
LIMIT 5;

-- 6. CHECK FOR ORPHANED CHAT MESSAGES
-- Messages without corresponding users in profiles
SELECT 
    cm.user_id,
    cm.user_name,
    cm.created_at,
    p.display_name,
    CASE 
        WHEN p.user_id IS NULL THEN 'NO_PROFILE'
        ELSE 'HAS_PROFILE'
    END as profile_status
FROM chat_messages cm
LEFT JOIN profiles p ON cm.user_id = p.user_id
WHERE p.user_id IS NULL
ORDER BY cm.created_at DESC
LIMIT 10;

-- 7. TEST AUTH SESSION QUERY (Chat.tsx line 51)
-- This is what Chat.tsx getCurrentUser() function runs
-- Note: This may not work in SQL client, but shows the pattern
-- SELECT auth.session();

-- 8. CHECK AUTH TOKENS/SESSIONS TABLE
-- Look for active sessions
SELECT 
    user_id,
    created_at,
    updated_at,
    factor_id,
    aal
FROM auth.sessions 
WHERE updated_at > NOW() - INTERVAL '1 day'
ORDER BY updated_at DESC;

-- DIAGNOSIS QUERIES:
-- Run these to identify the specific issue

-- A. Count users vs profiles
SELECT 
    'auth.users' as table_name,
    COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
    'profiles' as table_name,
    COUNT(*) as count
FROM profiles;

-- B. Check for users without profiles (potential issue)
SELECT 
    au.id,
    au.email,
    au.created_at,
    p.user_id,
    CASE 
        WHEN p.user_id IS NULL THEN 'MISSING_PROFILE'
        ELSE 'HAS_PROFILE'
    END as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.user_id
WHERE au.email_confirmed_at IS NOT NULL;

-- C. Check RLS is enabled on tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('profiles', 'chat_messages');