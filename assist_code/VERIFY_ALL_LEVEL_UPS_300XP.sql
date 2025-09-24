-- VERIFICATION: Check all users who reach Level 3 threshold (300 XP)
-- Run AFTER executing LEVEL_3_TO_300_XP_FIX.sql

-- 1. Show all users who should be promoted to Level 3 (300-1199 XP)
SELECT 
    'USERS WHO SHOULD BE LEVEL 3' as category,
    user_email,
    experience_points,
    level as current_level,
    public.calculate_level_from_xp(experience_points) as calculated_level,
    CASE 
        WHEN experience_points >= 300 AND experience_points < 1200 THEN '✅ Should be Level 3'
        WHEN experience_points >= 1200 THEN '⬆️ Should be Level 4+'
        ELSE '❌ Below Level 3 threshold'
    END as status
FROM public.profiles 
WHERE experience_points >= 250  -- Show users near threshold
ORDER BY experience_points DESC;

-- 2. Count users by level BEFORE and AFTER the change
WITH level_distribution AS (
    SELECT 
        level,
        COUNT(*) as current_count,
        COUNT(CASE WHEN experience_points >= 300 AND experience_points < 1200 THEN 1 END) as should_be_level_3
    FROM public.profiles 
    WHERE experience_points IS NOT NULL
    GROUP BY level
)
SELECT 
    'LEVEL DISTRIBUTION ANALYSIS' as info,
    level,
    current_count,
    CASE level 
        WHEN 3 THEN current_count + (SELECT COUNT(*) FROM public.profiles WHERE experience_points BETWEEN 300 AND 499 AND level = 2)
        ELSE current_count 
    END as expected_count_after_fix
FROM level_distribution
ORDER BY level;

-- 3. Show specific users who will be promoted from Level 2 to Level 3
SELECT 
    'USERS GETTING PROMOTED 2→3' as promotion,
    user_email,
    experience_points,
    level as current_level,
    '2 → 3' as promotion_path,
    experience_points - 300 as xp_above_new_threshold
FROM public.profiles 
WHERE level = 2 
AND experience_points >= 300
AND experience_points < 1200
ORDER BY experience_points DESC;

-- 4. Verify no users get wrongly demoted
SELECT 
    'CHECK FOR WRONG DEMOTIONS' as check,
    user_email,
    experience_points,
    level as current_level,
    public.calculate_level_from_xp(experience_points) as should_be_level,
    CASE 
        WHEN level > public.calculate_level_from_xp(experience_points) THEN '⚠️ WOULD BE DEMOTED'
        WHEN level < public.calculate_level_from_xp(experience_points) THEN '⬆️ WOULD BE PROMOTED'
        ELSE '✅ LEVEL CORRECT'
    END as status
FROM public.profiles 
WHERE experience_points IS NOT NULL
AND level != public.calculate_level_from_xp(experience_points)
ORDER BY experience_points DESC;

-- 5. Final summary of all changes
SELECT 
    'SUMMARY OF LEVEL 3 CHANGE' as summary,
    'OLD: Level 3 = 500 XP
     NEW: Level 3 = 300 XP
     IMPACT: Users with 300-499 XP promoted to Level 3
     STATUS: ' || 
    (SELECT COUNT(*) FROM public.profiles WHERE experience_points BETWEEN 300 AND 499) ||
    ' users will be promoted' as change_impact;