-- SQL to check current level threshold system for Level 3
-- Run these queries to understand current system state

-- 1. Check current calculate_level_from_xp function definition
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'calculate_level_from_xp';

-- 2. Check current user levels and XP distribution
SELECT 
    level,
    COUNT(*) as user_count,
    MIN(experience_points) as min_xp,
    MAX(experience_points) as max_xp,
    AVG(experience_points) as avg_xp
FROM public.profiles 
WHERE experience_points IS NOT NULL
GROUP BY level 
ORDER BY level;

-- 3. Check specific users near Level 3 threshold
SELECT 
    user_email,
    level,
    experience_points,
    CASE 
        WHEN experience_points >= 500 THEN 'Should be Level 3+'
        WHEN experience_points >= 150 THEN 'Should be Level 2+'  
        ELSE 'Level 1'
    END as expected_level_based_on_frontend
FROM public.profiles 
WHERE experience_points BETWEEN 100 AND 800
ORDER BY experience_points DESC;

-- 4. Check level 2 users who should be level 3 based on frontend thresholds
SELECT 
    user_email,
    level,
    experience_points,
    (experience_points >= 500) as should_be_level_3_frontend
FROM public.profiles 
WHERE level = 2 
AND experience_points >= 500;

-- 5. Test the current calculate_level_from_xp function with sample XP values
SELECT 
    xp_value,
    public.calculate_level_from_xp(xp_value) as db_calculated_level,
    CASE 
        WHEN xp_value >= 500 THEN 3
        WHEN xp_value >= 150 THEN 2
        ELSE 1
    END as frontend_calculated_level
FROM (
    VALUES (0), (100), (149), (150), (499), (500), (1199), (1200)
) AS test_values(xp_value);