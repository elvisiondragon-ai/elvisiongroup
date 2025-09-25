-- RESTORE EXACT WORKING award_xp function from your production backup

CREATE OR REPLACE FUNCTION public.award_xp(p_user_id uuid, p_xp_amount integer, p_activity_type text, p_reason text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_total_xp INTEGER;
  new_level INTEGER;
  old_level INTEGER;
BEGIN
  -- Get current level
  SELECT level INTO old_level FROM public.profiles WHERE user_id = p_user_id;
  
  -- Update experience points
  UPDATE public.profiles 
  SET experience_points = experience_points + p_xp_amount,
      updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Get new total XP
  SELECT experience_points INTO new_total_xp FROM public.profiles WHERE user_id = p_user_id;
  
  -- Calculate new level
  new_level := public.calculate_level_from_xp(new_total_xp);
  
  -- Update level if changed
  IF new_level != old_level THEN
    UPDATE public.profiles 
    SET level = new_level,
        updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
  
  -- Log the activity
  INSERT INTO public.user_activities (user_id, activity_type, xp_earned, metadata)
  VALUES (p_user_id, p_activity_type, p_xp_amount, p_metadata);
  
  -- Log the XP transaction
  INSERT INTO public.xp_transactions (user_id, xp_amount, transaction_type, reason)
  VALUES (p_user_id, p_xp_amount, 'earned', COALESCE(p_reason, p_activity_type));
END;
$function$;