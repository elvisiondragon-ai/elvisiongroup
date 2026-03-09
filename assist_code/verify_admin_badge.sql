-- Verification Script: Test Admin Badge Functionality
-- Run this AFTER implementing the frontend code changes

-- Test 1: Check if admin users are properly marked
SELECT 'TEST 1: Admin users in profiles' as test_name;
SELECT user_id, display_name, is_admin, level, created_at
FROM profiles 
WHERE is_admin = true;

-- Test 2: Check chat messages from admin users
SELECT 'TEST 2: Chat messages from admin users' as test_name;
SELECT cm.user_id, cm.user_name, cm.is_admin, cm.message, cm.created_at,
       p.is_admin as profile_is_admin
FROM chat_messages cm
LEFT JOIN profiles p ON cm.user_id = p.user_id
WHERE cm.is_admin = true OR p.is_admin = true
ORDER BY cm.created_at DESC
LIMIT 10;

-- Test 3: Verify schema integrity
SELECT 'TEST 3: Schema verification' as test_name;
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'chat_messages') 
AND column_name = 'is_admin'
ORDER BY table_name, ordinal_position;

-- Test 4: Count admin vs non-admin users
SELECT 'TEST 4: User counts' as test_name;
SELECT 
    is_admin,
    COUNT(*) as user_count
FROM profiles
GROUP BY is_admin;

-- Test 5: Sample data for testing (to verify frontend changes work)
SELECT 'TEST 5: Sample data for frontend testing' as test_name;
SELECT 
    user_id,
    user_name,
    user_level,
    is_pro,
    is_admin,
    message,
    created_at
FROM chat_messages 
ORDER BY created_at DESC 
LIMIT 5;