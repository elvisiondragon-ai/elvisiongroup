-- Manual cleanup script for expired payments (Jakarta time)
-- Run this manually if you don't want to use cron jobs

-- First, check how many expired pending payments exist (using Jakarta time)
SELECT 
  COUNT(*) as expired_pending_payments,
  MIN(created_at) as oldest_payment,
  MAX(created_at) as newest_expired_payment,
  (NOW() AT TIME ZONE 'Asia/Jakarta') as current_jakarta_time
FROM waiting_payment 
WHERE status = 'pending' 
  AND created_at < (NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '24 hours';

-- Preview the records that will be deleted
SELECT 
  id,
  user_email,
  customer_phone,
  subscription_type,
  amount_paid,
  tripay_reference,
  created_at,
  (NOW() AT TIME ZONE 'Asia/Jakarta') as current_jakarta_time,
  EXTRACT(EPOCH FROM ((NOW() AT TIME ZONE 'Asia/Jakarta') - created_at))/3600 as hours_old
FROM waiting_payment 
WHERE status = 'pending' 
  AND created_at < (NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '24 hours'
ORDER BY created_at ASC;

-- Delete the expired pending payments (Jakarta time)
-- UNCOMMENT THE LINE BELOW TO ACTUALLY DELETE
-- DELETE FROM waiting_payment WHERE status = 'pending' AND created_at < (NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '24 hours';

-- After deletion, verify cleanup
-- SELECT COUNT(*) FROM waiting_payment WHERE status = 'pending';