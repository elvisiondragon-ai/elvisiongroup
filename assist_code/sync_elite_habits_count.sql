-- Sync elite habits count from elite_habits table to profiles table
-- This ensures all existing and future data stays synchronized

-- First, update all existing users' total_elite_habit count based on actual elite_habits records
UPDATE public.profiles
SET total_elite_habit = (
    SELECT COUNT(*)
    FROM public.elite_habits
    WHERE elite_habits.user_id = profiles.user_id
)
WHERE user_id IS NOT NULL;

-- Create a function to automatically update total_elite_habit when elite_habits changes
CREATE OR REPLACE FUNCTION public.sync_elite_habit_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the profiles table with the new count
    UPDATE public.profiles
    SET total_elite_habit = (
        SELECT COUNT(*)
        FROM public.elite_habits
        WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    )
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically sync count on INSERT, UPDATE, DELETE
DROP TRIGGER IF EXISTS sync_elite_habit_count_insert ON public.elite_habits;
CREATE TRIGGER sync_elite_habit_count_insert
    AFTER INSERT ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_elite_habit_count();

DROP TRIGGER IF EXISTS sync_elite_habit_count_delete ON public.elite_habits;
CREATE TRIGGER sync_elite_habit_count_delete
    AFTER DELETE ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_elite_habit_count();

-- Optional: Trigger for UPDATE (in case user_id changes, though unlikely)
DROP TRIGGER IF EXISTS sync_elite_habit_count_update ON public.elite_habits;
CREATE TRIGGER sync_elite_habit_count_update
    AFTER UPDATE ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_elite_habit_count();

-- Verify the sync worked by showing current counts
SELECT
    p.user_id,
    p.total_elite_habit as profile_count,
    COALESCE(h.habit_count, 0) as actual_count,
    CASE
        WHEN p.total_elite_habit = COALESCE(h.habit_count, 0) THEN '✅ SYNCED'
        ELSE '❌ NOT SYNCED'
    END as status
FROM public.profiles p
LEFT JOIN (
    SELECT user_id, COUNT(*) as habit_count
    FROM public.elite_habits
    GROUP BY user_id
) h ON p.user_id = h.user_id
WHERE p.user_id IS NOT NULL
ORDER BY p.user_id;