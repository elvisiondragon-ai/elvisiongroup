-- Update level calculation function with new requirements
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp integer)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
  level INTEGER := 1;
BEGIN
  -- New level requirements: 1=100, 2=500, 3=1500, 4=3000
  IF total_xp >= 3000 THEN
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

-- Update XP for next level function
CREATE OR REPLACE FUNCTION public.get_xp_for_next_level(current_level integer)
RETURNS integer
LANGUAGE plpgsql
AS $function$
BEGIN
  CASE current_level
    WHEN 1 THEN RETURN 500;
    WHEN 2 THEN RETURN 1500;
    WHEN 3 THEN RETURN 3000;
    ELSE RETURN 3000; -- Max level reached
  END CASE;
END;
$function$;

-- Create function to check daily journal limit (5 XP per day)
CREATE OR REPLACE FUNCTION public.check_daily_journal_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
DECLARE
  daily_journal_xp INTEGER;
BEGIN
  SELECT COALESCE(SUM(xp_earned), 0) INTO daily_journal_xp
  FROM public.user_activities
  WHERE user_id = p_user_id
    AND activity_type = 'journal_entry'
    AND created_at >= CURRENT_DATE;
    
  RETURN daily_journal_xp < 5;
END;
$function$;

-- Create function to check daily audio limit (20 XP per day)
CREATE OR REPLACE FUNCTION public.check_daily_audio_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $function$
DECLARE
  daily_audio_xp INTEGER;
BEGIN
  SELECT COALESCE(SUM(xp_earned), 0) INTO daily_audio_xp
  FROM public.user_activities
  WHERE user_id = p_user_id
    AND activity_type = 'audio_completed'
    AND created_at >= CURRENT_DATE;
    
  RETURN daily_audio_xp < 20;
END;
$function$;