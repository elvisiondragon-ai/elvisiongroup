-- SQL to add RAISE NOTICE debugging messages to key functions.
-- Execute this script in your Supabase SQL editor.
-- After execution, perform an audio completion action in your 
       application
-- and observe the output messages in the SQL editor console to trace 
       execution.

-- Step 1.1: Redefine `increment_total_verses_unlimited` with debug 
       messages
CREATE OR REPLACE FUNCTION
       public.increment_total_verses_unlimited(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  RAISE NOTICE 'DEBUG: increment_total_verses_unlimited called for 
       user_id: %', p_user_id;

  UPDATE public.profiles
  SET total_verses = COALESCE(total_verses, 0) + 1,
      updated_at = now()
  WHERE user_id = p_user_id;

  IF FOUND THEN
    RAISE NOTICE 'DEBUG: profiles.total_verses updated for user_id: %',
       p_user_id;
  ELSE
    RAISE NOTICE 'DEBUG: profiles.total_verses NOT updated for user_id: 
       %. User not found or no change.', p_user_id;
  END IF;

  -- Log the update (optional, but good for auditing)
  INSERT INTO public.user_activities (user_id, activity_type, metadata)
  VALUES (p_user_id, 'total_verses_incremented', '{"source": 
       "unlimited_increment"}'::jsonb);
  RAISE NOTICE 'DEBUG: user_activities logged for 
       total_verses_incremented for user_id: %', p_user_id;

END;
$function$;

-- Step 1.2: Redefine `award_xp_with_limit` with debug messages
CREATE OR REPLACE FUNCTION public.award_xp_with_limit(
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
      daily_xp_earned INTEGER;
      remaining_xp INTEGER;
      actual_xp_to_award INTEGER;
      daily_limit_hit BOOLEAN := false;
      result jsonb;
  BEGIN
      RAISE NOTICE 'DEBUG: award_xp_with_limit called for user_id: %, 
       activity: %', p_user_id, p_activity_type;

      -- Check daily XP limit first
      SELECT COALESCE(SUM(xp_amount), 0) INTO daily_xp_earned
      FROM xp_transactions
      WHERE user_id = p_user_id
      AND created_at >= CURRENT_DATE;
      RAISE NOTICE 'DEBUG: Daily XP earned for user %: %', p_user_id,
       daily_xp_earned;

      -- Calculate remaining XP for today (limit 30 XP)
      remaining_xp := GREATEST(0, 30 - daily_xp_earned);
      RAISE NOTICE 'DEBUG: Remaining XP for user %: % (Limit: 30)',
       p_user_id, remaining_xp;

      -- Cap XP award to remaining daily limit
      actual_xp_to_award := LEAST(p_xp_amount, remaining_xp);
      daily_limit_hit := (daily_xp_earned + actual_xp_to_award) >= 30;
      RAISE NOTICE 'DEBUG: Actual XP to award for user %: % (Requested: 
       %)', p_user_id, actual_xp_to_award, p_xp_amount;

      -- Get current profile data
      SELECT level, experience_points INTO old_level, old_xp
      FROM public.profiles
      WHERE user_id = p_user_id;

      -- If no profile exists, create one
      IF NOT FOUND THEN
        RAISE NOTICE 'DEBUG: Profile not found for user %, creating new.'
       , p_user_id;
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
      RAISE NOTICE 'DEBUG: Profile XP and level updated for user %: 
       new_xp=%, new_level=%', p_user_id, new_xp, new_level;

      -- Award level 3 achievement badge if reached for first time
      IF new_level >= 3 AND old_level < 3 THEN
        UPDATE public.profiles
        SET achievements = CASE
          WHEN achievements IS NULL THEN ARRAY['level_3']
          ELSE array_append(achievements, 'level_3')
        END
        WHERE user_id = p_user_id;
        achievement_earned := true;
        RAISE NOTICE 'DEBUG: Achievement level_3 awarded for user %',
       p_user_id;
      END IF;

      -- Insert XP transaction only if actual_xp_to_award > 0
      IF actual_xp_to_award > 0 THEN
          INSERT INTO public.xp_transactions (
            user_id,
            xp_amount,
            transaction_type,
            reason
          ) VALUES (
            p_user_id,
            actual_xp_to_award,
            p_activity_type,
            COALESCE(p_reason, 'XP awarded')
          );
          RAISE NOTICE 'DEBUG: XP transaction inserted for user %: 
       xp_amount=%, type=%', p_user_id, actual_xp_to_award, p_activity_type;
      ELSE
          RAISE NOTICE 'DEBUG: XP transaction NOT inserted for user % 
       because actual_xp_to_award is 0 or less.', p_user_id;
      END IF;

      -- Log the activity (even if 0 XP awarded, for tracking attempts)
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
      RAISE NOTICE 'DEBUG: user_activities logged for user %: activity=%'
       , p_user_id, p_activity_type;

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
        'limit_reached', daily_limit_hit
      );

      RAISE NOTICE 'DEBUG: award_xp_with_limit returning result: %',
       result;
      RETURN result;
  END;
$function$;

-- Step 1.3: Redefine `award_audio_xp` with debug messages
CREATE OR REPLACE FUNCTION public.award_audio_xp(user_uuid uuid,
       is_journal boolean DEFAULT false, minutes_listened integer DEFAULT 0)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  DECLARE
      xp_result jsonb;
      xp_awarded_val INTEGER;
  BEGIN
      RAISE NOTICE 'DEBUG: award_audio_xp called for user_id: %',
       user_uuid;

      -- Call the new XP awarding function with limit
      xp_result := public.award_xp_with_limit(
          user_uuid,
          10, -- XP amount for audio completion
          'audio_completion',
          'Audio completed',
          jsonb_build_object('is_journal', is_journal, 'minutes_listened'
       , minutes_listened)
      );
      xp_awarded_val := (xp_result->>'xp_awarded')::integer;
      RAISE NOTICE 'DEBUG: award_xp_with_limit returned for user %: 
       xp_awarded=%', user_uuid, xp_awarded_val;

      -- Return the XP awarded (or 0 if limited)
      RETURN xp_awarded_val;
  END;
$function$;

-- Step 1.4: Redefine `handle_xp_transaction_trigger` with debug messages
CREATE OR REPLACE FUNCTION public.handle_xp_transaction_trigger() RETURNS
       trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path = 'public'
    AS $function$
BEGIN
  RAISE NOTICE 'DEBUG: handle_xp_transaction_trigger called for user_id: 
       %, activity: %', NEW.user_id, NEW.activity_type;

  -- Handle verse completion (audio completion) - now calls the unlimited
       increment function
  IF NEW.activity_type = 'audio_completion' THEN
    RAISE NOTICE 'DEBUG: handle_xp_transaction_trigger: Audio completion 
       detected. Calling increment_total_verses_unlimited for user_id: %',
       NEW.user_id;
    PERFORM public.increment_total_verses_unlimited(NEW.user_id);
  END IF;

  -- Handle journal completion
  IF NEW.activity_type IN ('journal_completion', 'journal_spiritual')
       THEN
    RAISE NOTICE 'DEBUG: handle_xp_transaction_trigger: Journal 
       completion detected. Calling increment_total_journal for user_id: %',
       NEW.user_id;
    PERFORM public.increment_total_journal(NEW.user_id,
       NEW.activity_type);
  END IF;

  -- Update streak and check achievements after any XP transaction
  RAISE NOTICE 'DEBUG: handle_xp_transaction_trigger: Calling 
       update_user_streak for user_id: %', NEW.user_id;
  PERFORM public.update_user_streak(NEW.user_id);
  RAISE NOTICE 'DEBUG: handle_xp_transaction_trigger: Calling 
       check_and_award_achievements for user_id: %', NEW.user_id;
  PERFORM public.check_and_award_achievements(NEW.user_id);

  RETURN NEW;
END;
$function$;

-- Step 1.5: Re-include dependent functions (without further debug 
       messages as they are not the primary focus)
-- Function: increment_total_journal
CREATE OR REPLACE FUNCTION public.increment_total_journal(user_id_param
       uuid, source_type text DEFAULT 'journal_entry'::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE profiles
  SET total_journal = COALESCE(total_journal, 0) + 1
  WHERE user_id = user_id_param;

  -- Log the update
  INSERT INTO user_activities (user_id, activity_type, metadata)
  VALUES (user_id_param, 'journal_completion', jsonb_build_object(
       'source', source_type));
END;
$$;

-- Function: update_user_streak
CREATE OR REPLACE FUNCTION public.update_user_streak(user_id_param uuid)
       RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  current_streak INTEGER := 0;
  consecutive_days INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  has_activity BOOLEAN;
BEGIN
  -- Check last 7 days for consecutive activity
  FOR i IN 0..6 LOOP
    check_date := CURRENT_DATE - INTERVAL '1 day' * i;

    -- Check if user had any XP activity on this date
    SELECT EXISTS (
      SELECT 1 FROM xp_transactions
      WHERE user_id = user_id_param
      AND DATE(created_at) = check_date
    ) INTO has_activity;

    IF has_activity THEN
      consecutive_days := consecutive_days + 1;
    ELSE
      EXIT; -- Break streak
    END IF;
  END LOOP;

  -- Update streak in profile
  UPDATE profiles
  SET streak_days = consecutive_days
  WHERE user_id = user_id_param;

END;
$$;

-- Function: check_and_award_achievements
CREATE OR REPLACE FUNCTION
       public.check_and_award_achievements(user_id_param uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  user_profile RECORD;
  current_achievements TEXT[];
  new_achievements TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Get current profile data
  SELECT * INTO user_profile
  FROM profiles
  WHERE user_id = user_id_param;

  current_achievements := COALESCE(user_profile.achievements, ARRAY
       []::TEXT[]);

  -- Check for 7-day streak achievement
  IF user_profile.streak_days >= 7 AND NOT ('7_day_streak' = ANY
       (current_achievements)) THEN
    new_achievements := array_append(new_achievements, '7_day_streak');
  END IF;

  -- Check for Zen Master achievement (100 journal entries)
  IF user_profile.total_journal >= 100 AND NOT ('zen_master' = ANY
       (current_achievements)) THEN
    new_achievements := array_append(new_achievements, 'zen_master');
  END IF;

  -- Update achievements if new ones found
  IF array_length(new_achievements, 1) > 0 THEN
    UPDATE profiles
    SET achievements = array_cat(current_achievements, new_achievements)
    WHERE user_id = user_id_param;

    -- Log achievement awards
    INSERT INTO user_activities (user_id, activity_type, metadata)
    VALUES (user_id_param, 'achievement_unlocked', jsonb_build_object(
       'achievements', new_achievements));
  END IF;
END;
$$;

-- Function: calculate_level_from_xp
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp
       integer) RETURNS integer
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
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
$$;