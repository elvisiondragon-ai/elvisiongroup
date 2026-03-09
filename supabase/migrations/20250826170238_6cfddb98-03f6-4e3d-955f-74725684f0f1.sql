-- Drop existing award_xp function first to allow changing return type
DROP FUNCTION IF EXISTS public.award_xp(uuid, integer, text, text, jsonb);

-- Update level thresholds according to new system
-- New thresholds: Level 1: 0 XP, Level 2: 150 XP, Level 3: 500 XP, Level 4: 1,200 XP, 
-- Level 5: 2,500 XP, Level 6: 4,500 XP, Level 7: 7,000 XP, Level 8: 9,000 XP, 
-- Level 9: 12,000 XP, Level 10: 15,000 XP

CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp integer)
RETURNS integer
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
DECLARE
  level INTEGER := 1;
BEGIN
  -- Updated level requirements with new thresholds
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
  ELSIF total_xp >= 500 THEN
    RETURN 3;
  ELSIF total_xp >= 150 THEN
    RETURN 2;
  ELSE
    RETURN 1;
  END IF;
END;
$function$;

-- Update get_xp_for_next_level function with new thresholds
CREATE OR REPLACE FUNCTION public.get_xp_for_next_level(current_level integer)
RETURNS integer
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  CASE current_level
    WHEN 1 THEN RETURN 150;
    WHEN 2 THEN RETURN 500;
    WHEN 3 THEN RETURN 1200;
    WHEN 4 THEN RETURN 2500;
    WHEN 5 THEN RETURN 4500;
    WHEN 6 THEN RETURN 7000;
    WHEN 7 THEN RETURN 9000;
    WHEN 8 THEN RETURN 12000;
    WHEN 9 THEN RETURN 15000;
    ELSE RETURN 15000; -- Max level reached
  END CASE;
END;
$function$;

-- Enhanced award_xp function with automatic level promotions and achievement badges
CREATE OR REPLACE FUNCTION public.award_xp(p_user_id uuid, p_xp_amount integer, p_activity_type text, p_reason text DEFAULT NULL, p_metadata jsonb DEFAULT '{}')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  old_level INTEGER;
  new_level INTEGER;
  old_xp INTEGER;
  new_xp INTEGER;
  level_up_occurred BOOLEAN := false;
  achievement_earned BOOLEAN := false;
  result jsonb;
BEGIN
  -- Get current profile data
  SELECT level, experience_points INTO old_level, old_xp
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  -- If no profile exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.profiles (user_id, level, experience_points)
    VALUES (p_user_id, 1, 0)
    ON CONFLICT (user_id) DO NOTHING;
    old_level := 1;
    old_xp := 0;
  END IF;
  
  -- Calculate new XP and level
  new_xp := old_xp + p_xp_amount;
  new_level := public.calculate_level_from_xp(new_xp);
  level_up_occurred := new_level > old_level;
  
  -- Update profile with new XP and level
  UPDATE public.profiles
  SET experience_points = new_xp,
      level = new_level,
      updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Award level 3 achievement badge if reached for first time
  IF new_level >= 3 AND old_level < 3 THEN
    UPDATE public.profiles
    SET achievements = CASE 
      WHEN 'level_3' = ANY(achievements) THEN achievements
      ELSE array_append(achievements, 'level_3')
    END
    WHERE user_id = p_user_id;
    achievement_earned := true;
  END IF;
  
  -- Log the XP transaction
  INSERT INTO public.user_activities (
    user_id,
    activity_type,
    xp_earned,
    metadata
  ) VALUES (
    p_user_id,
    p_activity_type,
    p_xp_amount,
    p_metadata || jsonb_build_object(
      'reason', p_reason,
      'old_level', old_level,
      'new_level', new_level,
      'level_up', level_up_occurred,
      'achievement_earned', achievement_earned
    )
  );
  
  -- Create XP transaction record
  INSERT INTO public.xp_transactions (
    user_id,
    xp_amount,
    transaction_type,
    reason
  ) VALUES (
    p_user_id,
    p_xp_amount,
    p_activity_type,
    p_reason
  );
  
  -- Return comprehensive result
  result := jsonb_build_object(
    'success', true,
    'old_xp', old_xp,
    'new_xp', new_xp,
    'xp_awarded', p_xp_amount,
    'old_level', old_level,
    'new_level', new_level,
    'level_up', level_up_occurred,
    'achievement_earned', achievement_earned
  );
  
  RETURN result;
END;
$function$;

-- Fix existing user levels based on new thresholds
UPDATE public.profiles 
SET level = public.calculate_level_from_xp(experience_points),
    updated_at = now()
WHERE level != public.calculate_level_from_xp(experience_points);

-- Award level 3 achievements to users who already reached it
UPDATE public.profiles
SET achievements = CASE 
  WHEN 'level_3' = ANY(achievements) THEN achievements
  ELSE array_append(achievements, 'level_3')
END
WHERE level >= 3 AND NOT ('level_3' = ANY(achievements));