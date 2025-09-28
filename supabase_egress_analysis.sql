-- Supabase Egress Analysis Queries
-- Run these in your Supabase SQL Editor to identify high egress usage

-- 1. Check Storage Bucket Sizes and Activity
SELECT 
  name as bucket_name,
  public,
  created_at,
  updated_at
FROM storage.buckets;

-- 2. Check all files in storage to see what columns exist
SELECT *
FROM storage.objects 
LIMIT 5;

-- 3. Check for files over 100MB (high egress risk)
SELECT 
  bucket_id,
  name as file_name,
  ROUND(size / 1024.0 / 1024.0, 2) as size_mb,
  content_type,
  created_at
FROM storage.objects 
WHERE size > 100 * 1024 * 1024  -- Files over 100MB
ORDER BY size DESC;

-- 4. Group by content type to see what types of files are biggest
SELECT 
  content_type,
  COUNT(*) as file_count,
  ROUND(SUM(size) / 1024.0 / 1024.0, 2) as total_size_mb,
  ROUND(AVG(size) / 1024.0 / 1024.0, 2) as avg_size_mb,
  ROUND(MAX(size) / 1024.0 / 1024.0, 2) as max_size_mb
FROM storage.objects 
GROUP BY content_type
ORDER BY SUM(size) DESC;

-- 5. Check recent large file uploads (last 7 days)
SELECT 
  bucket_id,
  name as file_name,
  ROUND(size / 1024.0 / 1024.0, 2) as size_mb,
  content_type,
  created_at
FROM storage.objects 
WHERE created_at > NOW() - INTERVAL '7 days'
  AND size > 10 * 1024 * 1024  -- Files over 10MB
ORDER BY size DESC;

-- 6. Check your database size (if using database egress)
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables 
WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 7. Check for frequently accessed files (if you have access logs)
-- Note: This might not be available in all Supabase plans
-- But check if you have any patterns in your app that download large files repeatedly

-- 8. Audio files analysis (since your app has audio)
SELECT 
  bucket_id,
  name as file_name,
  ROUND(size / 1024.0 / 1024.0, 2) as size_mb,
  content_type,
  created_at
FROM storage.objects 
WHERE content_type LIKE '%audio%' 
   OR name LIKE '%.mp3' 
   OR name LIKE '%.wav' 
   OR name LIKE '%.m4a'
ORDER BY size DESC;

-- 9. Image files analysis
SELECT 
  bucket_id,
  name as file_name,
  ROUND(size / 1024.0 / 1024.0, 2) as size_mb,
  content_type,
  created_at
FROM storage.objects 
WHERE content_type LIKE '%image%' 
   OR name LIKE '%.jpg' 
   OR name LIKE '%.png' 
   OR name LIKE '%.jpeg'
   OR name LIKE '%.webp'
ORDER BY size DESC;

-- 10. Total storage usage by bucket
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  ROUND(SUM(size) / 1024.0 / 1024.0, 2) as total_size_mb,
  ROUND(SUM(size) / 1024.0 / 1024.0 / 1024.0, 2) as total_size_gb
FROM storage.objects 
GROUP BY bucket_id
ORDER BY SUM(size) DESC;