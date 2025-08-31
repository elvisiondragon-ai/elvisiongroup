-- Fix broadcast notifications
-- The issue is likely with permissions or table references

-- Step 1: Check if the query works with proper permissions
-- First, let's check the actual table structures:

-- See profiles table structure
-- \d profiles

-- Step 2: Create a proper broadcast notification function
CREATE OR REPLACE FUNCTION broadcast_notification(
  notification_title text,
  notification_message text,
  notification_type text DEFAULT 'info'
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted_count integer := 0;
  user_record record;
BEGIN
  -- Log the start
  RAISE NOTICE 'Starting broadcast to all users...';
  
  -- Insert notifications for all users with user_id
  INSERT INTO notifications (user_id, title, message, type)
  SELECT 
    user_id, 
    notification_title, 
    notification_message, 
    notification_type 
  FROM profiles 
  WHERE user_id IS NOT NULL;
  
  -- Get the count of inserted rows
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  
  RAISE NOTICE 'Broadcast completed. Inserted % notifications', inserted_count;
  
  RETURN inserted_count;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in broadcast: %', SQLERRM;
    RETURN -1;
END;
$$;

-- Step 3: Grant necessary permissions
-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION broadcast_notification(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION broadcast_notification(text, text, text) TO service_role;

-- Step 4: Alternative direct insert approach (if the above doesn't work)
-- This creates a safer version that handles potential issues

CREATE OR REPLACE FUNCTION safe_broadcast_notification(
  notification_title text,
  notification_message text,
  notification_type text DEFAULT 'info'
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  inserted_count integer := 0;
  total_users integer := 0;
  result_msg text;
BEGIN
  -- Count total users first
  SELECT COUNT(*) INTO total_users 
  FROM profiles 
  WHERE user_id IS NOT NULL;
  
  RAISE NOTICE 'Found % users to notify', total_users;
  
  -- Insert notifications using explicit loop for better error handling
  FOR user_record IN 
    SELECT user_id FROM profiles WHERE user_id IS NOT NULL
  LOOP
    BEGIN
      INSERT INTO notifications (user_id, title, message, type, created_at)
      VALUES (
        user_record.user_id,
        notification_title,
        notification_message,
        notification_type,
        now()
      );
      inserted_count := inserted_count + 1;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE 'Failed to insert for user %: %', user_record.user_id, SQLERRM;
    END;
  END LOOP;
  
  result_msg := format('Broadcast completed: %s/%s notifications sent', inserted_count, total_users);
  RAISE NOTICE '%', result_msg;
  
  RETURN result_msg;
END;
$$;

-- Grant permissions for the safe version too
GRANT EXECUTE ON FUNCTION safe_broadcast_notification(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION safe_broadcast_notification(text, text, text) TO service_role;

-- Step 5: Test the functions
-- You can now use either:
-- SELECT broadcast_notification('📢 ADA UPDATE', 'Bersihkah Cookie dan Cache anda seperti di video kaka', 'success');
-- OR
-- SELECT safe_broadcast_notification('📢 ADA UPDATE', 'Bersihkah Cookie dan Cache anda seperti di video kaka', 'success');

-- Step 6: Troubleshooting queries
-- If issues persist, run these to debug:

-- Check profiles table has user_id column and data
-- SELECT COUNT(*) as total_profiles, COUNT(user_id) as profiles_with_user_id FROM profiles;

-- Check notifications table structure
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'notifications';

-- Check current notifications
-- SELECT COUNT(*) as total_notifications FROM notifications;

-- Check RLS policies
-- SELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE tablename IN ('profiles', 'notifications');

-- Manual broadcast (if functions don't work):
-- INSERT INTO notifications (user_id, title, message, type, created_at)
-- SELECT 
--   user_id,
--   '📢 ADA UPDATE',
--   'Bersihkah Cookie dan Cache anda seperti di video kaka',
--   'success',
--   now()
-- FROM profiles 
-- WHERE user_id IS NOT NULL;