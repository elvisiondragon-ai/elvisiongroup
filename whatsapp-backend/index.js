const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let qrCodeData = null;
let isReady = false;

// Initialize WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', 
            '--disable-gpu'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    // Generate QR code as a Data URL for display in browser
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Error generating QR code', err);
            return;
        }
        qrCodeData = url;
    });
});

client.on('ready', () => {
    console.log('Client is ready!');
    isReady = true;
    qrCodeData = null; // Clear QR code when ready
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.initialize();

// --- API Endpoints ---

// 1. Home / Status / QR Display
app.get('/', (req, res) => {
    if (isReady) {
        res.send(`
            <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1 style="color: green;">WhatsApp Client is Ready! ✅</h1>
                    <p>You can now send messages via the API.</p>
                </body>
            </html>
        `);
    } else if (qrCodeData) {
        res.send(`
            <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1>Scan this QR Code</h1>
                    <img src="${qrCodeData}" alt="QR Code" />
                    <p>Refresh if you don't see the code yet.</p>
                </body>
            </html>
        `);
    } else {
        res.send(`
            <html>
                <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                    <h1>Initializing...</h1>
                    <p>Please wait and refresh this page in a few seconds to see the QR code.</p>
                </body>
            </html>
        `);
    }
});

// 2. Send Message API
app.post('/send-message', async (req, res) => {
    if (!isReady) {
        return res.status(503).json({ error: 'Client not ready. Please scan QR code first.' });
    }

    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ error: 'Missing "number" or "message" in body' });
    }

    try {
        // Format number: remove '+' and ensure it ends with '@c.us'
        const chatId = number.replace(/\+/g, '') + '@c.us';
        
        await client.sendMessage(chatId, message);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
