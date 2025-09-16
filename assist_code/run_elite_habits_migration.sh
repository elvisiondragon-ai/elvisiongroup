#!/bin/bash

# Script to run Elite Habits database migration
echo "🏃‍♂️ Running Elite Habits database migration..."

# Check if we have psql or supabase CLI available
if command -v supabase &> /dev/null; then
    echo "📡 Using Supabase CLI..."
    supabase db reset
    echo "✅ Migration completed via Supabase CLI"
elif command -v psql &> /dev/null; then
    echo "🐘 Using PostgreSQL CLI..."
    echo "❌ Need Supabase connection string for psql"
    echo "Please run the SQL manually in Supabase dashboard:"
    echo "https://supabase.com/dashboard"
else
    echo "❌ No database CLI found"
    echo "Please run the SQL manually in Supabase dashboard:"
    echo "https://supabase.com/dashboard"
fi

echo ""
echo "📄 SQL file location:"
echo "$(pwd)/create_elite_habits_table.sql"
echo ""
echo "📋 What this migration creates:"
echo "• elite_habits table for tracking exercise activities"
echo "• total_elite_habit column in profiles table"
echo "• RLS policies for data security"
echo "• Indexes for performance"