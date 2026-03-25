-- Create cron job for automatic subscription expiry
-- This will run every hour to expire subscriptions
SELECT cron.schedule(
  'expire-subscriptions-hourly',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/expire-subscriptions',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NDM2MDUsImV4cCI6MjA4OTgwMzYwNX0.2zDvAe28Ho3BWUZC2Sxk7-PopwW0do2139xelPgEwLo"}'::jsonb
    ) as request_id;
  $$
);

-- Safe to drop pro_user table now - no longer needed
DROP TABLE IF EXISTS public.pro_user CASCADE;