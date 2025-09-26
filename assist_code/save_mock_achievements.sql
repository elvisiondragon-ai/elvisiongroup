-- Save achievements from mock6 to mock15
SELECT 
    user_email,
    display_name,
    achievements,
    level,
    experience_points,
    total_verses,
    total_journal,
    total_elite_habit,
    streak_days
FROM public.profiles 
WHERE user_email IN (
    'mock6@yahoo.com',
    'mock7@yahoo.com', 
    'mock8@yahoo.com',
    'mock9@yahoo.com',
    'mock10@yahoo.com',
    'mock11@yahoo.com',
    'mock12@yahoo.com',
    'mock13@yahoo.com',
    'mock14@yahoo.com',
    'mock15@yahoo.com'
)
ORDER BY user_email;