-- Get last 5 chat messages to see current user_name vs profile display_name
SELECT 
    cm.id,
    cm.user_id, 
    cm.user_name as current_chat_name,
    p.display_name as profile_display_name,
    cm.message,
    cm.created_at
FROM chat_messages cm
LEFT JOIN profiles p ON cm.user_id = p.user_id
ORDER BY cm.created_at DESC
LIMIT 5;

-- Update recent chat messages to use proper display_name from profiles
UPDATE chat_messages 
SET user_name = profiles.display_name
FROM profiles 
WHERE chat_messages.user_id = profiles.user_id 
AND profiles.display_name IS NOT NULL 
AND profiles.display_name != ''
AND chat_messages.id IN (
    SELECT id FROM chat_messages 
    ORDER BY created_at DESC 
    LIMIT 5
);

-- Verify the update worked
SELECT 
    cm.id,
    cm.user_id, 
    cm.user_name as updated_chat_name,
    p.display_name as profile_display_name,
    cm.message,
    cm.created_at
FROM chat_messages cm
LEFT JOIN profiles p ON cm.user_id = p.user_id
ORDER BY cm.created_at DESC
LIMIT 5;