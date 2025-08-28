-- FINAL XP LIMITS: 20 XP/day for ALL audio combined, 5 XP/day for journal text

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
  daily_xp_earned INTEGER := 0;
  xp_to_award INTEGER := 0;
  audio_xp_today INTEGER := 0;
  journal_text_xp_today INTEGER := 0;
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
  
  -- Check daily XP limits for audio completion and journal completion activities
  IF p_activity_type = 'audio_completion' OR p_activity_type = 'journal_completion' THEN
    -- Get today's XP earned for ALL AUDIO activities (verses + journal audio combined)
    SELECT COALESCE(SUM(xp_amount), 0) INTO audio_xp_today
    FROM public.xp_transactions
    WHERE user_id = p_user_id
      AND activity_type = 'audio_completion'
      AND DATE(created_at) = CURRENT_DATE;
    
    -- Get today's XP earned for journal TEXT activities (journal_completion only)
    SELECT COALESCE(SUM(xp_amount), 0) INTO journal_text_xp_today
    FROM public.xp_transactions
    WHERE user_id = p_user_id
      AND DATE(created_at) = CURRENT_DATE
      AND activity_type = 'journal_completion';
    
    -- Apply daily limits based on activity type
    IF p_activity_type = 'audio_completion' THEN
      -- ALL AUDIO (verses + journal audio): Max 20 XP per day combined
      IF audio_xp_today >= 20 THEN
        xp_to_award := 0; -- Daily limit reached
      ELSIF audio_xp_today + p_xp_amount > 20 THEN
        xp_to_award := 20 - audio_xp_today; -- Award partial XP to reach limit
      ELSE
        xp_to_award := p_xp_amount; -- Award full XP
      END IF;
    ELSIF p_activity_type = 'journal_completion' THEN
      -- Journal TEXT completion: Max 5 XP per day
      IF journal_text_xp_today >= 5 THEN
        xp_to_award := 0; -- Daily limit reached
      ELSIF journal_text_xp_today + p_xp_amount > 5 THEN
        xp_to_award := 5 - journal_text_xp_today; -- Award partial XP to reach limit
      ELSE
        xp_to_award := p_xp_amount; -- Award full XP
      END IF;
    ELSE
      -- Other activities (no specific limit)
      xp_to_award := p_xp_amount;
    END IF;
  ELSE
    -- Non-audio/journal completion activities (no specific limits)
    xp_to_award := p_xp_amount;
  END IF;
  
  -- If no XP to award due to limits, log and return early
  IF xp_to_award <= 0 THEN
    -- Log the limit reached event for monitoring
    INSERT INTO public.xp_transactions (
      user_id, 
      xp_amount, 
      activity_type, 
      reason, 
      metadata
    ) VALUES (
      p_user_id, 
      0,  -- No XP awarded due to limit
      p_activity_type || '_limit_reached', 
      'Daily XP limit reached', 
      jsonb_build_object(
        'requested_xp', p_xp_amount,
        'daily_audio_xp', audio_xp_today,
        'daily_journal_text_xp', journal_text_xp_today,
        'limit_type', p_activity_type
      )
    );
    
    result := jsonb_build_object(
      'success', true,
      'old_xp', old_xp,
      'new_xp', old_xp,
      'xp_gained', 0,
      'old_level', old_level,
      'new_level', old_level,
      'level_up', false,
      'achievement_earned', false,
      'daily_limit_reached', true,
      'message', CASE 
        WHEN p_activity_type = 'audio_completion' THEN 'Daily audio XP limit reached (20 XP/day for all audio)'
        WHEN p_activity_type = 'journal_completion' THEN 'Daily journal text XP limit reached (5 XP/day)'
        ELSE 'Daily limit reached'
      END
    );
    RETURN result;
  END IF;
  
  -- Calculate new XP and level with limited amount
  new_xp := old_xp + xp_to_award;
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
      SET total_verses = COALESCE(total_verses, 0) + 1
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
  
  -- Insert XP transaction record with actual awarded amount
  INSERT INTO public.xp_transactions (
    user_id, 
    xp_amount, 
    activity_type, 
    reason, 
    metadata
  ) VALUES (
    p_user_id, 
    xp_to_award,  -- Record actual XP awarded (may be less than requested)
    p_activity_type, 
    p_reason, 
    p_metadata
  );
  
  -- Return comprehensive result
  result := jsonb_build_object(
    'success', true,
    'old_xp', old_xp,
    'new_xp', new_xp,
    'xp_gained', xp_to_award,
    'old_level', old_level,
    'new_level', new_level,
    'level_up', level_up_occurred,
    'achievement_earned', achievement_earned,
    'daily_limit_reached', false
  );
  
  RETURN result;
END;
$function$;