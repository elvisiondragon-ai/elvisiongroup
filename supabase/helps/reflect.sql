-- Check reflections table schema to find the UUID mismatch issue
-- The error suggests there's a data type problem

-- 1. Check reflections table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'reflections'
  AND table_schema = 'public'
ORDER BY ordinal_position;

| column_name | data_type                | is_nullable | column_default    |
| ----------- | ------------------------ | ----------- | ----------------- |
| id          | uuid                     | NO          | gen_random_uuid() |
| user_id     | text                     | NO          | null              |
| user_email  | text                     | NO          | null              |
| reflection  | text                     | NO          | null              |
| created_at  | timestamp with time zone | YES         | now()             |
| updated_at  | timestamp with time zone | YES         | now()             |

-- 2. Compare user_id types between tables
SELECT 
    'profiles' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'user_id'
UNION ALL
SELECT 
    'reflections' as table_name,
    column_name,
    data_type,
    is_nullable  
FROM information_schema.columns
WHERE table_name = 'reflections' AND column_name = 'user_id'
UNION ALL
SELECT 
    'elite_habits' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'elite_habits' AND column_name = 'user_id'
ORDER BY table_name;

| table_name   | column_name | data_type | is_nullable |
| ------------ | ----------- | --------- | ----------- |
| elite_habits | user_id     | uuid      | NO          |
| profiles     | user_id     | uuid      | NO          |
| reflections  | user_id     | text      | NO          |

-- 3. Check current trigger function definitions
SELECT 
    proname as function_name,
    prosrc as function_body
FROM pg_proc 
WHERE proname IN ('update_total_journal_count', 'update_total_journal_count_delete');

| function_name                     | function_body                                                                                                                                                                                                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| update_total_journal_count        | 
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
 |
| update_total_journal_count_delete | 
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
 |