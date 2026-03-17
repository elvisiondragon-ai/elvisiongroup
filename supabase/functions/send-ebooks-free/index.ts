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

// WhatsApp API Configuration (WAPI)
const WAPI_TOKEN = Deno.env.get('WAPI_TOKEN') || "rvpwk8dkih9m";
const WAPI_URL = Deno.env.get('WAPI_URL') || "https://api.elvisiongroup.com/api/send";
const WAPI_SESSION = Deno.env.get('WAPI_SESSION') || "renata";

// --- FREE EBOOK PRODUCT CONFIGURATION (Dark Feminine) ---
const FREE_EBOOK_TEMPLATES: Record<string, any> = {
    'free_ebook_darkfeminine_id': {
        subject: "Ebook Gratis Dark Feminine - Khusus Untukmu!",
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
        subject: "Free Dark Feminine Ebook - Just For You!",
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
        subject: "Libreng Dark Feminine Ebook - Para Sa Iyo!",
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
        subject: "Ebook Gratis: Strategi Saham Ultimate - Khusus Untukmu!",
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
        const mailketingParams = {
            api_token: MAILKETING_API_KEY,
            email: 'support@elvisiongroup.com',
            from_name: 'eL Vision Group',
            from_email: 'support@elvisiongroup.com',
            recipient: email,
            subject: subject,
            content: htmlContent
        };
        
        console.log('📤 Sending to Mailketing /send:', JSON.stringify(mailketingParams, null, 2));

        const response = await fetch(`${MAILKETING_API_URL}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(mailketingParams).toString()
        });
        const result = await response.text();
        console.log('RAW RESULT:', result);
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
        
        const response = await fetch(WAPI_URL, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                session: WAPI_SESSION,
                token: WAPI_TOKEN,
                to: cleanPhone, 
                message: message 
            })
        });
        
        if (response.ok) {
            console.log(`✅ WhatsApp sent to ${cleanPhone}`);
            return true;
        } else {
            console.error(`⚠️ Failed to send WA (WAPI) to ${cleanPhone}`);
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

        // //YOU DEV DONT ACT SMARTASS, this has rule standar no fancy email will be error Must light theme must with unsubscribe, no emote in subject (emote only in content)
        const htmlContent = `<!DOCTYPE html>
<html lang="${htmlLang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f6f8fc; margin: 0; padding: 20px; color: #202124; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; background-color: #ffffff; border-radius: 8px; }
        .header { border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #5f6368; text-align: center; }
        .details-box { background-color: #f8f9fa; padding: 15px; border: 1px solid #e0e0e0; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background-color: #1a73e8; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .unsubscribe { color: #5f6368; text-decoration: underline; margin-top: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">${template.title}</h1>
        </div>
        <div class="content">
            <h2 style="font-size: 18px;">${greeting} ${userName},</h2>
            <p>${template.description}</p>

            <div style="text-align: center;">
                <a href="${template.downloadLink}" class="button">${template.btnText}</a>
            </div>

            <div class="details-box">
                <p style="margin-top: 0;"><strong>${instructionLabel}</strong></p>
                <ul>
                    ${template.instructions.map((inst: string) => `<li>${inst}</li>`).join('')}
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 eL Vision Group. All Rights Reserved.</p>
            <p>${helpText}</p>
            <a href="https://track.mailketing.co.id/unsubscribex.php?id=16720&em=${encodeURIComponent(recipientEmail)}" class="unsubscribe">Unsubscribe</a>
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
