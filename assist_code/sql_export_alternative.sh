#!/bin/bash

# Alternative: Export using SQL queries instead of pg_dump
echo "🔄 Alternative SQL-based export (no pg_dump)"
echo "============================================"

HOST="db.nlrgdhpmsittuwiiindq.supabase.co"
PORT="5432"
DBNAME="postgres"
USERNAME="postgres"
PASSWORD="Ns8H1SdrpepWWWeE"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Navigate to migrations directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATIONS_DIR="$PROJECT_ROOT/supabase/migrations"
cd "$MIGRATIONS_DIR"

echo "📁 Working in: $PWD"

echo "🔧 Exporting table schemas using SQL queries..."

# Export table definitions
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" > "SQL_TABLE_SCHEMAS_$TIMESTAMP.sql" << 'EOF'
-- Table schemas export
SELECT 
    'CREATE TABLE ' || schemaname || '.' || tablename || ' (' || 
    array_to_string(
        array_agg(
            column_name || ' ' || data_type || 
            CASE 
                WHEN character_maximum_length IS NOT NULL 
                THEN '(' || character_maximum_length || ')'
                ELSE ''
            END ||
            CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END
        ), 
        ', '
    ) || ');'
FROM information_schema.tables t
JOIN information_schema.columns c ON c.table_name = t.tablename AND c.table_schema = t.schemaname
WHERE t.schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;
EOF

echo "🔧 Exporting function definitions..."

# Export functions
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" > "SQL_FUNCTIONS_$TIMESTAMP.sql" << 'EOF'
-- Functions export
SELECT 
    'CREATE OR REPLACE FUNCTION ' || routine_name || '(' || 
    COALESCE(parameters, '') || ') RETURNS ' || 
    COALESCE(data_type, 'void') || ' AS $$ ' || 
    routine_definition || ' $$;'
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;
EOF

echo "🔧 Exporting table structure with psql..."

# Simple table list and basic info
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" > "DATABASE_INFO_$TIMESTAMP.sql" << 'EOF'
-- Database Information Export

-- List all tables
\dt public.*

-- List all functions  
\df public.*

-- Show table details for each table
SELECT 
    t.table_name,
    t.table_type,
    (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE t.table_schema = 'public'
ORDER BY t.table_name;

-- Show all columns
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
EOF

echo ""
echo "📁 Results:"
for file in *_$TIMESTAMP.sql; do
    if [ -f "$file" ]; then
        size=$(ls -lh "$file" | awk '{print $5}')
        lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo "   $file: $size ($lines lines)"
        
        # Show first few lines
        echo "   Preview:"
        head -5 "$file" | sed 's/^/      /'
        echo ""
    fi
done