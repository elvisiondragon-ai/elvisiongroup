-- ===========================================
-- FIX UNAUTHORIZED PRO ACCESS
-- ===========================================

-- 1. Check what check_unified_pro_status function does
SELECT routine_definition
FROM information_schema.routines
WHERE routine_name = 'check_unified_pro_status';

-- 2. Test with trial users to see if they get pro access
-- Replace with actual user IDs from the query results above
SELECT * FROM check_unified_pro_status('1388e8fc-22fd-4e49-8008-cca9ce79c4ed'); -- trial2
SELECT * FROM check_unified_pro_status('75abc8b0-4011-4762-9846-516be2fc7960'); -- trial_sam

-- 3. Check if these users have any hardcoded pro access in the function
-- This will reveal if there's backdoor pro access for trial users