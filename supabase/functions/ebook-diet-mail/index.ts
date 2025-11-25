import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Mailketing API configuration
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
const MAILKETING_EMAIL = Deno.env.get('MAILKETING_EMAIL');
const LIST_ID = '80713'; // Your list ID

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
      from_name: 'Support eL Vision Group',
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
  console.log('🚀 Mailketing Ebook Diet Email Function Started');

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
    const subscriptionType = body.subscriptionType || 'Ebook Diet'; // Default to Ebook Diet
    const userName = body.userName || recipientEmail.split('@')[0];

    console.log('📊 Processed data for ebook email:', {
      recipientEmail,
      amount,
      reference: reference || 'N/A',
      subscriptionType,
    });

    const safeReference = reference || 'N/A';
    const safeAmount = amount || 0;
    const safeSubscriptionType = subscriptionType || 'Ebook Diet';

    await addToMailketingList(recipientEmail, userName);

    const subject = "🎉 Pembayaran Berhasil! Link Ebook Diet Anda";
    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎉 Pembayaran Berhasil! Ebook Diet Anda Siap</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Cinzel', serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
            min-height: 100vh;
            color: #ffffff;
        }
        
        .container {
            max-width: 700px;
            margin: 0 auto;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            position: relative;
            overflow: hidden;
        }
        
        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(255, 215, 0, 0.1) 0%, transparent 50%);
            pointer-events: none;
        }
        
        .header {
            background: linear-gradient(135deg, #00d4ff 0%, #090979 50%, #020024 100%);
            padding: 50px 30px;
            text-align: center;
            position: relative;
            border-bottom: 3px solid #00d4ff;
        }
        
        .header::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, #00d4ff, #ff0080, #ffff00, transparent);
            animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
        }
        
        .logo-section {
            margin-bottom: 30px;
        }
        
        .main-title {
            font-family: 'Orbitron', monospace;
            font-size: 32px;
            font-weight: 900;
            color: #ffffff;
            text-shadow: 0 0 20px rgba(0, 212, 255, 0.8);
            margin-bottom: 15px;
            letter-spacing: 2px;
        }
        
        .subtitle {
            font-size: 18px;
            color: #e0e0ff;
            font-weight: 400;
            opacity: 0.9;
        }
        
        .content {
            padding: 50px 40px;
            position: relative;
            z-index: 1;
        }
        
        .greeting {
            font-size: 26px;
            color: #00d4ff;
            margin-bottom: 30px;
            font-weight: 700;
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }
        
        .description {
            font-size: 18px;
            line-height: 1.8;
            color: #e0e0e0;
            margin-bottom: 40px;
            text-align: justify;
        }
        
        .payment-details {
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 0, 128, 0.1) 100%);
            padding: 35px;
            border-radius: 20px;
            border: 2px solid rgba(0, 212, 255, 0.3);
            margin: 40px 0;
            position: relative;
            backdrop-filter: blur(10px);
        }
        
        .payment-details::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #00d4ff, #ff0080, #ffff00, #00d4ff);
            border-radius: 20px;
            z-index: -1;
            opacity: 0.3;
        }
        
        .detail-row {
            display: block;
            margin-bottom: 25px;
            padding: 20px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
        }
        
        .detail-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }
        
        .detail-label {
            display: block;
            font-size: 16px;
            color: #b0b0b0;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .detail-value {
            display: block;
            font-size: 16px;
            font-weight: 700;
            color: #ffffff;
        }
        
        .amount {
            color: #00ff88;
            font-size: 16px !important;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
        
        .status {
            background: linear-gradient(135deg, #00ff88, #00d4ff);
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 16px !important;
            font-weight: 900;
            color: #000;
            text-transform: uppercase;
            display: inline-block;
        }
        
        .cta-section {
            text-align: center;
            margin: 50px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 700;
            font-family: 'Orbitron', monospace;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            border: 2px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
        }
        
        .tip-section {
            background: rgba(255, 255, 255, 0.05);
            padding: 30px;
            border-radius: 15px;
            margin: 40px 0;
            border-left: 5px solid #00d4ff;
            backdrop-filter: blur(5px);
        }
        
        .tip-content {
            color: #d0d0d0;
            font-size: 15px;
            line-height: 1.7;
            text-align: center;
        }
        
        .footer {
            border-top: 2px solid rgba(0, 212, 255, 0.3);
            padding: 40px 30px;
            text-align: center;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(26, 26, 46, 0.3) 100%);
        }
        
        .footer-text {
            color: #e0e0e0;
            font-size: 18px;
            line-height: 1.6;
        }
        
        .footer-signature {
            color: #00d4ff;
            font-weight: 700;
            font-size: 20px;
            text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }
        
        .reference-code {
            font-family: 'Orbitron', monospace;
            background: rgba(0, 0, 0, 0.5);
            padding: 8px 15px;
            border: 1px solid rgba(0, 212, 255, 0.5);
            border-radius: 10px;
            color: #00d4ff !important;
            text-shadow: 0 0 5px rgba(0, 212, 255, 0.3);
        }
        
        .package-badge {
            background: linear-gradient(135deg, #ffd700, #ff8c00);
            color: #000;
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: 900;
            font-size: 14px !important;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .end-date {
            color: #ff6b6b !important;
            font-weight: 700;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 30px 20px;
            }
            
            .main-title {
                font-size: 24px;
            }
            
            .greeting {
                font-size: 22px;
            }
            
            .payment-details, .features-section {
                padding: 25px;
            }
            
            .detail-row {
                display: block;
                padding: 20px 0;
                text-align: center;
            }
            
            .cta-button {
                padding: 18px 30px;
                font-size: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section">
                <img src="https://gambarmailketing.b-cdn.net/uploaded_images/16720/FILE-20250720-0331PKYKC6MB57B9.png" height="150" width="150" alt="ElVision Group Logo" style="filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.8));" />
            </div>
            <h1 class="main-title">🎉 PEMBAYARAN BERHASIL! Ebook Diet Anda Siap</h1>
            <p class="subtitle">Terima kasih telah membeli Ebook Diet eL-Vision!</p>
        </div>
        
        <div class="content">
            <h2 class="greeting">Halo ${userName}! 👋</h2>
            
            <p class="description">
                <strong>Terima kasih!</strong> Pembayaran Anda untuk Ebook Diet telah berhasil diproses. 
                Silakan unduh Ebook Diet Anda melalui tautan di bawah ini:
            </p>

            <div class="cta-section">
                <a href="https://drive.google.com/file/d/1rf0yCAtllTFYjyFaSyMh8crp-B0jASHw/view?usp=share_link" class="cta-button">
                    📥 Unduh Ebook Sekarang
                </a>
            </div>
            <div class="payment-details">
                <div class="detail-row">
                    <span class="detail-label">📦 Produk</span>
                    <span class="detail-value package-badge">${safeSubscriptionType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">💰 Jumlah Dibayar</span>
                    <span class="detail-value amount">Rp ${safeAmount.toLocaleString('id-ID')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🔍 Referensi</span>
                    <span class="detail-value reference-code">${safeReference}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">✅ Status</span>
                    <span class="detail-value status">AKTIF</span>
                </div>
            </div>
            
            <div class="tip-section">
                <div class="tip-content">
                    <strong>💡 TIPS:</strong> Simpan email ini untuk akses mudah ke Ebook Anda di masa mendatang. 
                    Jika Anda mengalami kesulitan, hubungi kami di 
                    <a href="mailto:support@elvisiongroup.com" style="color: #00d4ff; text-decoration: none;">support@elvisiongroup.com</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Selamat menikmati Ebook Anda! 🚀<br>
                <strong class="footer-signature">Tim ElVision Group</strong>
            </p>
        </div>
    </div>
</body>
</html>`;

    const emailResult = await sendMailketingEmail(recipientEmail, subject, htmlContent, userName);
    console.log("✅ Mailketing ebook email sent successfully");

    try {
      await sendMailketingEmail('elvisiondragon@gmail.com', `SENT: ${subject}`, htmlContent, 'Support Team');
      console.log("✅ BCC copy sent to elvisiondragon@gmail.com");
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
