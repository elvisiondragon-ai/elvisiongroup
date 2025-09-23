-- Remove hardcoded SQL fixes - let frontend handle display names properly

-- 1. Revert all chat_messages back to original state (before our manual fixes)
-- This will show email splits again, but frontend should now handle it correctly

-- Find all messages that were manually updated to display_name
SELECT 
    cm.id,
    cm.user_id,
    cm.user_name,
    cm.message,
    cm.created_at
FROM chat_messages cm
JOIN profiles p ON cm.user_id = p.user_id
WHERE cm.user_name = p.display_name
AND cm.created_at >= CURRENT_DATE - INTERVAL '3 days'
ORDER BY cm.created_at DESC;

-- Revert chat_messages back to email split (original state)
UPDATE chat_messages 
SET user_name = SPLIT_PART(
    (SELECT user_email FROM profiles WHERE profiles.user_id = chat_messages.user_id), 
    '@', 1
)
WHERE user_id IN (
    SELECT user_id FROM profiles 
    WHERE display_name IS NOT NULL 
    AND display_name != ''
);

-- Verify revert - should show email splits again
SELECT 
    p.user_email,
    p.display_name,
    cm.user_name as reverted_to_email_split,
    cm.created_at
FROM chat_messages cm
JOIN profiles p ON cm.user_id = p.user_id
WHERE cm.created_at >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY cm.created_at DESC
LIMIT 10;