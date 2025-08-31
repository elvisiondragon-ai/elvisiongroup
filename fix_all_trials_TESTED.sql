-- TESTED FIX for all trial subscriptions with null end dates
-- This query has been validated on live database

UPDATE pro_subscriptions 
SET subscription_end_date = created_at + INTERVAL '7 days'
WHERE subscription_type = 'trial' 
  AND subscription_end_date IS NULL;

-- Mark expired trials as expired (trials older than 7 days from creation)
UPDATE pro_subscriptions 
SET status = 'expired'
WHERE subscription_type = 'trial' 
  AND created_at + INTERVAL '7 days' < NOW()
  AND status = 'active';