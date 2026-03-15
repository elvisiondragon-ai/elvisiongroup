// ==================================================================================
// 1. FREE PRODUK DIGITAL ada di send-ebooks-free
// 2. SUbscription bulanan dan fisik di send-payment-email
// 3. Khusus Ebook Paid ada di send-ebooks-email
//
// KHUSUS FREE PRODUK DIGITAL DISINI
// ==================================================================================

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Mailketing API configuration
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
const LIST_ID = '80713';

// WhatsApp API Configuration
const WATZAP_TOKEN = "23b62c4255c43489f55fa84693dc0451d89ea5a5c9ec00021a7b77287cdce0b8";
const WATZAP_URL = "https://watzapp.web.id/api/message";

// --- FREE EBOOK PRODUCT CONFIGURATION (Dark Feminine) ---
const FREE_EBOOK_TEMPLATES: Record<string, any> = {
    'free_ebook_darkfeminine_id': {
        subject: "🌙 Ebook GRATIS Dark Feminine - Khusus Untukmu!",
        downloadLink: "https://drive.google.com/file/d/1F8Y7CT76b41MhiZ-osqec8W3olhHEag7/view?usp=sharing",
        color: "#e11d48",
        accentColor: "#ffffff",
        title: "Ebook Gratis Dark Feminine",
        description: "Halo! Berikut adalah link download Ebook Gratis Dark Feminine yang kamu minta. Selamat membaca dan semoga bermanfaat!",
        instructions: [
            "Klik tombol di bawah untuk mengakses ebook gratis kamu.",
            "Simpan file di perangkat kamu agar bisa dibaca kapan saja.",
            "Tolong ketik <strong>Ok</strong> agar kami bisa menghubungi kamu kedepannya ya."
        ],
        btnText: "DOWNLOAD EBOOK GRATIS",
        waMessage: (name: string, link: string) =>
            `Halo kak ${name}, Silahkan Ambil Ebook Gratis Dark Feminine:\n${link}\n\nTolong ketik *Ok* agar saya bisa hubungi kakak kedepannya ya.`,
        lang: "id"
    },
    'free_ebook_darkfeminine_en': {
        subject: "🌙 FREE Dark Feminine Ebook - Just For You!",
        downloadLink: "https://drive.google.com/file/d/17LcRV9eRblAPqGZqeQtiilWNtzrwnQGY/view?usp=sharing",
        color: "#e11d48",
        accentColor: "#ffffff",
        title: "Free Dark Feminine Ebook",
        description: "Hi! Here is your FREE Dark Feminine Ebook download link as requested. Happy reading and we hope it helps you!",
        instructions: [
            "Click the button below to access your free ebook.",
            "Save the file on your device so you can read it anytime.",
            "Please reply <strong>Ok</strong> so we can stay in touch with you."
        ],
        btnText: "DOWNLOAD FREE EBOOK",
        waMessage: (name: string, link: string) =>
            `Hi ${name}, Here is your FREE Dark Feminine Ebook:\n${link}\n\nPlease reply *Ok* so we can stay connected!`,
        lang: "en"
    },
    'free_ebook_darkfeminine_ph': {
        subject: "🌙 LIBRENG Dark Feminine Ebook - Para Sa Iyo!",
        downloadLink: "https://drive.google.com/file/d/1fl0AJ9yTxn6srHRyagWZMju38FilYR83/view?usp=sharing",
        color: "#e11d48",
        accentColor: "#ffffff",
        title: "Libreng Dark Feminine Ebook",
        description: "Halo! Narito ang iyong link para i-download ang Libreng Dark Feminine Ebook na hiniling mo. Masayang pagbabasa at sana makatulong ito sa iyo!",
        instructions: [
            "I-click ang button sa ibaba para ma-access ang iyong libreng ebook.",
            "I-save ang file sa iyong device para mabasa mo ito kahit saan.",
            "Pakipagsagot ng <strong>Ok</strong> para makapag-ugnayan tayo."
        ],
        btnText: "I-DOWNLOAD ANG LIBRENG EBOOK",
        waMessage: (name: string, link: string) =>
            `Halo ${name}, Narito ang iyong LIBRENG Dark Feminine Ebook:\n${link}\n\nPakilagay ng *Ok* para makontak kita sa susunod ha.`,
        lang: "tl"
    },
    'free_ebook_saham': {
        subject: "🎁 Ebook GRATIS: Strategi Saham Ultimate - Khusus Untukmu!",
        downloadLink: "https://drive.google.com/file/d/1bNqIBaKrV5I8wqrWXJ2LRfv_NBoFId6K/view?usp=sharing",
        color: "#3b82f6",
        accentColor: "#ffffff",
        title: "Ebook Gratis Saham Ultimate",
        description: "Halo! Berikut adalah link download Ebook Gratis Saham Ultimate yang kamu minta. Selamat membaca dan semoga membantu strategi investasi Anda!",
        instructions: [
            "Klik tombol di bawah untuk mengakses ebook gratis kamu.",
            "Simpan file di perangkat kamu agar bisa dibaca kapan saja.",
            "Tolong ketik <strong>Ok</strong> agar kami bisa menghubungi anda untuk update data whale terbaru ya."
        ],
        btnText: "DOWNLOAD EBOOK GRATIS",
        waMessage: (name: string, link: string) =>
            `Halo kak ${name}, Silahkan Ambil Ebook Gratis Strategi Saham Ultimate:\n${link}\n\nTolong ketik *Ok* agar saya bisa hubungi kakak untuk update data whale terbaru ya.`,
        lang: "id"
    }
};

// Map request lang param → product key
function getProductKey(lang: string): string {
    switch (lang?.toLowerCase()) {
        case 'en': return 'free_ebook_darkfeminine_en';
        case 'ph': return 'free_ebook_darkfeminine_ph';
        case 'saham': return 'free_ebook_saham';
        case 'id':
        default: return 'free_ebook_darkfeminine_id';
    }
}

// Add subscriber to Mailketing list
async function addToMailketingList(email: string, name: string) {
    try {
        if (!MAILKETING_API_KEY) return false;
        const params = new URLSearchParams({
            api_token: MAILKETING_API_KEY,
            list_id: LIST_ID,
            email: email,
            first_name: name ? name.split(' ')[0] : email.split('@')[0],
            last_name: name ? name.split(' ').slice(1).join(' ') : ''
        });
        await fetch(`${MAILKETING_API_URL}/addsubtolist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });
        return true;
    } catch (error) {
        console.error('❌ Failed to add to Mailketing list:', error);
        return false;
    }
}

// Send email via Mailketing
async function sendMailketingEmail(email: string, subject: string, htmlContent: string) {
    try {
        if (!MAILKETING_API_KEY) {
            console.warn('⚠️ MAILKETING_API_KEY not set, skipping email.');
            return { skipped: true };
        }
        const params = new URLSearchParams({
            api_token: MAILKETING_API_KEY,
            email: 'support@elvisiongroup.com',
            from_name: 'eL Vision Group',
            from_email: 'support@elvisiongroup.com',
            recipient: email,
            subject: subject,
            content: htmlContent
        });
        const response = await fetch(`${MAILKETING_API_URL}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params
        });
        const result = await response.text();
        try { return JSON.parse(result); } catch { return { success: true, response: result }; }
    } catch (error) {
        console.error('❌ Mailketing send failed:', error);
        return { error: String(error) };
    }
}

// Send WhatsApp message via ShopAuto VPS
async function sendWhatsApp(phone: string, message: string) {
    try {
        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.slice(1);
        } else if (cleanPhone.startsWith('8')) {
            cleanPhone = '62' + cleanPhone;
        }

        console.log(`🚀 [WATZAPP] Sending message to ${cleanPhone}...`);
        
        const response = await fetch(WATZAP_URL, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                token: WATZAP_TOKEN,
                to: cleanPhone, 
                message: message 
            })
        });
        
        const resultText = await response.text();
        console.log(`📡 [WATZAPP] Response Status: ${response.status}`, resultText);
        
        if (response.ok) {
            console.log(`✅ WhatsApp sent to ${cleanPhone}`);
            return true;
        } else {
            console.error(`⚠️ Failed to send WA to ${cleanPhone}:`, resultText);
            return false;
        }
    } catch (error) {
        console.error('❌ WhatsApp Error:', error);
        return false;
    }
}

const handler = async (req: Request) => {
    console.log('🚀 SEND-EBOOKS-FREE Edge Function Started');

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const recipientEmail = body.userEmail || body.email;
        if (!recipientEmail) throw new Error('Email address is required');

        const userName = body.userName || recipientEmail.split('@')[0];
        const userPhone = body.phone || body.phone_number || '';
        const lang = body.id || body.lang || 'id'; // "id" | "en" | "ph"

        const productKey = getProductKey(lang);
        const template = FREE_EBOOK_TEMPLATES[productKey];

        console.log(`📊 Free Ebook request: ${recipientEmail} | lang: ${lang} → key: ${productKey}`);

        // 1. Add to Mailketing list
        await addToMailketingList(recipientEmail, userName);

        // 2. Build HTML email
        const htmlLang = template.lang || 'id';
        const greeting = htmlLang === 'en' ? 'Hello' : (htmlLang === 'tl' ? 'Halo' : 'Halo');
        const instructionLabel = htmlLang === 'en' ? 'Instructions:' : (htmlLang === 'tl' ? 'Mga Tagubilin:' : 'Instruksi:');
        const helpText = htmlLang === 'en'
            ? 'Need help? Reply to this email or contact us via WhatsApp.'
            : (htmlLang === 'tl'
                ? 'Kailangan ng tulong? Sumagot sa email na ito o makipag-ugnayan sa amin sa WhatsApp.'
                : 'Butuh bantuan? Balas email ini atau hubungi kami via WhatsApp.');

        const htmlContent = `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f4f4f9; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: ${template.color}; color: ${template.accentColor}; padding: 40px 20px; text-align: center; border-bottom: 4px solid rgba(255,255,255,0.2); }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 40px 30px; }
        .btn { display: inline-block; background: ${template.color}; color: ${template.accentColor}; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; text-transform: uppercase; letter-spacing: 1px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
        .instruction-list { background: #fff; border: 1px dashed ${template.color}; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .instruction-list ul { margin: 0; padding-left: 20px; }
        .instruction-list li { margin-bottom: 8px; }
        .free-badge { display: inline-block; background: #facc15; color: #000; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; margin-bottom: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="free-badge">FREE EBOOK 🎁</span>
            <h1>${template.title}</h1>
        </div>
        <div class="content">
            <h2>${greeting} ${userName},</h2>
            <p>${template.description}</p>

            <div style="text-align: center;">
                <a href="${template.downloadLink}" class="btn">
                    ${template.btnText}
                </a>
            </div>

            <div class="instruction-list">
                <p style="font-weight: bold; margin-top: 0; color: ${template.color};">${instructionLabel}</p>
                <ul>
                    ${template.instructions.map((inst: string) => `<li>${inst}</li>`).join('')}
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 eL Vision Group. All Rights Reserved.</p>
            <p>${helpText}</p>
        </div>
    </div>
</body>
</html>`;

        // 3. Send email
        let emailResult = null;
        try {
            emailResult = await sendMailketingEmail(recipientEmail, template.subject, htmlContent);
            console.log("✅ Free ebook email sent to:", recipientEmail);
        } catch (e) {
            console.error("⚠️ Email send failed (non-fatal):", e);
        }

        // 4. Send WhatsApp if phone provided
        let waResult = false;
        if (userPhone) {
            const waMessage = template.waMessage(userName, template.downloadLink);
            waResult = await sendWhatsApp(userPhone, waMessage);
        } else {
            console.log("ℹ️ No phone provided, skipping WhatsApp.");
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Free ebook sent successfully',
            product_key: productKey,
            email_sent: !!emailResult,
            wa_sent: waResult
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });

    } catch (error: any) {
        console.error("❌ Error in send-ebooks-free:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
};

serve(handler);
