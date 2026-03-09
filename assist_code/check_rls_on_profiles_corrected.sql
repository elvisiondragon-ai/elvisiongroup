-- This SQL job checks for Row-Level Security (RLS) policies on the 'profiles' table (corrected version).

-- 1. List RLS policies on the profiles table
-- This query will show us if there are any RLS policies enabled on the 'profiles' table.
SELECT
    'RLS POLICIES ON PROFILES' as info,
    pol.polname as policy_name,
    cls.relname as table_name,
    pol.polcmd as command,
    pol.polqual as policy_definition
FROM pg_policy pol
JOIN pg_class cls ON pol.polrelid = cls.oid
WHERE cls.relname = 'profiles';

-- 2. Propose a fix if RLS is the issue
SELECT
    'PROPOSED FIX' as info,
    'If the query above shows any RLS policies, the issue is almost certainly that the increment_total_verses function is being blocked by RLS.

    The solution is to alter the function to run with SECURITY DEFINER, which bypasses RLS. This is the same approach used by the award_xp function.

    Here is the SQL to apply the fix:
    ' as explanation,
    'CREATE OR REPLACE FUNCTION public.increment_total_verses()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      UPDATE public.profiles
      SET total_verses = COALESCE(total_verses, 0) + 1
      WHERE user_id = NEW.user_id;
      RETURN NEW;
    END;
    $$;' as fix_sql;
