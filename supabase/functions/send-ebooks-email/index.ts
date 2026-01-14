import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Mailketing API configuration
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
const LIST_ID = '80713'; // Default List ID

// --- PRODUCT CONFIGURATION ---
const PRODUCT_TEMPLATES: Record<string, any> = {
  'ebook_diet': {
    subject: "🥗 AKSES DIET: Program Diet eL-Vision Anda",
    downloadLink: "https://docs.google.com/document/d/1Xy--tVqilrJ-YNeQXXc9OjiDvmDCC_4l/edit?usp=sharing&ouid=105986209873893322274&rtpof=true&sd=true",
    color: "#4CAF50", // Green
    title: "Program Diet Dimulai!",
    description: "Terima kasih telah bergabung. Panduan lengkap diet Anda siap diakses.",
    instructions: [
      "Baca panduan pola makan dengan teliti.",
      "Siapkan bahan makanan sesuai daftar belanja.",
      "Mulai jurnal harian Anda besok pagi."
    ]
  },
  'ebook_elvision': {
    subject: "📘 DOWNLOAD: Ebook eL Vision Premium",
    downloadLink: "https://drive.google.com/drive/folders/17yvGGDVqT4BbymvKsTXZhoU_XKM4qD3S?usp=sharing",
    color: "#2196F3", // Blue
    title: "Akses Ebook Terbuka",
    description: "Selamat! Anda kini memiliki akses ke perpustakaan pengetahuan eL Vision.",
    instructions: [
      "Unduh ebook ke perangkat Anda.",
      "Pelajari materi dasar terlebih dahulu.",
      "Gabung komunitas Telegram jika tersedia."
    ]
  },
  'ebook_health20': {
    subject: "🌿 AKSES DOWNLOAD: Protokol Pemulihan Kesehatan Anda",
    downloadLink: "https://drive.google.com/drive/folders/1E2iYI6JLtZ73F3jggHEHkke6IniRWaxB?usp=sharing",
    color: "#004d40", // Teal/Dark Green
    title: "Mulai Perjalanan Kesembuhan",
    description: "Terima kasih atas kepercayaan Anda. Folder ini berisi Ebook dan Terapi Audio untuk pemulihan.",
    instructions: [
      "Dengarkan audio setiap malam sebelum tidur (wajib earphone).",
      "Baca ebook untuk protokol diet.",
      "Lakukan konsisten minimal 21 hari."
    ]
  },
  'ebook_percayadiri': {
    subject: "🔥 AKSES DOWNLOAD: Paket Pria Alpha Anda",
    downloadLink: "https://drive.google.com/drive/folders/1P4wdc44vaPquxw6vL2OpmQcENZeUIuNO?usp=sharing",
    color: "#1a2a3a", // Dark Navy
    accentColor: "#c5a059", // Gold
    title: "Akses Pria Alpha Terbuka",
    description: "Selamat! Anda sekarang memiliki akses penuh ke Paket Pria Alpha (Audio & Ebook).",
    instructions: [
      "Gunakan earphone untuk Audio Therapy.",
      "Dengarkan 'Deep Alpha Reset' saat akan tidur.",
      "Dengarkan 'Morning Glory' saat bangun pagi."
    ]
  },
  'ebook_feminine': {
    subject: "✨ AKSES DOWNLOAD: Paket Feminine Magnetism Anda",
    downloadLink: "https://drive.google.com/drive/folders/1B_SmtekAodf5G8fWF3tVjgcenjjVtbTZ?usp=sharing", // Update link if needed
    color: "#e11d48", // Rose 600
    accentColor: "#ffffff",
    title: "Akses Feminine Magnetism Terbuka",
    description: "Selamat! Anda sekarang memiliki akses penuh ke Paket Feminine Magnetism (Audio & Ebook).",
    instructions: [
      "Gunakan earphone agar gelombang Theta bekerja maksimal.",
      "Dengarkan 'Goddess Awakening' setiap malam sebelum tidur.",
      "Dengarkan 'Morning Radiance' untuk memulai hari dengan energi feminin."
    ]
  },
  'ebook_uangpanas': {
    subject: "🔥 AKSES DOWNLOAD: Sistem Uang Panas (Lead Magnet + Audio)",
    downloadLink: "https://drive.google.com/file/d/1R_AEFpjaxBwYnxLGevVPKHf548pMn9gE/view?usp=sharing", // Placeholder link, please update
    color: "#b91c1c", // Red 700
    accentColor: "#facc15", // Yellow 400
    title: "Sistem Uang Panas Diaktifkan!",
    description: "Terima kasih! Anda telah mengambil langkah cerdas. Berikut adalah akses ke 'senjata' rahasia Anda.",
    instructions: [
      "Download Ebook & Lead Magnet Pack segera.",
      "Dengarkan Audio 'Money Magnet' setiap pagi dan malam.",
      "Pelajari modul Affiliate untuk mulai hasilkan komisi 50%."
    ]
  },
  'vip_coaching': {
    subject: "💎 VIP CONFIRMATION: 6 Weeks eL Vision Program",
    downloadLink: "https://wa.me/62895325633487?text=HI%20I%20have%20paid%20for%20VIP%206%20weeks",
    color: "#004d40", // Teal/Dark Green
    title: "Welcome to the VIP Program",
    description: "Your payment has been received. The next step is to confirm your 1:1 session schedule.",
    instructions: [
      "Click the button below to connect with our WhatsApp Admin.",
      "Send the pre-filled confirmation message.",
      "Our admin will arrange your first session schedule."
    ],
    btnText: "WHATSAPP CONFIRMATION"
  }
};

// Helper to match product name to key
function getProductKey(productName: string): string {
  if (!productName) return 'ebook_elvision'; // Default fallback
  const lower = productName.toLowerCase();
  
  if (lower.includes('diet')) return 'ebook_diet';
  if (lower.includes('health') || lower.includes('pemulihan')) return 'ebook_health20';
  if (lower.includes('percayadiri') || lower.includes('pria alpha') || lower.includes('alpha')) return 'ebook_percayadiri';
  if (lower.includes('feminine') || lower.includes('magnetism')) return 'ebook_feminine';
  if (lower.includes('uangpanas') || lower.includes('uang panas')) return 'ebook_uangpanas';
  if (lower.includes('vip') || lower.includes('3000') || lower.includes('coaching')) return 'vip_coaching';
  
  return 'ebook_elvision';
}

// Add subscriber to Mailketing list
async function addToMailketingList(email: string, name: string) {
  try {
    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY!,
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
    console.error('❌ Failed to add to list:', error);
    return false;
  }
}

// Send email via Mailketing
async function sendMailketingEmail(email: string, subject: string, htmlContent: string) {
  try {
    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY!,
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
    try {
      return JSON.parse(result);
    } catch {
      return { success: true, response: result };
    }
  } catch (error) {
    console.error('❌ Mailketing send failed:', error);
    throw error;
  }
}

const handler = async (req: Request) => {
  console.log('🚀 SEND-EBOOKS-EMAIL Edge Function Started');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const recipientEmail = body.userEmail || body.email;
    if (!recipientEmail) throw new Error('Email address is required');

    const amount = body.amount || 0;
    const reference = body.reference || 'N/A';
    const productNameInput = body.subscriptionType || body.productName || 'Unknown Product';
    const userName = body.userName || recipientEmail.split('@')[0];

    // Determine Product Template
    const productKey = getProductKey(productNameInput);
    const template = PRODUCT_TEMPLATES[productKey];
    
    console.log(`📊 Processing email for: ${recipientEmail} | Product: ${productNameInput} -> Key: ${productKey}`);

    const displayAmount = amount < 1000 
        ? `$${Number(amount).toFixed(2)} USD` 
        : `Rp ${Number(amount).toLocaleString('id-ID')}`;

    // Add to list first
    await addToMailketingList(recipientEmail, userName);

    // Generate HTML
    const mainColor = template.color || '#333';
    const accentColor = template.accentColor || '#ffffff';
    
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f4f4f9; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: ${mainColor}; color: ${accentColor}; padding: 40px 20px; text-align: center; border-bottom: 4px solid ${template.accentColor ? template.accentColor : 'rgba(255,255,255,0.2)'}; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 40px 30px; }
        .btn { display: inline-block; background: ${mainColor}; color: ${accentColor}; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; text-transform: uppercase; letter-spacing: 1px; transition: opacity 0.3s; }
        .btn:hover { opacity: 0.9; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; }
        .details { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; border: 1px solid #eee; }
        .instruction-list { background: #fff; border: 1px dashed ${mainColor}; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .instruction-list ul { margin: 0; padding-left: 20px; }
        .instruction-list li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${template.title}</h1>
        </div>
        <div class="content">
            <h2>Halo ${userName},</h2>
            <p>${template.description}</p>
            
            <div style="text-align: center;">
                <a href="${template.downloadLink}" class="btn">
                    ${template.btnText || 'CLICK ME'}
                </a>
            </div>

            <div class="instruction-list">
                <p style="font-weight: bold; margin-top: 0; color: ${mainColor};">Instruksi:</p>
                <ul>
                    ${template.instructions.map((inst: string) => `<li>${inst}</li>`).join('')}
                </ul>
            </div>

            <div class="details">
                <p><strong>Produk:</strong> ${productNameInput}</p>
                <p><strong>Referensi:</strong> ${reference}</p>
                <p><strong>Total:</strong> ${displayAmount}</p>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 eL Vision Group. All Rights Reserved.</p>
            <p>Butuh bantuan? Balas email ini atau hubungi kami via WhatsApp.</p>
        </div>
    </div>
</body>
</html>`;

    // Send Email
    const emailResult = await sendMailketingEmail(recipientEmail, template.subject, htmlContent);
    console.log("✅ Email sent successfully");

    // BCC to Admin
    try {
        await sendMailketingEmail('support@elvisiongroup.com', `[ADMIN] SENT: ${template.subject}`, htmlContent);
    } catch(e) {
        console.error("⚠️ BCC Failed");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email sent successfully',
      mailketing_result: emailResult,
      product_detected: productKey
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("❌ Error sending email:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};

serve(handler);
