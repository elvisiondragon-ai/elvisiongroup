import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// Mailketing API configuration
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY') || '1858bc5ce747873d3eab0334c055cb9a';
const MAILKETING_EMAIL = Deno.env.get('MAILKETING_EMAIL') || 'support@elvisiongroup.com';
const LIST_ID = '80713'; // Signup subscriber list ID

// Add subscriber to Mailketing list
async function addToMailketingList(email, name) {
  try {
    console.log(`📋 Adding ${email} to Mailketing signup list ${LIST_ID}...`);
    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY,
      email: MAILKETING_EMAIL,
      list_id: LIST_ID,
      subscriber_email: email,
      name: name || email.split('@')[0]
    });

    const response = await fetch(`${MAILKETING_API_URL}/addsubtolist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const result = await response.json();
    console.log('📋 Add to signup list result:', result);
    return response.ok;
  } catch (error) {
    console.error('❌ Failed to add to signup list:', error);
    return false;
  }
}

// Send welcome email via Mailketing
async function sendWelcomeEmail(email, name) {
  try {
    console.log(`📧 Sending welcome email via Mailketing to: ${email}`);
    
    // YOU DEV DONT ACT SMARTASS, this has rule standar no fancy email will be error 
    // Must light theme must with unsubscribe, no emote in subject (emote only in content)
    // and must use Email subject line (use dynamic tags like %%first_name%%) to feel personalized
    const subject = "Selamat Datang di ElVision Group";
    
    const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f6f8fc; margin: 0; padding: 20px; color: #202124; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; background-color: #ffffff; border-radius: 8px; }
        .header { border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #5f6368; text-align: center; }
        .button { display: inline-block; background-color: #1a73e8; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .unsubscribe { color: #5f6368; text-decoration: underline; margin-top: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Selamat Datang!</h1>
        </div>
        <div class="content">
            <p>Halo ${name || 'Sahabat'},</p>
            <p>Terima kasih telah bergabung dengan ElVision Group. Kami senang Anda telah memilih kami untuk mendampingi perjalanan transformasi diri Anda.</p>
            
            <p><strong>Akses Anda sudah aktif:</strong></p>
            <ul>
                <li>Spiritual AI Chat</li>
                <li>Audio Therapy</li>
                <li>Spiritual Journal</li>
            </ul>

            <div style="text-align: center;">
                <a href="https://app.elvisiongroup.com" class="button">Mulai Sekarang</a>
            </div>

            <p>Jika ada pertanyaan, silakan hubungi tim kami di support@elvisiongroup.com.</p>
        </div>
        <div class="footer">
            <p>© 2026 ElVision Group. All rights reserved.</p>
            <a href="https://app.elvisiongroup.com/unsubscribe" class="unsubscribe">Unsubscribe from these emails</a>
        </div>
    </div>
</body>
</html>`;

    const mailketingParams = {
      api_token: MAILKETING_API_KEY,
      from_name: 'Support eL Vision Group',
      from_email: 'support@elvisiongroup.com',
      recipient: email,
      subject: subject,
      content: fullHtml
    };
    
    console.log('📤 Sending to Mailketing /send:', JSON.stringify({ ...mailketingParams, content: '[HTML CONTENT TRUNCATED]' }, null, 2));

    const response = await fetch(`${MAILKETING_API_URL}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(mailketingParams).toString()
    });

    const result = await response.text();
    console.log('RAW RESULT:', result);
    console.log('📧 Mailketing welcome email result:', result);
    
    try {
      const jsonResult = JSON.parse(result);
      return jsonResult;
    } catch {
      return {
        success: true,
        response: result
      };
    }
  } catch (error) {
    console.error('❌ Mailketing welcome email failed:', error);
    throw error;
  }
}

const handler = async (req) => {
  console.log('🚀 Mailketing Signup Email Function Started');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const body = await req.json();
    console.log('📨 Received signup payload:', body);

    // Extract email from various possible fields
    const recipientEmail = body.userEmail || body.email;
    if (!recipientEmail) {
      throw new Error('Email address is required');
    }

    const userName = body.userName || body.name || recipientEmail.split('@')[0];
    
    console.log('📊 Processed signup data:', {
      recipientEmail,
      userName
    });

    // Add user to mailing list first
    await addToMailketingList(recipientEmail, userName);

    // Send welcome email
    const emailResult = await sendWelcomeEmail(recipientEmail, userName);
    
    console.log("✅ Mailketing signup email sent successfully");
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Signup welcome email sent successfully via Mailketing',
      mailketing_result: emailResult,
      recipient: recipientEmail,
      list_id: LIST_ID
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("❌ Error sending Mailketing signup email:", error);
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