-- RESTORE award_xp function WITH counter increments

DROP FUNCTION IF EXISTS public.award_xp(uuid, integer, text, text, jsonb);

CREATE OR REPLACE FUNCTION public.award_xp(
    p_user_id uuid,
    p_xp_amount integer,
    p_activity_type text,
    p_reason text DEFAULT NULL,
    p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_xp INTEGER;
  new_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Get current XP
  SELECT experience_points INTO current_xp
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  -- Calculate new XP and level
  new_xp := COALESCE(current_xp, 0) + p_xp_amount;
  new_level := public.calculate_level_from_xp(new_xp);
  
  -- Update profile with XP, level AND counters
  UPDATE public.profiles
  SET experience_points = new_xp,
      level = new_level,
      updated_at = now(),
      total_verses = CASE
        WHEN p_activity_type IN ('verse_completion', 'audio_completion') THEN COALESCE(total_verses, 0) + 1
        ELSE COALESCE(total_verses, 0)
      END,
      total_journal = CASE
        WHEN p_activity_type = 'journal_completion' THEN COALESCE(total_journal, 0) + 1
        ELSE COALESCE(total_journal, 0)
      END,
      total_elite_habit = CASE
        WHEN p_activity_type = 'elite_habit_completion' THEN COALESCE(total_elite_habit, 0) + 1
        ELSE COALESCE(total_elite_habit, 0)
      END
  WHERE user_id = p_user_id;
  
  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, xp_earned, metadata)
  VALUES (p_user_id, p_activity_type, p_xp_amount, p_metadata);
  
  -- Log XP transaction
  INSERT INTO public.xp_transactions (user_id, xp_amount, transaction_type, reason)
  VALUES (p_user_id, p_xp_amount, 'earned', COALESCE(p_reason, p_activity_type));
END;
$$;