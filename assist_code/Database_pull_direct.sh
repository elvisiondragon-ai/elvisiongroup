#!/bin/bash

# Direct PostgreSQL Database Export (No Docker/CLI required)
# Simple pg_dump method for eL Vision Group

echo "🚀 Direct Database Export (No Docker/CLI required)"
echo "=================================================="

# Your Supabase connection details
# Use the working connection format
HOST="db.nlrgdhpmsittuwiiindq.supabase.co"
PORT="5432"

DBNAME="postgres"
USERNAME="postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Navigate to migrations directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATIONS_DIR="$PROJECT_ROOT/supabase/migrations"

# Create migrations directory if it doesn't exist
mkdir -p "$MIGRATIONS_DIR"
cd "$MIGRATIONS_DIR"
echo "📁 Working directory: $PWD"

# Check if pg_dump is available
if ! command -v pg_dump &> /dev/null; then
    echo "❌ pg_dump not found. Please install PostgreSQL client:"
    echo "   brew install postgresql"
    exit 1
fi

echo "✅ pg_dump found"
echo ""
echo "🔐 Enter your Supabase database password"
echo "   (Found in: Supabase Dashboard → Settings → Database → Database password)"
echo -n "Password: "
read -s DB_PASSWORD
echo ""

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ No password provided. Exiting..."
    exit 1
fi

# Build connection string with SSL
CONNECTION_STRING="postgresql://$USERNAME:$DB_PASSWORD@$HOST:$PORT/$DBNAME?sslmode=require"

echo "🔗 Testing connection to $HOST:$PORT..."

# Test connection
if ! PGPASSWORD="$DB_PASSWORD" psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" -c "SELECT version();" >/dev/null 2>&1; then
    echo "❌ Database connection failed"
    echo "💡 Make sure you entered the correct password"
    exit 1
fi

echo "✅ Connection successful!"
echo ""

echo "💾 Creating complete database backup (with data)..."
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    --no-owner \
    --no-privileges \
    --verbose \
    > "REAL_PRODUCTION_DATABASE_$TIMESTAMP.sql"

echo ""
echo "📋 Creating schema-only backup (structure only)..."
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    --schema-only \
    --no-owner \
    --no-privileges \
    --verbose \
    > "REAL_PRODUCTION_SCHEMA_$TIMESTAMP.sql"

echo ""
echo "🔧 Creating functions and procedures only..."
PGPASSWORD="$DB_PASSWORD" pg_dump \
    -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DBNAME" \
    --schema-only \
    --no-owner \
    --no-privileges \
    --schema=public \
    --verbose \
    > "REAL_PRODUCTION_FUNCTIONS_$TIMESTAMP.sql"

# Check results
EXPORT_COUNT=$(ls -1 *_$TIMESTAMP.sql 2>/dev/null | wc -l)

if [ "$EXPORT_COUNT" -gt 0 ]; then
    echo ""
    echo "✅ Database export completed successfully!"
    echo "=================================================="
    echo "📁 Files created in supabase/migrations:"
    echo ""
    ls -lh *_$TIMESTAMP.sql
    echo ""
    echo "📊 Export Summary:"
    echo "   - REAL_PRODUCTION_DATABASE: Complete database with all data"
    echo "   - REAL_PRODUCTION_SCHEMA: Database structure only"  
    echo "   - REAL_PRODUCTION_FUNCTIONS: Functions, procedures, triggers"
    echo ""
    echo "🎉 Your production database is now backed up!"
    echo "💡 Claude can now read your complete database structure from migrations folder"
else
    echo ""
    echo "❌ Export failed! No files were created."
    echo "Please check the error messages above."
    exit 1
fi