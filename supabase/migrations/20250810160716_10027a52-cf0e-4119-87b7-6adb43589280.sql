-- Update level calculation function to support level 9
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp integer)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  level INTEGER := 1;
BEGIN
  -- Extended level requirements to support level 9
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
  ELSIF total_xp >= 500 THEN
    RETURN 2;
  ELSIF total_xp >= 100 THEN
    RETURN 1;
  ELSE
    RETURN 1;
  END IF;
END;
$function$;

-- Update XP for next level function to support higher levels
CREATE OR REPLACE FUNCTION public.get_xp_for_next_level(current_level integer)
RETURNS integer
LANGUAGE plpgsql
AS $function$
BEGIN
  CASE current_level
    WHEN 1 THEN RETURN 500;
    WHEN 2 THEN RETURN 1500;
    WHEN 3 THEN RETURN 3000;
    WHEN 4 THEN RETURN 4000;
    WHEN 5 THEN RETURN 5000;
    WHEN 6 THEN RETURN 7500;
    WHEN 7 THEN RETURN 10000;
    WHEN 8 THEN RETURN 15000;
    ELSE RETURN 15000; -- Max level reached
  END CASE;
END;
$function$;