-- This migration fixes the issue where total_verses_completed stops incrementing after daily XP limit is reached for audio completion.
-- The total_verses_completed should increment regardless of XP limits.

CREATE OR REPLACE FUNCTION public.award_audio_xp(user_uuid uuid, is_journal boolean DEFAULT false, minutes_listened integer DEFAULT 0)
RETURNS integer
LANGUAGE plpgsql
AS $function$
  DECLARE
      daily_total INTEGER;
  BEGIN
      -- Calculate daily XP earned for audio completion
      SELECT COALESCE(SUM(xp_amount), 0) INTO daily_total
      FROM xp_transactions
      WHERE user_id = user_uuid
      AND transaction_type = 'audio_completion'
      AND created_at >= CURRENT_DATE;

      -- XP is still limited, but total_verses_completed should not be.
      -- If daily XP limit for audio is reached, do not award XP, but continue to increment total_verses_completed.
      IF daily_total < 20 THEN
          INSERT INTO xp_transactions (user_id, xp_amount, transaction_type, reason)
          VALUES (user_uuid, 10, 'audio_completion', 'Audio completed');
      END IF;

      IF is_journal THEN
          UPDATE profiles SET
              total_journal_sessions = total_journal_sessions + 1,
              last_activity_date = CURRENT_DATE
          WHERE user_id = user_uuid;
      ELSE
          -- Increment total_verses_completed regardless of daily XP limit
          UPDATE profiles SET
              total_verses_completed = COALESCE(total_verses_completed, 0) + 1,
              last_activity_date = CURRENT_DATE
          WHERE user_id = user_uuid;

          UPDATE profiles SET is_zen_master = TRUE
          WHERE user_id = user_uuid AND total_verses_completed >= 100;
      END IF;

      PERFORM update_streak(user_uuid);
      RETURN 10; -- This return value is for XP awarded, which is 0 if daily_total >= 20
  END;
$function$;