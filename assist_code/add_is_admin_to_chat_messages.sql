-- ===========================================
-- ADD IS_ADMIN TO CHAT_MESSAGES TABLE
-- ===========================================

-- 1. Add is_admin column to chat_messages
ALTER TABLE chat_messages ADD COLUMN is_admin boolean DEFAULT false;

-- 2. Update existing messages for admin user
UPDATE chat_messages
SET is_admin = true
WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'dragon@yahoo.com'
);

-- 3. Verify the update
SELECT
    user_name,
    user_level,
    is_pro,
    is_admin,
    message,
    created_at
FROM chat_messages
WHERE is_admin = true
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check table structure now includes is_admin
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'chat_messages'
AND column_name IN ('user_level', 'is_pro', 'is_admin');