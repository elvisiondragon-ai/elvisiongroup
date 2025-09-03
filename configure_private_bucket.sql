-- Simple SQL to make testaudio bucket private (signed URLs only)

-- 1. Make testaudio bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'testaudio';

-- 2. Delete all existing policies for testaudio
DELETE FROM storage.policies WHERE bucket_id = 'testaudio';

-- 3. Check bucket is now private
SELECT id, name, public FROM storage.buckets WHERE id = 'testaudio';