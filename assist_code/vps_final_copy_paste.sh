# --- COPY DARI SINI SAMPAI PALING BAWAH ---

# 1. Install DEFINITIVE libraries for Chrome & low-memory stability
sudo apt-get update && \
sudo apt-get install -y chromium-browser gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation lsb-release wget xdg-utils

# 2. Create the project folder and files with LOW-MEMORY optimization
mkdir -p ~/shopauto-wa && cd ~/shopauto-wa && \
cat << 'EOF' > index.js
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

console.log('🚀 Starting ShopAuto ULTIMATE Engine (Optimized for 1GB RAM)...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: '/usr/bin/chromium-browser', // Forces use of installed system chromium
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--enable-low-end-device-mode', // CRITICAL for 1GB RAM
            '--single-process',
            '--no-zygote',
            '--disable-extensions'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('\n✅ QR RECEIVED! SCAN NOW:');
    qrcodeTerminal.generate(qr, { small: true });
    qrcode.toDataURL(qr, (err, url) => { if (!err) qrCodeData = url; });
});

client.on('ready', () => {
    console.log('\n✅ CLIENT IS READY - Automation is active.');
    isReady = true;
    qrCodeData = null;
});

client.initialize();

app.get('/', (req, res) => {
    if (isReady) res.send('<h1 style="color:green;text-align:center;">Connected ✅</h1>');
    else if (qrCodeData) res.send('<div style="text-align:center;"><h1>Scan QR</h1><img src="' + qrCodeData + '" /></div>');
    else res.send('<h1 style="text-align:center;">Booting... Refresh in 30s</h1>');
});

app.get('/status', (req, res) => { res.json({ isReady, qrCodeData }); });

app.post('/send-message', async (req, res) => {
    if (!isReady) return res.status(503).json({ error: 'Not ready' });
    const { number, message } = req.body;
    try {
        const chatId = number.includes('@') ? number.trim() : `${number.replace(/[\s\+\-]/g, "")}@c.us`;
        await client.sendMessage(chatId, message);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.listen(port, () => { console.log('Backend live on port ' + port); });
EOF

cat << 'EOF' > package.json
{
  "name": "shopauto-wa",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "qrcode": "^1.5.3",
    "qrcode-terminal": "^0.12.0",
    "whatsapp-web.js": "^1.23.0"
  }
}
EOF

# 3. Clean install and Run
rm -rf node_modules package-lock.json && \
npm install && \
node index.js

# --- SELESAI ---
