-- ===========================================
-- UPDATE ADMIN CHAT HISTORY
-- ===========================================

-- 1. Check current admin users
SELECT user_id, display_name, user_email, achievements
FROM profiles
WHERE achievements::text ILIKE '%admin%';

-- 2. Find chat messages from admin users
SELECT
    cm.id,
    cm.user_id,
    cm.user_name,
    cm.message,
    cm.created_at,
    p.achievements,
    'Admin message' as status
FROM chat_messages cm
JOIN profiles p ON cm.user_id = p.user_id
WHERE p.achievements::text ILIKE '%admin%'
ORDER BY cm.created_at DESC;

-- 3. Update admin user names in chat to show [Admin] prefix
UPDATE chat_messages
SET user_name = CASE
    WHEN user_name NOT LIKE '[Admin]%' THEN '[Admin] ' || user_name
    ELSE user_name
END
WHERE user_id IN (
    SELECT user_id FROM profiles WHERE achievements::text ILIKE '%admin%'
);

-- 4. Verify the update
SELECT
    cm.user_name,
    cm.message,
    cm.created_at,
    'Updated admin message' as status
FROM chat_messages cm
WHERE cm.user_name LIKE '[Admin]%'
ORDER BY cm.created_at DESC;