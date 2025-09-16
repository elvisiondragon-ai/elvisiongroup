-- ADMIN COMMANDS FOR PRO USER MANAGEMENT
-- Copy these queries to Supabase SQL Editor as needed

-- ========================================
-- 1. FIND ALL USER PRO STATUS
-- ========================================
SELECT 
    ps.user_id,
    u.email,
    ps.subscription_type,
    ps.tripay_reference,
    ps.subscription_start_date,
    ps.subscription_end_date,
    EXTRACT(DAY FROM ps.subscription_end_date - NOW())::INTEGER as days_remaining,
    ps.status,
    CASE WHEN ps.subscription_end_date > NOW() THEN true ELSE false END as verse_access,
    CASE WHEN ps.subscription_end_date > NOW() THEN true ELSE false END as pro_badge
FROM public.pro_subscriptions ps
JOIN auth.users u ON ps.user_id = u.id
WHERE ps.status = 'active'
ORDER BY ps.subscription_end_date DESC;

-- ========================================
-- 2. FIND ALL USER PROFILES WITH PRO STATUS
-- ========================================
SELECT 
    p.user_id,
    u.email,
    p.level,
    CASE 
        WHEN ps.subscription_end_date > NOW() THEN 'PRO'
        ELSE 'FREE'
    END as status,
    CASE WHEN ps.subscription_end_date > NOW() THEN true ELSE false END as verse_access,
    CASE WHEN ps.subscription_end_date > NOW() THEN true ELSE false END as pro_badge,
    ps.subscription_type,
    ps.subscription_end_date
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id
LEFT JOIN public.pro_subscriptions ps ON p.user_id = ps.user_id AND ps.status = 'active'
ORDER BY u.email;

-- ========================================
-- 3. FIND AND DELETE ALL TRIAL SUBSCRIPTIONS
-- ========================================

-- First, find all trial subscriptions
SELECT 
    id,
    user_id,
    u.email,
    subscription_type,
    status,
    created_at
FROM public.pro_subscriptions ps
JOIN auth.users u ON ps.user_id = u.id
WHERE subscription_type = 'trial' 
   OR subscription_type ILIKE '%trial%'
   OR status = 'trial';

-- DELETE ALL TRIAL SUBSCRIPTIONS (EXECUTE AFTER REVIEWING ABOVE)
DELETE FROM public.pro_subscriptions 
WHERE subscription_type = 'trial' 
   OR subscription_type ILIKE '%trial%'
   OR status = 'trial';

-- ========================================
-- 4. GRANT PRO USER (1_month) BY EMAIL OR USER_ID
-- ========================================

-- Method A: Grant Pro by EMAIL
DO $$
DECLARE
    target_user_id UUID;
    user_email TEXT := 'user@example.com'; -- CHANGE THIS EMAIL
BEGIN
    -- Get user ID from email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Delete any existing subscription for this user
    DELETE FROM public.pro_subscriptions 
    WHERE user_id = target_user_id;
    
    -- Insert new Pro subscription
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
    ) VALUES (
        target_user_id,
        user_email,
        '1_month',
        NOW(),
        NOW() + INTERVAL '30 days',
        'active',
        'ADMIN_GRANT_' || EXTRACT(EPOCH FROM NOW())::TEXT,
        0, -- Admin granted, no payment
        'IDR'
    );
    
    RAISE NOTICE 'Pro access granted to user: %', user_email;
END $$;

-- Method B: Grant Pro by USER_ID
DO $$
DECLARE
    target_user_id UUID := 'USER_ID_HERE'; -- CHANGE THIS USER_ID
    user_email TEXT;
BEGIN
    -- Get email from user ID
    SELECT email INTO user_email 
    FROM auth.users 
    WHERE id = target_user_id;
    
    IF user_email IS NULL THEN
        RAISE EXCEPTION 'User with ID % not found', target_user_id;
    END IF;
    
    -- Delete any existing subscription
    DELETE FROM public.pro_subscriptions 
    WHERE user_id = target_user_id;
    
    -- Insert new Pro subscription
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
    ) VALUES (
        target_user_id,
        user_email,
        '1_month',
        NOW(),
        NOW() + INTERVAL '30 days',
        'active',
        'ADMIN_GRANT_' || EXTRACT(EPOCH FROM NOW())::TEXT,
        0,
        'IDR'
    );
    
    RAISE NOTICE 'Pro access granted to user: %', user_email;
END $$;

-- ========================================
-- 5. CANCEL PRO USER BY EMAIL OR USER_ID
-- ========================================

-- Method A: Cancel Pro by EMAIL
DO $$
DECLARE
    user_email TEXT := 'user@example.com'; -- CHANGE THIS EMAIL
BEGIN
    UPDATE public.pro_subscriptions 
    SET 
        status = 'cancelled_by_admin',
        subscription_end_date = NOW(),
        updated_at = NOW()
    WHERE user_id IN (
        SELECT id FROM auth.users WHERE email = user_email
    ) AND status = 'active';
    
    RAISE NOTICE 'Pro access cancelled for user: %', user_email;
END $$;

-- Method B: Cancel Pro by USER_ID
DO $$
DECLARE
    target_user_id UUID := 'USER_ID_HERE'; -- CHANGE THIS USER_ID
BEGIN
    UPDATE public.pro_subscriptions 
    SET 
        status = 'cancelled_by_admin',
        subscription_end_date = NOW(),
        updated_at = NOW()
    WHERE user_id = target_user_id AND status = 'active';
    
    RAISE NOTICE 'Pro access cancelled for user ID: %', target_user_id;
END $$;

-- ========================================
-- 6. VIEW ALL PAYMENT TRANSACTIONS (ADMIN MONITORING)
-- ========================================

-- Complete payment transaction history with user details
SELECT 
    pt.id as transaction_id,
    pt.created_at,
    u.email as user_email,
    pt.user_id,
    pt.subscription_type,
    pt.payment_method,
    pt.amount,
    pt.currency,
    pt.status,
    pt.tripay_reference,
    pt.callback_data,
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
    pt.subscription_type,
    pt.amount,
    pt.tripay_reference,
    pt.callback_data->'payment_method' as payment_method_used,
    pt.completed_at
FROM public.payment_transactions pt
JOIN auth.users u ON pt.user_id = u.id
WHERE pt.status = 'paid'
ORDER BY pt.completed_at DESC;

-- Show pending payments (users who clicked but didn't pay)
SELECT 
    pt.created_at,
    u.email,
    pt.subscription_type,
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
-- QUICK ADMIN HELPERS
-- ========================================

-- Count users by status
SELECT 
    'Total Users' as category,
    COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
    'Active Pro Users' as category,
    COUNT(*) as count
FROM public.pro_subscriptions ps
WHERE ps.status = 'active' AND ps.subscription_end_date > NOW()
UNION ALL
SELECT 
    'Pending Payments' as category,
    COUNT(*) as count
FROM public.payment_transactions
WHERE status = 'pending'
UNION ALL
SELECT 
    'Completed Payments' as category,
    COUNT(*) as count
FROM public.payment_transactions
WHERE status = 'paid';

-- Find user by email (quick lookup)
-- Change the email in the WHERE clause
SELECT 
    u.id as user_id,
    u.email,
    u.created_at as user_since,
    ps.subscription_type,
    ps.subscription_end_date,
    ps.status as pro_status,
    CASE WHEN ps.subscription_end_date > NOW() THEN '✅ ACTIVE PRO' ELSE '❌ FREE USER' END as current_status
FROM auth.users u
LEFT JOIN public.pro_subscriptions ps ON u.id = ps.user_id AND ps.status = 'active'
WHERE u.email = 'user@example.com'; -- CHANGE THIS EMAIL