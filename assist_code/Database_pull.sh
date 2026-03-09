#!/bin/bash

# Database Export Script for eL Vision Group
# Exports complete Supabase database to assist_code folder
# Created: $(date)

echo "🚀 Starting Database Export to assist_code folder..."
echo "=================================================="

# Your Supabase project details
PROJECT_REF="nlrgdhpmsittuwiiindq"
SUPABASE_ACCESS_TOKEN="sbp_e75b191c6c88aae37812df73cbfff1f94016b309"
HOST="db.nlrgdhpmsittuwiiindq.supabase.co"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Navigate to project root and create/go to migrations directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MIGRATIONS_DIR="$PROJECT_ROOT/supabase/migrations"

# Create migrations directory if it doesn't exist
mkdir -p "$MIGRATIONS_DIR"
cd "$MIGRATIONS_DIR"
echo "📁 Working directory: $PWD"

# Check if supabase CLI is available
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI found"
    USE_CLI=true
else
    echo "⚠️  Supabase CLI not found, will use direct pg_dump"
    USE_CLI=false
fi

if [ "$USE_CLI" = true ]; then
    echo "🔐 Using Supabase CLI method..."
    
    # Set environment variable
    export SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN"
    
    # Login to Supabase
    echo "🔑 Logging in to Supabase..."
    supabase login --token $SUPABASE_ACCESS_TOKEN
    
    # Go to project root to link project
    cd "$PROJECT_ROOT"
    echo "🔗 Linking to project $PROJECT_REF..."
    supabase link --project-ref $PROJECT_REF
    
    # Return to migrations folder
    cd "$MIGRATIONS_DIR"
    
    echo "💾 Creating complete database backup..."
    supabase db dump > "FULL_DATABASE_BACKUP_$TIMESTAMP.sql"
    
    echo "📋 Creating schema-only backup..."
    supabase db dump --schema-only > "SCHEMA_ONLY_$TIMESTAMP.sql"
    
    echo "🔧 Creating functions and tables export..."
    supabase db dump --schema-only --schema=public > "FUNCTIONS_AND_TABLES_$TIMESTAMP.sql"

else
    echo "🔐 Using direct pg_dump method..."
    echo "📝 You will need your database password from Supabase Dashboard -> Settings -> Database"
    echo "Enter your Supabase database password:"
    read -s DB_PASSWORD
    
    if [ -z "$DB_PASSWORD" ]; then
        echo "❌ No password provided. Exiting..."
        exit 1
    fi
    
    CONNECTION_STRING="postgresql://postgres:$DB_PASSWORD@$HOST:5432/postgres"
    
    echo "💾 Creating complete database backup..."
    pg_dump "$CONNECTION_STRING" \
        --no-owner \
        --no-privileges \
        > "FULL_DATABASE_BACKUP_$TIMESTAMP.sql"
    
    echo "📋 Creating schema-only backup..."
    pg_dump "$CONNECTION_STRING" \
        --schema-only \
        --no-owner \
        --no-privileges \
        > "SCHEMA_ONLY_$TIMESTAMP.sql"
    
    echo "🔧 Creating functions and tables export..."
    pg_dump "$CONNECTION_STRING" \
        --schema-only \
        --no-owner \
        --no-privileges \
        --schema=public \
        > "FUNCTIONS_AND_TABLES_$TIMESTAMP.sql"
fi

# Check if exports were successful
EXPORT_COUNT=$(ls -1 *_$TIMESTAMP.sql 2>/dev/null | wc -l)

if [ "$EXPORT_COUNT" -gt 0 ]; then
    echo ""
    echo "✅ Database export completed successfully!"
    echo "=================================================="
    echo "📁 Files created in supabase/migrations folder:"
    echo ""
    ls -la *_$TIMESTAMP.sql
    echo ""
    echo "📊 Export Summary:"
    echo "   - FULL_DATABASE_BACKUP: Complete database with data"
    echo "   - SCHEMA_ONLY: Database structure without data"  
    echo "   - FUNCTIONS_AND_TABLES: Database objects and schema"
    echo ""
    echo "🎉 All your production database state is now backed up!"
else
    echo ""
    echo "❌ Export failed! No files were created."
    echo "Please check your credentials and try again."
    exit 1
fi