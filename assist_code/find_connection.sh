#!/bin/bash

# Comprehensive Supabase Connection Format Tester
echo "🔍 Finding your correct Supabase connection format..."
echo "================================================="

PASSWORD="Ns8H1SdrpepWWWeE"
PROJECT_REF="nlrgdhpmsittuwiiindq"

# All possible Supabase connection formats
CONNECTIONS=(
    # Standard formats
    "db.$PROJECT_REF.supabase.co:5432"
    "$PROJECT_REF.supabase.co:5432"
    "postgresql://$PROJECT_REF.supabase.co:5432"
    
    # Pooler formats
    "db.$PROJECT_REF.supabase.co:6543"
    "$PROJECT_REF.supabase.co:6543"
    
    # Regional pooler formats (common regions)
    "aws-0-us-east-1.pooler.supabase.com:6543"
    "aws-0-us-west-1.pooler.supabase.com:6543"
    "aws-0-eu-west-1.pooler.supabase.com:6543"
    "aws-0-ap-southeast-1.pooler.supabase.com:6543"
    "aws-0-ap-northeast-1.pooler.supabase.com:6543"
    
    # Alternative formats
    "$PROJECT_REF.db.supabase.co:5432"
    "postgres.$PROJECT_REF.supabase.co:5432"
    "database.$PROJECT_REF.supabase.co:5432"
)

echo "Testing ${#CONNECTIONS[@]} different connection formats..."
echo ""

WORKING_CONNECTION=""

for i in "${!CONNECTIONS[@]}"; do
    conn="${CONNECTIONS[$i]}"
    host=$(echo "$conn" | cut -d':' -f1)
    port=$(echo "$conn" | cut -d':' -f2)
    
    printf "[$((i+1))/${#CONNECTIONS[@]}] Testing: $host:$port"
    
    # Test network connectivity first
    if nc -z "$host" "$port" 2>/dev/null; then
        printf " ✅ reachable"
        
        # Test database connection
        if PGPASSWORD="$PASSWORD" psql -h "$host" -p "$port" -U postgres -d postgres -c "SELECT 1;" >/dev/null 2>&1; then
            printf " ✅ DB connected!"
            echo ""
            echo "🎉 FOUND WORKING CONNECTION: $host:$port"
            WORKING_CONNECTION="$host:$port"
            
            # Test if it has content
            echo "📊 Testing database content..."
            table_count=$(PGPASSWORD="$PASSWORD" psql -h "$host" -p "$port" -U postgres -d postgres -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null | tr -d ' ')
            echo "   Public tables: $table_count"
            
            function_count=$(PGPASSWORD="$PASSWORD" psql -h "$host" -p "$port" -U postgres -d postgres -t -c "SELECT count(*) FROM information_schema.routines WHERE routine_schema='public';" 2>/dev/null | tr -d ' ')
            echo "   Public functions: $function_count"
            
            if [ "$table_count" -gt 0 ] || [ "$function_count" -gt 0 ]; then
                echo "✅ Database has content!"
                break
            else
                echo "⚠️  Database appears empty"
            fi
        else
            printf " ❌ auth failed"
        fi
    else
        printf " ❌ unreachable"
    fi
    echo ""
done

if [ -n "$WORKING_CONNECTION" ]; then
    echo ""
    echo "🎯 SUCCESS! Use this connection format:"
    echo "Host: $(echo $WORKING_CONNECTION | cut -d':' -f1)"
    echo "Port: $(echo $WORKING_CONNECTION | cut -d':' -f2)"
    echo ""
    echo "Connection string:"
    echo "postgresql://postgres:$PASSWORD@$WORKING_CONNECTION/postgres"
else
    echo ""
    echo "❌ No working connection found!"
    echo "💡 Possible issues:"
    echo "   1. Wrong password"
    echo "   2. Project is paused/sleeping"
    echo "   3. Different project region"
    echo "   4. IP restrictions enabled"
fi