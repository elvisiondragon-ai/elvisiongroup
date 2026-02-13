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
  console.log('🚀 Mailketing Payment Email Function Started');
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const body = await req.json();
    console.log('📨 Received payload:', body);
    // Extract email from various possible fields
    const recipientEmail = body.userEmail || body.email;
    if (!recipientEmail) {
      throw new Error('Email address is required');
    }
    // Extract data from payload (support both nested and flat structure)
    const amount = body.paymentData?.amount || body.amount || 0;
    const currency = body.paymentData?.currency || body.currency || 'IDR';
    const reference = body.paymentData?.reference || body.paymentData?.tripay_reference || body.reference || body.tripay_reference || 'N/A';
    const subscriptionType = body.paymentData?.subscriptionType || body.subscriptionType || 'Pro';
    const paymentMethod = body.paymentData?.paymentMethod || body.paymentMethod || 'Transfer Bank';
    const endDate = body.paymentData?.endDate;
    const userName = body.userName || recipientEmail.split('@')[0];
    const type = body.type || body.status || 'payment_completed';
    console.log('DEBUG: body.subscriptionType =', body.subscriptionType);
    console.log('DEBUG: body.paymentData?.subscriptionType =', body.paymentData?.subscriptionType);
    console.log('📊 Processed data:', {
      recipientEmail,
      amount,
      reference: reference || 'N/A',
      subscriptionType,
      type
    });
    // Ensure all variables are defined
    const safeReference = reference || 'N/A';
    const safeAmount = amount || 0;
    const safeSubscriptionType = subscriptionType || 'Pro';
    const safePaymentMethod = paymentMethod || 'Transfer Bank';

    // Format amount based on currency
    const formattedAmount = currency === 'USD' 
        ? `$${safeAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
        : currency === 'SGD'
        ? `S$${safeAmount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}`
        : `Rp ${safeAmount.toLocaleString('id-ID')}`;

    // Add user to mailing list first
    await addToMailketingList(recipientEmail, userName);
    let subject;
    let htmlContent;
    
    // Check for VIP 6 Week Program
    const isVIP = safeSubscriptionType.includes('VIP') || safeSubscriptionType.includes('3000') || safeSubscriptionType === 'VIP6WEEK';
    const isDrelf = safeSubscriptionType.toLowerCase().includes('drelf');
    const isJewelry = safeSubscriptionType.toLowerCase().includes('jewelry');

    if (type === 'payment_created' || type === 'created') {
      subject = isVIP ? "Payment Pending - eL Vision VIP Session" : "Pembayaran Menunggu - ElVision Group Pro";
      htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px 15px 0 0; text-align: center; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);">
            <h1 style="margin: 0; font-size: 28px; font-weight: 700;">${isVIP ? '🔔 Payment Pending' : '🔔 Pembayaran Menunggu'}</h1>
            <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 16px;">${isVIP ? 'Thank you for choosing eL Vision VIP!' : 'Terima kasih telah memilih ElVision Group Pro!'}</p>
          </div>
          
          <div style="background: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 25px; font-size: 22px;">Hello ${userName}! 👋</h2>
            
            <p style="color: #666; line-height: 1.7; margin-bottom: 25px; font-size: 16px;">
              ${isVIP ? 'Your payment has been created and is awaiting confirmation. Here are the details:' : 'Pembayaran Anda telah dibuat dan sedang menunggu konfirmasi. Berikut adalah detail pembayaran:'}
            </p>
            
            <div style="background: #f8f9ff; padding: 25px; border-radius: 12px; border-left: 5px solid #667eea; margin: 25px 0;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; align-items: center;">
                <span style="color: #666; font-weight: 500;">📦 ${isVIP ? 'Package' : 'Paket'}:</span>
                <span style="font-weight: bold; color: #333; background: #e8f0fe; padding: 5px 12px; border-radius: 20px;">${safeSubscriptionType}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; align-items: center;">
                <span style="color: #666; font-weight: 500;">💰 ${isVIP ? 'Amount' : 'Jumlah'}:</span>
                <span style="font-weight: bold; color: #00c851; font-size: 18px;">${formattedAmount}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 15px; align-items: center;">
                <span style="color: #666; font-weight: 500;">🔍 ${isVIP ? 'Reference' : 'Referensi'}:</span>
                <span style="font-weight: bold; color: #333; font-family: 'Courier New', monospace; background: #fff; padding: 5px 10px; border: 1px solid #ddd; border-radius: 5px;">${safeReference}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #666; font-weight: 500;">💳 ${isVIP ? 'Method' : 'Metode'}:</span>
                <span style="font-weight: bold; color: #333;">${safePaymentMethod}</span>
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border: 2px solid #ffeaa7; padding: 20px; border-radius: 12px; margin: 25px 0;">
              <p style="margin: 0; color: #856404; text-align: center; font-weight: 500;">
                <strong>⏰ ${isVIP ? 'Important' : 'Penting'}:</strong> ${isVIP ? 'Payment will be automatically processed once we receive confirmation.' : 'Pembayaran akan otomatis diproses setelah kami menerima konfirmasi dari bank.'}
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://app.elvisiongroup.com" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
                🚀 ${isVIP ? 'Check Status' : 'Cek Status Pembayaran'}
              </a>
            </div>
          </div>
        </div>
      `;
    } else {
      // payment_completed or success
      subject = isVIP ? "🎉 Payment Successful - eL Vision VIP Session" : 
                isDrelf ? "🎉 Order Confirmed - Drelf Collagen Ritual" :
                isJewelry ? "🎉 Order Confirmed - eL Royal Jewelry Masterpiece" :
                "🎉 Selamat! Pembayaran Berhasil - ElVision Group Pro";
      
      if (isJewelry) {
        htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #BF953F 0%, #FCF6BA 50%, #B38728 100%); color: #4b3d1b; padding: 30px; border-radius: 15px 15px 0 0; text-align: center; border-bottom: 2px solid #BF953F;">
              <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 ORDER CONFIRMED!</h1>
              <p style="margin: 15px 0 0 0; font-size: 16px;">Thank you for your trust, ${userName}!</p>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 15px 15px; border: 1px solid #e0e0e0; border-top: none;">
              <h2 style="color: #333; margin-bottom: 20px;">Your Moment is Happening Now 💎</h2>
              <p style="color: #666; line-height: 1.7; margin-bottom: 25px;">
                We have received your payment for <strong>${safeSubscriptionType}</strong>. Our master craftsmen are now preparing your piece for rapid delivery.
              </p>

              <div style="background: #fffdf5; padding: 20px; border-radius: 12px; border: 1px solid #fcf6ba; margin-bottom: 25px;">
                <h3 style="color: #856404; margin-top: 0; font-size: 16px;">📍 Shipping Information:</h3>
                <p style="color: #333; margin-bottom: 5px; font-weight: bold;">Delivery Address:</p>
                <p style="color: #555; margin-top: 0; font-style: italic;">${body.address || 'Address provided at checkout'}</p>
                <p style="color: #333; margin-top: 15px; font-weight: bold;">Estimated Arrival:</p>
                <p style="color: #555; margin-top: 0;">1 - 3 Working Days</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #666; margin-bottom: 15px;">Want to track your shipment or discuss customization?</p>
                <a href="https://wa.me/62895325633487?text=Hi%2C%20I%20have%20paid%20for%20Jewelry%20order%20${safeReference}" style="background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
                  💬 Chat with eL Royal Concierge
                </a>
              </div>

               <div style="background: #f8f9ff; padding: 25px; border-radius: 12px; border-left: 5px solid #BF953F; margin: 25px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Total Paid:</span>
                  <span style="font-weight: bold; color: #333; font-size: 18px;">${formattedAmount}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Reference:</span>
                  <span style="font-weight: bold; color: #333;">${safeReference}</span>
                </div>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              © 2026 eL Royal Jewelry. All Rights Reserved.
            </div>
          </div>
        `;
      } else if (isDrelf) {
        htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #BF953F 0%, #B38728 100%); color: white; padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🎉 ORDER CONFIRMED!</h1>
              <p style="margin: 15px 0 0 0; font-size: 16px;">Thank you for your purchase, ${userName}!</p>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 15px 15px;">
              <h2 style="color: #333; margin-bottom: 20px;">Your Ritual is on its Way! 🚚</h2>
              <p style="color: #666; line-height: 1.7; margin-bottom: 25px;">
                We have received your payment for <strong>${safeSubscriptionType}</strong>. Our team is now preparing your package for the fastest shipping to Singapore.
              </p>

              <div style="background: #fff8e1; padding: 20px; border-radius: 12px; border: 1px solid #ffe082; margin-bottom: 25px;">
                <h3 style="color: #856404; margin-top: 0; font-size: 16px;">📍 Shipping Information:</h3>
                <p style="color: #333; margin-bottom: 5px; font-weight: bold;">Delivery Address:</p>
                <p style="color: #555; margin-top: 0; font-style: italic;">${body.address || 'Address provided at checkout'}</p>
                <p style="color: #333; margin-top: 15px; font-weight: bold;">Estimated Arrival:</p>
                <p style="color: #555; margin-top: 0;">3 - 5 Working Days</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #666; margin-bottom: 15px;">Have questions about your order or dosage?</p>
                <a href="https://wa.me/62895325633487?text=Hi%2C%20I%20have%20paid%20for%20Drelf%20order%20${safeReference}" style="background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
                  💬 Chat with Customer Service
                </a>
              </div>

               <div style="background: #f8f9ff; padding: 25px; border-radius: 12px; border-left: 5px solid #BF953F; margin: 25px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                  <span style="color: #666;">Total Paid:</span>
                  <span style="font-weight: bold; color: #333;">${formattedAmount}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Reference:</span>
                  <span style="font-weight: bold; color: #333;">${safeReference}</span>
                </div>
              </div>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              © 2026 eL Vision Group. All Rights Reserved.
            </div>
          </div>
        `;
      } else if (isVIP) {
        htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🎉 PAYMENT SUCCESSFUL!</h1>
              <p style="margin: 15px 0 0 0; font-size: 16px;">Thank you for your payment!</p>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 15px 15px;">
              <h2 style="color: #333; margin-bottom: 25px;">Hello ${userName}! 👋</h2>
              <p style="color: #666; line-height: 1.7; margin-bottom: 25px; font-size: 18px; font-weight: bold; text-align: center;">
                Thank you for your payment, please contact our customer service for custom plan 62895325633487
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/62895325633487?text=Hi%2C%20I%20have%20paid%20for%20the%20VIP%20Session" style="background: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);">
                  💬 Contact Customer Service
                </a>
              </div>

               <div style="background: #f8f9ff; padding: 25px; border-radius: 12px; border-left: 5px solid #667eea; margin: 25px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                  <span style="color: #666;">Product:</span>
                  <span style="font-weight: bold; color: #333;">${safeSubscriptionType}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                  <span style="color: #666;">Amount:</span>
                  <span style="font-weight: bold; color: #00c851;">${formattedAmount}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Reference:</span>
                  <span style="font-weight: bold; color: #333;">${safeReference}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      } else if (safeSubscriptionType === 'Program Diet eL-Vision' || safeSubscriptionType === 'ebook_diet' || safeSubscriptionType === 'Ebook Diet' || safeSubscriptionType === 'Ebook_diet' || safeSubscriptionType === 'Ebook Diet PAID') {
        subject = "🎉 Pembayaran Berhasil! Link Ebook Diet Anda";
        htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🎉 PEMBAYARAN BERHASIL!</h1>
              <p style="margin: 15px 0 0 0; font-size: 16px;">Terima kasih telah membeli Ebook Diet eL-Vision!</p>
            </div>
            <div style="background: white; padding: 40px; border-radius: 0 0 15px 15px;">
              <h2 style="color: #333; margin-bottom: 25px;">Halo ${userName}! 👋</h2>
              <p style="color: #666; line-height: 1.7; margin-bottom: 25px;">
                Pembayaran Anda telah kami terima. Silakan unduh Ebook Diet Anda melalui tautan di bawah ini.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://drive.google.com/file/d/1rf0yCAtllTFYjyFaSyMh8crp-B0jASHw/view?usp=share_link" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                  📥 Unduh Ebook Sekarang
                </a>
              </div>
               <div style="background: #f8f9ff; padding: 25px; border-radius: 12px; border-left: 5px solid #667eea; margin: 25px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                  <span style="color: #666;">Produk:</span>
                  <span style="font-weight: bold; color: #333;">${safeSubscriptionType}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                  <span style="color: #666;">Jumlah:</span>
                  <span style="font-weight: bold; color: #00c851;">Rp ${safeAmount.toLocaleString('id-ID')}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Referensi:</span>
                  <span style="font-weight: bold; color: #333;">${safeReference}</span>
                </div>
              </div>
              <p style="color: #666; line-height: 1.7;">
                Jika Anda mengalami kesulitan, jangan ragu untuk menghubungi kami di <a href="mailto:support@elvisiongroup.com" style="color: #667eea;">support@elvisiongroup.com</a>.
              </p>
            </div>
          </div>
        `;
        console.log('DEBUG: Ebook htmlContent length:', htmlContent.length); // ADDED LOG
      } else {
        // Original Pro content
        htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎉 Selamat! Pembayaran Berhasil - ElVision Group Pro</title>
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
        
        .features-section {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 0, 128, 0.1) 100%);
            padding: 40px;
            border-radius: 20px;
            margin: 40px 0;
            border: 2px solid rgba(255, 215, 0, 0.3);
            text-align: center;
        }
        
        .features-title {
            font-family: 'Orbitron', monospace;
            font-size: 24px;
            color: #ffd700;
            margin-bottom: 30px;
            font-weight: 700;
            text-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
        }
        
        .features-list {
            max-width: 500px;
            margin: 0 auto;
            text-align: left;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            margin: 15px 0;
            font-size: 16px;
            color: #ffffff;
        }
        
        .feature-icon {
            color: #00ff88;
            font-size: 20px;
            margin-right: 15px;
            text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
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
            <h1 class="main-title">🎉 PEMBAYARAN BERHASIL!</h1>
            <p class="subtitle">Selamat datang di ElVision Group Pro!</p>
        </div>
        
        <div class="content">
            <h2 class="greeting">Halo ${userName}! 🎊</h2>
            
            <p class="description">
                <strong>Terima kasih!</strong> Pembayaran Anda telah berhasil diproses dan akun Pro Anda telah <span style="color: #00ff88; font-weight: bold; text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);">AKTIF</span>! 
                Anda sekarang dapat menikmati semua fitur premium ElVision Group dengan teknologi terdepan.
            </p>
            
            <div class="payment-details">
                <div class="detail-row">
                    <span class="detail-label">📦 Paket</span>
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
                ${endDate ? `
                <div class="detail-row">
                    <span class="detail-label">📅 Berakhir Pada</span>
                    <span class="detail-value end-date">${new Date(endDate).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="features-section">
                <h3 class="features-title">🚀 FITUR PRO FUTURISTIK</h3>
                <div class="features-list">
                    <div class="feature-item">
                        <span class="feature-icon">✅</span>
                        <span>Akses ke semua konten premium</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✅</span>
                        <span>Fitur chat tanpa batas</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✅</span>
                        <span>Audio therapy eksklusif</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✅</span>
                        <span>Spiritual journal dengan AI</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✅</span>
                        <span>Badge Pro eksklusif</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">✅</span>
                        <span>Prioritas customer support</span>
                    </div>
                </div>
            </div>
            
            <div class="cta-section">
                <a href="https://app.elvisiongroup.com" class="cta-button">
                    🎯 MULAI EKSPLORASI PRO
                </a>
            </div>
            
            <div class="tip-section">
                <div class="tip-content">
                    <strong>💡 TIPS FUTURISTIK:</strong> Simpan email ini sebagai bukti pembayaran digital Anda. 
                    Tim support advanced kami siap membantu 24/7 di 
                    <a href="mailto:support@elvisiongroup.com" style="color: #00d4ff; text-decoration: none;">support@elvisiongroup.com</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Selamat menikmati pengalaman Pro masa depan! 🚀<br>
                <strong class="footer-signature">Tim ElVision Group</strong>
            </p>
        </div>
    </div>
</body>
</html>`;
      }
    }
    // Send email via Mailketing
    const emailResult = await sendMailketingEmail(recipientEmail, subject, htmlContent, userName);
    console.log("✅ Mailketing payment email sent successfully");
    // Send BCC copy to support@elvisiongroup.com
    try {
      await sendMailketingEmail('elvisiondragon@gmail.com', `SENT: ${subject}`, htmlContent, 'Support Team');
      console.log("✅ BCC copy sent to elvisiondragon@gmail.com");
    } catch (bccError) {
      console.error("⚠️ Failed to send BCC copy:", bccError);
    // Continue even if BCC fails
    }
    return new Response(JSON.stringify({
      success: true,
      message: 'Payment email sent successfully via Mailketing',
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
    console.error("❌ Error sending Mailketing payment email:", error);
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
