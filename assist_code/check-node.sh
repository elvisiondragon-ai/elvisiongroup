#!/bin/bash
echo "🔍 Checking for remaining Node.js processes..."
echo ""

# Check for any node/npm processes (exclude this script)
NODE_PROCS=$(ps aux | grep -E "(node|npm)" | grep -v grep | grep -v "check-node.sh" | wc -l)
if [ $NODE_PROCS -eq 0 ]; then
    echo "✅ No Node.js processes found"
else
    echo "❌ Found $NODE_PROCS Node.js processes:"
    ps aux | grep -E "(node|npm)" | grep -v grep | grep -v "check-node.sh"
fi

echo ""

# Check common ports
echo "🔍 Checking common development ports..."
for port in 3000 3001 8000 8080 9000 5000 4000; do
    if lsof -i:$port >/dev/null 2>&1; then
        echo "❌ Port $port is still in use:"
        lsof -i:$port
    else
        echo "✅ Port $port is free"
    fi
done

echo ""

# Check CPU usage
echo "🔍 Checking CPU usage..."
CPU_USAGE=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//')
if (( $(echo "$CPU_USAGE > 20" | bc -l) )); then
    echo "⚠️  High CPU usage: $CPU_USAGE%"
else
    echo "✅ CPU usage normal: $CPU_USAGE%"
fi