#!/bin/bash

# Supabase Restore Script
# This script restores a Supabase database backup

# Configuration - UPDATE THESE FOR YOUR TARGET DATABASE
TARGET_DB_PASSWORD="YOUR_TARGET_PASSWORD"
TARGET_DB_CONNECTION="postgresql://postgres:${TARGET_DB_PASSWORD}@YOUR_TARGET_HOST:5432/postgres"
BACKUP_FILE="database_complete.dump"

echo "🔄 Supabase Database Restore Script"
echo "=================================="

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: Backup file '$BACKUP_FILE' not found!"
    echo "Available files:"
    ls -la *.dump *.sql 2>/dev/null || echo "No backup files found"
    exit 1
fi

# Confirm restore operation
echo "⚠️  WARNING: This will overwrite the target database!"
echo "Target: $TARGET_DB_CONNECTION"
echo "Backup: $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Restore database
echo "🚀 Starting database restore..."
pg_restore \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    --verbose \
    --dbname="$TARGET_DB_CONNECTION" \
    "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database restore completed successfully!"
else
    echo "❌ Restore failed. Check error messages above."
    exit 1
fi

echo ""
echo "📋 Post-restore checklist:"
echo "1. Verify data integrity"
echo "2. Test application functionality"
echo "3. Check RLS policies are working"
echo "4. Verify auth users can login"
echo "5. Test API endpoints"