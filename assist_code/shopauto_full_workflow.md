# ShopAuto AI: Full System Workflow & Reference

This document tracks all the steps and code implemented to build your private Shopee Automation ecosystem.

## 1. Database Setup (Supabase)
Run this SQL in your Supabase Editor to create the storage for your AI and WhatsApp settings:

```sql
-- 1. Add settings column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS shopauto_settings JSONB DEFAULT '{}'::jsonb;

-- 2. Cleanup old column (Optional)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS shope_settings;

-- 3. Speed up lookups for webhooks
CREATE INDEX IF NOT EXISTS idx_profiles_shopauto_shop_id 
ON public.profiles ((shopauto_settings->>'shopeShopId'));
```

## 2. VPS Infrastructure (Hostinger/Domainesia)
These are the commands used to turn your 1GB RAM Ubuntu Server into an AI-WhatsApp Powerhouse.

### Step A: Install Core Engines
```bash
# Update Ubuntu
sudo apt-get update

# Install Node.js 18
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Chrome & Graphics Libraries (Required for WhatsApp)
sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxext6 libxfixes3 libxrandr2 libgbm1 libasound2 libpango-1.0-0 libpangocairo-1.0-0 libx11-6 libx11-xcb1 libxcb1 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 lsb-release xdg-utils
```

### Step B: Setup Swap RAM (Critical for 1GB VPS)
Prevents the server from crashing when AI and WhatsApp run together.
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Step C: Initialize Backend
```bash
mkdir -p ~/shopauto-wa && cd ~/shopauto-wa
npm install whatsapp-web.js qrcode qrcode-terminal express cors
```

## 3. The WhatsApp Engine Logic (`index.js`)
This is the final optimized code running on your VPS (Port 8080):

```javascript
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

let qrCodeData = null;
let isReady = false;
let logs = [];

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    }
});

client.on('qr', (qr) => {
    qrcodeTerminal.generate(qr, { small: true });
    qrcode.toDataURL(qr, (err, url) => { qrCodeData = url; });
});

client.on('ready', () => {
    isReady = true;
    console.log('✅ BACKEND ONLINE');
});

client.initialize();

// Dashboard & API
app.get('/', (req, res) => {
    res.send(isReady ? '<h1>Status: Ready ✅</h1>' : '<h1>Scan QR in Terminal</h1>');
});

app.get('/status', (req, res) => { res.json({ isReady, qrCodeData }); });

app.post('/send-message', async (req, res) => {
    const { number, message } = req.body;
    try {
        const chatId = number.includes('@') ? number.trim() : `${number.replace(/[\s\+\-]/g, "")}@c.us`;
        await client.sendMessage(chatId, message);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => { console.log('Server live on port ' + port); });
```

## 4. Execution Commands
To keep the server running 24/7 even after you close the terminal:

```bash
# 1. Install PM2
sudo npm install -g pm2

# 2. Start Project
pm2 start index.js --name "shopauto-ai"

# 3. Enable Auto-Restart on VPS reboot
pm2 save
pm2 startup
```

## 5. Website Integration
1. Go to `app.elvisiongroup.com/shopauto`.
2. Enter your VPS URL: `http://202.155.91.45:8080`.
3. Select **Admin Kamu**.
4. Enjoy your private AI Automation!
