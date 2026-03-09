-- Update Andin's profile to level 9 with 15000 XP
UPDATE profiles 
SET 
  experience_points = 15000,
  level = 9,
  display_name = 'Andin'
WHERE user_id = '8c2cd3b1-6b77-4df9-92c5-467182ecd13d';