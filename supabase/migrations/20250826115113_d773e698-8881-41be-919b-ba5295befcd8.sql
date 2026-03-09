-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Create cron job for automatic subscription expiry (runs every hour)
SELECT cron.schedule(
  'expire-subscriptions-hourly',
  '0 * * * *', -- Every hour at minute 0
  $$
  SELECT
    net.http_post(
        url:='https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/expire-subscriptions',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw"}'::jsonb
    ) as request_id;
  $$
);

-- Safe to drop pro_user table now - no longer needed
DROP TABLE IF EXISTS public.pro_user CASCADE;