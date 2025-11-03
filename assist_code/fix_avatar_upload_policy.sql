-- This script makes the storage policies for profile pictures more robust to prevent 500 errors.

-- 1. Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can upload their own profile picture" ON storage.objects;

-- 2. Create a more robust INSERT policy
CREATE POLICY "Users can upload their own profile picture"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  cardinality(storage.foldername(name)) > 0 AND -- Ensures the path has at least one folder level
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Drop the existing UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profile picture" ON storage.objects;

-- 4. Create a more robust UPDATE policy
CREATE POLICY "Users can update their own profile picture"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  cardinality(storage.foldername(name)) > 0 AND
  (storage.foldername(name))[1] = auth.uid()::text
);
