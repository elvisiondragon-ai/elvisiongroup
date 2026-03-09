#!/bin/bash

# Debug Supabase Link Issues
echo "🔍 Debugging Supabase Link Issues"
echo "=================================="

# Check environment variables
echo "📋 Environment Variables:"
echo "SUPABASE_ACCESS_TOKEN: ${SUPABASE_ACCESS_TOKEN:0:10}..."
echo "SUPABASE_PROJECT_REF: $SUPABASE_PROJECT_REF"

# Check Supabase CLI version
echo ""
echo "🔧 Supabase CLI Info:"
supabase --version

# Check if in Supabase project
echo ""
echo "📁 Project Structure:"
if [ -f "supabase/config.toml" ]; then
    echo "✅ supabase/config.toml exists"
else
    echo "❌ supabase/config.toml not found"
    echo "💡 Run: supabase init"
fi

# Check if already linked
echo ""
echo "🔗 Link Status:"
if [ -f ".supabase/config.toml" ]; then
    echo "✅ .supabase/config.toml exists"
    echo "Current project_id:"
    grep 'project_id' .supabase/config.toml || echo "No project_id found"
else
    echo "❌ Not linked to any project"
fi

# Try manual link with verbose output
echo ""
echo "🔄 Attempting to link..."
echo "Command: supabase link --project-ref $SUPABASE_PROJECT_REF"

# Login first if needed
echo ""
echo "🔐 Checking auth status..."
supabase auth status

echo ""
echo "🚀 Manual Steps to Fix:"
echo "1. Run: supabase auth login"
echo "2. Run: supabase link --project-ref nlrgdhpmsittuwiiindq"
echo "3. Enter your database password when prompted"
echo "4. Try the sync script again"