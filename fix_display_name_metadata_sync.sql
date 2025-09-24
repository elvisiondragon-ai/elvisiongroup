-- Fix display_name metadata sync issue
-- This populates auth.users.raw_user_meta_data.display_name from profiles.display_name

-- 1. First, check current state of display_name data
SELECT 
    'Current State Analysis' as info,
    COUNT(*) as total_users,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' IS NOT NULL 
               AND trim(au.raw_user_meta_data->>'display_name') != '' THEN 1 END) as has_metadata_display_name,
    COUNT(CASE WHEN p.display_name IS NOT NULL 
               AND trim(p.display_name) != '' THEN 1 END) as has_profile_display_name,
    COUNT(CASE WHEN (au.raw_user_meta_data->>'display_name' IS NULL 
                     OR trim(au.raw_user_meta_data->>'display_name') = '')
               AND p.display_name IS NOT NULL 
               AND trim(p.display_name) != '' THEN 1 END) as needs_metadata_sync
FROM auth.users au
LEFT JOIN profiles p ON p.user_id = au.id;

-- 2. Show specific users that need metadata sync
SELECT 
    'Users needing metadata sync:' as info,
    au.id,
    au.email,
    au.raw_user_meta_data->>'display_name' as current_metadata_display_name,
    p.display_name as profile_display_name,
    au.created_at
FROM auth.users au
LEFT JOIN profiles p ON p.user_id = au.id
WHERE (au.raw_user_meta_data->>'display_name' IS NULL 
       OR trim(au.raw_user_meta_data->>'display_name') = ''
       OR au.raw_user_meta_data->>'display_name' = 'Anonymous')
  AND p.display_name IS NOT NULL 
  AND trim(p.display_name) != ''
ORDER BY au.created_at DESC
LIMIT 20;

-- 3. UPDATE: Populate metadata display_name from profiles display_name
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
                        jsonb_build_object('display_name', profiles.display_name)
FROM profiles 
WHERE auth.users.id = profiles.user_id
  AND profiles.display_name IS NOT NULL 
  AND trim(profiles.display_name) != ''
  AND (auth.users.raw_user_meta_data->>'display_name' IS NULL 
       OR trim(auth.users.raw_user_meta_data->>'display_name') = ''
       OR auth.users.raw_user_meta_data->>'display_name' = 'Anonymous');

-- 4. Verify the update worked
SELECT 
    'After Update Analysis' as info,
    COUNT(*) as total_users,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' IS NOT NULL 
               AND trim(au.raw_user_meta_data->>'display_name') != '' 
               AND au.raw_user_meta_data->>'display_name' != 'Anonymous' THEN 1 END) as has_valid_metadata_display_name,
    COUNT(CASE WHEN p.display_name IS NOT NULL 
               AND trim(p.display_name) != '' THEN 1 END) as has_profile_display_name,
    COUNT(CASE WHEN (au.raw_user_meta_data->>'display_name' IS NULL 
                     OR trim(au.raw_user_meta_data->>'display_name') = ''
                     OR au.raw_user_meta_data->>'display_name' = 'Anonymous')
               AND p.display_name IS NOT NULL 
               AND trim(p.display_name) != '' THEN 1 END) as still_needs_sync
FROM auth.users au
LEFT JOIN profiles p ON p.user_id = au.id;

-- 5. Show sample of updated users
SELECT 
    'Updated users sample:' as info,
    au.id,
    au.email,
    au.raw_user_meta_data->>'display_name' as metadata_display_name,
    p.display_name as profile_display_name,
    CASE 
        WHEN au.raw_user_meta_data->>'display_name' = p.display_name THEN '✅ Synced'
        ELSE '❌ Mismatch'
    END as sync_status
FROM auth.users au
LEFT JOIN profiles p ON p.user_id = au.id
WHERE p.display_name IS NOT NULL 
  AND trim(p.display_name) != ''
ORDER BY au.updated_at DESC
LIMIT 10;

-- 6. Handle edge case: Users with email-based fallback names
-- This updates users whose profiles have email-based names but metadata is empty
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
                        jsonb_build_object('display_name', split_part(auth.users.email, '@', 1))
WHERE (raw_user_meta_data->>'display_name' IS NULL 
       OR trim(raw_user_meta_data->>'display_name') = ''
       OR raw_user_meta_data->>'display_name' = 'Anonymous')
  AND email IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.users.id 
        AND profiles.display_name IS NOT NULL 
        AND trim(profiles.display_name) != ''
  );

-- 7. Final verification - show problem users that still need manual attention
SELECT 
    'Still problematic users:' as info,
    au.id,
    au.email,
    au.raw_user_meta_data->>'display_name' as metadata_display_name,
    p.display_name as profile_display_name,
    split_part(au.email, '@', 1) as email_fallback,
    au.created_at
FROM auth.users au
LEFT JOIN profiles p ON p.user_id = au.id
WHERE (au.raw_user_meta_data->>'display_name' IS NULL 
       OR trim(au.raw_user_meta_data->>'display_name') = ''
       OR au.raw_user_meta_data->>'display_name' = 'Anonymous')
ORDER BY au.created_at DESC
LIMIT 5;

-- 8. Create a function for future automatic syncing
CREATE OR REPLACE FUNCTION sync_display_name_to_metadata()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Sync from profiles to auth metadata
    UPDATE auth.users 
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
                            jsonb_build_object('display_name', profiles.display_name),
        updated_at = now()
    FROM profiles 
    WHERE auth.users.id = profiles.user_id
      AND profiles.display_name IS NOT NULL 
      AND trim(profiles.display_name) != ''
      AND (auth.users.raw_user_meta_data->>'display_name' IS NULL 
           OR trim(auth.users.raw_user_meta_data->>'display_name') = ''
           OR auth.users.raw_user_meta_data->>'display_name' = 'Anonymous'
           OR auth.users.raw_user_meta_data->>'display_name' != profiles.display_name);
           
    -- Log the sync operation
    RAISE NOTICE 'Display name metadata sync completed at %', now();
END;
$$;

-- 9. Test the function
SELECT sync_display_name_to_metadata();

-- 10. Show final summary
SELECT 
    'FINAL SUMMARY' as status,
    COUNT(*) as total_users,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' IS NOT NULL 
               AND trim(au.raw_user_meta_data->>'display_name') != '' 
               AND au.raw_user_meta_data->>'display_name' != 'Anonymous' THEN 1 END) as users_with_valid_metadata,
    COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' = 'Anonymous' 
               OR au.raw_user_meta_data->>'display_name' IS NULL 
               OR trim(au.raw_user_meta_data->>'display_name') = '' THEN 1 END) as users_still_anonymous,
    ROUND(
        (COUNT(CASE WHEN au.raw_user_meta_data->>'display_name' IS NOT NULL 
                     AND trim(au.raw_user_meta_data->>'display_name') != '' 
                     AND au.raw_user_meta_data->>'display_name' != 'Anonymous' THEN 1 END) * 100.0) 
        / COUNT(*), 2
    ) as success_percentage
FROM auth.users au;