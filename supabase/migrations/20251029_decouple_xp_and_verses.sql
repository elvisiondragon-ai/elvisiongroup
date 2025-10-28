-- This migration creates two distinct functions for XP awarding (with limits) and unconditional verse incrementing.
-- It also updates existing functions to use this new, decoupled logic.

-- Step 1: Create or replace the function for awarding XP with a daily limit.
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
          WHEN 'level_3' = ANY(achievements) THEN achievements
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

-- Step 2: Create or replace the function for unconditionally incrementing total_verses.
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

-- Step 3: Modify award_audio_xp to use the new award_xp_with_limit function.
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

-- Step 4: Modify handle_xp_transaction_trigger to call the new unconditional verse increment function.
-- This trigger will now ONLY be responsible for incrementing total_verses for audio completions.
CREATE OR REPLACE FUNCTION public.handle_xp_transaction_trigger() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
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

-- Step 5: Ensure 'total_verses' is correctly set up (from previous migration, re-included for completeness)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_verses_completed') THEN
        UPDATE public.profiles
        SET total_verses = GREATEST(COALESCE(total_verses, 0), COALESCE(total_verses_completed, 0))
        WHERE total_verses_completed IS NOT NULL;

        ALTER TABLE public.profiles DROP COLUMN total_verses_completed;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_verses') THEN
        ALTER TABLE public.profiles ADD COLUMN total_verses INTEGER NOT NULL DEFAULT 0;
    END IF;

    ALTER TABLE public.profiles ALTER COLUMN total_verses SET NOT NULL;
    ALTER TABLE public.profiles ALTER COLUMN total_verses SET DEFAULT 0;

END $$;