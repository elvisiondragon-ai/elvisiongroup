-- STEP 1: Backup check - verify these columns are truly unused
SELECT
    COUNT(*) as total_rows,
    COUNT(CASE WHEN total_sessions > 0 THEN 1 END) as sessions_used,
    COUNT(CASE WHEN is_premium = true THEN 1 END) as premium_used,
    COUNT(CASE WHEN premium_expires_at IS NOT NULL THEN 1 END) as expiry_used,
    COUNT(CASE WHEN last_notification_time IS NOT NULL THEN 1 END) as notification_used,
    COUNT(CASE WHEN cache_cleared_at IS NOT NULL THEN 1 END) as cache_used
FROM profiles;

-- STEP 2: Remove unused columns (run after confirming STEP 1 shows minimal usage)
ALTER TABLE profiles DROP COLUMN IF EXISTS total_sessions;
ALTER TABLE profiles DROP COLUMN IF EXISTS is_premium;
ALTER TABLE profiles DROP COLUMN IF EXISTS premium_expires_at;
ALTER TABLE profiles DROP COLUMN IF EXISTS last_notification_time;
ALTER TABLE profiles DROP COLUMN IF EXISTS cache_cleared_at;

-- STEP 3: Verify columns were removed
SELECT
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- STEP 4: Update TypeScript types (manual step after SQL)
-- You'll need to regenerate types or update manually:
-- npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts