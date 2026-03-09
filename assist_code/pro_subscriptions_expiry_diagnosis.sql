-- PRO_SUBSCRIPTIONS EXPIRY DIAGNOSIS AND FIX
-- This file contains diagnostic queries to find why expired users aren't being kicked from pro_subscriptions table
-- Generated: 2025-09-25

-- ============================================================================
-- TABLE SCHEMA REFERENCE
-- ============================================================================
/*
CREATE TABLE public.pro_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    ip_address text,
    subscription_type text DEFAULT 'trial'::text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    subscription_start_date timestamp with time zone,
    subscription_end_date timestamp with time zone,
    amount_paid numeric(10,2),
    currency text DEFAULT 'IDR'::text,
    tripay_reference text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_email text,
    customer_phone text,
    verse_access boolean DEFAULT true,
    pro_badge boolean DEFAULT true,
    days_remaining integer DEFAULT 0 NOT NULL,
    CONSTRAINT vip_subscriptions_status_check CHECK ((status = ANY (ARRAY['active'::text, 'expired'::text, 'cancelled'::text, 'pending'::text])))
);
*/

-- ============================================================================
-- EXPECTED WORKFLOW ANALYSIS
-- ============================================================================
/*
EXPECTED TRIGGERS:
1. calculate_days_remaining_trigger (BEFORE INSERT/UPDATE) - Updates days_remaining
2. auto_cleanup_pro_trigger (BEFORE UPDATE) - Deletes when days_remaining <= 0  
3. update_days_remaining_trigger (BEFORE INSERT/UPDATE) - Backup days calculation

EXPECTED FUNCTIONS:
- cleanup_expired_pro_subscriptions() - Manual cleanup function
- auto_cleanup_pro_on_update() - Auto cleanup trigger function
*/

-- ============================================================================
-- DIAGNOSTIC QUERY #1: FIND EXPIRED USERS STILL ACTIVE
-- ============================================================================
-- This is the main query to identify the problem
SELECT 
    '=== EXPIRED USERS STILL ACTIVE ===' as diagnosis_type,
    id,
    user_id,
    user_email,
    subscription_type,
    status,
    subscription_start_date,
    subscription_end_date,
    days_remaining,
    EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER as actual_days_remaining,
    CASE 
        WHEN subscription_end_date < NOW() THEN 'EXPIRED'
        ELSE 'ACTIVE' 
    END as real_status,
    (NOW() - subscription_end_date) as overdue_by,
    created_at,
    updated_at
FROM public.pro_subscriptions 
WHERE status = 'active' 
AND (
    subscription_end_date < NOW() 
    OR days_remaining <= 0
)
ORDER BY subscription_end_date ASC;

-- ============================================================================
-- DIAGNOSTIC QUERY #2: CHECK TRIGGER STATUS
-- ============================================================================
-- Verify triggers are enabled and functional
SELECT 
    '=== TRIGGER STATUS ===' as diagnosis_type,
    pn.nspname as schemaname,
    pc.relname as tablename, 
    pt.tgname as triggername,
    tgfoid::regproc AS trigger_function,
    CASE tgenabled 
        WHEN 'O' THEN 'ENABLED'
        WHEN 'D' THEN 'DISABLED'
        WHEN 'R' THEN 'REPLICA_ONLY'
        WHEN 'A' THEN 'ALWAYS'
        ELSE 'UNKNOWN'
    END as trigger_status
FROM pg_trigger pt
JOIN pg_class pc ON pt.tgrelid = pc.oid
JOIN pg_namespace pn ON pc.relnamespace = pn.oid
WHERE pc.relname = 'pro_subscriptions'
AND pn.nspname = 'public'
AND NOT tgisinternal
ORDER BY pt.tgname;

-- ============================================================================
-- DIAGNOSTIC QUERY #3: CHECK CLEANUP FUNCTIONS
-- ============================================================================
-- Verify cleanup function exists and get its code
SELECT 
    '=== CLEANUP FUNCTIONS ===' as diagnosis_type,
    p.proname as function_name,
    p.prorettype::regtype as return_type,
    length(p.prosrc) as code_length,
    CASE 
        WHEN p.prosrc LIKE '%DELETE%' THEN 'HAS_DELETE'
        ELSE 'NO_DELETE'
    END as has_delete_logic
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND (p.proname LIKE '%cleanup%' OR p.proname LIKE '%auto_cleanup%')
ORDER BY p.proname;

-- ============================================================================
-- DIAGNOSTIC QUERY #4: ROOT CAUSE ANALYSIS
-- ============================================================================
-- Comprehensive analysis of what should happen vs what is happening
WITH analysis AS (
    SELECT 
        id,
        user_email,
        status,
        subscription_end_date,
        days_remaining,
        EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER as calculated_days,
        CASE 
            WHEN subscription_end_date < NOW() THEN 'EXPIRED'
            WHEN EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER <= 0 THEN 'SHOULD_EXPIRE'
            ELSE 'VALID'
        END as subscription_state,
        CASE 
            WHEN days_remaining != EXTRACT(DAY FROM (subscription_end_date - NOW()))::INTEGER THEN 'DAYS_MISMATCH'
            ELSE 'DAYS_MATCH'
        END as days_sync_status,
        updated_at,
        (NOW() - updated_at) as last_updated_ago
    FROM public.pro_subscriptions
    WHERE status = 'active'
)
SELECT 
    '=== ROOT CAUSE ANALYSIS ===' as diagnosis_type,
    *,
    CASE 
        WHEN subscription_state IN ('EXPIRED', 'SHOULD_EXPIRE') AND status = 'active' THEN '❌ CLEANUP_FAILED'
        WHEN subscription_state = 'VALID' AND status = 'active' THEN '✅ WORKING'
        WHEN days_sync_status = 'DAYS_MISMATCH' THEN '⚠️ SYNC_ISSUE'
        ELSE '❓ UNKNOWN'
    END as diagnosis
FROM analysis
ORDER BY calculated_days ASC;

-- ============================================================================
-- DIAGNOSTIC QUERY #5: CHECK FOR CRON JOBS
-- ============================================================================
-- Check if there are any CRON jobs for cleanup
SELECT 
    '=== CRON JOBS ===' as diagnosis_type,
    jobname,
    schedule,
    command,
    active
FROM cron.job 
WHERE command ILIKE '%pro_subscription%' 
   OR command ILIKE '%cleanup%'
   OR command ILIKE '%expir%'
ORDER BY jobname;

-- ============================================================================
-- DIAGNOSTIC QUERY #6: TRIGGER EXECUTION ISSUES
-- ============================================================================
-- Check when triggers were last executed
SELECT 
    '=== TRIGGER EXECUTION ===' as diagnosis_type,
    user_email,
    status,
    subscription_end_date,
    days_remaining,
    updated_at,
    CASE 
        WHEN updated_at < (NOW() - INTERVAL '24 hours') AND subscription_end_date < NOW() 
        THEN 'TRIGGER_NOT_RUNNING'
        ELSE 'RECENT_UPDATE'
    END as trigger_status
FROM public.pro_subscriptions 
WHERE status = 'active'
AND subscription_end_date < NOW()
ORDER BY updated_at DESC;

-- ============================================================================
-- FIX #1: PREVIEW CLEANUP (SAFE TO RUN)
-- ============================================================================
-- Step 1: Preview what will be cleaned up
SELECT 
    '=== CLEANUP PREVIEW ===' as fix_type,
    COUNT(*) as expired_count,
    string_agg(user_email, ', ') as expired_emails
FROM public.pro_subscriptions 
WHERE status = 'active' 
AND (
    subscription_end_date < NOW() 
    OR days_remaining <= 0
);

-- ============================================================================
-- FIX #2: UPDATE EXPIRED STATUS (SAFE TO RUN)
-- ============================================================================
-- Step 2: Update expired subscriptions to 'expired' status
/*
UPDATE public.pro_subscriptions 
SET 
    status = 'expired',
    updated_at = NOW()
WHERE status = 'active' 
AND (
    subscription_end_date < NOW() 
    OR days_remaining <= 0
);
*/

-- ============================================================================
-- FIX #3: DELETE EXPIRED RECORDS (CAUTION: DELETES DATA)
-- ============================================================================
-- Step 3: Delete expired records (UNCOMMENT TO USE)
/*
DELETE FROM public.pro_subscriptions 
WHERE status = 'expired';
*/

-- ============================================================================
-- FIX #4: CREATE MISSING CRON JOB
-- ============================================================================
-- Create daily cleanup job (UNCOMMENT TO USE)
/*
SELECT cron.schedule(
    'daily-pro-subscription-cleanup',
    '0 2 * * *', -- 2 AM daily
    $$
    -- Update days_remaining to trigger cleanup
    UPDATE public.pro_subscriptions 
    SET updated_at = NOW() 
    WHERE status = 'active' 
    AND subscription_end_date < NOW();
    $$
);
*/

-- ============================================================================
-- ROOT CAUSE ANALYSIS (BASED ON ACTUAL DIAGNOSTIC RESULTS)
-- ============================================================================
/*
🔍 CONFIRMED ROOT ISSUES:

ISSUE #1: EXTERNAL CRON JOB FAILURE ⚠️
- Hourly cron job exists: 'expire-subscriptions-hourly' (0 * * * *)
- BUT: It calls external Supabase Edge Function URL
- PROBLEM: External function is failing or not properly updating database
- EVIDENCE: Expired users still active with "TRIGGER_NOT_RUNNING" status

ISSUE #2: TRIGGER ONLY RUNS ON UPDATES ❌
- auto_cleanup_pro_trigger only executes on UPDATE events
- calculate_days_remaining_trigger only runs on INSERT/UPDATE
- PROBLEM: No triggers fire when time naturally passes
- EVIDENCE: All subscriptions show "DAYS_MISMATCH" - stale days_remaining values

ISSUE #3: STALE DAYS_REMAINING FIELD ❌  
- days_remaining field is never updated unless record is manually touched
- Real calculation shows: actual_days_remaining = -1 (expired)
- Stored value shows: days_remaining = 2 (stale)
- PROBLEM: Cleanup trigger waits for days_remaining <= 0 but it never gets updated

ISSUE #4: EXTERNAL DEPENDENCY FAILURE ⚠️
- System relies on external Supabase Edge Function for cleanup
- If external service fails, no cleanup happens
- EVIDENCE: Multiple users expired 1+ days ago still showing as active

🚨 CRITICAL FINDING:
The cleanup system is completely broken because:
1. External cron function is failing 
2. Internal triggers never fire for time-based expiry
3. days_remaining field becomes permanently stale
4. Users remain "active" indefinitely after expiration

IMMEDIATE ACTIONS NEEDED:
1. Fix external Edge Function OR replace with direct SQL cron
2. Add direct time-based cleanup that doesn't depend on days_remaining field
3. Implement daily trigger to update days_remaining values
4. Clean up current expired users manually
*/

-- ============================================================================
-- USAGE INSTRUCTIONS
-- ============================================================================
/*
1. Run diagnostic queries 1-6 first to identify the issue
2. Review the results to understand what's failing
3. Use Fix #1 to preview what will be cleaned up
4. Use Fix #2 to mark expired subscriptions (safe)
5. Use Fix #3 to delete expired records (only if needed)
6. Use Fix #4 to create automated cleanup (prevents future issues)
7. Monitor the system after implementing fixes
*/