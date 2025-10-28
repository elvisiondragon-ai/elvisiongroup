CREATE OR REPLACE FUNCTION public.award_xp(
  p_user_id uuid,
  p_xp_amount integer,
  p_activity_type text,
  p_reason text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  old_level INTEGER;
  new_level INTEGER;
  old_xp INTEGER;
  new_xp INTEGER;
  level_up_occurred BOOLEAN := false;
  achievement_earned BOOLEAN := false;
  daily_xp_earned INTEGER := 0;
  remaining_xp INTEGER := 0;
  actual_xp_to_award INTEGER := 0;
  daily_limit_hit BOOLEAN := false;
  updated_rows INTEGER := 0;
BEGIN
  -- Ensure profile exists (idempotent)
  INSERT INTO public.profiles (user_id, level, experience_points, total_verses, total_journal)
  VALUES (p_user_id, 1, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Load current level/xp
  SELECT level, experience_points INTO old_level, old_xp
  FROM public.profiles WHERE user_id = p_user_id;

  IF old_level IS NULL THEN
    -- Safety: re-select after insert in case of race
    SELECT level, experience_points INTO old_level, old_xp
    FROM public.profiles WHERE user_id = p_user_id;
  END IF;

  IF old_level IS NULL THEN
    RAISE EXCEPTION 'Profile not found or not creatable for user_id=%', p_user_id;
  END IF;

  -- Increment counters FIRST (independent of daily XP cap)
  UPDATE public.profiles
  SET
    total_verses = CASE
      WHEN p_activity_type = 'verse_completion'
        THEN COALESCE(total_verses, 0) + 1
      ELSE COALESCE(total_verses, 0)
    END,
    total_journal = CASE
      WHEN p_activity_type = 'journal_completion'
        THEN COALESCE(total_journal, 0) + 1
      ELSE COALESCE(total_journal, 0)
    END,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING 1 INTO updated_rows;

  IF updated_rows IS NULL THEN
    RAISE EXCEPTION 'Failed to update counters for user_id=%', p_user_id;
  END IF;

  -- Daily XP limit
  SELECT COALESCE(SUM(xp_amount), 0) INTO daily_xp_earned
  FROM public.xp_transactions
  WHERE user_id = p_user_id
    AND DATE(created_at) = CURRENT_DATE;

  remaining_xp := GREATEST(0, 30 - daily_xp_earned);
  actual_xp_to_award := LEAST(GREATEST(p_xp_amount, 0), remaining_xp); -- prevent negative awards
  daily_limit_hit := (daily_xp_earned + actual_xp_to_award) >= 30;

  -- Calculate new XP/level
  new_xp := old_xp + actual_xp_to_award;
  new_level := public.calculate_level_from_xp(new_xp);
  level_up_occurred := new_level > old_level;

  -- Update XP/level
  UPDATE public.profiles
  SET
    experience_points = new_xp,
    level = new_level,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Achievements (example)
  IF new_level >= 3 AND old_level < 3 THEN
    UPDATE public.profiles
    SET achievements = CASE
      WHEN achievements IS NULL THEN ARRAY['level_3']
      WHEN 'level_3' = ANY(achievements) THEN achievements
      ELSE array_append(achievements, 'level_3')
    END
    WHERE user_id = p_user_id;
    achievement_earned := true;
  END IF;

  -- Logging (will record 0 XP when capped, which is fine)
  INSERT INTO public.user_activities (user_id, activity_type, xp_earned, metadata)
  VALUES (p_user_id, p_activity_type, actual_xp_to_award, p_metadata);

  INSERT INTO public.xp_transactions (user_id, xp_amount, transaction_type, reason)
  VALUES (p_user_id, actual_xp_to_award, p_activity_type, COALESCE(p_reason, 'XP awarded'));

  RETURN jsonb_build_object(
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
    'limit_reached', daily_limit_hit,
    'show_notification', daily_limit_hit
  );
END;
$function$;