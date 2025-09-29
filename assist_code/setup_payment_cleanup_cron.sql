-- Setup cron job for cleaning up expired payments
-- This creates a PostgreSQL cron job using pg_cron extension

-- First, ensure pg_cron extension is enabled (run as superuser)
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cron job to run every hour (Jakarta time)
-- This will delete pending payments older than 24 hours using Jakarta timezone
SELECT cron.schedule(
  'cleanup-expired-payments',           -- job name
  '0 * * * *',                         -- every hour at minute 0
  $$ 
  DELETE FROM waiting_payment 
  WHERE status = 'pending' 
    AND created_at < (NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '24 hours';
  $$
);

-- Alternative: Run every 6 hours instead (at 00:00, 06:00, 12:00, 18:00 Jakarta time)
-- SELECT cron.schedule(
--   'cleanup-expired-payments',
--   '0 */6 * * *',
--   $$ 
--   DELETE FROM waiting_payment 
--   WHERE status = 'pending' 
--     AND created_at < (NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '24 hours';
--   $$
-- );

-- View scheduled jobs
-- SELECT * FROM cron.job;

-- To remove the job later:
-- SELECT cron.unschedule('cleanup-expired-payments');