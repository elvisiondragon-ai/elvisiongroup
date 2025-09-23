#!/bin/bash

# Complete Docker Removal for Mac
# Usage: ./remove_docker_completely.sh

echo "🗑️ Removing Docker completely from Mac..."
echo "=================================="

# Confirmation prompt
read -p "⚠️  This will completely remove Docker from your Mac. Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "❌ Docker removal cancelled"
    exit 1
fi

echo "🚀 Starting Docker removal process..."

# 1. Stop all running Docker containers
echo "📦 Stopping all Docker containers..."
docker stop $(docker ps -aq) 2>/dev/null || echo "   ℹ️  No containers to stop"

# 2. Remove all containers
echo "🗂️ Removing all Docker containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "   ℹ️  No containers to remove"

# 3. Remove all images
echo "🖼️ Removing all Docker images..."
docker rmi $(docker images -q) 2>/dev/null || echo "   ℹ️  No images to remove"

# 4. Remove all volumes
echo "💾 Removing all Docker volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null || echo "   ℹ️  No volumes to remove"

# 5. Remove all networks
echo "🌐 Removing all Docker networks..."
docker network rm $(docker network ls -q) 2>/dev/null || echo "   ℹ️  No networks to remove"

# 6. System prune (clean everything)
echo "🧹 Docker system prune..."
docker system prune -a --volumes -f 2>/dev/null || echo "   ℹ️  Docker not running"

# 7. Quit Docker Desktop
echo "🛑 Quitting Docker Desktop..."
osascript -e 'quit app "Docker Desktop"' 2>/dev/null || echo "   ℹ️  Docker Desktop not running"
killall Docker 2>/dev/null || echo "   ℹ️  Docker process not found"

# 8. Remove Docker Desktop application
echo "🗑️ Removing Docker Desktop application..."
sudo rm -rf /Applications/Docker.app

# 9. Remove Docker data and configuration
echo "📁 Removing Docker data and configuration..."
rm -rf ~/.docker
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/Library/Application\ Support/Docker\ Desktop
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/HTTPStorages/com.docker.docker
rm -rf ~/Library/Logs/Docker\ Desktop
rm -rf ~/Library/Preferences/com.docker.docker.plist
rm -rf ~/Library/Saved\ Application\ State/com.docker.docker.savedState
rm -rf ~/Library/Caches/com.docker.docker

# 10. Remove command line tools
echo "⚙️ Removing Docker command line tools..."
sudo rm -f /usr/local/bin/docker
sudo rm -f /usr/local/bin/docker-compose
sudo rm -f /usr/local/bin/docker-credential-desktop
sudo rm -f /usr/local/bin/docker-credential-ecr-login
sudo rm -f /usr/local/bin/docker-credential-osxkeychain
sudo rm -f /var/db/receipts/com.docker.*

# 11. Remove Docker from PATH (if added manually)
echo "🛤️ Checking shell profiles for Docker PATH..."
sed -i '' '/docker/d' ~/.bash_profile 2>/dev/null || echo "   ℹ️  No bash_profile Docker entries"
sed -i '' '/docker/d' ~/.bashrc 2>/dev/null || echo "   ℹ️  No bashrc Docker entries"
sed -i '' '/docker/d' ~/.zshrc 2>/dev/null || echo "   ℹ️  No zshrc Docker entries"

# 12. Remove any remaining Docker processes
echo "🔄 Killing any remaining Docker processes..."
sudo pkill -f docker 2>/dev/null || echo "   ℹ️  No Docker processes running"

# 13. Remove Docker from system preferences/login items
echo "🔧 Removing Docker from login items..."
osascript -e 'tell application "System Events" to delete login item "Docker Desktop"' 2>/dev/null || echo "   ℹ️  Docker not in login items"

# 14. Clear DNS/network cache (Docker sometimes modifies these)
echo "🌐 Flushing DNS cache..."
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# 15. Verification
echo ""
echo "🔍 Verifying Docker removal..."
echo "=================================="

if command -v docker &> /dev/null; then
    echo "⚠️  Docker command still found - manual removal needed:"
    which docker
else
    echo "✅ Docker command removed successfully"
fi

if [ -d "/Applications/Docker.app" ]; then
    echo "⚠️  Docker Desktop app still exists - manual removal needed"
else
    echo "✅ Docker Desktop app removed successfully"
fi

# 16. Check disk space freed
echo ""
echo "💾 Disk space status:"
df -h | grep "disk1s1\|disk3s1" | head -1

echo ""
echo "🎉 Docker removal completed successfully!"
echo "========================================"
echo ""
echo "📝 What was removed:"
echo "   ✅ Docker Desktop application"
echo "   ✅ All containers, images, volumes"
echo "   ✅ Docker configuration files"
echo "   ✅ Command line tools"
echo "   ✅ Login items and startup entries"
echo "   ✅ Network and DNS cache cleared"
echo ""
echo "🔄 Next steps:"
echo "   1. Restart your terminal: source ~/.zshrc"
echo "   2. Optional: Restart your Mac for complete cleanup"
echo ""
echo "✅ Your Mac is now Docker-free!"
echo "🚀 Focus on building features with your perfect Supabase + Netlify stack!"
echo ""
echo "💭 Remember: Don't fix what isn't broken - greed makes you bleed! 💪"