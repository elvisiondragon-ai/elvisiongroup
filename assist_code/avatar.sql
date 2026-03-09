-- Bulk update avatar URLs for all users
-- Match user IDs with avatar filenames

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/agustinus.jpg' WHERE user_id = 'd828905b-bf9a-4672-9233-8411c39d4371';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/ahmad.jpg' WHERE user_id = '59fbd3da-1c7e-4d2a-b0fd-3c8534bb57b0';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/budi.jpeg' WHERE user_id = '82c7d969-45e7-47e1-992d-8e1fd6b177cd';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/dani.png' WHERE user_id = '4ce66004-b0c9-45a4-875d-699611eea046';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/dewi.png' WHERE user_id = '8e2cd453-9d34-41ab-9b5b-8629587b65e2';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/drhendro.png' WHERE user_id = '9a178d5c-c6f2-465a-b5f6-4e3dee6a388b';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/fitri.jpg' WHERE user_id = '41b60152-34a8-4c56-86d4-ec66c3302a5b';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/madebangli.png' WHERE user_id = '9c03719b-0e18-4851-b6ec-0abc3981df9a';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/mega.png' WHERE user_id = 'a985f091-7712-4972-8d0a-9a90b01e3c26';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/tian.jpg' WHERE user_id = '8a6b16aa-de55-4deb-b4ed-b35fb8a4fe4a';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/lina.png' WHERE user_id = '60428b60-4dfc-4246-abd8-b14f013c31e4';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/putri.png' WHERE user_id = 'ab68113b-cba7-4243-9544-8d932abcb521';

UPDATE profiles SET avatar_url = 'https://nlrgdhpmsittuwiiindq.supabase.co/storage/v1/object/public/avatar/sari.png' WHERE user_id = 'cde28520-7335-49e2-880e-7dbc08848c71';

-- Users WITHOUT avatar files (NO IMAGES YET):
-- 1. Gustian (94dda7bb-aa8f-47c8-a3be-de2139f94ef9) - no gustian.jpg
-- 2. mock16 (7051ee15-5578-494d-961d-5c8cdedcc84a) - no mock16.jpg
-- 3. Suyin Bekasi (bd19d5e0-0cb8-45b7-b769-0a8b0981bae9) - no suyin.jpg

-- COMPLETED AVATARS ADDED:
-- ✅ Lina Maharani - lina.png ADDED
-- ✅ Putri Wahyudi - putri.png ADDED  
-- ✅ Sari Kusuma - sari.png ADDED

-- Verify all updates
SELECT user_id, display_name, avatar_url FROM profiles WHERE avatar_url IS NOT NULL ORDER BY display_name;

SARI PUTRI LINA 