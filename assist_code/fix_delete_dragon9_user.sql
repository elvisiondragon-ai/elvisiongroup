-- ===========================================
-- FIX DELETE DRAGON9 USER COMPLETELY
-- ===========================================

-- 1. Get dragon9 user_id first
SELECT user_id FROM profiles WHERE user_email = 'dragon9@yahoo.com';

-- 2. Delete using the actual user_id (replace with actual UUID from step 1)
-- Replace 'USER_ID_HERE' with the actual UUID from above query

-- Delete chat messages
DELETE FROM chat_messages WHERE user_id = 'f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b';

-- Delete reflections/journal entries
DELETE FROM reflections WHERE user_id = 'f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b';

-- Delete XP transactions
DELETE FROM xp_transactions WHERE user_id = 'f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b';

-- Delete pro subscriptions
DELETE FROM pro_subscriptions WHERE user_id = 'f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b';

-- Delete user activities
DELETE FROM user_activities WHERE user_id = 'f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b';

-- Delete elite habits
DELETE FROM elite_habits WHERE user_id = 'f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b';

-- Delete device tokens
DELETE FROM device_tokens WHERE user_id = 'f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b';

-- Delete notification settings
DELETE FROM notification_settings WHERE user_id = 'f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b';

-- Delete waiting payments
DELETE FROM waiting_payment WHERE user_id = 'f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b';

-- Finally delete the profile
DELETE FROM profiles WHERE user_id = 'f5ab3d7f-cc48-4469-bd3b-0ef31c19e55b';

-- 3. Verify deletion
SELECT COUNT(*) as remaining_records FROM profiles WHERE user_email = 'dragon9@yahoo.com';