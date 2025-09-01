-- FIXED ADMIN COMMANDS - TESTED VERSION
-- First, let's check the actual table structure

-- Check payment_transactions table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payment_transactions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check pro_subscriptions table structure  
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pro_subscriptions' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- ========================================
-- DISABLE SECURITY TRIGGER FOR ADMIN OPERATIONS
-- ========================================
-- Run this first to allow admin grants
DROP TRIGGER IF EXISTS prevent_unauthorized_pro_trigger ON public.pro_subscriptions;

-- ========================================
-- 1. FIND ALL USER PRO STATUS (TESTED)
-- ========================================
SELECT 
    ps.user_id,
    u.email,
    ps.subscription_type,
    ps.tripay_reference,
    ps.subscription_start_date,
    ps.subscription_end_date,
    EXTRACT(DAY FROM ps.subscription_end_date - NOW())::INTEGER as days_remaining,
    ps.status
FROM public.pro_subscriptions ps
JOIN auth.users u ON ps.user_id = u.id
WHERE ps.status = 'active'
ORDER BY ps.subscription_end_date DESC;

-- ========================================
-- 2. FIND ALL USER PROFILES (TESTED)
-- ========================================
SELECT 
    u.id as user_id,
    u.email,
    p.level,
    CASE 
        WHEN ps.subscription_end_date > NOW() THEN 'PRO'
        ELSE 'FREE'
    END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.user_id
LEFT JOIN public.pro_subscriptions ps ON u.id = ps.user_id AND ps.status = 'active'
ORDER BY u.email;

-- ========================================
-- 3. DELETE ALL TRIAL SUBSCRIPTIONS (FIXED)
-- ========================================
-- First find trials
SELECT 
    ps.id,
    ps.user_id,
    u.email,
    ps.subscription_type,
    ps.status,
    ps.created_at
FROM public.pro_subscriptions ps
JOIN auth.users u ON ps.user_id = u.id
WHERE ps.subscription_type ILIKE '%trial%' 
   OR ps.status ILIKE '%trial%';

-- Delete trials (execute after reviewing above)
DELETE FROM public.pro_subscriptions 
WHERE subscription_type ILIKE '%trial%' 
   OR status ILIKE '%trial%';

-- ========================================
-- 4. GRANT PRO USER - ADMIN METHOD (FIXED)
-- ========================================
-- Method A: Grant by EMAIL
INSERT INTO public.pro_subscriptions (
    user_id,
    user_email, 
    subscription_type,
    subscription_start_date,
    subscription_end_date,
    status,
    tripay_reference,
    amount_paid,
    currency
)
SELECT 
    u.id,
    u.email,
    '1_month',
    NOW(),
    NOW() + INTERVAL '30 days',
    'active',
    'ADMIN_GRANT_' || EXTRACT(EPOCH FROM NOW())::TEXT,
    0,
    'IDR'
FROM auth.users u
WHERE u.email = 'srcindocs@gmail.com' -- CHANGE THIS EMAIL
ON CONFLICT (user_id) DO UPDATE SET
    subscription_type = EXCLUDED.subscription_type,
    subscription_start_date = EXCLUDED.subscription_start_date,
    subscription_end_date = EXCLUDED.subscription_end_date,
    status = EXCLUDED.status,
    updated_at = NOW();

-- Method B: Grant by USER_ID  
INSERT INTO public.pro_subscriptions (
    user_id,
    user_email,
    subscription_type,
    subscription_start_date,
    subscription_end_date,
    status,
    tripay_reference,
    amount_paid,
    currency
)
SELECT 
    u.id,
    u.email,
    '1_month',
    NOW(),
    NOW() + INTERVAL '30 days',
    'active',
    'ADMIN_GRANT_' || EXTRACT(EPOCH FROM NOW())::TEXT,
    0,
    'IDR'
FROM auth.users u
WHERE u.id = 'ed289706-acf5-4af5-9301-2bfb0128f0f5' -- CHANGE THIS USER_ID
ON CONFLICT (user_id) DO UPDATE SET
    subscription_type = EXCLUDED.subscription_type,
    subscription_start_date = EXCLUDED.subscription_start_date,
    subscription_end_date = EXCLUDED.subscription_end_date,
    status = EXCLUDED.status,
    updated_at = NOW();

-- ========================================
-- 5. CANCEL PRO USER (FIXED)
-- ========================================
-- Cancel by EMAIL
UPDATE public.pro_subscriptions 
SET 
    status = 'cancelled_by_admin',
    subscription_end_date = NOW(),
    updated_at = NOW()
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'user@example.com' -- CHANGE EMAIL
) 
AND status = 'active';

-- Cancel by USER_ID
UPDATE public.pro_subscriptions 
SET 
    status = 'cancelled_by_admin', 
    subscription_end_date = NOW(),
    updated_at = NOW()
WHERE user_id = 'c644f60a-2f41-41fa-8814-b698c5154474' -- CHANGE USER_ID
AND status = 'active';

-- ========================================
-- 6. VIEW ALL PAYMENT TRANSACTIONS (FIXED)
-- ========================================
-- Check what columns exist first
SELECT * FROM public.payment_transactions LIMIT 1;

-- Basic payment transaction view (adjust columns based on your table)
SELECT 
    pt.id as transaction_id,
    pt.created_at,
    u.email as user_email,
    pt.user_id,
    pt.amount,
    pt.status,
    pt.tripay_reference,
    pt.user_phone,
    pt.user_full_name,
    pt.user_email_payment,
    pt.completed_at,
    CASE 
        WHEN pt.status = 'paid' THEN '✅ SUCCESS'
        WHEN pt.status = 'pending' THEN '⏳ WAITING'  
        WHEN pt.status = 'failed' THEN '❌ FAILED'
        ELSE pt.status
    END as status_display
FROM public.payment_transactions pt
JOIN auth.users u ON pt.user_id = u.id
ORDER BY pt.created_at DESC;

-- Show only completed payments
SELECT 
    pt.created_at,
    u.email,
    pt.amount,
    pt.tripay_reference,
    pt.completed_at
FROM public.payment_transactions pt
JOIN auth.users u ON pt.user_id = u.id
WHERE pt.status = 'paid'
ORDER BY pt.completed_at DESC;

-- Show pending payments
SELECT 
    pt.created_at,
    u.email,
    pt.amount,
    pt.tripay_reference,
    pt.user_phone,
    pt.user_full_name,
    EXTRACT(HOUR FROM NOW() - pt.created_at) as hours_waiting
FROM public.payment_transactions pt
JOIN auth.users u ON pt.user_id = u.id  
WHERE pt.status = 'pending'
ORDER BY pt.created_at DESC;

-- ========================================
-- SIMPLE ADMIN HELPERS (TESTED)
-- ========================================
-- Quick user lookup by email
SELECT 
    u.id,
    u.email,
    u.created_at,
    ps.subscription_type,
    ps.subscription_end_date,
    ps.status,
    CASE WHEN ps.subscription_end_date > NOW() THEN 'ACTIVE PRO' ELSE 'FREE' END as current_status
FROM auth.users u
LEFT JOIN public.pro_subscriptions ps ON u.id = ps.user_id AND ps.status = 'active'
WHERE u.email = 'srcindocs@gmail.com'; -- CHANGE EMAIL

-- Count summary
SELECT 'Total Users' as type, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Active Pro', COUNT(*) FROM public.pro_subscriptions WHERE status = 'active' AND subscription_end_date > NOW()
UNION ALL  
SELECT 'Pending Payments', COUNT(*) FROM public.payment_transactions WHERE status = 'pending'
UNION ALL
SELECT 'Paid Transactions', COUNT(*) FROM public.payment_transactions WHERE status = 'paid';

-- ========================================
-- RE-ENABLE SECURITY TRIGGER AFTER ADMIN WORK
-- ========================================
-- Run this after you're done with admin operations
CREATE TRIGGER prevent_unauthorized_pro_trigger
    BEFORE INSERT ON public.pro_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_unauthorized_pro();