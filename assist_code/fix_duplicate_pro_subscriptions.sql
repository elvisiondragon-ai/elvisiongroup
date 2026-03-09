-- ===========================================
-- FIX DUPLICATE PRO SUBSCRIPTIONS - KEEP LONGEST
-- ===========================================

-- 1. Find users with multiple pro subscriptions
SELECT
    user_id,
    user_email,
    COUNT(*) as subscription_count,
    array_agg(subscription_type) as types,
    array_agg(days_remaining) as days_array,
    MAX(subscription_end_date) as longest_expires
FROM pro_subscriptions
WHERE status = 'active'
GROUP BY user_id, user_email
HAVING COUNT(*) > 1
ORDER BY subscription_count DESC;

-- 2. For each duplicate user, keep only the subscription with longest expiry
-- Delete shorter subscriptions, keep the longest one
WITH ranked_subscriptions AS (
    SELECT
        id,
        user_id,
        user_email,
        subscription_type,
        subscription_end_date,
        days_remaining,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY subscription_end_date DESC, days_remaining DESC
        ) as rank
    FROM pro_subscriptions
    WHERE status = 'active'
)
DELETE FROM pro_subscriptions
WHERE id IN (
    SELECT id
    FROM ranked_subscriptions
    WHERE rank > 1
);

-- 3. Verify no more duplicates
SELECT
    user_id,
    user_email,
    subscription_type,
    days_remaining,
    subscription_end_date,
    'Single subscription per user' as status
FROM pro_subscriptions
WHERE status = 'active'
ORDER BY subscription_end_date DESC;