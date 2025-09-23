-- Update ALL chat messages to use display_name instead of email split

-- 1. Check current state - see email splits vs display names
SELECT 
    p.user_email,
    p.display_name,
    cm.user_name as current_chat_name,
    CASE 
        WHEN cm.user_name = p.display_name THEN 'ALREADY CORRECT'
        WHEN cm.user_name = SPLIT_PART(p.user_email, '@', 1) THEN 'EMAIL SPLIT - NEEDS UPDATE'
        ELSE 'OTHER'
    END as status,
    COUNT(*) as message_count
FROM chat_messages cm
JOIN profiles p ON cm.user_id = p.user_id
WHERE p.display_name IS NOT NULL AND p.display_name != ''
GROUP BY p.user_email, p.display_name, cm.user_name
ORDER BY status, p.user_email;

-- 2. UPDATE: Change all chat messages to use display_name
UPDATE chat_messages 
SET user_name = profiles.display_name
FROM profiles 
WHERE chat_messages.user_id = profiles.user_id 
AND profiles.display_name IS NOT NULL 
AND profiles.display_name != ''
AND chat_messages.user_name != profiles.display_name;

-- 3. Verify the update worked - should show all display names now
SELECT 
    p.user_email,
    p.display_name,
    cm.user_name as updated_chat_name,
    cm.created_at
FROM chat_messages cm
JOIN profiles p ON cm.user_id = p.user_id
WHERE cm.created_at >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY cm.created_at DESC
LIMIT 15;