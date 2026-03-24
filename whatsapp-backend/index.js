const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const qrcodeTerminal = require('qrcode-terminal');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());

// --- CONFIG ---
const API_KEY = process.env.WA_API_KEY || "aae95e77d1e8af24574a433272785c9b";
const GEMINI_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY_HERE";
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const aiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let qrCodeData = null;
let currentStatus = "INITIALIZING";

// Auth Middleware
const auth = (req, res, next) => {
    const key = req.headers['x-api-key'];
    if (key === API_KEY) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

console.log('🚀 BOOTING SHOPAUTO ULTIMATE ENGINE...');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--enable-low-end-device-mode',
            '--single-process',
            '--no-zygote'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('✅ SCAN THIS QR:');
    qrcodeTerminal.generate(qr, { small: true });
    qrcode.toDataURL(qr, (err, url) => { 
        if (!err) {
            qrCodeData = url;
            currentStatus = "QR_READY";
            io.emit('qr-user', url);
            io.emit('status-user', currentStatus);
        } 
    });
});

client.on('authenticated', () => {
    currentStatus = "AUTHENTICATED";
    io.emit('status-user', currentStatus);
});

client.on('ready', () => {
    console.log('✅ SYSTEM ONLINE');
    currentStatus = "READY";
    qrCodeData = null;
    io.emit('status-user', currentStatus);
});

client.initialize();

// API Endpoints
app.get('/status', (req, res) => { 
    res.json({ 
        isReady: currentStatus === "READY", 
        number: client.info ? client.info.wid.user : null,
        qrCodeData, // legacy
        user: {
            status: currentStatus,
            qr: qrCodeData
        }
    }); 
});

app.get('/groups', auth, async (req, res) => {
    try {
        if (currentStatus !== "READY") {
            return res.status(503).json({ error: 'WhatsApp not connected' });
        }
        const chats = await client.getChats();
        const groups = chats
            .filter(chat => chat.isGroup)
            .map(chat => ({
                id: chat.id._serialized,
                name: chat.name,
                count: chat.groupMetadata ? chat.groupMetadata.participants.length : 0
            }));
        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/send-message', auth, async (req, res) => {
    const { number, message, sender } = req.body;
    console.log(`📩 INCOMING MESSAGE REQUEST: to ${number} (Sender: ${sender || 'default'})`);

    // --- WHATSAPP SENDER LOGIC ---
    if (currentStatus !== "READY" && sender !== 'admin') {
        console.log('❌ FAILED: Custom Client not ready');
        return res.status(503).json({ error: 'Not ready' });
    }
    
    try {
        const chatId = number.includes('@') ? number.trim() : `${number.replace(/[\s\+\-]/g, "")}@c.us`;
        
        // Note: Implement specific logic for 'sender: admin' if your bot handles multiple sessions
        await client.sendMessage(chatId, message);
        
        console.log('✅ MESSAGE SENT');
        res.json({ success: true });
    } catch (error) { 
        console.log(`❌ SEND ERROR: ${error.message}`);
        res.status(500).json({ error: error.message }); 
    }
});

// TEST AI ENDPOINT
app.post('/ask-ai', auth, async (req, res) => {
    try {
        const result = await aiModel.generateContent(req.body.prompt);
        const response = await result.response;
        res.json({ reply: response.text() });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/disconnect', auth, async (req, res) => {
    try {
        await client.logout();
        currentStatus = "INITIALIZING";
        qrCodeData = null;
        io.emit('status-user', currentStatus);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

server.listen(3000, () => { console.log('Server running on port 3000'); });
