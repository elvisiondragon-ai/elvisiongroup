-- ===========================================
-- DELETE DRAGON9 USER COMPLETELY
-- ===========================================

-- 1. Check dragon9 user exists
SELECT
    user_id,
    display_name,
    user_email,
    achievements,
    created_at,
    'User to be deleted' as status
FROM profiles
WHERE user_email = 'dragon9@yahoo.com';

-- 2. Delete from all related tables (cascade cleanup)
-- Delete chat messages
DELETE FROM chat_messages WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'dragon9@yahoo.com'
);

-- Delete reflections/journal entries
DELETE FROM reflections WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'dragon9@yahoo.com'
);

-- Delete XP transactions
DELETE FROM xp_transactions WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'dragon9@yahoo.com'
);

-- Delete pro subscriptions
DELETE FROM pro_subscriptions WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'dragon9@yahoo.com'
);

-- Delete user activities
DELETE FROM user_activities WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'dragon9@yahoo.com'
);

-- Delete elite habits
DELETE FROM elite_habits WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'dragon9@yahoo.com'
);

-- Delete device tokens
DELETE FROM device_tokens WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'dragon9@yahoo.com'
);

-- Delete notification settings
DELETE FROM notification_settings WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'dragon9@yahoo.com'
);

-- Delete waiting payments
DELETE FROM waiting_payment WHERE user_id = (
    SELECT user_id FROM profiles WHERE user_email = 'dragon9@yahoo.com'
);

-- Finally delete the profile
DELETE FROM profiles WHERE user_email = 'dragon9@yahoo.com';

-- 3. Verify deletion
SELECT
    COUNT(*) as remaining_dragon9_records,
    'Should be 0' as expected
FROM profiles
WHERE user_email = 'dragon9@yahoo.com';