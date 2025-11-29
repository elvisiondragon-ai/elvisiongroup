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
    const subject = "🎉 Selamat Datang di ElVision Group!";
    const htmlContent = `
      <div style="width: 90%; max-width: none; margin: 0 auto; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: 15px; overflow: hidden;">
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 15px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 700;">🎉 Selamat Datang!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Terima kasih telah bergabung dengan ElVision Group!</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 20px 15px; border-radius: 0 0 15px 15px;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 22px;">Halo ${name}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin: 0 0 15px 0; font-size: 16px;">
            Selamat datang di ElVision Group! Kami senang Anda telah bergabung dengan komunitas transformasi diri melalui teknologi spiritual.
          </p>
          
          <!-- Features Box -->
          <div style="background: #f8f9ff; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 10px;">
            <h3 style="color: #333; margin: 0 0 12px 0; font-size: 18px;">✨ Apa yang Anda dapatkan:</h3>
            <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 18px; font-size: 15px;">
              <li>Akses ke konten spiritual dan teknologi terdepan</li>
              <li>Fitur chat dengan AI spiritual</li>
              <li>Audio therapy untuk meditasi dan relaksasi</li>
              <li>Spiritual journal untuk refleksi diri</li>
              <li>Komunitas yang mendukung pertumbuhan spiritual Anda</li>
            </ul>
          </div>
          
          <!-- Promo Box -->
          <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 10px;">
            <p style="margin: 0; color: #856404; text-align: center; font-weight: 500; font-size: 15px;">
              <strong>💝 Ini Gratis,</strong> namun jika anda ingin merasakan Verse lengkap dan audio yang lebih powerful silahkan Upgrade pro hanya 4Ribu per hari dengan Manfaat ratusan kali lipat.
            </p>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://app.elvisiongroup.com" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              🚀 Mulai Perjalanan Anda
            </a>
          </div>
          
          <!-- Footer -->
          <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Butuh bantuan? Hubungi kami di <a href="mailto:support@elvisiongroup.com" style="color: #667eea; text-decoration: none;">support@elvisiongroup.com</a>
            </p>
          </div>
        </div>
      </div>
    `;
    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY,
      email: MAILKETING_EMAIL,
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
    console.log('📧 Mailketing welcome email result:', result);
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
    console.error('❌ Mailketing welcome email failed:', error);
    throw error;
  }
}
const handler = async (req)=>{
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
