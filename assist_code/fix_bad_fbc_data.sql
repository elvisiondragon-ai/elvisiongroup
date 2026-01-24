-- 🔍 1. IDENTIFY BAD RECORDS
-- Count how many records have the test fbc
SELECT count(*) as bad_fbc_count 
FROM global_product 
WHERE fbc LIKE '%TEST_CLICK%';

-- View the bad records to confirm they are safe to modify
SELECT id, email, product_name, amount, status, fbc, created_at
FROM global_product 
WHERE fbc LIKE '%TEST_CLICK%';

-- 🛠️ 2. FIX THE DATA (Choose one option)

-- Option A: NULLIFY the bad FBC (Keeps the transaction record, just removes the bad tracking data)
-- Recommended if you want to keep the invoice/order history.
UPDATE global_product
SET fbc = NULL
WHERE fbc LIKE '%TEST_CLICK%';

-- Option B: DELETE the test records entirely
-- Recommended if these were just junk test orders that mess up your revenue stats.
-- DELETE FROM global_product
-- WHERE fbc LIKE '%TEST_CLICK%';
