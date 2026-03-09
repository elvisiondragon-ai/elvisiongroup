-- 1. Search for the SPECIFIC Transaction (ID or Email)
SELECT 
    'SPECIFIC_SEARCH' as query_type,
    created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' as time_jakarta,
    event_name,
    status,
    event_id,
    user_data->>'email' as email,
    pixel_id,
    custom_data->>'product_name' as product,
    meta_response
FROM public.pixel_events
WHERE 
    event_id = 'T4427230259419ZQHDD' 
    OR custom_data::text ILIKE '%T4427230259419ZQHDD%'
    OR user_data->>'email' = 'xieheeen@gmail.com'

UNION ALL

-- 2. Search for ANY 'Purchase' event around that time (+/- 30 mins)
-- In case the ID was missing or malformed
SELECT 
    'BROAD_TIME_SEARCH' as query_type,
    created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' as time_jakarta,
    event_name,
    status,
    event_id,
    user_data->>'email' as email,
    pixel_id,
    custom_data->>'product_name' as product,
    meta_response
FROM public.pixel_events
WHERE 
    event_name = 'Purchase'
    AND created_at >= '2026-01-24 15:24:00+00' -- 22:24 WIB
    AND created_at <= '2026-01-24 16:24:00+00' -- 23:24 WIB

ORDER BY time_jakarta DESC;
