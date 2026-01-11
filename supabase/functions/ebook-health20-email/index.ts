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

    const subject = "🌿 DOWNLOAD ACCESS: Your Health Recovery Protocol";
    
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Health Protocol Access</title>
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
            <h1>Start Your Healing Journey Today</h1>
        </div>
        <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Thank you for trusting us. You have successfully purchased the <strong>Health Recovery Protocol</strong>.</p>
            <p>This folder contains the Ebook and the Audio Therapy files necessary for your reprogramming.</p>
            
            <div style="text-align: center;">
                <a href="https://drive.google.com/drive/folders/1E2iYI6JLtZ73F3jggHEHkke6IniRWaxB?usp=sharing" class="btn">
                    Access Your Files Here
                </a>
            </div>

            <p><strong>Instructions:</strong></p>
            <ul>
                <li>Listen to the audio every night before sleep.</li>
                <li>Read the ebook to understand the diet protocol.</li>
                <li>Be consistent for at least 21 days.</li>
            </ul>

            <div class="details">
                <p><strong>Order Reference:</strong> ${safeReference}</p>
                <p><strong>Amount Paid:</strong> ${displayAmount}</p>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 eL Vision Group. All rights reserved.</p>
            <p>Need help? Reply to this email or chat us on WhatsApp.</p>
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
