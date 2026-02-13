#!/bin/bash

echo "🚀 Starting ShopAuto VPS Setup..."

# 1. Update System
sudo apt-get update -y

# 2. Install Node.js 18
echo "📦 Installing Node.js..."
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install Chrome Dependencies for WhatsApp
echo "🌐 Installing Chrome Dependencies..."
sudo apt-get install -y libgbm-dev wget unzip fontconfig locales gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

# 4. Setup 2GB Swap Memory (Critical for 1GB RAM)
echo "🧠 Setting up Swap Memory..."
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 5. Install Project Dependencies
echo "📥 Installing NPM Packages..."
npm install

# 6. Install and Setup PM2 (Process Manager)
echo "⚙️ Setting up Process Manager..."
sudo npm install -g pm2
pm2 start index.js --name "shopauto-wa"
pm2 save
pm2 startup

echo "✅ Setup Complete!"
echo "-------------------------------------------------------"
echo "Your WhatsApp Backend is now running on port 3000."
echo "1. Open ShopAuto Dashboard on your website."
echo "2. Enter your VPS IP: http://$(hostname -I | awk '{print $1}'):3000"
echo "3. Scan the QR code and enjoy your AI Automation!"
echo "-------------------------------------------------------"
