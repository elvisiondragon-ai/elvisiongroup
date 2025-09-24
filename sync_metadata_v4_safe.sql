-- Safe SQL to sync essential profile fields to user_metadata 
-- Drops triggers first, then functions, then recreates everything

-- Step 1: Drop all triggers first (they depend on the functions)
DROP TRIGGER IF EXISTS trigger_auto_sync_metadata ON profiles;
DROP TRIGGER IF EXISTS trigger_sync_profile_metadata ON profiles;
DROP TRIGGER IF EXISTS trigger_sync_new_profile_metadata ON profiles;

-- Step 2: Now safely drop functions (no dependencies remain)
DROP FUNCTION IF EXISTS auto_sync_profile_metadata();
DROP FUNCTION IF EXISTS auto_sync_new_profile_metadata();
DROP FUNCTION IF EXISTS sync_profile_to_metadata();

-- Step 3: Create the new sync function
CREATE OR REPLACE FUNCTION sync_profile_to_metadata()
RETURNS TABLE (
  user_id uuid,
  status text,
  synced_fields text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  sync_count integer := 0;
BEGIN
  -- Update user metadata with essential profile fields only
  WITH profile_data AS (
    SELECT 
      p.user_id,
      p.display_name,
      p.level,
      COALESCE(p.is_pro, false) as is_pro,
      p.achievements,
      p.subscription_type
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
        'is_pro', pd.is_pro,
        'achievements', CASE 
          WHEN pd.achievements IS NOT NULL THEN to_jsonb(pd.achievements)
          ELSE '[]'::jsonb
        END,
        'subscription_type', pd.subscription_type,
        'synced_at', EXTRACT(epoch FROM NOW())::bigint,
        'sync_version', '4.0'
      )
    FROM profile_data pd
    WHERE auth.users.id = pd.user_id
    RETURNING auth.users.id as updated_user_id
  )
  SELECT COUNT(*) INTO sync_count FROM metadata_updates;

  -- Return results for verification
  RETURN QUERY
  SELECT 
    p.user_id,
    'SYNCED'::text as status,
    format('display_name=%s, level=%s, is_pro=%s', 
           p.display_name, p.level::text, p.is_pro::text) as synced_fields
  FROM profiles p
  WHERE p.display_name IS NOT NULL;

  RAISE NOTICE 'Successfully synced % profiles to metadata v4.0', sync_count;
END;
$$;

-- Step 4: Create new trigger function for auto-sync
CREATE OR REPLACE FUNCTION auto_sync_profile_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only sync if essential fields changed
  IF (TG_OP = 'INSERT') OR 
     (OLD.display_name IS DISTINCT FROM NEW.display_name) OR
     (OLD.level IS DISTINCT FROM NEW.level) OR
     (OLD.is_pro IS DISTINCT FROM NEW.is_pro) OR
     (OLD.achievements IS DISTINCT FROM NEW.achievements) OR
     (OLD.subscription_type IS DISTINCT FROM NEW.subscription_type) THEN
    
    -- Update user metadata with essential fields only
    UPDATE auth.users 
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || 
      jsonb_build_object(
        'display_name', NEW.display_name,
        'level', NEW.level,
        'is_pro', COALESCE(NEW.is_pro, false),
        'achievements', CASE 
          WHEN NEW.achievements IS NOT NULL THEN to_jsonb(NEW.achievements)
          ELSE '[]'::jsonb
        END,
        'subscription_type', NEW.subscription_type,
        'synced_at', EXTRACT(epoch FROM NOW())::bigint,
        'sync_version', '4.0'
      )
    WHERE id = NEW.user_id;
    
    RAISE NOTICE 'Auto-synced profile metadata v4.0 for user: % (operation: %)', NEW.user_id, TG_OP;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Step 5: Create the trigger (now that function exists)
CREATE TRIGGER trigger_auto_sync_metadata
  AFTER INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_sync_profile_metadata();

-- Step 6: Execute the sync function
SELECT 'Starting metadata sync v4.0...' as info;
SELECT * FROM sync_profile_to_metadata();

-- Step 7: Verification
SELECT 'Metadata sync verification v4.0:' as info;

SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'display_name' as metadata_name,
  au.raw_user_meta_data->>'level' as metadata_level,
  au.raw_user_meta_data->>'is_pro' as metadata_is_pro,
  au.raw_user_meta_data->>'sync_version' as sync_version
FROM auth.users au
WHERE au.raw_user_meta_data ? 'sync_version'
ORDER BY (au.raw_user_meta_data->>'synced_at')::bigint DESC
LIMIT 5;

SELECT 'Metadata sync v4.0 completed successfully!' as result;