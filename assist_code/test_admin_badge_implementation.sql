-- Final Test Script: Admin Badge Implementation
-- Run this to verify everything is working

-- Test 1: Check if dragon@yahoo.com has admin status
SELECT 'TEST 1: Check dragon admin status' as test_name;
SELECT p.user_id, p.display_name, p.is_admin, p.level, u.email
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE u.email = 'dragon@yahoo.com';

-- Test 2: Check all admin users
SELECT 'TEST 2: All admin users' as test_name;
SELECT user_id, display_name, is_admin, level, created_at
FROM profiles 
WHERE is_admin = true;

-- Test 3: Check chat messages that should show admin badge
SELECT 'TEST 3: Chat messages from admin users' as test_name;
SELECT cm.user_id, cm.user_name, cm.user_level, cm.is_pro, cm.is_admin, 
       LEFT(cm.message, 50) as message_preview, cm.created_at
FROM chat_messages cm
WHERE cm.user_id IN (
    SELECT p.user_id 
    FROM profiles p
    JOIN auth.users u ON p.user_id = u.id
    WHERE u.email = 'dragon@yahoo.com' OR p.is_admin = true
)
ORDER BY cm.created_at DESC
LIMIT 10;

-- Test 4: Update test message to verify admin badge shows
-- (This will create a test message if dragon user exists)
DO $$
DECLARE
    admin_user_id UUID;
    admin_user_name TEXT;
    admin_user_level INTEGER;
BEGIN
    -- Find dragon admin user
    SELECT p.user_id, p.display_name, p.level
    INTO admin_user_id, admin_user_name, admin_user_level
    FROM profiles p
    JOIN auth.users u ON p.user_id = u.id
    WHERE u.email = 'dragon@yahoo.com' AND p.is_admin = true;
    
    -- If admin user exists, insert test message
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO chat_messages (user_id, user_name, user_level, is_pro, is_admin, message)
        VALUES (admin_user_id, admin_user_name, admin_user_level, true, true, '[TEST] Admin badge should appear on this message 🛡️');
        
        RAISE NOTICE 'Test message inserted for admin user: %', admin_user_name;
    ELSE
        RAISE NOTICE 'No admin user found with email dragon@yahoo.com';
    END IF;
END $$;

-- Test 5: Final verification
SELECT 'TEST 5: Final verification - Recent messages with admin status' as test_name;
SELECT user_name, user_level, is_pro, is_admin, 
       LEFT(message, 60) as message_preview,
       created_at
FROM chat_messages 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC
LIMIT 5;