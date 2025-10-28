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
SET search_path = 'public'
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
BEGIN
  -- 1) Ensure profile exists up-front (idempotent)
  INSERT INTO public.profiles (user_id, level, experience_points, total_verses, total_journal)
  VALUES (p_user_id, 1, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- 2) Load current profile data
  SELECT level, experience_points INTO old_level, old_xp
  FROM public.profiles WHERE user_id = p_user_id;

  IF old_level IS NULL THEN
    -- Safety in case of a race
    SELECT level, experience_points INTO old_level, old_xp
    FROM public.profiles WHERE user_id = p_user_id;
  END IF;

  IF old_level IS NULL THEN
    RAISE EXCEPTION 'Profile not found or not creatable for user_id=%', p_user_id;
  END IF;

  -- 3) Increment counters FIRST (independent of XP cap)
  -- NOTE: Removed total_journal increment; reflections triggers will maintain it.
  UPDATE public.profiles
  SET
    total_verses = CASE
      WHEN p_activity_type = 'verse_completion' THEN COALESCE(total_verses, 0) + 1
      ELSE COALESCE(total_verses, 0)
    END,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- 4) Daily XP limit (calculate after counters)
  SELECT COALESCE(SUM(xp_amount), 0) INTO daily_xp_earned
  FROM public.xp_transactions
  WHERE user_id = p_user_id
    AND DATE(created_at) = CURRENT_DATE;

  remaining_xp := GREATEST(0, 30 - daily_xp_earned);
  actual_xp_to_award := LEAST(GREATEST(p_xp_amount, 0), remaining_xp);
  daily_limit_hit := (daily_xp_earned + actual_xp_to_award) >= 30 OR remaining_xp = 0;

  -- 5) Calculate new XP and level (XP can be 0 when capped)
  new_xp := old_xp + actual_xp_to_award;
  new_level := public.calculate_level_from_xp(new_xp);
  level_up_occurred := new_level > old_level;

  -- 6) Update profile with new XP and level
  UPDATE public.profiles
  SET experience_points = new_xp,
      level = new_level,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- 7) Level-based achievements (example)
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

  -- 8) Logging: skip noisy 0-XP inserts to avoid "0 EXP earned" toasts
  IF actual_xp_to_award > 0 THEN
    INSERT INTO public.user_activities (user_id, activity_type, xp_earned, metadata)
    VALUES (p_user_id, p_activity_type, actual_xp_to_award, p_metadata);

    INSERT INTO public.xp_transactions (user_id, xp_amount, transaction_type, reason)
    VALUES (p_user_id, actual_xp_to_award, p_activity_type, COALESCE(p_reason, 'XP awarded'));
  END IF;

  -- 9) UI helpers: let frontend suppress XP toast on cap and show counter text instead
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
    'remaining_xp', GREATEST(0, remaining_xp - actual_xp_to_award),
    'limit_reached', remaining_xp = 0,
    'show_notification', daily_limit_hit,

    -- New: toast control
    'show_xp_toast', actual_xp_to_award > 0,
    'toast_message',
      CASE
        WHEN actual_xp_to_award = 0 AND p_activity_type = 'verse_completion' THEN '+1 Total Verse'
        WHEN actual_xp_to_award = 0 AND p_activity_type = 'journal_completion' THEN '+1 Total Journal'
        WHEN actual_xp_to_award > 0 THEN CONCAT('+', actual_xp_to_award, ' EXP')
        ELSE NULL
      END
  );
END;
$function$;