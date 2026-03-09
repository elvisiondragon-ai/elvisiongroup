-- Add columns for streak tracking if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_login_date DATE,
ADD COLUMN IF NOT EXISTS last_streak_bonus_date DATE;

-- Create function to handle daily login and streak tracking
CREATE OR REPLACE FUNCTION public.handle_daily_login(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_profile RECORD;
  today_date DATE := CURRENT_DATE;
  yesterday_date DATE := CURRENT_DATE - INTERVAL '1 day';
  new_streak INTEGER := 0;
  xp_awarded INTEGER := 0;
  streak_bonus_awarded BOOLEAN := false;
  result jsonb;
BEGIN
  -- Get current user profile
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  -- Check if user already logged in today
  IF user_profile.last_login_date = today_date THEN
    -- User already logged in today, return current streak
    RETURN jsonb_build_object(
      'streak_days', user_profile.streak_days,
      'xp_awarded', 0,
      'streak_bonus_awarded', false,
      'message', 'Already logged in today'
    );
  END IF;
  
  -- Determine new streak
  IF user_profile.last_login_date = yesterday_date THEN
    -- Consecutive login, increment streak
    new_streak := user_profile.streak_days + 1;
  ELSIF user_profile.last_login_date IS NULL OR user_profile.last_login_date < yesterday_date THEN
    -- First login or missed days, reset streak
    new_streak := 1;
  ELSE
    -- This shouldn't happen, but handle it
    new_streak := 1;
  END IF;
  
  -- Check for 7-day streak bonus
  IF new_streak >= 7 AND (new_streak % 7 = 0) THEN
    -- Award streak bonus (only once per 7-day cycle)
    IF user_profile.last_streak_bonus_date IS NULL OR 
       user_profile.last_streak_bonus_date < (today_date - INTERVAL '6 days') THEN
      xp_awarded := 50;
      streak_bonus_awarded := true;
      
      -- Award XP using existing function
      PERFORM public.award_xp(
        p_user_id,
        xp_awarded,
        'weekly_streak_bonus',
        'Completed 7-day login streak',
        jsonb_build_object('streak_days', new_streak, 'bonus_date', today_date)
      );
    END IF;
  END IF;
  
  -- Update profile with new streak and login date
  UPDATE public.profiles
  SET 
    streak_days = new_streak,
    last_login_date = today_date,
    last_streak_bonus_date = CASE 
      WHEN streak_bonus_awarded THEN today_date 
      ELSE last_streak_bonus_date 
    END,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Build result
  result := jsonb_build_object(
    'streak_days', new_streak,
    'xp_awarded', xp_awarded,
    'streak_bonus_awarded', streak_bonus_awarded,
    'message', CASE 
      WHEN streak_bonus_awarded THEN 'Weekly streak bonus earned!'
      WHEN new_streak = 1 THEN 'Login streak started!'
      ELSE 'Login streak continued!'
    END
  );
  
  RETURN result;
END;
$$;