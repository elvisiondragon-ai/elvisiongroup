import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Mailketing API configuration
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
const LIST_ID = '80713'; // Using same list ID as diet for now, can be changed

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
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('📨 Received payload for ebook email:', body);

    const recipientEmail = body.userEmail || body.email;
    if (!recipientEmail) {
      throw new Error('Email address is required');
    }

    const amount = body.amount || 0;
    const reference = body.reference || 'N/A';
    const subscriptionType = body.subscriptionType || 'Ebook Percaya Diri';
    const userName = body.userName || recipientEmail.split('@')[0];

    console.log('📊 Processed data for ebook email:', { 
      recipientEmail, 
      amount, 
      reference: reference || 'N/A', 
      subscriptionType 
    });

    const safeReference = reference || 'N/A';
    const safeAmount = amount || 0;
    const safeSubscriptionType = subscriptionType || 'Ebook Percaya Diri';
    const downloadLink = "https://drive.google.com/drive/folders/1P4wdc44vaPquxw6vL2OpmQcENZeUIuNO?usp=sharing";

    await addToMailketingList(recipientEmail, userName);

    const subject = "🔥 AKSES MASUK: Paket Pria Alpha Anda";
    
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akses Paket Pria Alpha</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; background-color: #f4f4f4; color: #333; line-height: 1.6; }
        .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .header { background: #1a2a3a; padding: 40px 20px; text-align: center; color: #ffffff; border-bottom: 5px solid #c5a059; }
        .logo-text { font-size: 24px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #c5a059; }
        .main-title { margin-top: 15px; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #1a2a3a; }
        .message { font-size: 16px; margin-bottom: 30px; color: #555; }
        .highlight-box { background: #fffcf0; border: 1px solid #c5a059; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
        .btn-access { display: inline-block; background: #c5a059; color: #1a2a3a; padding: 18px 40px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 18px; text-transform: uppercase; transition: all 0.3s; box-shadow: 0 5px 15px rgba(197, 160, 89, 0.4); }
        .btn-access:hover { background: #d4af6a; transform: translateY(-2px); }
        .order-details { margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
        .detail-item { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
        .footer { background: #f9f9f9; padding: 30px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; }
        .footer a { color: #1a2a3a; text-decoration: none; font-weight: 600; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo-text">eL Vision Ecosystem</div>
            <h1 class="main-title">Akses Pria Alpha Terbuka!</h1>
        </div>
        
        <div class="content">
            <h2 class="greeting">Selamat Datang, ${userName}!</h2>
            
            <p class="message">
                Keputusan Anda hari ini adalah langkah pertama menuju transformasi diri yang permanen. 
                Pembayaran Anda telah kami terima, dan sistem kami telah membuka akses eksklusif untuk Anda.
            </p>

            <div class="highlight-box">
                <p style="font-weight: 600; margin-bottom: 15px; color: #1a2a3a;">Klik tombol di bawah untuk mengakses:</p>
                <ul style="list-style: none; margin-bottom: 20px; color: #555;">
                    <li>✅ Audio Hipnoterapi Alpha & Theta</li>
                    <li>✅ Ebook Panduan Strategi</li>
                    <li>✅ Bonus Materi Tambahan</li>
                </ul>
                <a href="${downloadLink}" class="btn-access">AKSES MATERI SEKARANG</a>
            </div>

            <p class="message" style="font-size: 14px;">
                <strong>Saran Penggunaan:</strong> Mulailah mendengarkan Audio Hipnoterapi malam ini juga sebelum tidur. 
                Pastikan Anda menggunakan headphone/earphone untuk hasil maksimal.
            </p>

            <div class="order-details">
                <p style="font-weight: 700; margin-bottom: 15px; color: #1a2a3a;">Detail Transaksi:</p>
                <div class="detail-item">
                    <span>Produk:</span>
                    <strong>${safeSubscriptionType}</strong>
                </div>
                <div class="detail-item">
                    <span>Total:</span>
                    <strong>Rp ${safeAmount.toLocaleString('id-ID')}</strong>
                </div>
                <div class="detail-item">
                    <span>Ref:</span>
                    <span style="font-family: monospace;">${safeReference}</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; 2026 eL Vision Ecosystem. All Rights Reserved.</p>
            <p style="margin-top: 10px;">
                Butuh bantuan? Hubungi <a href="mailto:support@elvisiongroup.com">support@elvisiongroup.com</a><br>
                atau WhatsApp Admin kami.
            </p>
        </div>
    </div>
</body>
</html>`;

    const emailResult = await sendMailketingEmail(recipientEmail, subject, htmlContent, userName);
    console.log("✅ Mailketing ebook email sent successfully");

    try {
      await sendMailketingEmail('support@elvisiongroup.com', `SENT: ${subject}`, htmlContent, 'Admin Monitor');
      console.log("✅ BCC copy sent to admin");
    } catch (bccError) {
      console.error("⚠️ Failed to send BCC copy:", bccError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Ebook email sent successfully via Mailketing',
      mailketing_result: emailResult,
      recipient: recipientEmail
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });

  } catch (error: any) {
    console.error("❌ Error sending Mailketing ebook email:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
};

serve(handler);
