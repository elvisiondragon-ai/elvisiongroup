-- Add total_verses field to profiles table for separate verse tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_verses INTEGER NOT NULL DEFAULT 0;

-- Update award_xp function to track verse and journal completions separately
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
  
  -- Track activity-specific counters
  IF p_activity_type = 'audio_completion' THEN
    -- Check if it's a verse or journal completion based on metadata
    IF p_metadata->>'verseId' IS NOT NULL THEN
      -- It's a verse completion
      UPDATE public.profiles
      SET total_verses = total_verses + 1
      WHERE user_id = p_user_id;
    ELSIF p_metadata->>'journalId' IS NOT NULL THEN
      -- It's a journal completion  
      UPDATE public.profiles
      SET total_sessions = total_sessions + 1
      WHERE user_id = p_user_id;
    END IF;
  END IF;
  
  -- Award level 3 achievement badge if reached for first time
  IF new_level >= 3 AND old_level < 3 THEN
    UPDATE public.profiles
    SET achievements = CASE 
      WHEN 'spirit' = ANY(achievements) THEN achievements
      ELSE array_append(achievements, 'spirit')
    END
    WHERE user_id = p_user_id;
    achievement_earned := true;
  END IF;
  
  -- Insert XP transaction record
  INSERT INTO public.xp_transactions (
    user_id, 
    xp_amount, 
    activity_type, 
    reason, 
    metadata
  ) VALUES (
    p_user_id, 
    p_xp_amount, 
    p_activity_type, 
    p_reason, 
    p_metadata
  );
  
  -- Return comprehensive result
  result := jsonb_build_object(
    'success', true,
    'old_xp', old_xp,
    'new_xp', new_xp,
    'xp_gained', p_xp_amount,
    'old_level', old_level,
    'new_level', new_level,
    'level_up', level_up_occurred,
    'achievement_earned', achievement_earned
  );
  
  RETURN result;
END;
$function$;