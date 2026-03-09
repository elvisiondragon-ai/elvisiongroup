-- Update streak_days to 7 for all users (since we don't have a specific user context)
UPDATE profiles 
SET streak_days = 7;