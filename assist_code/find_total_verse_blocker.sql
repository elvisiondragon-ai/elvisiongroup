-- This SQL job identifies why the 'total_verses' count in the 'profiles' table is not updated when the daily XP limit is reached.

-- 1. Inspect the 'award_xp' function
-- This is the primary function responsible for awarding XP and updating user statistics.
SELECT
    'AWARD_XP FUNCTION DEFINITION' as info,
    pg_get_functiondef(p.oid) as function_code
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'award_xp';

-- 2. Explanation of the blocking mechanism
SELECT
    'BLOCKING MECHANISM EXPLANATION' as info,
    'The award_xp function contains the logic for both the daily XP limit and for incrementing total_verses.

    The function first checks the daily XP earned by the user.
    If the user has reached the 30 XP daily limit, the function returns immediately.
    You can see this in the function body with the code:
    "IF remaining_xp <= 0 THEN RETURN jsonb_build_object(...); END IF;"

    The code that increments the "total_verses" count is located *after* this check.
    "total_verses = CASE WHEN p_activity_type IN (''verse_completion'', ''audio_completion'') THEN COALESCE(total_verses, 0) + 1 ELSE COALESCE(total_verses, 0) END"

    Therefore, when the daily XP limit is reached, the function exits before it can execute the update to "total_verses".
    This is the reason why "total_verses" is not incremented once the daily XP limit is hit.' as explanation;

-- 3. To verify, you can check the daily XP of a user who you suspect has this issue.
-- Replace 'user_id_to_check' with the actual user_id.
SELECT
    user_id,
    SUM(xp_amount) as total_xp_today
FROM
    public.xp_transactions
WHERE
    user_id = 'user_id_to_check' AND DATE(created_at) = CURRENT_DATE
GROUP BY
    user_id;
