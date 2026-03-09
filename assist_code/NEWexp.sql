-- Comprehensive SQL Script to Decouple XP and Verse Counting
-- This script ensures that total_verses increments unconditionally for audio completions,
-- regardless of daily XP limits, and updates all related functions for consistency.

-- Step 0: Set search_path for all functions to 'public' for security and consistency.
-- This is a common practice in Supabase functions.
ALTER FUNCTION public.award_audio_xp(uuid, boolean, integer) SET search_path TO 'public';
ALTER FUNCTION public.increment_total_journal(uuid, text) SET search_path TO 'public';
ALTER FUNCTION public.update_user_streak(uuid) SET search_path TO 'public';
ALTER FUNCTION public.check_and_award_achievements(uuid) SET search_path TO 'public';
ALTER FUNCTION public.calculate_level_from_xp(integer) SET search_path TO 'public';
ALTER FUNCTION public.handle_xp_transaction_trigger() SET search_path TO 'public';


-- Step 1: Ensure 'total_verses' is the canonical column and handle potential 'total_verses_completed' redundancy.
-- If 'total_verses_completed' exists as a separate column, migrate its data to 'total_verses' and then drop it.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_verses_completed') THEN
        -- Migrate data from total_verses_completed to total_verses if total_verses is null or less
        UPDATE public.profiles
        SET total_verses = GREATEST(COALESCE(total_verses, 0), COALESCE(total_verses_completed, 0))
        WHERE total_verses_completed IS NOT NULL;

        -- Drop the redundant column
        ALTER TABLE public.profiles DROP COLUMN total_verses_completed;
    END IF;

    -- Ensure total_verses exists and has a default value
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_verses') THEN
        ALTER TABLE public.profiles ADD COLUMN total_verses INTEGER NOT NULL DEFAULT 0;
    END IF;

    -- Ensure total_verses has a NOT NULL constraint and default
    ALTER TABLE public.profiles ALTER COLUMN total_verses SET NOT NULL;
    ALTER TABLE public.profiles ALTER COLUMN total_verses SET DEFAULT 0;

END $$;

-- Step 2: Create or replace the function for awarding XP with a daily limit.
-- This function will handle all XP-related logic, including daily caps.
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
      -- Check daily XP limit first
      SELECT COALESCE(SUM(xp_amount), 0) INTO daily_xp_earned
      FROM xp_transactions
      WHERE user_id = p_user_id
      AND created_at >= CURRENT_DATE;

      -- Calculate remaining XP for today (limit 30 XP)
      remaining_xp := GREATEST(0, 30 - daily_xp_earned);

      -- Cap XP award to remaining daily limit
      actual_xp_to_award := LEAST(p_xp_amount, remaining_xp);
      daily_limit_hit := (daily_xp_earned + actual_xp_to_award) >= 30;

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
          WHEN achievements IS NULL THEN ARRAY['level_3']
          ELSE array_append(achievements, 'level_3')
        END
        WHERE user_id = p_user_id;
        achievement_earned := true;
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
        'limit_reached', daily_limit_hit
      );
      
      RETURN result;
  END;
$function$;

-- Step 3: Create or replace the function for unconditionally incrementing total_verses.
-- This function has no limits.
CREATE OR REPLACE FUNCTION public.increment_total_verses_unlimited(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.profiles
  SET total_verses = COALESCE(total_verses, 0) + 1,
      updated_at = now()
  WHERE user_id = p_user_id;

  -- Log the update
  INSERT INTO public.user_activities (user_id, activity_type, metadata)
  VALUES (p_user_id, 'total_verses_incremented', '{"source": "unlimited_increment"}'::jsonb);
END;
$function$;

-- Step 4: Update award_audio_xp to use the new award_xp_with_limit function.
-- This function will now ONLY be responsible for initiating XP awards.
CREATE OR REPLACE FUNCTION public.award_audio_xp(user_uuid uuid, is_journal boolean DEFAULT false, minutes_listened integer DEFAULT 0)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  DECLARE
      xp_result jsonb;
  BEGIN
      -- Call the new XP awarding function with limit
      xp_result := public.award_xp_with_limit(
          user_uuid,
          10, -- XP amount for audio completion
          'audio_completion',
          'Audio completed',
          jsonb_build_object('is_journal', is_journal, 'minutes_listened', minutes_listened)
      );

      -- Return the XP awarded (or 0 if limited)
      RETURN (xp_result->>'xp_awarded')::integer;
  END;
$function$;

-- Step 5: Update handle_xp_transaction_trigger to call the new unconditional verse increment function.
-- This trigger will now ONLY be responsible for incrementing total_verses for audio completions.
CREATE OR REPLACE FUNCTION public.handle_xp_transaction_trigger() RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = 'public'
    AS $function$
BEGIN
  -- Handle verse completion (audio completion) - now calls the unlimited increment function
  IF NEW.activity_type = 'audio_completion' THEN
    PERFORM public.increment_total_verses_unlimited(NEW.user_id);
  END IF;
  
  -- Handle journal completion 
  IF NEW.activity_type IN ('journal_completion', 'journal_spiritual') THEN
    PERFORM public.increment_total_journal(NEW.user_id, NEW.activity_type);
  END IF;
  
  -- Update streak and check achievements after any XP transaction
  PERFORM public.update_user_streak(NEW.user_id);
  PERFORM public.check_and_award_achievements(NEW.user_id);
  
  RETURN NEW;
END;
$function$;

-- Step 6: Include dependent functions for completeness and consistency.

-- Function: increment_total_journal
CREATE OR REPLACE FUNCTION public.increment_total_journal(user_id_param uuid, source_type text DEFAULT 'journal_entry'::text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE profiles 
  SET total_journal = COALESCE(total_journal, 0) + 1
  WHERE user_id = user_id_param;
  
  -- Log the update
  INSERT INTO user_activities (user_id, activity_type, metadata)
  VALUES (user_id_param, 'journal_completion', jsonb_build_object('source', source_type));
END;
$$;

-- Function: update_user_streak
CREATE OR REPLACE FUNCTION public.update_user_streak(user_id_param uuid) RETURNS void
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
CREATE OR REPLACE FUNCTION public.check_and_award_achievements(user_id_param uuid) RETURNS void
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
  
  current_achievements := COALESCE(user_profile.achievements, ARRAY[]::TEXT[]);
  
  -- Check for 7-day streak achievement
  IF user_profile.streak_days >= 7 AND NOT ('7_day_streak' = ANY(current_achievements)) THEN
    new_achievements := array_append(new_achievements, '7_day_streak');
  END IF;
  
  -- Check for Zen Master achievement (100 journal entries)
  IF user_profile.total_journal >= 100 AND NOT ('zen_master' = ANY(current_achievements)) THEN
    new_achievements := array_append(new_achievements, 'zen_master');
  END IF;
  
  -- Update achievements if new ones found
  IF array_length(new_achievements, 1) > 0 THEN
    UPDATE profiles 
    SET achievements = array_cat(current_achievements, new_achievements)
    WHERE user_id = user_id_param;
    
    -- Log achievement awards
    INSERT INTO user_activities (user_id, activity_type, metadata)
    VALUES (user_id_param, 'achievement_unlocked', jsonb_build_object('achievements', new_achievements));
  END IF;
END;
$$;

-- Function: calculate_level_from_xp
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp integer) RETURNS integer
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
