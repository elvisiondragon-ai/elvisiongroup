-- ===========================================
-- CHECK FOR BACKDOOR PRO ACCESS
-- ===========================================

-- 1. Get the check_unified_pro_status function definition
SELECT routine_definition
FROM information_schema.routines
WHERE routine_name = 'check_unified_pro_status';

-- 2. Test with trial2 and trial_sam to see if they get unauthorized pro access
SELECT * FROM check_unified_pro_status('1388e8fc-22fd-4e49-8008-cca9ce79c4ed'); -- trial2
SELECT * FROM check_unified_pro_status('75abc8b0-4011-4762-9846-516be2fc7960'); -- trial_sam

-- 3. These should return isPro=false since they're not in pro_subscriptions
-- If they return isPro=true, there's a security vulnerability