-- Update avatar_url for specific users based on their email
UPDATE public.profiles
SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/profile-pictures/' || au.email || '.jpeg'
FROM auth.users AS au
WHERE public.profiles.user_id = au.id
  AND au.email IN (
    'mock1@yahoo.com',
    'mock10@yahoo.com',
    'mock11@yahoo.com',
    'mock12@yahoo.com',
    'mock13@yahoo.com',
    'mock14@yahoo.com',
    'mock15@yahoo.com',
    'mock16@yahoo.com',
    'mock17@yahoo.com',
    'mock18@yahoo.com',
    'mock19@yahoo.com',
    'mock2@yahoo.com',
    'mock20@yahoo.com',
    'mock3@yahoo.com',
    'mock4@yahoo.com',
    'mock5@yahoo.com',
    'mock6@yahoo.com',
    'mock7@yahoo.com',
    'mock8@yahoo.com',
    'mock9@yahoo.com'
  );

-- Optional: Verify the changes (run this separately after the update)
-- SELECT
--     p.user_id,
--     au.email,
--     p.avatar_url
-- FROM
--     public.profiles AS p
-- JOIN
--     auth.users AS au ON p.user_id = au.id
-- WHERE
--     au.email IN (
--         'mock1@yahoo.com',
--         'mock10@yahoo.com',
--         'mock11@yahoo.com',
--         'mock12@yahoo.com',
--         'mock13@yahoo.com',
--         'mock14@yahoo.com',
--         'mock15@yahoo.com',
--         'mock16@yahoo.com',
--         'mock17@yahoo.com',
--         'mock18@yahoo.com',
--         'mock19@yahoo.com',
--         'mock2@yahoo.com',
--         'mock20@yahoo.com',
--         'mock3@yahoo.com',
--         'mock4@yahoo.com',
--         'mock5@yahoo.com',
--         'mock6@yahoo.com',
--         'mock7@yahoo.com',
--         'mock8@yahoo.com',
--         'mock9@yahoo.com'
--     );