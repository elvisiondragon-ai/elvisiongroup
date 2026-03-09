#!/bin/bash

# Debug pg_dump issues
echo "🔍 Debugging pg_dump issues..."
echo "================================"

HOST="db.nlrgdhpmsittuwiiindq.supabase.co"
PORT="5432"
DBNAME="postgres"
USERNAME="postgres" 
PASSWORD="Ns8H1SdrpepWWWeE"

echo "🧪 Test 1: Basic pg_dump with error output..."
PGPASSWORD="$PASSWORD" pg_dump \
    -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    --schema-only \
    --table=pg_stat_database \
    2>&1

echo ""
echo "🧪 Test 2: List all schemas..."
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    -c "SELECT schema_name FROM information_schema.schemata ORDER BY schema_name;"

echo ""
echo "🧪 Test 3: Show tables in public schema..."
PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name LIMIT 10;"

echo ""
echo "🧪 Test 4: Test simple pg_dump on one table..."
first_table=$(PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' LIMIT 1;" | tr -d ' ')

if [ -n "$first_table" ]; then
    echo "Trying to dump table: $first_table"
    PGPASSWORD="$PASSWORD" pg_dump \
        -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
        --schema-only \
        --table="public.$first_table" \
        2>&1 | head -20
else
    echo "No tables found!"
fi

echo ""
echo "🧪 Test 5: Check pg_dump version and permissions..."
pg_dump --version
echo "pg_dump location: $(which pg_dump)"

echo ""
echo "🧪 Test 6: Try different pg_dump approach..."
PGPASSWORD="$PASSWORD" pg_dump \
    -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    --no-owner \
    --no-privileges \
    --schema=public \
    --schema-only \
    2>&1 | head -10