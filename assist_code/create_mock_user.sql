-- Simple mock user data update following rule.txt pattern
-- Set total_verses=100, total_elite_habit=200, total_journal=400, exp=300

UPDATE public.profiles
SET total_verses = 956,
    total_elite_habit = 34, 
    total_journal = 1562,
    experience_points = 14570,
    streak_days = 320,
    level = public.calculate_level_from_xp(14570),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock1@yahoo.com'
);

-- FOR ADD DATA NOT CHANGING
UPDATE public.profiles
SET total_verses = total_verses + 100,
    total_elite_habit = total_elite_habit + 200, 
    total_journal = total_journal + 400,
    experience_points = experience_points + 300,
    streak_days = streak_days + 365,
    level = public.calculate_level_from_xp(experience_points + 300),
    updated_at = now()
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock1@yahoo.com'
);

-- Verify the update
SELECT 
    user_email,
    display_name,
    total_verses,
    total_elite_habit,
    total_journal,
    experience_points,
    level
FROM public.profiles 
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'mock1@yahoo.com'
);