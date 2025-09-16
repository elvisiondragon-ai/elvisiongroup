-- COMPLETE FIX FOR ELITE HABITS STORAGE ISSUES
-- This script will nuke and recreate the entire elite_habits system properly

-- 1. DROP ALL EXISTING ELITE HABITS RELATED OBJECTS
DROP TRIGGER IF EXISTS sync_elite_habit_count_insert ON public.elite_habits;
DROP TRIGGER IF EXISTS sync_elite_habit_count_delete ON public.elite_habits;
DROP TRIGGER IF EXISTS sync_elite_habit_count_update ON public.elite_habits;
DROP TRIGGER IF EXISTS handle_elite_habits_updated_at ON public.elite_habits;

DROP FUNCTION IF EXISTS public.sync_elite_habit_count();
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Remove policies
DROP POLICY IF EXISTS "Users can view own elite habits" ON public.elite_habits;
DROP POLICY IF EXISTS "Users can insert own elite habits" ON public.elite_habits;
DROP POLICY IF EXISTS "Users can update own elite habits" ON public.elite_habits;
DROP POLICY IF EXISTS "Users can delete own elite habits" ON public.elite_habits;

-- Drop indexes
DROP INDEX IF EXISTS elite_habits_user_id_idx;
DROP INDEX IF EXISTS elite_habits_date_idx;
DROP INDEX IF EXISTS elite_habits_created_at_idx;

-- Drop the table completely
DROP TABLE IF EXISTS public.elite_habits CASCADE;

-- 2. RECREATE ELITE_HABITS TABLE WITH PROPER SCHEMA
CREATE TABLE public.elite_habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    exercise_type TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ADD TOTAL_ELITE_HABIT COLUMN TO PROFILES (IF NOT EXISTS)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS total_elite_habit INTEGER DEFAULT 0;

-- Reset all existing counts to 0 first
UPDATE public.profiles SET total_elite_habit = 0;

-- 4. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.elite_habits ENABLE ROW LEVEL SECURITY;

-- 5. CREATE RLS POLICIES
CREATE POLICY "Users can view own elite habits" ON public.elite_habits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own elite habits" ON public.elite_habits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own elite habits" ON public.elite_habits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own elite habits" ON public.elite_habits
    FOR DELETE USING (auth.uid() = user_id);

-- 6. CREATE PERFORMANCE INDEXES
CREATE INDEX elite_habits_user_id_idx ON public.elite_habits(user_id);
CREATE INDEX elite_habits_date_idx ON public.elite_habits(date);
CREATE INDEX elite_habits_created_at_idx ON public.elite_habits(created_at);
CREATE INDEX elite_habits_user_email_idx ON public.elite_habits(user_email);

-- 7. CREATE UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. CREATE UPDATED_AT TRIGGER
CREATE TRIGGER handle_elite_habits_updated_at
    BEFORE UPDATE ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 9. CREATE USER_EMAIL AUTO-POPULATE TRIGGER
CREATE OR REPLACE FUNCTION public.populate_elite_habit_user_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-populate user_email from auth.users
    IF NEW.user_email IS NULL THEN
        SELECT email INTO NEW.user_email
        FROM auth.users
        WHERE id = NEW.user_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER populate_elite_habit_user_email_trigger
    BEFORE INSERT ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.populate_elite_habit_user_email();

-- 10. CREATE SYNC FUNCTION FOR TOTAL_ELITE_HABIT COUNT
CREATE OR REPLACE FUNCTION public.sync_elite_habit_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the profiles table with the new count for the affected user
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

-- 11. CREATE SYNC TRIGGERS (INSERT, UPDATE, DELETE)
CREATE TRIGGER sync_elite_habit_count_insert
    AFTER INSERT ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_elite_habit_count();

CREATE TRIGGER sync_elite_habit_count_update
    AFTER UPDATE ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_elite_habit_count();

CREATE TRIGGER sync_elite_habit_count_delete
    AFTER DELETE ON public.elite_habits
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_elite_habit_count();

-- 12. TEST THE SYSTEM WITH SAMPLE DATA (Replace with real user_id)
-- Get the first real user from auth.users for testing
DO $$
DECLARE
    test_user_id UUID;
    test_user_email TEXT;
BEGIN
    -- Get a real user for testing
    SELECT id, email INTO test_user_id, test_user_email
    FROM auth.users
    LIMIT 1;

    IF test_user_id IS NOT NULL THEN
        -- Insert test elite habit
        INSERT INTO public.elite_habits (
            user_id,
            user_email,
            exercise_type,
            duration_minutes,
            date
        ) VALUES (
            test_user_id,
            test_user_email,
            'Plank',
            10,
            CURRENT_DATE::TEXT
        );

        RAISE NOTICE 'Test elite habit inserted for user: %', test_user_email;
    ELSE
        RAISE NOTICE 'No users found for testing';
    END IF;
END $$;

-- 13. VERIFY THE FIX
SELECT
    'VERIFICATION RESULTS' as status,
    COUNT(*) as total_elite_habits
FROM public.elite_habits;

SELECT
    p.user_id,
    u.email,
    p.total_elite_habit as profile_count,
    COALESCE(h.actual_count, 0) as actual_count,
    CASE
        WHEN p.total_elite_habit = COALESCE(h.actual_count, 0) THEN '✅ SYNCED'
        ELSE '❌ NOT SYNCED'
    END as sync_status
FROM public.profiles p
LEFT JOIN auth.users u ON p.user_id = u.id
LEFT JOIN (
    SELECT user_id, COUNT(*) as actual_count
    FROM public.elite_habits
    GROUP BY user_id
) h ON p.user_id = h.user_id
WHERE p.user_id IS NOT NULL
ORDER BY p.created_at DESC
LIMIT 10;

-- 14. FINAL MESSAGE
SELECT '🚀 ELITE HABITS SYSTEM COMPLETELY REBUILT AND READY!' as final_status;