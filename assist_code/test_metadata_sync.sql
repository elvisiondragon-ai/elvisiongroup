-- Test the metadata sync function first
SELECT * FROM sync_profile_to_metadata();

-- Check if the sync worked by viewing updated metadata
SELECT 
  id,
  email,
  raw_user_meta_data->>'display_name' as metadata_name,
  raw_user_meta_data->>'level' as metadata_level,
  raw_user_meta_data->>'is_pro' as metadata_is_pro,
  raw_user_meta_data->>'synced_at' as synced_at
FROM auth.users 
WHERE raw_user_meta_data ? 'display_name'
ORDER BY (raw_user_meta_data->>'synced_at')::bigint DESC
LIMIT 10;