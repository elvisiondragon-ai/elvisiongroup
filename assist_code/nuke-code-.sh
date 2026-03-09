 #!/bin/bash
  echo "🔥 Nuking all Node.js processes..."
  sudo pkill -9 -f node
  sudo pkill -9 -f npm
  sudo pkill -9 -f npx
  sudo killall -9 node 2>/dev/null || true
  sudo killall -9 npm 2>/dev/null || true
  for port in 3000 3001 8000 8080 9000 5000 4000; do
    sudo lsof -ti:$port | xargs sudo kill -9 2>/dev/null || true
  done
  ps aux | grep node | grep -v grep | awk '{print $2}' | xargs sudo kill -9
  2>/dev/null || true
  echo "💀 All Node.js processes terminated"
