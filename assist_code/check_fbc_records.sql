-- Check recent global_product records to see fbc/fbp status
SELECT 
    id, 
    created_at, 
    merchant_ref, 
    product_name, 
    status, 
    fbc, 
    fbp,
    CASE WHEN fbc IS NULL THEN 'MISSING' ELSE 'OK' END as fbc_status
FROM 
    global_product
ORDER BY 
    created_at DESC
LIMIT 20;
