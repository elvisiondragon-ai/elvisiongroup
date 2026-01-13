import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Mailketing API configuration
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
const LIST_ID = '80713'; 

// Add subscriber to Mailketing list
async function addToMailketingList(email: string, name: string) {
  try {
    console.log(`📋 Adding ${email} to Mailketing list ${LIST_ID}...`);
    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY!,
      list_id: LIST_ID,
      email: email,
      first_name: name ? name.split(' ')[0] : email.split('@')[0],
      last_name: name ? name.split(' ').slice(1).join(' ') : ''
    });

    const response = await fetch(`${MAILKETING_API_URL}/addsubtolist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const result = await response.json();
    console.log('📋 Add to list result:', result);
    return response.ok;
  } catch (error) {
    console.error('❌ Failed to add to list:', error);
    return false;
  }
}

// Send email via Mailketing
async function sendMailketingEmail(email: string, subject: string, htmlContent: string, name: string) {
  try {
    console.log(`📧 Sending email via Mailketing to: ${email}`);
    
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
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const result = await response.text();
    console.log('📧 Mailketing send result:', result);
    
    try {
      const jsonResult = JSON.parse(result);
      return jsonResult;
    } catch {
      return { success: true, response: result };
    }
  } catch (error) {
    console.error('❌ Mailketing send failed:', error);
    throw error;
  }
}

const handler = async (req: Request) => {
  console.log('🚀 Mailketing Ebook Percaya Diri Email Function Started');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const recipientEmail = body.userEmail || body.email;
    if (!recipientEmail) throw new Error('Email address is required');

    const amount = body.amount || 0;
    const reference = body.reference || 'N/A';
    const subscriptionType = body.subscriptionType || 'Paket Pria Alpha';
    const userName = body.userName || recipientEmail.split('@')[0];

    const safeReference = reference || 'N/A';
    const displayAmount = `Rp ${Number(amount).toLocaleString('id-ID')}`;
    const downloadLink = "https://drive.google.com/drive/folders/1P4wdc44vaPquxw6vL2OpmQcENZeUIuNO?usp=sharing";

    await addToMailketingList(recipientEmail, userName);

    const subject = "🔥 AKSES DOWNLOAD: Paket Pria Alpha Anda";
    
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akses Paket Pria Alpha</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f4f4f9; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: #1a2a3a; color: white; padding: 40px 20px; text-align: center; border-bottom: 4px solid #c5a059; }
        .header h1 { margin: 0; font-size: 24px; color: #c5a059; }
        .content { padding: 40px 30px; }
        .btn { display: inline-block; background: #c5a059; color: #1a2a3a; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; text-transform: uppercase; letter-spacing: 1px; }
        .btn:hover { background: #d4af6a; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .details { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; border: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Akses Pria Alpha Terbuka</h1>
        </div>
        <div class="content">
            <h2>Halo ${userName},</h2>
            <p>Selamat! Pembayaran Anda telah dikonfirmasi. Anda sekarang memiliki akses penuh ke <strong>Paket Pria Alpha</strong>.</p>
            <p>Folder di bawah ini berisi Ebook "The Alpha Code" dan file Terapi Audio (Alpha & Theta) untuk memprogram ulang rasa percaya diri Anda.</p>
            
            <div style="text-align: center;">
                <a href="${downloadLink}" class="btn">
                    AKSES MATERI SEKARANG
                </a>
            </div>

            <p><strong>Instruksi Penting:</strong></p>
            <ul>
                <li>Gunakan earphone saat mendengarkan audio.</li>
                <li>Dengarkan audio "Deep Alpha Reset" setiap malam sebelum tidur.</li>
                <li>Gunakan audio "Morning Glory" untuk memulai pagi Anda dengan energi maskulin.</li>
            </ul>

            <div class="details">
                <p><strong>Referensi Order:</strong> ${safeReference}</p>
                <p><strong>Jumlah Dibayar:</strong> ${displayAmount}</p>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 eL Vision Group. Hak Cipta Dilindungi.</p>
            <p>Butuh bantuan? Balas email ini atau hubungi Admin via WhatsApp.</p>
        </div>
    </div>
</body>
</html>`;

    const emailResult = await sendMailketingEmail(recipientEmail, subject, htmlContent, userName);
    console.log("✅ Mailketing Pria Alpha email sent successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email sent successfully',
      mailketing_result: emailResult
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