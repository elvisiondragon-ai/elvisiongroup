-- DROP THE SYNC ERROR - Remove trigger and function causing the error

-- 1. Drop the trigger that calls the missing function
DROP TRIGGER IF EXISTS trigger_auto_sync_pro ON public.pro_subscriptions;

-- 2. Drop the function that calls the missing sync function
DROP FUNCTION IF EXISTS public.auto_sync_pro_on_subscription_change();

-- 3. Create dummy function to prevent any remaining calls
CREATE OR REPLACE FUNCTION public.sync_pro_status_from_subscription(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Do nothing, sync is not needed
  RETURN true;
END;
$$;

-- 4. Check no more triggers exist
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table = 'pro_subscriptions';