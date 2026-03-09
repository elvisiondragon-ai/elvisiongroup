#!/bin/bash

# Secure Environment Setup for Supabase Sync
# This script helps you set up credentials securely

echo "🔐 Supabase Environment Setup"
echo "=============================="

# Create .env.supabase file for credentials (add to .gitignore)
cat > .env.supabase << 'EOF'
# Supabase Credentials - DO NOT COMMIT TO GIT
# Add this file to .gitignore

# Replace with your actual credentials
export SUPABASE_ACCESS_TOKEN="sbp_your_access_token_here"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_service_role_key_here"
export SUPABASE_PROJECT_REF="nlrgdhpmsittuwiiindq"
export SUPABASE_DB_PASSWORD="your_db_password"

EOF

# Add to .gitignore if not already there
if ! grep -q ".env.supabase" .gitignore 2>/dev/null; then
    echo ".env.supabase" >> .gitignore
    echo "✅ Added .env.supabase to .gitignore"
fi

echo ""
echo "📝 Next steps:"
echo "1. Edit .env.supabase with your real credentials"
echo "2. Run: source .env.supabase"
echo "3. Run: ./assist_code/sync_supabase_database.sh"
echo ""
echo "⚠️  SECURITY NOTE:"
echo "• Never commit .env.supabase to git"
echo "• Keep your credentials secure"
echo "• Use environment variables in production"