-- Delete last chat message from specific email

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