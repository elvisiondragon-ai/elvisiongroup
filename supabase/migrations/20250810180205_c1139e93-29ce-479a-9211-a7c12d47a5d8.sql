-- Update the calculate_level_from_xp function to change level 2 requirement from 500 to 150
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp integer)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  level INTEGER := 1;
BEGIN
  -- Updated level requirements with level 2 now requiring 150 XP instead of 500
  IF total_xp >= 15000 THEN
    RETURN 9;
  ELSIF total_xp >= 10000 THEN
    RETURN 8;
  ELSIF total_xp >= 7500 THEN
    RETURN 7;
  ELSIF total_xp >= 5000 THEN
    RETURN 6;
  ELSIF total_xp >= 4000 THEN
    RETURN 5;
  ELSIF total_xp >= 3000 THEN
    RETURN 4;
  ELSIF total_xp >= 1500 THEN
    RETURN 3;
  ELSIF total_xp >= 150 THEN
    RETURN 2;
  ELSIF total_xp >= 100 THEN
    RETURN 1;
  ELSE
    RETURN 1;
  END IF;
END;
$function$;

-- Update all users' levels based on the new XP requirements
UPDATE public.profiles 
SET level = public.calculate_level_from_xp(experience_points),
    updated_at = now()
WHERE experience_points IS NOT NULL;