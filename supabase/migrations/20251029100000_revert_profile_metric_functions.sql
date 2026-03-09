-- SQL Migration to revert changes made to profile metric functions.
-- This migration restores the original definitions of:
--   - increment_total_journal
--   - increment_total_verses
--   - sync_elite_habit_count
-- It removes the explicit 'updated_at = now()' and the local variable '_user_id'
-- that were added in the previous migration.

-- Revert increment_total_journal
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

-- Revert increment_total_verses
CREATE OR REPLACE FUNCTION public.increment_total_verses(user_id_param uuid) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  UPDATE profiles
  SET total_verses = COALESCE(total_verses, 0) + 1
  WHERE user_id = user_id_param;

  -- Log the update
  INSERT INTO user_activities (user_id, activity_type, metadata)
  VALUES (user_id_param, 'verse_completion', '{"source": "audio_completion"}'::jsonb);
END;
$$;

-- Revert sync_elite_habit_count
CREATE OR REPLACE FUNCTION public.sync_elite_habit_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Update the profiles table with the new count for the affected user
    UPDATE public.profiles
    SET total_elite_habit = (
        SELECT COUNT(*)
        FROM public.elite_habits
        WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    )
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);

    RETURN COALESCE(NEW, OLD);
END;
$$;