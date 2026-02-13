# ShopAuto VPS Setup Guide (Ubuntu 22.04)

This guide is optimized for a 1GB RAM VPS (Hostinger Cloud VPS Lite).

## 1. System Preparation (Critical for 1GB RAM)
Login via SSH and run these commands to prepare the environment and add 2GB Swap space:

```bash
# Update and install Node.js + Chrome Dependencies
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs libgbm-dev wget unzip fontconfig locales gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

# Setup 2GB Swap (Prevents crash due to low RAM)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Install Process Manager
sudo npm install -g pm2
```

## 2. Deploying WhatsApp Backend
Upload the content of `elvisiongroup/whatsapp-backend` to your VPS, then:

```bash
cd whatsapp-backend
npm install
pm2 start index.js --name "shopauto-wa"
pm2 save
pm2 startup
```

## 3. Connecting to Dashboard
1. Copy your VPS Public IP (e.g., `http://103.123.123.123:3000`).
2. Go to **ShopAuto Dashboard** -> **Nomor Gudang**.
3. Paste the IP into **WhatsApp Backend URL**.
4. Go to **Admin Identities**, select **Admin Kamu**.
5. Click **Scan WA QR** and scan the appearing code with your WhatsApp.

## 4. Troubleshooting
- If QR doesn't appear: Ensure port 3000 is open in Hostinger Firewall.
- If it crashes: Check swap usage with `free -m`.
- To see logs: `pm2 logs shopauto-wa`.
