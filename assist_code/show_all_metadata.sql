-- Show all user metadata without any filtering or specifications
-- Just raw data to see what users actually have

SELECT 
  id,
  email,
  raw_user_meta_data,
  raw_app_meta_data
FROM auth.users 
WHERE raw_user_meta_data IS NOT NULL
ORDER BY created_at DESC
LIMIT 3;