-- ===========================================
-- REVERSE ADMIN CHAT HISTORY CHANGES
-- ===========================================

-- 1. Check current admin messages with [Admin] prefix
SELECT
    cm.id,
    cm.user_name,
    cm.message,
    cm.created_at,
    'Messages with [Admin] prefix' as status
FROM chat_messages cm
WHERE cm.user_name LIKE '[Admin]%'
ORDER BY cm.created_at DESC;

-- 2. Remove [Admin] prefix from all admin user names in chat
UPDATE chat_messages
SET user_name = REPLACE(user_name, '[Admin] ', '')
WHERE user_name LIKE '[Admin]%';

-- 3. Verify the reversal
SELECT
    cm.user_name,
    cm.message,
    cm.created_at,
    'Admin prefix removed' as status
FROM chat_messages cm
WHERE user_id IN (
    SELECT user_id FROM profiles WHERE achievements::text ILIKE '%admin%'
)
ORDER BY cm.created_at DESC;