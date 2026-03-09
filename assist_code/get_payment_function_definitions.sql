-- Get payment function definitions for security fixing
-- These are the highest priority due to financial impact

SELECT 
    '=== CRITICAL PAYMENT: ' || routine_name || ' ===' as separator,
    routine_name,
    routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
      'process_tripay_payment_callback',
      'confirm_payment_make_pro', 
      'create_pending_payment'
  )
ORDER BY 
    CASE routine_name
        WHEN 'process_tripay_payment_callback' THEN 1
        WHEN 'confirm_payment_make_pro' THEN 2  
        WHEN 'create_pending_payment' THEN 3
    END;