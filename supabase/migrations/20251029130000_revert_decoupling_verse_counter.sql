-- Reverts the changes from 20251029120000_decouple_verse_counter.sql

-- Step 1: Drop the function that was created.
DROP FUNCTION IF EXISTS public.increment_verse_count(p_user_id uuid);

-- Step 2: Restore the original xp transaction trigger.
CREATE OR REPLACE FUNCTION public.handle_xp_transaction_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Handle verse completion (audio completion)
  IF NEW.activity_type = 'audio_completion' THEN
    PERFORM increment_total_verses(NEW.user_id);
  END IF;

  -- Update streak and check achievements after any XP transaction
  PERFORM update_user_streak(NEW.user_id);
  PERFORM check_and_award_achievements(NEW.user_id);

  RETURN NEW;
END;
$function$
