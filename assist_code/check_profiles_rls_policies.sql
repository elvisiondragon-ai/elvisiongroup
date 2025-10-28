
SELECT
    policyname AS policy_name,
    tablename AS table_name,
    cmd AS command,
    qual AS policy_expression,
    with_check AS with_check_expression
FROM
    pg_policies
WHERE
    tablename = 'profiles' AND schemaname = 'public';
