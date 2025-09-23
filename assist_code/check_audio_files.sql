-- Check audio files in Supabase storage bucket
-- This will help verify the actual file names and storage structure

-- 1. Check if audio-tracks bucket exists and is public
SELECT 
    id,
    name,
    public,
    created_at,
    updated_at
FROM storage.buckets 
WHERE name = 'audio-tracks';

-- 2. List all files in audio-tracks bucket
SELECT 
    name,
    id,
    bucket_id,
    owner,
    created_at,
    updated_at,
    last_accessed_at,
    metadata
FROM storage.objects 
WHERE bucket_id = 'audio-tracks'
ORDER BY name;

-- 3. Check for files with spaces in names (potential encoding issues)
SELECT 
    name,
    id,
    length(name) as name_length,
    bucket_id
FROM storage.objects 
WHERE bucket_id = 'audio-tracks'
    AND name LIKE '% %'  -- Files with spaces
ORDER BY name;

-- 4. Check bucket policies for public access
SELECT 
    id,
    bucket_id,
    roles,
    definition
FROM storage.policies
WHERE bucket_id = 'audio-tracks';

-- 5. Test the exact file names from the error logs
SELECT 
    name,
    id,
    bucket_id,
    CASE 
        WHEN name = 'Verse1 - Calm Clarity.MP3' THEN 'EXACT_MATCH'
        WHEN name = 'Verse2 - Lucid Beach.MP3' THEN 'EXACT_MATCH'
        WHEN name = 'Verse 3 - Syukur.MP3' THEN 'EXACT_MATCH'
        WHEN name = 'Verse 4 - Prosperity Stream Vol. 1.MP3' THEN 'EXACT_MATCH'
        WHEN name = 'Verse4-English.MP3' THEN 'EXACT_MATCH'
        WHEN name = 'Verse5 - Virtality Vortex.MP3' THEN 'EXACT_MATCH'
        ELSE 'NO_MATCH'
    END as match_status
FROM storage.objects 
WHERE bucket_id = 'audio-tracks'
ORDER BY match_status DESC, name;