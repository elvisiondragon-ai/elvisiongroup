
SELECT
    viewname AS view_name,
    definition AS view_definition
FROM
    pg_views
WHERE
    schemaname = 'public' AND definition ILIKE '%total_verses%';
