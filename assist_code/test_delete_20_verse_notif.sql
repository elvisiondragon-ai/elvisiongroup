-- Test delete 20 verse_notif records

-- 1. Show records before deletion
SELECT 
  COUNT(*) as total_before,
  MIN(created_at) as oldest,
  MAX(created_at) as newest
FROM public.verse_notif;

-- 2. Delete 20 oldest records
WITH deleted_records AS (
  DELETE FROM public.verse_notif 
  WHERE id IN (
    SELECT id 
    FROM public.verse_notif 
    ORDER BY created_at ASC 
    LIMIT 20
  )
  RETURNING id, created_at
)
SELECT 
  'Deleted 20 oldest verse_notif records' as message,
  COUNT(*) as deleted_count,
  MIN(created_at) as oldest_deleted,
  MAX(created_at) as newest_deleted
FROM deleted_records;

-- 3. Show records after deletion
SELECT 
  COUNT(*) as total_after,
  MIN(created_at) as oldest_remaining,
  MAX(created_at) as newest_remaining
FROM public.verse_notif;