-- Check what Chat.tsx actually receives vs what it should send

-- 1. What the profile query returns (Chat.tsx line 63)
SELECT 
    'Profile Query Result:' as check_type,
    display_name, 
    level, 
    achievements, 
    is_pro, 
    subscription_type
FROM profiles 
WHERE user_id = 'c644f60a-2f41-41fa-8814-b698c5154474';

-- 2. What gets stored in chat_messages when user sends message
SELECT 
    'Recent Chat Messages:' as check_type,
    user_name as what_chat_stored,
    message,
    created_at
FROM chat_messages 
WHERE user_id = 'c644f60a-2f41-41fa-8814-b698c5154474'
ORDER BY created_at DESC
LIMIT 3;

-- 3. Expected result: Chat.tsx should use display_name "aisah" 
-- If chat_messages.user_name shows "dragon" instead of "aisah", 
-- then Chat.tsx is not using the profile.display_name correctly