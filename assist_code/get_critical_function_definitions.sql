-- Get the actual definitions of the most critical functions for manual security fixing
-- These functions handle payments and admin privileges - highest security priority

-- 1. PAYMENT FUNCTIONS (HIGHEST PRIORITY)
SELECT 
    '=== PAYMENT FUNCTION: ' || routine_name || ' ===' as separator,
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
      'process_tripay_payment_callback',
      'confirm_payment_make_pro', 
      'create_pending_payment'
  )
ORDER BY routine_name;

-- 2. PAYMENT ACCESS CONTROL FUNCTIONS
SELECT 
    '=== PAYMENT ACCESS: ' || routine_name || ' ===' as separator,
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
      'validate_payment_access',
      'enhanced_payment_access_control',
      'get_secure_payment_transaction'
  )
ORDER BY routine_name;

-- 3. ADMIN VERIFICATION FUNCTIONS  
SELECT 
    '=== ADMIN FUNCTIONS: ' || routine_name || ' ===' as separator,
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
      'verify_admin_with_failsafe',
      'is_verified_admin',
      'grant_admin_role'
  )
ORDER BY routine_name;