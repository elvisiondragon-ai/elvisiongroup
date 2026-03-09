-- Analyze functions that need search_path security fixes
-- This will show current function definitions to understand what needs fixing

-- 1. Check critical payment-related functions first
SELECT 
    'payment_functions' as category,
    routine_name,
    routine_type,
    security_type,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
      'process_tripay_payment_callback',
      'create_pending_payment',
      'confirm_payment_make_pro',
      'cleanup_expired_waiting_payments',
      'cleanup_expired_pro_subscriptions',
      'handle_subscription_upgrade'
  )
ORDER BY routine_name;

-- 2. Check a sample of other functions to understand the pattern
SELECT 
    'sample_functions' as category,
    routine_name,
    routine_type,
    security_type,
    length(routine_definition) as def_length,
    CASE 
        WHEN routine_definition LIKE '%SET search_path%' THEN 'HAS_SEARCH_PATH'
        ELSE 'NEEDS_SEARCH_PATH'
    END as search_path_status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
      'enhanced_admin_role_access_log',
      'handle_new_user_trial',
      'check_sensitive_data_rate_limit',
      'handle_updated_at',
      'add_achievement'
  )
ORDER BY routine_name;

-- 3. Count all functions that need fixing
SELECT 
    'function_count_summary' as category,
    COUNT(*) as total_functions,
    COUNT(CASE WHEN routine_definition LIKE '%SET search_path%' THEN 1 END) as functions_with_search_path,
    COUNT(CASE WHEN routine_definition NOT LIKE '%SET search_path%' THEN 1 END) as functions_needing_fix
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION';

-- 4. List all function names that need search_path fix
SELECT 
    'functions_needing_fix' as category,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_type = 'FUNCTION'
  AND routine_definition NOT LIKE '%SET search_path%'
ORDER BY 
    CASE 
        WHEN routine_name LIKE '%payment%' OR routine_name LIKE '%tripay%' OR routine_name LIKE '%pro%' THEN 1
        ELSE 2
    END,
    routine_name;