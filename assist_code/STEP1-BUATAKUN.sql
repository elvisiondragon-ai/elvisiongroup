-- STEP AWAL: Create email, name, password123
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data) VALUES
(gen_random_uuid(), 'mock6@yahoo.com', '$2a$10$password123hash', now(), now(), now(), '{"display_name": "Ir. Budiyanto"}'),
(gen_random_uuid(), 'mock7@yahoo.com', '$2a$10$password123hash', now(), now(), now(), '{"display_name": "Dr. Sari Kusuma"}'),
(gen_random_uuid(), 'mock8@yahoo.com', '$2a$10$password123hash', now(), now(), now(), '{"display_name": "Prof. Ahmad Santoso"}'),
(gen_random_uuid(), 'mock9@yahoo.com', '$2a$10$password123hash', now(), now(), now(), '{"display_name": "Ir. Rika Permata"}'),
(gen_random_uuid(), 'mock10@yahoo.com', '$2a$10$password123hash', now(), now(), now(), '{"display_name": "Dr. Hendro Wijaya"}'),
(gen_random_uuid(), 'mock11@yahoo.com', '$2a$10$password123hash', now(), now(), now(), '{"display_name": "Ir. Mega Sari"}'),
(gen_random_uuid(), 'mock12@yahoo.com', '$2a$10$password123hash', now(), now(), now(), '{"display_name": "Prof. Dani Pratama"}'),
(gen_random_uuid(), 'mock13@yahoo.com', '$2a$10$password123hash', now(), now(), now(), '{"display_name": "Dr. Lina Maharani"}'),
(gen_random_uuid(), 'mock14@yahoo.com', '$2a$10$password123hash', now(), now(), now(), '{"display_name": "Ir. Budi Hartono"}'),
(gen_random_uuid(), 'mock15@yahoo.com', '$2a$10$password123hash', now(), now(), now(), '{"display_name": "Dr. Fitri Handayani"}');

---------------------------------------------------------------------------------------------------------
-- STEP EXP: Give experience points via email using user_id lookup
-- mock6@yahoo.com - Ir. Budiyanto: 1250 XP
UPDATE public.profiles
SET experience_points = experience_points + (1250 - experience_points),
    level = public.calculate_level_from_xp(1250),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock6@yahoo.com'
);

-- mock7@yahoo.com - Dr. Sari Kusuma: 1800 XP
UPDATE public.profiles
SET experience_points = experience_points + (1800 - experience_points),
    level = public.calculate_level_from_xp(1800),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock7@yahoo.com'
);

-- mock8@yahoo.com - Prof. Ahmad Santoso: 2500 XP
UPDATE public.profiles
SET experience_points = experience_points + (2500 - experience_points),
    level = public.calculate_level_from_xp(2500),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock8@yahoo.com'
);

-- mock9@yahoo.com - Ir. Rika Permata: 1400 XP
UPDATE public.profiles
SET experience_points = experience_points + (1400 - experience_points),
    level = public.calculate_level_from_xp(1400),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock9@yahoo.com'
);

-- mock10@yahoo.com - Dr. Hendro Wijaya: 1950 XP
UPDATE public.profiles
SET experience_points = experience_points + (1950 - experience_points),
    level = public.calculate_level_from_xp(1950),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock10@yahoo.com'
);

-- mock11@yahoo.com - Ir. Mega Sari: 800 XP
UPDATE public.profiles
SET experience_points = experience_points + (800 - experience_points),
    level = public.calculate_level_from_xp(800),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock11@yahoo.com'
);

-- mock12@yahoo.com - Prof. Dani Pratama: 3200 XP
UPDATE public.profiles
SET experience_points = experience_points + (3200 - experience_points),
    level = public.calculate_level_from_xp(3200),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock12@yahoo.com'
);

-- mock13@yahoo.com - Dr. Lina Maharani: 1300 XP
UPDATE public.profiles
SET experience_points = experience_points + (1300 - experience_points),
    level = public.calculate_level_from_xp(1300),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock13@yahoo.com'
);

-- mock14@yahoo.com - Ir. Budi Hartono: 2100 XP
UPDATE public.profiles
SET experience_points = experience_points + (2100 - experience_points),
    level = public.calculate_level_from_xp(2100),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock14@yahoo.com'
);

-- mock15@yahoo.com - Dr. Fitri Handayani: 2800 XP
UPDATE public.profiles
SET experience_points = experience_points + (2800 - experience_points),
    level = public.calculate_level_from_xp(2800),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock15@yahoo.com'
);

---------------------------------------------------------------------------------------------------------
-- STEP NAIKAN KE PRO: ADD PRO subscription 1_month for email
-- mock6@yahoo.com - Ir. Budiyanto gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, created_at, updated_at)
SELECT 
    id, 'active', '1_month', now(), now() + interval '1 month', now(), now()
FROM auth.users WHERE email = 'mock6@yahoo.com';

-- mock7@yahoo.com - Dr. Sari Kusuma gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, created_at, updated_at)
SELECT 
    id, 'active', '1_month', now(), now() + interval '1 month', now(), now()
FROM auth.users WHERE email = 'mock7@yahoo.com';

-- mock8@yahoo.com - Prof. Ahmad Santoso gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, created_at, updated_at)
SELECT 
    id, 'active', '1_month', now(), now() + interval '1 month', now(), now()
FROM auth.users WHERE email = 'mock8@yahoo.com';

-- mock9@yahoo.com - Ir. Rika Permata gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, created_at, updated_at)
SELECT 
    id, 'active', '1_month', now(), now() + interval '1 month', now(), now()
FROM auth.users WHERE email = 'mock9@yahoo.com';

-- mock10@yahoo.com - Dr. Hendro Wijaya gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, created_at, updated_at)
SELECT 
    id, 'active', '1_month', now(), now() + interval '1 month', now(), now()
FROM auth.users WHERE email = 'mock10@yahoo.com';

-- mock11@yahoo.com - Ir. Mega Sari gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, created_at, updated_at)
SELECT 
    id, 'active', '1_month', now(), now() + interval '1 month', now(), now()
FROM auth.users WHERE email = 'mock11@yahoo.com';

-- mock12@yahoo.com - Prof. Dani Pratama gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, created_at, updated_at)
SELECT 
    id, 'active', '1_month', now(), now() + interval '1 month', now(), now()
FROM auth.users WHERE email = 'mock12@yahoo.com';

-- mock13@yahoo.com - Dr. Lina Maharani gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, created_at, updated_at)
SELECT 
    id, 'active', '1_month', now(), now() + interval '1 month', now(), now()
FROM auth.users WHERE email = 'mock13@yahoo.com';

-- mock14@yahoo.com - Ir. Budi Hartono gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, created_at, updated_at)
SELECT 
    id, 'active', '1_month', now(), now() + interval '1 month', now(), now()
FROM auth.users WHERE email = 'mock14@yahoo.com';

-- mock15@yahoo.com - Dr. Fitri Handayani gets 1_month pro
INSERT INTO public.pro_subscriptions (user_id, status, subscription_type, subscription_start_date, subscription_end_date, created_at, updated_at)
SELECT 
    id, 'active', '1_month', now(), now() + interval '1 month', now(), now()
FROM auth.users WHERE email = 'mock15@yahoo.com';

-- VERIFICATION: Check chat messages were inserted
SELECT 
    cm.user_name,
    cm.message,
    cm.created_at
FROM public.chat_messages cm
JOIN auth.users au ON cm.user_id = au.id
WHERE au.email LIKE 'mock%@yahoo.com'
ORDER BY cm.created_at DESC;

-- VERIFICATION: Check pro subscriptions were added
SELECT 
    au.email,
    ps.status,
    ps.subscription_type,
    ps.subscription_start_date,
    ps.subscription_end_date
FROM public.pro_subscriptions ps
JOIN auth.users au ON ps.user_id = au.id
WHERE au.email LIKE 'mock%@yahoo.com'
ORDER BY au.email;

---------------------------------------------------------------------------------------------------------
-- MAU GANTI NAMA DISINI
UPDATE public.profiles
SET display_name = 'Ir. Budiyanto',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock6@yahoo.com'
);

UPDATE public.profiles
SET display_name = 'Dr. Sari Kusuma',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock7@yahoo.com'
);

UPDATE public.profiles
SET display_name = 'Prof. Ahmad Santoso',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock8@yahoo.com'
);

UPDATE public.profiles
SET display_name = 'Ir. Rika Permata',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock9@yahoo.com'
);

UPDATE public.profiles
SET display_name = 'Dr. Hendro Wijaya',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock10@yahoo.com'
);

UPDATE public.profiles
SET display_name = 'Ir. Mega Sari',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock11@yahoo.com'
);

UPDATE public.profiles
SET display_name = 'Prof. Dani Pratama',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock12@yahoo.com'
);

UPDATE public.profiles
SET display_name = 'Dr. Lina Maharani',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock13@yahoo.com'
);

UPDATE public.profiles
SET display_name = 'Ir. Budi Hartono',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock14@yahoo.com'
);

UPDATE public.profiles
SET display_name = 'Dr. Fitri Handayani',
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock15@yahoo.com'
);

-- VERIFICATION: Check if emails were inserted correctly
SELECT user_email, display_name, level, experience_points, created_at 
FROM public.profiles 
WHERE user_email LIKE 'mock%@yahoo.com' 
ORDER BY user_email;

-- GET USER IDs for chat messages (run this to get the IDs for next step)
SELECT user_id, user_email, display_name 
FROM public.profiles 
WHERE user_email LIKE 'mock%@yahoo.com' 
ORDER BY user_email;