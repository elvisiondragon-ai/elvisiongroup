-- Award 140 XP to user srcindocs@gmail.com
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get the user_id for the email srcindocs@gmail.com
  SELECT user_id INTO target_user_id 
  FROM public.profiles 
  WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'srcindocs@gmail.com'
  );
  
  -- If user found, award XP
  IF target_user_id IS NOT NULL THEN
    PERFORM public.award_xp(
      target_user_id,
      140,
      'admin_bonus',
      'Manual XP award by admin',
      '{"source": "admin_action"}'::jsonb
    );
    RAISE NOTICE 'Successfully awarded 140 XP to user srcindocs@gmail.com';
  ELSE
    RAISE NOTICE 'User with email srcindocs@gmail.com not found';
  END IF;
END $$;