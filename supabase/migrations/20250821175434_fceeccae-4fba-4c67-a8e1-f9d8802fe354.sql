-- Remove SECURITY DEFINER from view and create a proper function for admin access
DROP VIEW IF EXISTS pro_subscriptions_admin_view;

-- Create a regular view without SECURITY DEFINER
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