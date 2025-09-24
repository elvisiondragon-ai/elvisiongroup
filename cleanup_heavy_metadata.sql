-- Remove heavy fields from existing metadata
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data - 'total_verses' - 'total_journal' - 'total_elite_habit'
WHERE raw_user_meta_data ? 'total_verses' 
   OR raw_user_meta_data ? 'total_journal' 
   OR raw_user_meta_data ? 'total_elite_habit';

-- Verify cleanup worked
SELECT 
  email,
  raw_user_meta_data ? 'total_verses' as still_has_verses,
  raw_user_meta_data ? 'total_journal' as still_has_journal,
  raw_user_meta_data->>'display_name' as name
FROM auth.users 
WHERE raw_user_meta_data IS NOT NULL
LIMIT 3;