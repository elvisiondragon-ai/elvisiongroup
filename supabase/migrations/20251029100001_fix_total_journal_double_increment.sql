-- SQL Migration to fix double increment of total_journal.
-- This migration redefines the handle_xp_transaction_trigger function
-- to remove the direct call to increment_total_journal, preventing double counting.

CREATE OR REPLACE FUNCTION public.handle_xp_transaction_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle verse completion (audio completion)
  IF NEW.activity_type = 'audio_completion' THEN
    PERFORM increment_total_verses(NEW.user_id);
  END IF;

  -- Handle journal completion - REMOVED direct increment, now relies on reflections trigger
  -- IF NEW.activity_type IN ('journal_completion', 'journal_spiritual') THEN
  --   PERFORM increment_total_journal(NEW.user_id, NEW.activity_type);
  -- END IF;

  -- Update streak and check achievements after any XP transaction
  PERFORM update_user_streak(NEW.user_id);
  PERFORM check_and_award_achievements(NEW.user_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;