-- QUICK FIX: Remove user_email requirement completely
-- Since it was working before user_email was added, let's remove that constraint

-- 1. Make user_email completely optional
ALTER TABLE public.elite_habits
ALTER COLUMN user_email DROP NOT NULL;

-- 2. Make user_email default to NULL if not provided
ALTER TABLE public.elite_habits
ALTER COLUMN user_email SET DEFAULT NULL;

-- 3. Update the auto-populate function to be more robust
CREATE OR REPLACE FUNCTION public.populate_elite_habit_user_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Only populate if user_email is NULL
    IF NEW.user_email IS NULL THEN
        SELECT email INTO NEW.user_email
        FROM auth.users
        WHERE id = NEW.user_id;

        -- If we can't find email, set to empty string
        IF NEW.user_email IS NULL THEN
            NEW.user_email := '';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Test with the exact same pattern as the working code before
INSERT INTO public.elite_habits (user_id, exercise_type, duration_minutes, date)
SELECT
    u.id,
    'QUICK TEST',
    5,
    CURRENT_DATE::TEXT
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
LIMIT 1;

-- 5. Check if it worked
SELECT 'QUICK TEST RESULT' as status,
       COUNT(*) as total_records,
       MAX(created_at) as latest_entry
FROM public.elite_habits
WHERE exercise_type = 'QUICK TEST';