
-- Check Row Level Security (RLS) policies for the global_product table
SELECT 
    policyname, 
    permissive, 
    cmd, 
    qual, 
    with_check 
FROM 
    pg_catalog.pg_policies 
WHERE 
    schemaname = 'public' AND tablename = 'global_product';

-- Describe the schema of the global_product table
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM 
    information_schema.columns 
WHERE 
    table_schema = 'public' AND table_name = 'global_product' 
ORDER BY 
    ordinal_position;

-- Check if global_product table is enabled for real-time publications (for INSERT events)
SELECT
    relname AS table_name,
    CASE
        WHEN (p.puballattrs) THEN 'All columns'
        WHEN (p.pubinsert OR p.pubupdate OR p.pubdelete OR p.pubtruncate) THEN 'Specific columns'
        ELSE 'No columns'
    END AS published_columns,
    p.pubinsert AS publishes_inserts,
    p.pubupdate AS publishes_updates,
    p.pubdelete AS publishes_deletes,
    p.pubtruncate AS publishes_truncates
FROM
    pg_publication_tables AS pt
JOIN
    pg_publication AS p ON pt.pubid = p.oid
WHERE
    pt.schemaname = 'public' AND pt.relname = 'global_product';
