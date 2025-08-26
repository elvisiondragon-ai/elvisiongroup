-- Fix any users who have incorrect levels based on their XP
-- This will update all users to have the correct level based on their current XP

UPDATE public.profiles 
SET level = public.calculate_level_from_xp(experience_points),
    updated_at = now()
WHERE level != public.calculate_level_from_xp(experience_points);

-- Log how many users were updated
CREATE OR REPLACE FUNCTION public.fix_user_levels()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.profiles 
  SET level = public.calculate_level_from_xp(experience_points),
      updated_at = now()
  WHERE level != public.calculate_level_from_xp(experience_points);
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Log the fix
  PERFORM public.log_sensitive_action(
    'user_levels_corrected',
    'profiles',
    NULL,
    jsonb_build_object(
      'updated_count', updated_count,
      'fix_time', now()
    )
  );
  
  RETURN updated_count;
END;
$$;