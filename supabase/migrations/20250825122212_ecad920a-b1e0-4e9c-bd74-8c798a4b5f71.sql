-- Update profile achievements for user charismoch259 to add 'pro' status
UPDATE public.profiles 
SET achievements = array_append(achievements, 'pro'),
    updated_at = now()
WHERE user_id = 'b2803bb9-d737-4420-8eb0-4a6deed56216';