-- supabase/migrations/[timestamp]_award_first_avatar_xp.sql

-- Create a function to award XP for the first avatar upload
CREATE OR REPLACE FUNCTION public.award_first_avatar_xp(p_user_id uuid)
RETURNS boolean 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    xp_awarded boolean := FALSE;
    current_avatar_url text;
BEGIN
    -- Check if the user currently has no avatar_url
    SELECT avatar_url INTO current_avatar_url
    FROM public.profiles
    WHERE user_id = p_user_id;

    IF current_avatar_url IS NULL THEN
        -- Award 200 XP and update avatar_url to a non-null value (if it's still null)
        UPDATE public.profiles
        SET 
            experience_points = experience_points + 200,
            -- Optionally, add a flag to prevent re-awarding if avatar_url can be set to NULL again
            -- first_avatar_xp_awarded = TRUE 
            -- (Requires adding first_avatar_xp_awarded column to profiles table)
            updated_at = now()
        WHERE user_id = p_user_id
          AND avatar_url IS NULL; -- Ensure we only update if it's still NULL

        IF FOUND THEN
            xp_awarded := TRUE;
        END IF;
    END IF;

    RETURN xp_awarded;
END;
$$;

-- Grant usage to authenticated users
GRANT EXECUTE ON FUNCTION public.award_first_avatar_xp(uuid) TO authenticated;

-- Optional: Add RLS policy if needed (profiles table should already have RLS)
-- This function is SECURITY DEFINER, so it runs with the privileges of the function owner (supabase_admin)
-- and bypasses RLS on the profiles table for the update operation.
-- However, the `WHERE user_id = p_user_id AND avatar_url IS NULL` clause acts as a safeguard.
