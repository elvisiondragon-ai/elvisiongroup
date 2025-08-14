-- Check current storage buckets and their settings
SELECT id, name, public, created_at, updated_at 
FROM storage.buckets;

-- Check storage objects count and sizes per bucket
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size'::integer) as total_size_bytes
FROM storage.objects 
GROUP BY bucket_id;