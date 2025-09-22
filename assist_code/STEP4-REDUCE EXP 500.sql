-- Reduce XP by 500 for certain emails

-- mock6@yahoo.com - Ir. Budiyanto: Reduce 500 XP
UPDATE public.profiles
SET experience_points = GREATEST(experience_points - 500, 0),
    level = public.calculate_level_from_xp(GREATEST(experience_points - 500, 0)),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock6@yahoo.com'
);

-- mock7@yahoo.com - Dr. Sari Kusuma: Reduce 500 XP
UPDATE public.profiles
SET experience_points = GREATEST(experience_points - 500, 0),
    level = public.calculate_level_from_xp(GREATEST(experience_points - 500, 0)),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock7@yahoo.com'
);

-- mock8@yahoo.com - Prof. Ahmad Santoso: Reduce 500 XP
UPDATE public.profiles
SET experience_points = GREATEST(experience_points - 500, 0),
    level = public.calculate_level_from_xp(GREATEST(experience_points - 500, 0)),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock8@yahoo.com'
);

-- mock9@yahoo.com - Ir. Rika Permata: Reduce 500 XP
UPDATE public.profiles
SET experience_points = GREATEST(experience_points - 500, 0),
    level = public.calculate_level_from_xp(GREATEST(experience_points - 500, 0)),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock9@yahoo.com'
);

-- mock10@yahoo.com - Dr. Hendro Wijaya: Reduce 500 XP
UPDATE public.profiles
SET experience_points = GREATEST(experience_points - 500, 0),
    level = public.calculate_level_from_xp(GREATEST(experience_points - 500, 0)),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock10@yahoo.com'
);

-- mock11@yahoo.com - Ir. Mega Sari: Reduce 500 XP
UPDATE public.profiles
SET experience_points = GREATEST(experience_points - 500, 0),
    level = public.calculate_level_from_xp(GREATEST(experience_points - 500, 0)),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock11@yahoo.com'
);

-- mock12@yahoo.com - Prof. Dani Pratama: Reduce 500 XP
UPDATE public.profiles
SET experience_points = GREATEST(experience_points - 500, 0),
    level = public.calculate_level_from_xp(GREATEST(experience_points - 500, 0)),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock12@yahoo.com'
);

-- mock13@yahoo.com - Dr. Lina Maharani: Reduce 500 XP
UPDATE public.profiles
SET experience_points = GREATEST(experience_points - 500, 0),
    level = public.calculate_level_from_xp(GREATEST(experience_points - 500, 0)),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock13@yahoo.com'
);

-- mock14@yahoo.com - Ir. Budi Hartono: Reduce 500 XP
UPDATE public.profiles
SET experience_points = GREATEST(experience_points - 500, 0),
    level = public.calculate_level_from_xp(GREATEST(experience_points - 500, 0)),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock14@yahoo.com'
);

-- mock15@yahoo.com - Dr. Fitri Handayani: Reduce 500 XP
UPDATE public.profiles
SET experience_points = GREATEST(experience_points - 500, 0),
    level = public.calculate_level_from_xp(GREATEST(experience_points - 500, 0)),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock15@yahoo.com'
);

-- VERIFICATION: Check updated XP levels
SELECT 
    au.email,
    p.display_name,
    p.experience_points,
    p.level,
    p.updated_at
FROM public.profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE au.email LIKE 'mock%@yahoo.com'
ORDER BY au.email;