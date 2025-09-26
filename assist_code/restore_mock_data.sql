-- Restore mock users data after recreation
UPDATE public.profiles
SET display_name = 'Suyin Bekasi',
    level = 3,
    experience_points = 1175,
    total_verses = 7,
    total_journal = 34,
    total_elite_habit = 2,
    streak_days = 51,
    updated_at = now()
WHERE user_email = 'mock6@yahoo.com';

UPDATE public.profiles
SET display_name = 'Sari Kusuma',
    level = 4,
    experience_points = 1800,
    total_verses = 0,
    total_journal = 0,
    total_elite_habit = 0,
    streak_days = 50,
    updated_at = now()
WHERE user_email = 'mock7@yahoo.com';

UPDATE public.profiles
SET display_name = 'Ahmad Santoso',
    level = 5,
    experience_points = 2500,
    total_verses = 0,
    total_journal = 0,
    total_elite_habit = 0,
    streak_days = 50,
    updated_at = now()
WHERE user_email = 'mock8@yahoo.com';

UPDATE public.profiles
SET display_name = 'Dewi Anggraini, A.Md.Keb',
    level = 3,
    experience_points = 800,
    total_verses = 0,
    total_journal = 0,
    total_elite_habit = 0,
    streak_days = 90,
    updated_at = now()
WHERE user_email = 'mock9@yahoo.com';

UPDATE public.profiles
SET display_name = 'Dr. Hendro Wijaya',
    level = 5,
    experience_points = 2600,
    total_verses = 0,
    total_journal = 0,
    total_elite_habit = 0,
    streak_days = 50,
    updated_at = now()
WHERE user_email = 'mock10@yahoo.com';

UPDATE public.profiles
SET display_name = 'Mega Sari',
    level = 3,
    experience_points = 800,
    total_verses = 0,
    total_journal = 0,
    total_elite_habit = 0,
    streak_days = 81,
    updated_at = now()
WHERE user_email = 'mock11@yahoo.com';

UPDATE public.profiles
SET display_name = 'Dani Pratama',
    level = 5,
    experience_points = 3200,
    total_verses = 0,
    total_journal = 0,
    total_elite_habit = 0,
    streak_days = 50,
    updated_at = now()
WHERE user_email = 'mock12@yahoo.com';

UPDATE public.profiles
SET display_name = 'Lina Maharani',
    level = 4,
    experience_points = 1300,
    total_verses = 0,
    total_journal = 0,
    total_elite_habit = 0,
    streak_days = 50,
    updated_at = now()
WHERE user_email = 'mock13@yahoo.com';

UPDATE public.profiles
SET display_name = 'Budi Hartono',
    level = 4,
    experience_points = 2100,
    total_verses = 0,
    total_journal = 0,
    total_elite_habit = 0,
    streak_days = 50,
    updated_at = now()
WHERE user_email = 'mock14@yahoo.com';

UPDATE public.profiles
SET display_name = 'Fitri Handayani',
    level = 6,
    experience_points = 5000,
    total_verses = 0,
    total_journal = 0,
    total_elite_habit = 0,
    streak_days = 71,
    updated_at = now()
WHERE user_email = 'mock15@yahoo.com';