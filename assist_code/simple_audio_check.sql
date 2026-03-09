-- Simple check for audio files in storage
-- Check what storage tables exist first

-- 1. Check if storage schema exists and what tables are available
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'storage'
ORDER BY table_name;

-- 2. Check if audio-tracks bucket exists
SELECT 
    id,
    name,
    public,
    created_at
FROM storage.buckets 
WHERE name = 'audio-tracks';

-- 3. List all buckets to see what's available
SELECT 
    name,
    id,
    public
FROM storage.buckets 
ORDER BY name;

-- 4. Check files in audio-tracks bucket (if it exists)
SELECT 
    name,
    id,
    bucket_id,
    created_at
FROM storage.objects 
WHERE bucket_id = 'audio-tracks'
ORDER BY name;

-- 5. If audio-tracks doesn't exist, check all buckets for audio files
SELECT 
    bucket_id,
    name,
    id
FROM storage.objects 
WHERE name ILIKE '%.mp3' OR name ILIKE '%.wav'
ORDER BY bucket_id, name;