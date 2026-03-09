-- 1. Make specific user NON-PRO (cancel subscription)
UPDATE pro_subscriptions 
SET 
  status = 'cancelled',
  subscription_end_date = NOW(),
  updated_at = NOW()
WHERE user_email = 'user@example.com' 
  AND status = 'active';

-- Also remove from pro_user table if exists
UPDATE pro_user 
SET 
  status = 'cancelled',
  end_date = NOW(),
  updated_at = NOW()
WHERE email = 'user@example.com' 
  AND status = 'active';

-- Remove 'pro' achievement from profiles
UPDATE profiles 
SET achievements = array_remove(achievements, 'pro')
WHERE user_id IN (
  SELECT ps.user_id 
  FROM pro_subscriptions ps 
  WHERE ps.user_email = 'user@example.com'
);

-- 2. Bulk cancel all expired subscriptions
UPDATE pro_subscriptions 
SET 
  status = 'expired',
  updated_at = NOW()
WHERE status = 'active' 
  AND subscription_end_date < NOW();

-- 3. Remove PRO achievements from expired users
UPDATE profiles 
SET achievements = array_remove(achievements, 'pro')
WHERE user_id IN (
  SELECT ps.user_id 
  FROM pro_subscriptions ps 
  WHERE ps.status = 'expired'
    AND ps.subscription_end_date < NOW()
);

-- 4. Find and remove duplicate subscriptions (keep latest)
WITH duplicates AS (
  SELECT 
    user_email,
    COUNT(*) as subscription_count,
    array_agg(id ORDER BY created_at DESC) as subscription_ids
  FROM pro_subscriptions 
  WHERE status = 'active'
  GROUP BY user_email 
  HAVING COUNT(*) > 1
)
UPDATE pro_subscriptions 
SET 
  status = 'duplicate_cancelled',
  updated_at = NOW()
WHERE id IN (
  SELECT unnest(subscription_ids[2:]) -- Keep first (latest), cancel rest
  FROM duplicates
);

-- 5. Query to see duplicates before removing
SELECT 
  user_email,
  COUNT(*) as duplicate_count,
  string_agg(
    subscription_type || ' (' || status || ') - ' || created_at::date::text, 
    ', ' 
    ORDER BY created_at DESC
  ) as subscriptions
FROM pro_subscriptions 
WHERE status IN ('active', 'pending')
GROUP BY user_email 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 6. Clean up old expired records (optional - keep for history)
DELETE FROM pro_subscriptions 
WHERE status = 'expired' 
  AND subscription_end_date < NOW() - INTERVAL '6 months';

-- 7. Function to safely cancel a user's PRO status
CREATE OR REPLACE FUNCTION cancel_user_pro(p_email TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_record RECORD;
  result jsonb;
BEGIN
  -- Cancel active subscriptions
  UPDATE pro_subscriptions 
  SET 
    status = 'cancelled',
    subscription_end_date = NOW(),
    updated_at = NOW()
  WHERE user_email = p_email 
    AND status = 'active';
  
  -- Remove from pro_user table
  UPDATE pro_user 
  SET 
    status = 'cancelled',
    end_date = NOW(),
    updated_at = NOW()
  WHERE email = p_email 
    AND status = 'active';
  
  -- Remove pro achievement
  UPDATE profiles 
  SET achievements = array_remove(achievements, 'pro')
  WHERE user_id IN (
    SELECT ps.user_id 
    FROM pro_subscriptions ps 
    WHERE ps.user_email = p_email
  );
  
  result := jsonb_build_object(
    'success', true,
    'message', 'User PRO status cancelled successfully',
    'email', p_email,
    'cancelled_at', NOW()
  );
  
  RETURN result;
END;
$$;

-- 8. Function to remove duplicates safely
CREATE OR REPLACE FUNCTION remove_duplicate_subscriptions()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  duplicates_count INTEGER;
BEGIN
  -- Cancel duplicate subscriptions (keep latest)
  WITH duplicates AS (
    SELECT 
      user_email,
      array_agg(id ORDER BY created_at DESC) as subscription_ids
    FROM pro_subscriptions 
    WHERE status = 'active'
    GROUP BY user_email 
    HAVING COUNT(*) > 1
  )
  UPDATE pro_subscriptions 
  SET 
    status = 'duplicate_cancelled',
    updated_at = NOW()
  WHERE id IN (
    SELECT unnest(subscription_ids[2:]) 
    FROM duplicates
  );
  
  GET DIAGNOSTICS duplicates_count = ROW_COUNT;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Duplicate subscriptions removed',
    'duplicates_removed', duplicates_count,
    'processed_at', NOW()
  );
END;
$$;