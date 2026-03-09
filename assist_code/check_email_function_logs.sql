-- Check if email function is working by looking at recent signups
SELECT
    user_email,
    created_at,
    'Check if welcome email was sent' as action_needed
FROM profiles
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 10;

-- You can also check Supabase function logs:
-- 1. Go to Supabase Dashboard
-- 2. Navigate to Functions > send-signup-email
-- 3. Check the Logs tab for recent invocations and errors