
SELECT
    proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM
    pg_proc p
LEFT JOIN
    pg_namespace n ON p.pronamespace = n.oid
WHERE
    n.nspname = 'public' AND pg_get_functiondef(p.oid) ILIKE '%total_verses%';
