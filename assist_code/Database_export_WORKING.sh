#!/bin/bash

# WORKING Database Export Script for eL Vision Group
# Uses confirmed working connection format

echo "🚀 Exporting Database with WORKING connection format"
echo "=================================================="

# Confirmed working connection details
HOST="db.nlrgdhpmsittuwiiindq.supabase.co"
PORT="5432"
DBNAME="postgres"
USERNAME="postgres"
PASSWORD="Ns8H1SdrpepWWWeE"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Navigate to migrations directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATIONS_DIR="$PROJECT_ROOT/supabase/migrations"

# Create migrations directory if it doesn't exist
mkdir -p "$MIGRATIONS_DIR"
cd "$MIGRATIONS_DIR"
echo "📁 Working directory: $PWD"

echo "🔗 Testing confirmed connection..."
if ! PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" -c "SELECT version();" >/dev/null 2>&1; then
    echo "❌ Connection failed - this shouldn't happen!"
    exit 1
fi
echo "✅ Connection confirmed working!"

echo ""
echo "📊 Database info:"
table_count=$(PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null | tr -d ' ')
function_count=$(PGPASSWORD="$PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" -t -c "SELECT count(*) FROM information_schema.routines WHERE routine_schema='public';" 2>/dev/null | tr -d ' ')
echo "   Public tables: $table_count"
echo "   Public functions: $function_count"

echo ""
echo "💾 Creating complete database backup (with data)..."
PGPASSWORD="$PASSWORD" pg_dump \
    -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    --verbose \
    > "PRODUCTION_FULL_DATABASE_$TIMESTAMP.sql" 2>/dev/null

echo ""
echo "📋 Creating schema-only backup (structure only)..."
PGPASSWORD="$PASSWORD" pg_dump \
    -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    --schema-only \
    --no-owner \
    --no-privileges \
    --clean \
    --if-exists \
    --verbose \
    > "PRODUCTION_SCHEMA_ONLY_$TIMESTAMP.sql" 2>/dev/null

echo ""
echo "🔧 Creating public schema objects only..."
PGPASSWORD="$PASSWORD" pg_dump \
    -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    --schema-only \
    --no-owner \
    --no-privileges \
    --schema=public \
    --clean \
    --if-exists \
    --verbose \
    > "PRODUCTION_PUBLIC_SCHEMA_$TIMESTAMP.sql" 2>/dev/null

echo ""
echo "🎯 Creating data-only backup..."
PGPASSWORD="$PASSWORD" pg_dump \
    -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    --data-only \
    --no-owner \
    --no-privileges \
    --schema=public \
    --verbose \
    > "PRODUCTION_DATA_ONLY_$TIMESTAMP.sql" 2>/dev/null

# Check results
echo ""
echo "📁 Export results:"
for file in *_$TIMESTAMP.sql; do
    if [ -f "$file" ]; then
        size=$(ls -lh "$file" | awk '{print $5}')
        lines=$(wc -l < "$file" 2>/dev/null || echo "0")
        echo "   $file: $size ($lines lines)"
    fi
done

# Verify at least one file has content
has_content=false
for file in *_$TIMESTAMP.sql; do
    if [ -f "$file" ] && [ -s "$file" ]; then
        has_content=true
        break
    fi
done

if [ "$has_content" = true ]; then
    echo ""
    echo "✅ SUCCESS! Database exported successfully!"
    echo "🎉 Claude can now read your complete production database from migrations folder!"
    echo ""
    echo "📝 Files created:"
    echo "   - PRODUCTION_FULL_DATABASE: Complete database with data"
    echo "   - PRODUCTION_SCHEMA_ONLY: Database structure only"
    echo "   - PRODUCTION_PUBLIC_SCHEMA: Public schema objects"
    echo "   - PRODUCTION_DATA_ONLY: Data without structure"
else
    echo ""
    echo "❌ Export failed - all files are empty!"
    echo "💡 Check pg_dump permissions or database access"
fi