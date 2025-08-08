-- Update the current user's streak to 7 days
UPDATE profiles 
SET streak_days = 7 
WHERE user_id = auth.uid();