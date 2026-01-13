import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Mailketing API configuration
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
const MAILKETING_EMAIL = Deno.env.get('MAILKETING_EMAIL');
const LIST_ID = '80713'; // Your list ID (Same as diet for now, or change if needed)

// Add subscriber to Mailketing list
async function addToMailketingList(email, name) {
  try {
    console.log(`📋 Adding ${email} to Mailketing list ${LIST_ID}...`);
    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY,
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
async function sendMailketingEmail(email, subject, htmlContent, name) {
  try {
    console.log(`📧 Sending email via Mailketing to: ${email}`);
    
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
    } catch  {
      return {
        success: true,
        response: result
      };
    }
  } catch (error) {
    console.error('❌ Mailketing send failed:', error);
    throw error;
  }
}

const handler = async (req) => {
  console.log('🚀 Mailketing Ebook Health Email Function Started');

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
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
    const subscriptionType = body.subscriptionType || 'Ebook Health Recovery';
    const userName = body.userName || recipientEmail.split('@')[0];

    console.log('📊 Processed data for ebook email:', {
      recipientEmail,
      amount,
      reference: reference || 'N/A',
      subscriptionType
    });

    const safeReference = reference || 'N/A';
    // Display $20 if amount is small (USD), or IDR formatting if large
    const displayAmount = amount < 1000 
        ? `$${Number(amount).toFixed(2)} USD` 
        : `Rp ${Number(amount).toLocaleString('id-ID')}`;

    await addToMailketingList(recipientEmail, userName);

    const subject = "🌿 AKSES DOWNLOAD: Protokol Pemulihan Kesehatan Anda";
    
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akses Protokol Kesehatan Anda</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f4f4f9; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: #004d40; color: white; padding: 40px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 40px 30px; }
        .btn { display: inline-block; background: #00bfa5; color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; margin: 20px 0; text-transform: uppercase; letter-spacing: 1px; }
        .btn:hover { background: #009688; }
        .footer { background: #e0f2f1; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .details { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Mulai Perjalanan Kesembuhan Anda Hari Ini</h1>
        </div>
        <div class="content">
            <h2>Halo ${userName},</h2>
            <p>Terima kasih atas kepercayaan Anda. Anda telah berhasil membeli <strong>Protokol Pemulihan Kesehatan (Health Recovery Protocol)</strong>.</p>
            <p>Folder ini berisi Ebook dan file Terapi Audio yang diperlukan untuk pemrograman ulang bawah sadar Anda.</p>
            
            <div style="text-align: center;">
                <a href="https://drive.google.com/drive/folders/1E2iYI6JLtZ73F3jggHEHkke6IniRWaxB?usp=sharing" class="btn">
                    Akses File Anda Di Sini
                </a>
            </div>

            <p><strong>Instruksi Penggunaan:</strong></p>
            <ul>
                <li>Dengarkan audio setiap malam sebelum tidur menggunakan earphone.</li>
                <li>Baca ebook untuk memahami protokol diet yang disarankan.</li>
                <li>Lakukan secara konsisten selama minimal 21 hari untuk hasil maksimal.</li>
            </ul>

            <div class="details">
                <p><strong>Referensi Order:</strong> ${safeReference}</p>
                <p><strong>Jumlah Dibayar:</strong> ${displayAmount}</p>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 eL Vision Group. Hak Cipta Dilindungi.</p>
            <p>Butuh bantuan? Balas email ini atau hubungi kami via WhatsApp.</p>
        </div>
    </div>
</body>
</html>`;

    const emailResult = await sendMailketingEmail(recipientEmail, subject, htmlContent, userName);
    console.log("✅ Mailketing ebook email sent successfully");

    try {
      await sendMailketingEmail('support@elvisiongroup.com', `SENT: ${subject}`, htmlContent, 'Support Team');
      console.log("✅ BCC copy sent to support");
    } catch (bccError) {
      console.error("⚠️ Failed to send BCC copy:", bccError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Ebook email sent successfully via Mailketing',
      mailketing_result: emailResult,
      recipient: recipientEmail,
      subject: subject
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error("❌ Error sending Mailketing ebook email:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};

serve(handler);
