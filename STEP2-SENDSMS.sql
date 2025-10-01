-- STEP SEND: KIRIM SENDING SMS

-- mock6@yahoo.com - Ir. Budiyanto - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, is_pro, subscription_type, streak_days)
SELECT au.id, p.display_name, p.level, 
    'Ada Sesi Meditasi record malam ini admin?', now() - 
    interval '2 hours', p.is_pro, p.subscription_type, p.streak_days
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock6@yahoo.com';

-- mock7@yahoo.com - Dr. Sari Kusuma - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, is_pro, subscription_type, streak_days)
SELECT au.id, p.display_name, p.level, 
    'Selamat Siang', now() - 
    interval '1.5 hours', p.is_pro, p.subscription_type, p.streak_days
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock7@yahoo.com';

-- mock8@yahoo.com - Prof. Ahmad Santoso - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, is_pro, subscription_type, streak_days)
SELECT au.id, p.display_name, p.level, 
    'Setiap hari setia mendengar verse, semkain bagus ada anlytics', now() - 
    interval '1 hour', p.is_pro, p.subscription_type, p.streak_days
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock8@yahoo.com';

-- mock9@yahoo.com - Ir. Rika Permata - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, is_pro, subscription_type, streak_days)
SELECT au.id, p.display_name, p.level, 
    'Seru sekarang mulai pada aktif di komunitas bersamaan.', now() - 
    interval '45 minutes', p.is_pro, p.subscription_type, p.streak_days
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock9@yahoo.com';

-- mock10@yahoo.com - Dr. Hendro Wijaya - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, is_pro, subscription_type, streak_days)
SELECT au.id, p.display_name, p.level, 
    'Tingkat kemudahan aplikasi sangat user friendly.', now() - 
    interval '30 minutes', p.is_pro, p.subscription_type, p.streak_days
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock10@yahoo.com';

-- mock11@yahoo.com - Ir. Mega Sari - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, is_pro, subscription_type, streak_days)
SELECT au.id, p.display_name, p.level, 
    'Fitur analytics membantu tracking progress harian.', now() - 
    interval '25 minutes', p.is_pro, p.subscription_type, p.streak_days
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock11@yahoo.com';

-- mock12@yahoo.com - Prof. Dani Pratama - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, is_pro, subscription_type, streak_days)
SELECT au.id, p.display_name, p.level, 
    'Kualitas audio sangat jernih dan menenangkan.', now() - 
    interval '20 minutes', p.is_pro, p.subscription_type, p.streak_days
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock12@yahoo.com';

-- mock13@yahoo.com - Dr. Lina Maharani - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, is_pro, subscription_type, streak_days)
SELECT au.id, p.display_name, p.level, 
    'System gamifikasi membuat belajar lebih engaging.', now() - 
    interval '15 minutes', p.is_pro, p.subscription_type, p.streak_days
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock13@yahoo.com';

-- mock14@yahoo.com - Ir. Budi Hartono - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, is_pro, subscription_type, streak_days)
SELECT au.id, p.display_name, p.level, 
    'Interface design sangat intuitif dan modern.', now() - 
    interval '10 minutes', p.is_pro, p.subscription_type, p.streak_days
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock14@yahoo.com';

-- mock15@yahoo.com - Dr. Fitri Handayani - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at, is_pro, subscription_type, streak_days)
SELECT au.id, p.display_name, p.level, 
    'Performance aplikasi smooth tanpa lag sama sekali.', now() - 
    interval '5 minutes', p.is_pro, p.subscription_type, p.streak_days
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock15@yahoo.com';

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


---------------------------------------------------------------------------------------------------------
-- DELETE LAST MASSAGE ON CHAT

-- Delete last chat from mock6@yahoo.com - Ir. Budiyanto
DELETE FROM public.chat_messages 
WHERE id = (
    SELECT cm.id 
    FROM public.chat_messages cm
    JOIN auth.users au ON cm.user_id = au.id
    WHERE au.email = 'mock6@yahoo.com'
    ORDER BY cm.created_at DESC
    LIMIT 1
);


-- VERIFICATION: Check remaining messages
SELECT 
    au.email,
    cm.user_name,
    cm.message,
    cm.created_at
FROM public.chat_messages cm
JOIN auth.users au ON cm.user_id = au.id
WHERE au.email LIKE 'mock%@yahoo.com'
ORDER BY cm.created_at DESC;