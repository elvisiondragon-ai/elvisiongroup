-- Fix UUID comparison error in trigger functions
-- The error "operator does not exist: uuid = text" happens because of type mismatch

-- 1. Check current trigger functions
SELECT 
    p.proname as function_name,
    p.prosrc as function_body
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
  AND p.proname IN ('update_total_journal_count', 'update_total_journal_count_delete')
ORDER BY p.proname;

-- 2. Fix the update_total_journal_count function (for INSERT/UPDATE)
CREATE OR REPLACE FUNCTION update_total_journal_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_journal count in profiles table
    UPDATE profiles
    SET total_journal = (
        SELECT COUNT(*)
        FROM reflections
        WHERE user_id = NEW.user_id  -- Direct UUID comparison, no casting needed
    )
    WHERE user_id = NEW.user_id;  -- Direct UUID comparison

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Fix the update_total_journal_count_delete function (for DELETE)  
CREATE OR REPLACE FUNCTION update_total_journal_count_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_journal count in profiles table
    UPDATE profiles
    SET total_journal = (
        SELECT COUNT(*)
        FROM reflections
        WHERE user_id = OLD.user_id  -- Direct UUID comparison, no casting needed
    )
    WHERE user_id = OLD.user_id;  -- Direct UUID comparison

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 4. Test the fixed functions by checking data types
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN ('profiles', 'reflections')
  AND column_name = 'user_id'
ORDER BY table_name;

-- 5. Verify triggers are still working
SELECT 
    t.trigger_name,
    t.event_manipulation,
    t.action_timing,
    t.action_statement
FROM information_schema.triggers t
WHERE t.event_object_table = 'reflections'
ORDER BY t.trigger_name;