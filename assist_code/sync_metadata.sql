-- SQL to sync essential profile fields to user_metadata for instant chat access
-- This will update auth.users.raw_user_meta_data with key fields from profiles table

-- Function to sync profile data to user metadata
CREATE OR REPLACE FUNCTION sync_profile_to_metadata()
RETURNS TABLE (
  user_id uuid,
  old_metadata jsonb,
  new_metadata jsonb,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH profile_data AS (
    SELECT 
      p.user_id,
      p.display_name,
      p.level,
      p.is_pro,
      p.achievements,
      p.subscription_type,
      p.total_journal,
      p.total_verses
    FROM profiles p
    WHERE p.display_name IS NOT NULL -- Only sync users with display names
  ),
  metadata_updates AS (
    UPDATE auth.users 
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object(
        'display_name', pd.display_name,
        'level', pd.level,
        'is_pro', COALESCE(pd.is_pro, false),
        'achievements', COALESCE(array_to_json(pd.achievements)::jsonb, '[]'::jsonb),
        'subscription_type', pd.subscription_type,
        'synced_at', EXTRACT(epoch FROM NOW())::bigint
      )
    FROM profile_data pd
    WHERE auth.users.id = pd.user_id
    RETURNING 
      auth.users.id,
      raw_user_meta_data - 'display_name' - 'level' - 'is_pro' - 'achievements' - 'subscription_type' - 'total_journal' - 'total_verses' - 'synced_at' as old_meta,
      raw_user_meta_data as new_meta
  )
  SELECT 
    mu.id,
    mu.old_meta,
    mu.new_meta,
    'SYNCED' as status
  FROM metadata_updates mu;
END;
$$;

-- Execute the sync function
SELECT * FROM sync_profile_to_metadata();

-- Create a trigger function to auto-sync when profile changes
CREATE OR REPLACE FUNCTION auto_sync_profile_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only sync if essential fields changed
  IF (OLD.display_name IS DISTINCT FROM NEW.display_name) OR
     (OLD.level IS DISTINCT FROM NEW.level) OR
     (OLD.is_pro IS DISTINCT FROM NEW.is_pro) OR
     (OLD.achievements IS DISTINCT FROM NEW.achievements) OR
     (OLD.subscription_type IS DISTINCT FROM NEW.subscription_type) OR
     (OLD.total_journal IS DISTINCT FROM NEW.total_journal) OR
     (OLD.total_verses IS DISTINCT FROM NEW.total_verses) THEN
    
    -- Update user metadata
    UPDATE auth.users 
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object(
        'display_name', NEW.display_name,
        'level', NEW.level,
        'is_pro', COALESCE(NEW.is_pro, false),
        'achievements', COALESCE(array_to_json(NEW.achievements)::jsonb, '[]'::jsonb),
        'subscription_type', NEW.subscription_type,
        'synced_at', EXTRACT(epoch FROM NOW())::bigint
      )
    WHERE id = NEW.user_id;
    
    RAISE NOTICE 'Synced profile metadata for user: %', NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS trigger_sync_profile_metadata ON profiles;
CREATE TRIGGER trigger_sync_profile_metadata
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_sync_profile_metadata();

-- Also create trigger for INSERT (new users)
CREATE OR REPLACE FUNCTION auto_sync_new_profile_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Sync new profile to metadata
  UPDATE auth.users 
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'display_name', NEW.display_name,
      'level', NEW.level,
      'is_pro', COALESCE(NEW.is_pro, false),
      'achievements', COALESCE(array_to_json(NEW.achievements)::jsonb, '[]'::jsonb),
      'subscription_type', NEW.subscription_type,
      'synced_at', EXTRACT(epoch FROM NOW())::bigint
    )
  WHERE id = NEW.user_id;
  
  RAISE NOTICE 'Synced new profile metadata for user: %', NEW.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_sync_new_profile_metadata ON profiles;
CREATE TRIGGER trigger_sync_new_profile_metadata
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_sync_new_profile_metadata();

-- Query to verify sync results
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'display_name' as metadata_name,
  au.raw_user_meta_data->>'level' as metadata_level,
  au.raw_user_meta_data->>'is_pro' as metadata_is_pro,
  au.raw_user_meta_data->>'subscription_type' as metadata_sub_type,
  p.display_name as profile_name,
  p.level as profile_level,
  p.is_pro as profile_is_pro,
  p.subscription_type as profile_sub_type
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.user_id
WHERE p.display_name IS NOT NULL
ORDER BY au.created_at DESC
LIMIT 10;

-- Test query to show the metadata structure
SELECT 
  id,
  email,
  raw_user_meta_data
FROM auth.users 
WHERE raw_user_meta_data ? 'display_name'
LIMIT 5;