-- Check what handle_daily_login function does
SELECT
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_daily_login'
AND routine_schema = 'public';

-- Test the function (run this first to see current behavior)
SELECT handle_daily_login('YOUR_USER_ID_HERE');