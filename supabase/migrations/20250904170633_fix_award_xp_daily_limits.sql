-- Fix award_xp function to enforce daily limits
DROP FUNCTION IF EXISTS public.award_xp(uuid, integer, text, text, jsonb);

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
  daily_xp_earned INTEGER;
  remaining_xp INTEGER;
  actual_xp_to_award INTEGER;
  result jsonb;
BEGIN
  -- Check daily XP limit first
  SELECT COALESCE(SUM(xp_amount), 0) INTO daily_xp_earned
  FROM public.xp_transactions
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE;
  
  -- Calculate remaining XP for today
  remaining_xp := GREATEST(0, 30 - daily_xp_earned);
  
  -- If daily limit reached, return early without awarding XP
  IF remaining_xp <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'reason', 'daily_limit_reached',
      'daily_xp_earned', daily_xp_earned,
      'daily_limit', 30,
      'remaining_xp', 0,
      'limit_reached', true
    );
  END IF;
  
  -- Cap XP award to remaining daily limit
  actual_xp_to_award := LEAST(p_xp_amount, remaining_xp);

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
  new_xp := old_xp + actual_xp_to_award;
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
    actual_xp_to_award,
    p_metadata || jsonb_build_object(
      'reason', p_reason,
      'old_level', old_level,
      'new_level', new_level,
      'level_up', level_up_occurred,
      'achievement_earned', achievement_earned,
      'requested_xp', p_xp_amount,
      'actual_xp_awarded', actual_xp_to_award,
      'daily_xp_earned', daily_xp_earned + actual_xp_to_award
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
    actual_xp_to_award,
    p_activity_type,
    p_reason
  );
  
  -- Return comprehensive result
  result := jsonb_build_object(
    'success', true,
    'old_xp', old_xp,
    'new_xp', new_xp,
    'xp_awarded', actual_xp_to_award,
    'requested_xp', p_xp_amount,
    'old_level', old_level,
    'new_level', new_level,
    'level_up', level_up_occurred,
    'achievement_earned', achievement_earned,
    'daily_xp_earned', daily_xp_earned + actual_xp_to_award,
    'daily_limit', 30,
    'remaining_xp', remaining_xp - actual_xp_to_award,
    'limit_reached', (daily_xp_earned + actual_xp_to_award) >= 30
  );
  
  RETURN result;
END;
$function$;