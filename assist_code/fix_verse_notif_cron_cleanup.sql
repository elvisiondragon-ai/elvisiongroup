-- Fix verse_notif cron job cleanup
-- Remove duplicate jobs and create single working cleanup job

-- 1. Remove both existing verse_notif cleanup jobs
SELECT cron.unschedule('clean-verse-notif-daily');
SELECT cron.unschedule('cleanup-old-verse-notifs');

-- 2. Create new single verse_notif cleanup job
-- Runs daily at 3 AM Jakarta time, keeps records for 3 days
SELECT cron.schedule(
  'verse-notif-cleanup',
  '0 3 * * *',  -- Daily at 3 AM Jakarta time
  $$ 
  DELETE FROM public.verse_notif 
  WHERE created_at < (NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '3 days';
  $$
);

-- 3. Check records before cleanup
SELECT 
  COUNT(*) as records_before_cleanup,
  COUNT(CASE WHEN created_at < (NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '3 days' THEN 1 END) as records_to_delete
FROM public.verse_notif;

-- 4. Test the cleanup job manually (run immediately)
WITH deleted_records AS (
  DELETE FROM public.verse_notif 
  WHERE created_at < (NOW() AT TIME ZONE 'Asia/Jakarta') - INTERVAL '3 days'
  RETURNING id
)
SELECT 
  'Records deleted from verse_notif older than 3 days' as message,
  COUNT(*) as deleted_count
FROM deleted_records;

-- 5. Verify the new cron job is created
SELECT 
    jobid,
    jobname,
    schedule,
    active,
    command
FROM cron.job 
WHERE jobname = 'verse-notif-cleanup';

-- 6. Check current verse_notif records count
SELECT 
  COUNT(*) as total_records,
  MIN(created_at) as oldest_record,
  MAX(created_at) as newest_record
FROM public.verse_notif;