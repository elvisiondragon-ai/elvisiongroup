-- This migration refines the verse counting logic to ensure total_verses increments unconditionally for audio completions,
-- decoupling it from daily XP limits, and consolidates verse counting to a single metric.

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

-- Step 2: Create or replace the unconditional verse increment function.
-- This function will be responsible for incrementing the total_verses count.
CREATE OR REPLACE FUNCTION public.increment_verse_count(p_user_id uuid)
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

  -- Log the update (optional, but good for auditing)
  INSERT INTO public.user_activities (user_id, activity_type, metadata)
  VALUES (p_user_id, 'verse_incremented', '{"source": "unconditional_increment"}'::jsonb);
END;
$function$;

-- Step 3: Modify award_audio_xp to ONLY handle XP, removing verse increment logic.
-- The verse increment will now be handled by the trigger calling increment_verse_count.
CREATE OR REPLACE FUNCTION public.award_audio_xp(user_uuid uuid, is_journal boolean DEFAULT false, minutes_listened integer DEFAULT 0)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
  DECLARE
      daily_total INTEGER;
      xp_to_award INTEGER := 10; -- Default XP for audio completion
  BEGIN
      -- Calculate daily XP earned for audio completion
      SELECT COALESCE(SUM(xp_amount), 0) INTO daily_total
      FROM xp_transactions
      WHERE user_id = user_uuid
      AND transaction_type = 'audio_completion'
      AND created_at >= CURRENT_DATE;

      -- If daily XP limit for audio is reached, do not award XP.
      IF daily_total >= 20 THEN
          xp_to_award := 0; -- Set XP to 0 if limit reached
      END IF;

      -- Only insert XP transaction if XP is actually awarded
      IF xp_to_award > 0 THEN
          INSERT INTO xp_transactions (user_id, xp_amount, transaction_type, reason)
          VALUES (user_uuid, xp_to_award, 'audio_completion', 'Audio completed');
      END IF;

      -- No longer incrementing total_verses_completed here. That's handled by the trigger.

      PERFORM update_streak(user_uuid); -- Assuming update_streak is still desired
      RETURN xp_to_award; -- Return actual XP awarded
  END;
$function$;

-- Step 4: Modify handle_xp_transaction_trigger to call increment_verse_count unconditionally for audio_completion.
-- This ensures total_verses increments even if XP is capped.
CREATE OR REPLACE FUNCTION public.handle_xp_transaction_trigger() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path = 'public'
    AS $function$
BEGIN
  -- Handle verse completion (audio completion) - unconditionally increment total_verses
  IF NEW.activity_type = 'audio_completion' THEN
    PERFORM public.increment_verse_count(NEW.user_id);
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