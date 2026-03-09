-- FIX MISSING DELETE BUTTON IN CHAT
-- Issue: currentUserId not matching user.id after database restore

-- 1. CHECK CURRENT AUTH STATE
SELECT 
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- 2. CHECK USER IDs IN CHAT MESSAGES  
-- See if user_id format matches what auth.uid() returns
SELECT 
    DISTINCT user_id,
    user_name,
    LENGTH(user_id) as id_length,
    user_id::text as user_id_text
FROM chat_messages 
ORDER BY user_name
LIMIT 10;

-- 3. CHECK YOUR SPECIFIC MESSAGES
-- Find messages you should be able to delete
SELECT 
    id,
    user_id,
    user_name,
    message,
    created_at,
    CASE 
        WHEN user_id::text = auth.uid()::text THEN 'SHOULD_SHOW_DELETE_BUTTON'
        WHEN auth.uid() IS NULL THEN 'AUTH_UID_IS_NULL'
        ELSE 'DIFFERENT_USER'
    END as delete_button_status
FROM chat_messages 
ORDER BY created_at DESC
LIMIT 10;

-- 4. CHECK PROFILES TABLE FOR USER ID MISMATCH
-- See if user IDs got corrupted during restore
SELECT 
    user_id,
    display_name,
    LENGTH(user_id) as id_length
FROM profiles
WHERE display_name IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;