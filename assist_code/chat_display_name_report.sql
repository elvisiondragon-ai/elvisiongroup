-- REPORT: Why dragon@yahoo.com showed email split instead of display_name in chat
-- ISSUE ANALYSIS AND RESOLUTION

-- The problem was in chat_messages table storing old user_name values

-- 1. Check current chat_messages for dragon user
SELECT 
    cm.user_name as stored_chat_name,
    p.display_name as profile_display_name,
    cm.created_at,
    CASE 
        WHEN cm.user_name = p.display_name THEN 'CORRECT'
        ELSE 'OUTDATED'
    END as name_status
FROM chat_messages cm
JOIN profiles p ON cm.user_id = p.user_id
WHERE p.user_email = 'dragon@yahoo.com'
ORDER BY cm.created_at DESC
LIMIT 5;

-- WHAT HAPPENED:
-- 1. User dragon@yahoo.com has display_name = 'Renata' in profiles table ✓
-- 2. But chat_messages.user_name still contained 'dragon' (email split) ✗
-- 3. Chat.tsx shows user_name from chat_messages, not live lookup from profiles
-- 4. Our earlier SQL fix updated chat_messages.user_name to use proper display_name ✓

-- PREVENTION: 
-- Chat component should either:
-- A) Always use live profile lookup (slower)
-- B) Update chat_messages when user changes display_name (current approach)
-- C) Join with profiles table in chat query (recommended)

-- RECOMMENDED FIX for future:
-- Update Chat.tsx to join with profiles for live display names