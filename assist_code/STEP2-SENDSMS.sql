-- STEP SEND: KIRIM SENDING SMS

-- mock6@yahoo.com - Ir. Budiyanto - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at)
SELECT 
    au.id, p.display_name, p.level, 'Ada Sesi Meditasi record malam ini admin?', now() - interval '2 hours'
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock6@yahoo.com';

-- mock7@yahoo.com - Dr. Sari Kusuma - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at)
SELECT 
    au.id, p.display_name, p.level, 'Selamat Siang', now() - interval '1.5 hours'
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock7@yahoo.com';

-- mock8@yahoo.com - Prof. Ahmad Santoso - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at)
SELECT 
    au.id, p.display_name, p.level, 'Setiap hari setia mendengar verse, semkain bagus ada anlytics', now() - interval '1 hour'
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock8@yahoo.com';

-- mock9@yahoo.com - Ir. Rika Permata - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at)
SELECT 
    au.id, p.display_name, p.level, 'comment4', now() - interval '45 minutes'
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock9@yahoo.com';

-- mock10@yahoo.com - Dr. Hendro Wijaya - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at)
SELECT 
    au.id, p.display_name, p.level, 'comment5', now() - interval '30 minutes'
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock10@yahoo.com';

-- mock11@yahoo.com - Ir. Mega Sari - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at)
SELECT 
    au.id, p.display_name, p.level, 'comment6', now() - interval '25 minutes'
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock11@yahoo.com';

-- mock12@yahoo.com - Prof. Dani Pratama - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at)
SELECT 
    au.id, p.display_name, p.level, 'comment7', now() - interval '20 minutes'
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock12@yahoo.com';

-- mock13@yahoo.com - Dr. Lina Maharani - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at)
SELECT 
    au.id, p.display_name, p.level, 'comment8', now() - interval '15 minutes'
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock13@yahoo.com';

-- mock14@yahoo.com - Ir. Budi Hartono - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at)
SELECT 
    au.id, p.display_name, p.level, 'comment9', now() - interval '10 minutes'
FROM auth.users au
JOIN public.profiles p ON au.id = p.user_id
WHERE au.email = 'mock14@yahoo.com';

-- mock15@yahoo.com - Dr. Fitri Handayani - sent message
INSERT INTO public.chat_messages (user_id, user_name, user_level, message, created_at)
SELECT 
    au.id, p.display_name, p.level, 'comment10', now() - interval '5 minutes'
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

-- Delete last chat from mock7@yahoo.com - Dr. Sari Kusuma
DELETE FROM public.chat_messages 
WHERE id = (
    SELECT cm.id 
    FROM public.chat_messages cm
    JOIN auth.users au ON cm.user_id = au.id
    WHERE au.email = 'mock7@yahoo.com'
    ORDER BY cm.created_at DESC
    LIMIT 1
);

-- Delete last chat from mock8@yahoo.com - Prof. Ahmad Santoso
DELETE FROM public.chat_messages 
WHERE id = (
    SELECT cm.id 
    FROM public.chat_messages cm
    JOIN auth.users au ON cm.user_id = au.id
    WHERE au.email = 'mock8@yahoo.com'
    ORDER BY cm.created_at DESC
    LIMIT 1
);

-- Delete last chat from mock9@yahoo.com - Ir. Rika Permata
DELETE FROM public.chat_messages 
WHERE id = (
    SELECT cm.id 
    FROM public.chat_messages cm
    JOIN auth.users au ON cm.user_id = au.id
    WHERE au.email = 'mock9@yahoo.com'
    ORDER BY cm.created_at DESC
    LIMIT 1
);

-- Delete last chat from mock10@yahoo.com - Dr. Hendro Wijaya
DELETE FROM public.chat_messages 
WHERE id = (
    SELECT cm.id 
    FROM public.chat_messages cm
    JOIN auth.users au ON cm.user_id = au.id
    WHERE au.email = 'mock10@yahoo.com'
    ORDER BY cm.created_at DESC
    LIMIT 1
);

-- Delete last chat from mock11@yahoo.com - Ir. Mega Sari
DELETE FROM public.chat_messages 
WHERE id = (
    SELECT cm.id 
    FROM public.chat_messages cm
    JOIN auth.users au ON cm.user_id = au.id
    WHERE au.email = 'mock11@yahoo.com'
    ORDER BY cm.created_at DESC
    LIMIT 1
);

-- Delete last chat from mock12@yahoo.com - Prof. Dani Pratama
DELETE FROM public.chat_messages 
WHERE id = (
    SELECT cm.id 
    FROM public.chat_messages cm
    JOIN auth.users au ON cm.user_id = au.id
    WHERE au.email = 'mock12@yahoo.com'
    ORDER BY cm.created_at DESC
    LIMIT 1
);

-- Delete last chat from mock13@yahoo.com - Dr. Lina Maharani
DELETE FROM public.chat_messages 
WHERE id = (
    SELECT cm.id 
    FROM public.chat_messages cm
    JOIN auth.users au ON cm.user_id = au.id
    WHERE au.email = 'mock13@yahoo.com'
    ORDER BY cm.created_at DESC
    LIMIT 1
);

-- Delete last chat from mock14@yahoo.com - Ir. Budi Hartono
DELETE FROM public.chat_messages 
WHERE id = (
    SELECT cm.id 
    FROM public.chat_messages cm
    JOIN auth.users au ON cm.user_id = au.id
    WHERE au.email = 'mock14@yahoo.com'
    ORDER BY cm.created_at DESC
    LIMIT 1
);

-- Delete last chat from mock15@yahoo.com - Dr. Fitri Handayani
DELETE FROM public.chat_messages 
WHERE id = (
    SELECT cm.id 
    FROM public.chat_messages cm
    JOIN auth.users au ON cm.user_id = au.id
    WHERE au.email = 'mock15@yahoo.com'
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