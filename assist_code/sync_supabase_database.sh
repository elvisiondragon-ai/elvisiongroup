#!/bin/bash

# Supabase Database Sync Script
# This script pulls the latest database schema and data from Supabase to local

echo "🔄 Supabase Database Sync Script"
echo "================================="

# IMPORTANT: Set your credentials as environment variables
# DO NOT put real credentials in this file for security
export SUPABASE_ACCESS_TOKEN="your_access_token_here"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key_here"
export SUPABASE_PROJECT_REF="nlrgdhpmsittuwiiindq"
export SUPABASE_DB_PASSWORD="your_db_password_here"

# Verify Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory"
    echo "Run 'supabase init' first"
    exit 1
fi

echo "📡 Connecting to Supabase project: $SUPABASE_PROJECT_REF"

# Check if already linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "🔗 Linking to Supabase project..."
    supabase link --project-ref $SUPABASE_PROJECT_REF
else
    echo "✅ Already linked to Supabase project"
    # Verify the link is correct
    current_ref=$(grep 'project_id' .supabase/config.toml | cut -d'"' -f2)
    if [ "$current_ref" != "$SUPABASE_PROJECT_REF" ]; then
        echo "🔄 Re-linking to correct project..."
        supabase unlink
        supabase link --project-ref $SUPABASE_PROJECT_REF
    fi
fi

# Pull database schema and data
echo "📥 Pulling database schema..."
supabase db pull

# Generate types for TypeScript
echo "🔧 Generating TypeScript types..."
supabase gen types typescript --local > src/types/supabase.ts

# Start local Supabase instance
echo "🚀 Starting local Supabase..."
supabase start

# Reset local database with remote data
echo "🔄 Resetting local database with remote data..."
supabase db reset

# Run any pending migrations
echo "📋 Running migrations..."
supabase migration list
supabase db push

echo ""
echo "✅ Database sync completed!"
echo ""
echo "🔗 Local URLs:"
echo "• Studio: http://localhost:54323"
echo "• API: http://localhost:54321"
echo "• DB: postgresql://postgres:postgres@localhost:54322/postgres"
echo ""
echo "📝 Next steps:"
echo "1. Update your .env.local with local Supabase URLs"
echo "2. Test your application with local database"
echo "3. Use 'supabase stop' to stop local instance"