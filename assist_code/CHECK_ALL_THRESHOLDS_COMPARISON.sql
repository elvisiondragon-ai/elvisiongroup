-- SQL to check ALL level thresholds from database vs frontend expectations
-- Compare database calculate_level_from_xp function with frontend useXPSystem.ts

-- 1. Test database function with ALL level thresholds
SELECT 
    level_test,
    xp_value,
    public.calculate_level_from_xp(xp_value) as db_calculated_level,
    CASE 
        WHEN xp_value >= 15000 THEN 10
        WHEN xp_value >= 12000 THEN 9
        WHEN xp_value >= 9000 THEN 8
        WHEN xp_value >= 7000 THEN 7
        WHEN xp_value >= 4500 THEN 6
        WHEN xp_value >= 2500 THEN 5
        WHEN xp_value >= 1200 THEN 4
        WHEN xp_value >= 500 THEN 3
        WHEN xp_value >= 150 THEN 2
        ELSE 1
    END as frontend_expected_level,
    CASE 
        WHEN public.calculate_level_from_xp(xp_value) = CASE 
            WHEN xp_value >= 15000 THEN 10
            WHEN xp_value >= 12000 THEN 9
            WHEN xp_value >= 9000 THEN 8
            WHEN xp_value >= 7000 THEN 7
            WHEN xp_value >= 4500 THEN 6
            WHEN xp_value >= 2500 THEN 5
            WHEN xp_value >= 1200 THEN 4
            WHEN xp_value >= 500 THEN 3
            WHEN xp_value >= 150 THEN 2
            ELSE 1
        END THEN '✅ MATCH'
        ELSE '❌ MISMATCH'
    END as status
FROM (
    VALUES 
        ('Level 1 Start', 0),
        ('Level 1 Max', 149),
        ('Level 2 Start', 150),
        ('Level 2 Max', 499),
        ('Level 3 Start', 500),
        ('Level 3 Max', 1199),
        ('Level 4 Start', 1200),
        ('Level 4 Max', 2499),
        ('Level 5 Start', 2500),
        ('Level 5 Max', 4499),
        ('Level 6 Start', 4500),
        ('Level 6 Max', 6999),
        ('Level 7 Start', 7000),
        ('Level 7 Max', 8999),
        ('Level 8 Start', 9000),
        ('Level 8 Max', 11999),
        ('Level 9 Start', 12000),
        ('Level 9 Max', 14999),
        ('Level 10 Start', 15000),
        ('Level 10 Max', 20000)
) AS test_values(level_test, xp_value)
ORDER BY xp_value;

-- 2. Show current database function definition
SELECT 
    'DATABASE FUNCTION' as source,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'calculate_level_from_xp';

-- 3. Show what frontend expects (from useXPSystem.ts)
SELECT 'FRONTEND EXPECTATIONS' as info, 
'
Level 1: 0 XP (totalXPForLevel = 0, xpForNextLevel = 150)
Level 2: 150 XP (totalXPForLevel = 150, xpForNextLevel = 500) 
Level 3: 500 XP (totalXPForLevel = 500, xpForNextLevel = 1200)
Level 4: 1200 XP (totalXPForLevel = 1200, xpForNextLevel = 2500)
Level 5: 2500 XP (totalXPForLevel = 2500, xpForNextLevel = 4500)
Level 6: 4500 XP (totalXPForLevel = 4500, xpForNextLevel = 7000)
Level 7: 7000 XP (totalXPForLevel = 7000, xpForNextLevel = 9000)
Level 8: 9000 XP (totalXPForLevel = 9000, xpForNextLevel = 12000)
Level 9: 12000 XP (totalXPForLevel = 12000, xpForNextLevel = 15000)
Level 10: 15000 XP (totalXPForLevel = 15000, xpForNextLevel = 15000 - MAX)
' as thresholds;

-- 4. Check real user distribution by current levels
SELECT 
    'USER DISTRIBUTION' as info,
    level,
    COUNT(*) as user_count,
    MIN(experience_points) as min_xp,
    MAX(experience_points) as max_xp,
    ROUND(AVG(experience_points), 0) as avg_xp
FROM public.profiles 
WHERE experience_points IS NOT NULL
GROUP BY level 
ORDER BY level;