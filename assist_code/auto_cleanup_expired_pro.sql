-- Auto cleanup expired/cancelled pro subscriptions
-- Remove users from pro_subscriptions table when cancelled or days_remaining <= 0

-- 1. Create function to cleanup expired/cancelled subscriptions
CREATE OR REPLACE FUNCTION public.cleanup_expired_pro_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete cancelled subscriptions
  DELETE FROM public.pro_subscriptions 
  WHERE status = 'cancelled';
  
  -- Delete expired subscriptions (days_remaining <= 0)
  DELETE FROM public.pro_subscriptions 
  WHERE days_remaining <= 0;
  
  -- Delete subscriptions past end date
  DELETE FROM public.pro_subscriptions 
  WHERE subscription_end_date < now();
  
  RAISE NOTICE 'Cleaned up expired/cancelled pro subscriptions';
END;
$$;

-- 2. Create trigger function to auto-cleanup on UPDATE
CREATE OR REPLACE FUNCTION public.auto_cleanup_pro_on_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If status changed to cancelled, delete the record
  IF NEW.status = 'cancelled' THEN
    DELETE FROM public.pro_subscriptions WHERE id = NEW.id;
    RETURN NULL; -- Don't insert/update, record is deleted
  END IF;
  
  -- If days_remaining becomes 0 or negative, delete the record
  IF NEW.days_remaining <= 0 THEN
    DELETE FROM public.pro_subscriptions WHERE id = NEW.id;
    RETURN NULL; -- Don't insert/update, record is deleted
  END IF;
  
  -- If subscription_end_date is past, delete the record
  IF NEW.subscription_end_date < now() THEN
    DELETE FROM public.pro_subscriptions WHERE id = NEW.id;
    RETURN NULL; -- Don't insert/update, record is deleted
  END IF;
  
  RETURN NEW; -- Allow normal update
END;
$$;

-- 3. Create trigger on pro_subscriptions
DROP TRIGGER IF EXISTS auto_cleanup_pro_trigger ON public.pro_subscriptions;
CREATE TRIGGER auto_cleanup_pro_trigger
  BEFORE UPDATE ON public.pro_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_cleanup_pro_on_update();

-- 4. Clean up existing expired/cancelled records immediately
SELECT public.cleanup_expired_pro_subscriptions();

-- 5. Verify the cleanup worked - should show no records for srcindocs@gmail.com
SELECT * FROM public.pro_subscriptions WHERE user_email = 'srcindocs@gmail.com';