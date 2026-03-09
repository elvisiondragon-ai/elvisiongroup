-- This SQL job checks for verse completion activities from users who do not have a profile.

-- 1. Find verse completion activities for users without a profile
-- This query will show us if there are any verse completion activities from users who do not have a corresponding entry in the 'profiles' table.
SELECT
    'MISSING PROFILES' as info,
    ua.user_id,
    ua.activity_type,
    ua.created_at
FROM public.user_activities ua
LEFT JOIN public.profiles p ON ua.user_id = p.user_id
WHERE ua.activity_type IN ('verse_completion', 'audio_completion')
  AND p.user_id IS NULL
ORDER BY ua.created_at DESC
LIMIT 10;

-- 2. Propose a fix if missing profiles are the issue
SELECT
    'PROPOSED FIX' as info,
    'If the query above returns any rows, it means that the trigger is firing for users who do not have a profile yet. The fix is to make the increment_total_verses function more robust by adding a check to create a profile if one does not exist.

    Here is the SQL to apply the fix:
    ' as explanation,
    'CREATE OR REPLACE FUNCTION public.increment_total_verses()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        -- First, ensure a profile exists for the user.
        INSERT INTO public.profiles (user_id, level, experience_points)
        VALUES (NEW.user_id, 1, 0)
        ON CONFLICT (user_id) DO NOTHING;

        -- Now, update the total_verses count.
        UPDATE public.profiles
        SET total_verses = COALESCE(total_verses, 0) + 1
        WHERE user_id = NEW.user_id;

        RETURN NEW;
    END;
    $$;' as fix_sql;
