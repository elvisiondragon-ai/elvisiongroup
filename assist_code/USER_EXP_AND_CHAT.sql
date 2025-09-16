-- USER EXP AND CHAT
-- Complete SQL script for setting up mock users with experience, subscriptions, and chat messages

-- =============================================
-- STEP 1: FIND USER IDS
-- =============================================
SELECT id, email FROM auth.users 
WHERE email IN ('mock1@yahoo.com', 'mock2@yahoo.com', 'mock3@yahoo.com', 'mock4@yahoo.com', 'mock5@yahoo.com');

-- Expected Results:
-- | id                                   | email           |
-- | ------------------------------------ | --------------- |
-- | ab68113b-cba7-4243-9544-8d932abcb521 | mock3@yahoo.com |
-- | 9c03719b-0e18-4851-b6ec-0abc3981df9a | mock2@yahoo.com |
-- | d828905b-bf9a-4672-9233-8411c39d4371 | mock5@yahoo.com |
-- | 94dda7bb-aa8f-47c8-a3be-de2139f94ef9 | mock1@yahoo.com |
-- | 8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a | mock4@yahoo.com |

-- =============================================
-- STEP 2: AWARD EXPERIENCE POINTS
-- =============================================
-- XP Requirements based on calculate_level_from_xp function:
-- Level 8: 9,000 XP
-- Level 9: 12,000 XP  
-- Level 10: 15,000 XP

-- Gustian lv9: Add XP to reach 12,000 total
UPDATE public.profiles
SET experience_points = experience_points + (12000 - experience_points),
    level = public.calculate_level_from_xp(12000),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock1@yahoo.com'
);

-- Made Bangli lv9: Add XP to reach 12,000 total
UPDATE public.profiles
SET experience_points = experience_points + (12000 - experience_points),
    level = public.calculate_level_from_xp(12000),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock2@yahoo.com'
);

-- Putri Wahyudi lv8: Add XP to reach 9,000 total
UPDATE public.profiles
SET experience_points = experience_points + (9000 - experience_points),
    level = public.calculate_level_from_xp(9000),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock3@yahoo.com'
);

-- Tian lee lv10: Add XP to reach 15,000 total
UPDATE public.profiles
SET experience_points = experience_points + (15000 - experience_points),
    level = public.calculate_level_from_xp(15000),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock4@yahoo.com'
);

-- Agustinus lv10: Add XP to reach 15,000 total
UPDATE public.profiles
SET experience_points = experience_points + (15000 - experience_points),
    level = public.calculate_level_from_xp(15000),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock5@yahoo.com'
);

-- =============================================
-- STEP 3: GRANT 1-YEAR PRO SUBSCRIPTIONS
-- =============================================
-- Grant 1-year pro subscriptions to all mock users
INSERT INTO public.pro_subscriptions (
  user_id, 
  user_email, 
  subscription_type, 
  status, 
  subscription_start_date, 
  subscription_end_date,
  created_at,
  updated_at
) VALUES 
-- Gustian (mock1@yahoo.com)
('94dda7bb-aa8f-47c8-a3be-de2139f94ef9', 'mock1@yahoo.com', '1_year', 'active', now(), now() + interval '1 year', now(), now()),

-- Made Bangli (mock2@yahoo.com) 
('9c03719b-0e18-4851-b6ec-0abc3981df9a', 'mock2@yahoo.com', '1_year', 'active', now(), now() + interval '1 year', now(), now()),

-- Putri Wahyudi (mock3@yahoo.com)
('ab68113b-cba7-4243-9544-8d932abcb521', 'mock3@yahoo.com', '1_year', 'active', now(), now() + interval '1 year', now(), now()),

-- Tian lee (mock4@yahoo.com)
('8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a', 'mock4@yahoo.com', '1_year', 'active', now(), now() + interval '1 year', now(), now()),

-- Agustinus (mock5@yahoo.com)
('d828905b-bf9a-4672-9233-8411c39d4371', 'mock5@yahoo.com', '1_year', 'active', now(), now() + interval '1 year', now(), now());

-- =============================================
-- STEP 4: CHAT MESSAGES - CURRENT TIME
-- =============================================
-- Insert chat messages with current timestamp
INSERT INTO public.chat_messages (
  user_id,
  user_name,
  user_level,
  is_pro,
  message,
  subscription_type,
  created_at
) VALUES
-- Gustian (mock1@yahoo.com)
('94dda7bb-aa8f-47c8-a3be-de2139f94ef9', 'Gustian', 9, true, 'Siap All Father sudah dinotif kemarin', '1_year', now()),

-- Made Bangli (mock2@yahoo.com)
('9c03719b-0e18-4851-b6ec-0abc3981df9a', 'Made Bangli', 9, true, 'Stand by', '1_year', now()),

-- Putri Wahyudi (mock3@yahoo.com)
('ab68113b-cba7-4243-9544-8d932abcb521', 'Putri Wahyudi', 8, true, 'Makasih informasinya All Father semoga bisa kelas bersama', '1_year', now()),

-- Tian lee (mock4@yahoo.com)
('8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a', 'Tian lee', 10, true, 'Thank you All Father, Noted !.', '1_year', now()),

-- Agustinus (mock5@yahoo.com)
('d828905b-bf9a-4672-9233-8411c39d4371', 'Agustinus', 10, true, 'Sudah saya nanti moment ini', '1_year', now());

-- =============================================
-- STEP 5: CHAT MESSAGES - INTERVAL TIMING
-- =============================================
-- Delete previous messages from mock users
DELETE FROM public.chat_messages 
WHERE user_id IN (
  '94dda7bb-aa8f-47c8-a3be-de2139f94ef9',
  '9c03719b-0e18-4851-b6ec-0abc3981df9a', 
  'ab68113b-cba7-4243-9544-8d932abcb521',
  '8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a',
  'd828905b-bf9a-4672-9233-8411c39d4371'
);

-- Insert chat messages with 3-minute intervals
INSERT INTO public.chat_messages (
  user_id,
  user_name,
  user_level,
  is_pro,
  message,
  subscription_type,
  created_at
) VALUES
-- Gustian (mock1@yahoo.com)
('94dda7bb-aa8f-47c8-a3be-de2139f94ef9', 'Gustian', 9, true, 'Siap All Father sudah dinotif kemarin', '1_year', now() - interval '15 minutes'),

-- Made Bangli (mock2@yahoo.com)
('9c03719b-0e18-4851-b6ec-0abc3981df9a', 'Made Bangli', 9, true, 'Stand by', '1_year', now() - interval '12 minutes'),

-- Putri Wahyudi (mock3@yahoo.com)
('ab68113b-cba7-4243-9544-8d932abcb521', 'Putri Wahyudi', 8, true, 'Makasih informasinya All Father semoga bisa kelas bersama', '1_year', now() - interval '9 minutes'),

-- Tian lee (mock4@yahoo.com)
('8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a', 'Tian lee', 10, true, 'Thank you All Father, Noted !.', '1_year', now() - interval '6 minutes'),

-- Agustinus (mock5@yahoo.com)
('d828905b-bf9a-4672-9233-8411c39d4371', 'Agustinus', 10, true, 'Sudah saya nanti moment ini', '1_year', now() - interval '3 minutes');

-- =============================================
-- STEP 6: CHAT MESSAGES - SPECIFIC TIMES (UTC+7)
-- =============================================
-- Delete previous messages from mock users
DELETE FROM public.chat_messages 
WHERE user_id IN (
  '94dda7bb-aa8f-47c8-a3be-de2139f94ef9',
  '9c03719b-0e18-4851-b6ec-0abc3981df9a', 
  'ab68113b-cba7-4243-9544-8d932abcb521',
  '8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a',
  'd828905b-bf9a-4672-9233-8411c39d4371'
);

-- Insert chat messages with Indonesia timezone (WIB = UTC+7)
INSERT INTO public.chat_messages (
  user_id,
  user_name,
  user_level,
  is_pro,
  message,
  subscription_type,
  created_at
) VALUES
-- Gustian at 21:05 WIB
('94dda7bb-aa8f-47c8-a3be-de2139f94ef9', 'Gustian', 9, true, 'Siap All Father sudah dinotif kemarin', '1_year', '2025-09-07 21:05:00+07'),

-- Made Bangli at 21:30 WIB
('9c03719b-0e18-4851-b6ec-0abc3981df9a', 'Made Bangli', 9, true, 'Stand by', '1_year', '2025-09-07 21:30:00+07'),

-- Putri Wahyudi at 21:45 WIB
('ab68113b-cba7-4243-9544-8d932abcb521', 'Putri Wahyudi', 8, true, 'Makasih informasinya All Father semoga bisa kelas bersama', '1_year', '2025-09-07 21:45:00+07'),

-- Tian lee at 22:01 WIB
('8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a', 'Tian lee', 10, true, 'Thank you All Father, Noted !.', '1_year', '2025-09-07 22:01:00+07'),

-- Agustinus at 22:10 WIB
('d828905b-bf9a-4672-9233-8411c39d4371', 'Agustinus', 10, true, 'Sudah saya nanti moment ini', '1_year', '2025-09-07 22:10:00+07');

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Check user profiles and levels
SELECT p.display_name, p.level, p.experience_points, u.email
FROM profiles p 
JOIN auth.users u ON p.user_id = u.id 
WHERE u.email IN ('mock1@yahoo.com', 'mock2@yahoo.com', 'mock3@yahoo.com', 'mock4@yahoo.com', 'mock5@yahoo.com');

-- Check pro subscriptions
SELECT user_email, subscription_type, status, subscription_start_date, subscription_end_date
FROM pro_subscriptions 
WHERE user_email IN ('mock1@yahoo.com', 'mock2@yahoo.com', 'mock3@yahoo.com', 'mock4@yahoo.com', 'mock5@yahoo.com');

-- Check chat messages
SELECT user_name, user_level, is_pro, subscription_type, message, created_at
FROM chat_messages 
WHERE user_id IN (
  '94dda7bb-aa8f-47c8-a3be-de2139f94ef9',
  '9c03719b-0e18-4851-b6ec-0abc3981df9a', 
  'ab68113b-cba7-4243-9544-8d932abcb521',
  '8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a',
  'd828905b-bf9a-4672-9233-8411c39d4371'
)
ORDER BY created_at ASC;