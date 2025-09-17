-- ===========================================
-- COMPLETE SUBSCRIPTION SYSTEM VERIFICATION
-- ===========================================
-- Understand the ACTUAL system before making any changes

-- ===========================================
-- 1. CHECK ALL SUBSCRIPTION PLANS
-- ===========================================
SELECT
    'SUBSCRIPTION_PLANS' as table_name,
    id,
    name,
    duration_days,
    price,
    is_active
FROM public.subscription_plans
ORDER BY duration_days;

-- ===========================================
-- 2. CHECK ALL SUBSCRIPTION TYPES IN WAITING_PAYMENT
-- ===========================================
SELECT
    'WAITING_PAYMENT_TYPES' as source,
    subscription_type,
    COUNT(*) as count
FROM public.waiting_payment
GROUP BY subscription_type
ORDER BY subscription_type;

-- ===========================================
-- 3. CHECK ALL SUBSCRIPTION TYPES IN PRO_SUBSCRIPTIONS
-- ===========================================
SELECT
    'PRO_SUBSCRIPTIONS_TYPES' as source,
    subscription_type,
    COUNT(*) as count
FROM public.pro_subscriptions
GROUP BY subscription_type
ORDER BY subscription_type;

-- ===========================================
-- 4. CHECK CURRENT CALCULATE_SUBSCRIPTION_END_DATE FUNCTION
-- ===========================================
SELECT
    'CURRENT_FUNCTION' as info,
    routine_definition
FROM information_schema.routines
WHERE routine_name = 'calculate_subscription_end_date';

-- ===========================================
-- 5. CHECK FOR ANY CONSTRAINTS ON SUBSCRIPTION_TYPE
-- ===========================================
SELECT
    'CONSTRAINTS' as info,
    constraint_name,
    check_clause
FROM information_schema.check_constraints
WHERE check_clause ILIKE '%subscription_type%';

-- ===========================================
-- 6. CHECK FOR ANY REFERENCES TO 'monthly' OR 'yearly'
-- ===========================================
-- Check if monthly/yearly exist anywhere in the data
SELECT 'MONTHLY_YEARLY_CHECK' as info, 'waiting_payment' as table_name, COUNT(*) as count
FROM public.waiting_payment
WHERE subscription_type IN ('monthly', 'yearly')

UNION ALL

SELECT 'MONTHLY_YEARLY_CHECK' as info, 'pro_subscriptions' as table_name, COUNT(*) as count
FROM public.pro_subscriptions
WHERE subscription_type IN ('monthly', 'yearly');

-- ===========================================
-- 7. SUMMARY: WHAT SUBSCRIPTION TYPES ACTUALLY EXIST
-- ===========================================
SELECT 'SUMMARY' as info, 'All unique subscription types found:' as description

UNION ALL

SELECT 'FROM_PLANS', id
FROM public.subscription_plans
WHERE is_active = true

UNION ALL

SELECT 'FROM_WAITING', subscription_type
FROM (SELECT DISTINCT subscription_type FROM public.waiting_payment) w

UNION ALL

SELECT 'FROM_PRO_SUBS', subscription_type
FROM (SELECT DISTINCT subscription_type FROM public.pro_subscriptions) p;