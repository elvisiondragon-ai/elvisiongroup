-- DROP AND RECREATE award_xp function without counter increments

-- Drop existing function (handles any signature conflicts)
DROP FUNCTION IF EXISTS public.award_xp(uuid, integer, text, text, jsonb);
DROP FUNCTION IF EXISTS public.award_xp(uuid, integer, text, text);
DROP FUNCTION IF EXISTS public.award_xp(uuid, integer, text);

-- Recreate without counter increments
CREATE FUNCTION public.award_xp(
    p_user_id uuid,
    p_xp_amount integer,
    p_activity_type text,
    p_reason text DEFAULT NULL,
    p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_xp INTEGER;
  new_xp INTEGER;
  new_level INTEGER;
  old_level INTEGER;
BEGIN
  -- Get current XP and level
  SELECT experience_points, level INTO current_xp, old_level
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  -- Calculate new XP and level
  new_xp := COALESCE(current_xp, 0) + p_xp_amount;
  new_level := public.calculate_level_from_xp(new_xp);
  
  -- Update profile with XP and level ONLY (no counter increments)
  UPDATE public.profiles
  SET experience_points = new_xp,
      level = new_level,
      updated_at = now()
      -- REMOVED: total_journal, total_verses, total_elite_habit increments
  WHERE user_id = p_user_id;
  
  -- Log the activity
  INSERT INTO public.user_activities (user_id, activity_type, xp_earned, metadata, created_at)
  VALUES (p_user_id, p_activity_type, p_xp_amount, p_metadata, now());
  
  -- Log XP transaction  
  INSERT INTO public.xp_transactions (user_id, xp_amount, transaction_type, reason, created_at)
  VALUES (p_user_id, p_xp_amount, 'earned', COALESCE(p_reason, p_activity_type), now());
  
END;
$$;

-- Verify
SELECT 'award_xp function recreated without counter increments' as status;