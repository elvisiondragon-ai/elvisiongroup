-- SIMPLE FIX: Change Level 3 from 500 XP to 300 XP
-- Keep all other levels unchanged, keep 30 XP daily limit unchanged

-- 1. BACKUP current function first
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp_backup_500(total_xp integer)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  level INTEGER := 1;
BEGIN
  -- BACKUP: Old thresholds before change
  IF total_xp >= 15000 THEN
    RETURN 10;
  ELSIF total_xp >= 12000 THEN
    RETURN 9;
  ELSIF total_xp >= 9000 THEN
    RETURN 8;
  ELSIF total_xp >= 7000 THEN
    RETURN 7;
  ELSIF total_xp >= 4500 THEN
    RETURN 6;
  ELSIF total_xp >= 2500 THEN
    RETURN 5;
  ELSIF total_xp >= 1200 THEN
    RETURN 4;
  ELSIF total_xp >= 500 THEN  -- OLD: Level 3 was 500 XP
    RETURN 3;
  ELSIF total_xp >= 150 THEN
    RETURN 2;
  ELSE
    RETURN 1;
  END IF;
END;
$function$;

-- 2. UPDATE function: Level 3 now 300 XP (was 500 XP)
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp integer)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  level INTEGER := 1;
BEGIN
  -- Updated: Level 3 now 300 XP instead of 500 XP
  IF total_xp >= 15000 THEN
    RETURN 10;
  ELSIF total_xp >= 12000 THEN
    RETURN 9;
  ELSIF total_xp >= 9000 THEN
    RETURN 8;
  ELSIF total_xp >= 7000 THEN
    RETURN 7;
  ELSIF total_xp >= 4500 THEN
    RETURN 6;
  ELSIF total_xp >= 2500 THEN
    RETURN 5;
  ELSIF total_xp >= 1200 THEN
    RETURN 4;
  ELSIF total_xp >= 300 THEN  -- NEW: Level 3 now 300 XP (was 500)
    RETURN 3;
  ELSIF total_xp >= 150 THEN
    RETURN 2;
  ELSE
    RETURN 1;
  END IF;
END;
$function$;

-- 3. Recalculate ALL user levels with new threshold
UPDATE public.profiles 
SET level = public.calculate_level_from_xp(experience_points),
    updated_at = now()
WHERE experience_points IS NOT NULL;

-- 4. Verify the fix worked - show users who got promoted to Level 3
SELECT 
    'USERS PROMOTED TO LEVEL 3' as info,
    user_email,
    experience_points,
    level as new_level,
    CASE 
        WHEN experience_points >= 300 AND experience_points < 500 THEN '🎉 PROMOTED!'
        ELSE 'Already qualified'
    END as promotion_status
FROM public.profiles 
WHERE level = 3 
AND experience_points BETWEEN 300 AND 599
ORDER BY experience_points;

-- 5. Test new thresholds
SELECT 
    'VERIFICATION TEST' as test,
    xp_value,
    public.calculate_level_from_xp(xp_value) as new_level,
    CASE xp_value
        WHEN 299 THEN 'Should be Level 2'
        WHEN 300 THEN 'Should be Level 3 ✅'
        WHEN 400 THEN 'Should be Level 3 ✅'
        WHEN 500 THEN 'Should be Level 3 ✅'
        WHEN 1200 THEN 'Should be Level 4'
    END as expected
FROM (VALUES (299), (300), (400), (500), (1200)) AS test_values(xp_value);

-- 6. Summary of changes
SELECT 
    'SUMMARY OF CHANGES' as info,
    'Level 3 threshold changed from 500 XP to 300 XP
     All other levels unchanged
     Daily 30 XP limit unchanged
     Users with 300-499 XP now promoted to Level 3' as changes_made;