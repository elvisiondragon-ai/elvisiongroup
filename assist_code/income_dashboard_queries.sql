-- This file contains the SQL queries for the Admin Income Dashboard.
-- These queries will be executed from the frontend using the Supabase client.

-- Query 1: Get Income Data for ALL TIME
-- Fetches total quantity and sum of amounts for all paid products, grouped by product name.
SELECT
    product_name,
    COUNT(*) AS quantity_sold,
    SUM(amount) AS total_paid
FROM
    global_product
WHERE
    status = 'PAID'
GROUP BY
    product_name
ORDER BY
    product_name;

-- Query 2: Get Total Income for ALL TIME
-- Calculates the grand total of all paid products.
SELECT SUM(amount) as grand_total
FROM global_product
WHERE status = 'PAID';


-- Query 3: Get Income Data for LAST 30 DAYS
-- Fetches the same data as Query 1, but limited to records from the last 30 days.
-- NOTE: Assumes a 'created_at' column of type timestamp/timestamptz exists.
SELECT
    product_name,
    COUNT(*) AS quantity_sold,
    SUM(amount) AS total_paid
FROM
    global_product
WHERE
    status = 'PAID' AND
    created_at >= NOW() - INTERVAL '30 days'
GROUP BY
    product_name
ORDER BY
    product_name;

-- Query 4: Get Total Income for LAST 30 DAYS
-- Calculates the grand total for all paid products in the last 30 days.
SELECT SUM(amount) as grand_total
FROM global_product
WHERE status = 'PAID' AND created_at >= NOW() - INTERVAL '30 days';
