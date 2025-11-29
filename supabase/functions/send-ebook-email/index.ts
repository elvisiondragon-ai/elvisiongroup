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
const handler = async (req)=>{
  console.log('🚀 Mailketing Ebook Diet Email Function Started');
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
    const subscriptionType = body.subscriptionType || 'Ebook Diet'; // Default to Ebook Diet
    const userName = body.userName || recipientEmail.split('@')[0];
    console.log('📊 Processed data for ebook email:', {
      recipientEmail,
      amount,
      reference: reference || 'N/A',
      subscriptionType
    });
    const safeReference = reference || 'N/A';
    const safeAmount = amount || 0;
    const safeSubscriptionType = subscriptionType || 'Ebook Diet';
    await addToMailketingList(recipientEmail, userName);
    const subject = "🎉 Pembayaran Berhasil! Link Ebook Diet Anda";
    const htmlContent = `Selamat! Ebook Anda siap diunduh. Silahkan download ebook Anda melalui link berikut: https://drive.google.com/file/d/1rf0yCAtllTFYjyFaSyMh8crp-B0jASHw/view?usp=share_link`;
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
