-- Drop existing view if it exists
DROP VIEW IF EXISTS pro_subscriptions_admin_view;

-- Create admin view for pro_subscriptions with reordered columns
CREATE VIEW pro_subscriptions_admin_view AS
SELECT 
  id,
  user_id,
  user_email,
  status,
  subscription_type,
  subscription_start_date,
  subscription_end_date,
  trial_start_date,
  trial_end_date,
  amount_paid,
  currency,
  created_at,
  updated_at,
  -- Add helper columns for display
  (SELECT display_name FROM profiles WHERE user_id = ps.user_id) as display_name,
  CASE 
    WHEN status = 'active' AND subscription_type = 'trial' AND trial_end_date > now() THEN 'Active Trial'
    WHEN status = 'active' AND subscription_type IN ('monthly', 'yearly', 'weekly', 'daily') AND (subscription_end_date IS NULL OR subscription_end_date > now()) THEN 'Active Subscription'
    WHEN status = 'expired' THEN 'Expired'
    WHEN status = 'pending' THEN 'Pending Activation'
    ELSE status
  END as readable_status
FROM pro_subscriptions ps
ORDER BY created_at DESC;

-- Create function to manually update subscription status with duration
CREATE OR REPLACE FUNCTION update_subscription_status_manually(
  p_subscription_id UUID,
  p_status TEXT,
  p_subscription_type TEXT,
  p_duration_type TEXT DEFAULT 'monthly'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  subscription_record RECORD;
  new_end_date TIMESTAMP WITH TIME ZONE;
  result JSONB;
BEGIN
  -- Check if user is admin
  IF NOT is_verified_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only verified admins can manually update subscription status';
  END IF;
  
  -- Get the subscription
  SELECT * INTO subscription_record
  FROM pro_subscriptions
  WHERE id = p_subscription_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Subscription not found';
  END IF;
  
  -- Calculate end date based on duration type
  IF p_status = 'active' AND p_subscription_type != 'trial' THEN
    CASE p_duration_type
      WHEN 'daily' THEN new_end_date := now() + INTERVAL '1 day';
      WHEN 'weekly' THEN new_end_date := now() + INTERVAL '1 week';
      WHEN 'monthly' THEN new_end_date := now() + INTERVAL '1 month';
      WHEN 'yearly' THEN new_end_date := now() + INTERVAL '1 year';
      ELSE new_end_date := now() + INTERVAL '1 month'; -- Default to monthly
    END CASE;
  END IF;
  
  -- Update the subscription
  UPDATE pro_subscriptions
  SET 
    status = p_status,
    subscription_type = p_subscription_type,
    subscription_start_date = CASE 
      WHEN p_status = 'active' AND p_subscription_type != 'trial' THEN now()
      ELSE subscription_start_date
    END,
    subscription_end_date = CASE 
      WHEN p_status = 'active' AND p_subscription_type != 'trial' THEN new_end_date
      ELSE subscription_end_date
    END,
    updated_at = now()
  WHERE id = p_subscription_id;
  
  -- Sync pro status for the user
  PERFORM sync_pro_status_from_subscription(subscription_record.user_id);
  
  -- Log the manual update
  PERFORM log_sensitive_action(
    'manual_subscription_update',
    'pro_subscriptions',
    p_subscription_id,
    jsonb_build_object(
      'admin_user', auth.uid(),
      'target_user', subscription_record.user_id,
      'old_status', subscription_record.status,
      'new_status', p_status,
      'old_type', subscription_record.subscription_type,
      'new_type', p_subscription_type,
      'duration_type', p_duration_type,
      'new_end_date', new_end_date
    )
  );
  
  result := jsonb_build_object(
    'success', true,
    'subscription_id', p_subscription_id,
    'status', p_status,
    'subscription_type', p_subscription_type,
    'end_date', new_end_date,
    'message', 'Subscription updated successfully'
  );
  
  RETURN result;
END;
$$;