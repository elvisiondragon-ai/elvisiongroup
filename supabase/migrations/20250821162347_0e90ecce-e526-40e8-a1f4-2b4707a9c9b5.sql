-- Grant hendi a 30-day subscription and pro status
INSERT INTO vip_subscriptions (
  user_id, 
  subscription_type, 
  status, 
  subscription_start_date, 
  subscription_end_date,
  amount_paid,
  currency
) VALUES (
  '8fa357c9-4450-4e90-b3c9-6886f7159287'::uuid,
  'monthly',
  'active',
  now(),
  now() + interval '30 days',
  25000,
  'IDR'
);

-- Manually sync pro status for hendi (the trigger should handle this automatically, but let's make sure)
SELECT sync_pro_status_from_subscription('8fa357c9-4450-4e90-b3c9-6886f7159287'::uuid);