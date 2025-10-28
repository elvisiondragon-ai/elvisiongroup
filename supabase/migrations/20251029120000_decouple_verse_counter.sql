
-- Step 1: Create a new function to unconditionally increment total_verses.
CREATE OR REPLACE FUNCTION public.increment_verse_count(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.profiles
  SET total_verses = COALESCE(total_verses, 0) + 1
  WHERE user_id = p_user_id;
END;
$$;

-- Step 2: Modify the xp transaction trigger to REMOVE the verse counting responsibility.
-- This prevents double-counting and fully decouples the two systems.
CREATE OR REPLACE FUNCTION public.handle_xp_transaction_trigger()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- NOTE: Verse completion is now handled by a direct RPC call from the client.
  -- This trigger no longer increments the verse count.

  -- Update streak and check achievements after any XP transaction
  PERFORM update_user_streak(NEW.user_id);
  PERFORM check_and_award_achievements(NEW.user_id);

  RETURN NEW;
END;
$function$
