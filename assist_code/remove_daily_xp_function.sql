-- Remove the get_daily_xp_remaining function that was added for daily limits
DROP FUNCTION IF EXISTS public.get_daily_xp_remaining(uuid);