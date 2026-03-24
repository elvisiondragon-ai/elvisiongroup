// ==================================================================================
// 1. FREE PRODUK DIGITAL ada di send-ebooks-free
// 2. SUbscription bulanan dan fisik di send-payment-email
// 3. Khusus Ebook Paid ada di send-ebooks-email
//
// PRODUK SUBSCRIPTION BULANAN DAN FISIK DISINI
// EBOOK JANGAN DISINI tapi di send-ebooks-email
// ==================================================================================
// THIS ONLY FOR SUBSCRIPTION AND FISIK, FOR EBOOK AND DIGITAL AT send-ebooks-email 
// YOU STUPID AI LEAVE THIS IF NOT FOR YOU
// ==================================================================================

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

// WhatsApp API Configuration (WAPI)
const WAPI_TOKEN = Deno.env.get('WAPI_TOKEN') || "rvpwk8dkih9m";
const WAPI_URL = Deno.env.get('WAPI_URL') || "https://api.elvisiongroup.com/api/send";
const WAPI_SESSION = Deno.env.get('WAPI_SESSION') || "renata";

// Add subscriber to Mailketing list
async function addToMailketingList(email, name, listId = LIST_ID) {
  try {
    console.log(`📋 Adding ${email} to Mailketing list ${listId}...`);
    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY,
      list_id: listId,
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
    console.log(`📋 Add to list ${listId} result:`, result);
    return response.ok;
  } catch (error) {
    console.error(`❌ Failed to add to list ${listId}:`, error);
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
    const mailketingParams = {
      api_token: MAILKETING_API_KEY,
      email: 'support@elvisiongroup.com',
      from_name: 'Support eL Vision Group',
      from_email: 'support@elvisiongroup.com',
      recipient: email,
      subject: subject,
      content: htmlContent
    };
    
    console.log('📤 Sending to Mailketing /send:', JSON.stringify(mailketingParams, null, 2));

    const response = await fetch(`${MAILKETING_API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(mailketingParams).toString()
    });
    const result = await response.text();
    console.log('RAW RESULT:', result);
    console.log('📧 Mailketing send result:', result);
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
    console.error('❌ Mailketing send failed:', error);
    throw error;
  }
}
const handler = async (req) => {
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
    const quantity = body.quantity || body.qty || 1;
    
    // --- SKU Mappings for send-payment-email ---
    const rawSubscriptionType = subscriptionType || 'Pro';
    let safeSubscriptionType = rawSubscriptionType;
    const paymentSkuMap: Record<string, string> = {
      'paymentpaid01': 'VIP 6 Week Program',
      'paymentpaid02': 'Drelf',
      'paymentpaid03': 'Jewelry',
      'paymentpaid04': 'Parenting',
      'paymentpaid05': 'Fitfactor',
      'paymentpaid06': 'Pro'
    };
    const paymentSkuMatch = String(rawSubscriptionType).toLowerCase().match(/^paymentpaid?0?(\d+)$/);
    if (paymentSkuMatch) {
      const skuCode = `paymentpaid${paymentSkuMatch[1].padStart(2, '0')}`;
      if (paymentSkuMap[skuCode]) {
        safeSubscriptionType = paymentSkuMap[skuCode];
      }
    }
    const safePaymentMethod = paymentMethod || 'Transfer Bank';
    
    // --- Define Product Flags EARLY to avoid TDZ ---
    const isVIP = safeSubscriptionType.includes('VIP') || safeSubscriptionType.includes('3000') || safeSubscriptionType === 'VIP6WEEK';
    const isDrelf = safeSubscriptionType.toLowerCase().includes('drelf');
    const isJewelry = safeSubscriptionType.toLowerCase().includes('jewelry');
    const isParenting = safeSubscriptionType.toLowerCase().includes('parenting');
    const isFitfactor = safeSubscriptionType.toLowerCase().includes('fitfactor');
    const isPhysical = isFitfactor || isDrelf || isJewelry;
    const brandName = isFitfactor ? "FitFactor Herbal" : isDrelf ? "Drelf" : isJewelry ? "Jewelry" : "ElVision";

    // Format amount based on currency
    const formattedAmount = currency === 'USD'
      ? `$${safeAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      : currency === 'SGD'
        ? `S$${safeAmount.toLocaleString('en-SG', { minimumFractionDigits: 2 })}`
        : `Rp ${safeAmount.toLocaleString('id-ID')}`;

    // Add user to mailing list first (Core List)
    await addToMailketingList(recipientEmail, userName, '80713');
    
    // Add to specific Brand Lists
    if (isFitfactor) {
      console.log(`🌿 Fitfactor detected, adding to additional list 88217...`);
      await addToMailketingList(recipientEmail, userName, '88217');
    } else if (isDrelf) {
      console.log(`✨ Drelf detected, adding to additional list 88218...`);
      await addToMailketingList(recipientEmail, userName, '88218');
    }

    // Add to Dark Fem Unpaid list ONLY if status is created/pending
    const isDarkFem = safeSubscriptionType.toLowerCase().includes('feminine') || safeSubscriptionType.toLowerCase().includes('dark');
    if (isDarkFem && (type === 'payment_created' || type === 'created')) {
      console.log(`🌙 Dark Feminine (Unpaid) detected, adding to list 88212...`);
      await addToMailketingList(recipientEmail, userName, '88212');
    }

    let subject;
    let htmlContent;

    // YOU DEV DONT ACT SMARTASS, this has rule standar no fancy email will be error 
    // Must light theme must with unsubscribe, no emote in subject (emote only in content)
    // and must use Email subject line (use dynamic tags like %%first_name%%) to feel personalized
    if (type === 'payment_created' || type === 'created') {
      subject = isVIP ? "Payment Pending - eL Vision VIP Session" : 
                isFitfactor ? "Instruksi Pembayaran - Fit Factor Herbal" :
                "Pembayaran Menunggu - ElVision Group Pro";
      
      if (isFitfactor) {
        htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f0fdf4; margin: 0; padding: 20px; color: #166534; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #bbf7d0; padding: 20px; background-color: #ffffff; border-radius: 12px; }
        .header { border-bottom: 2px solid #22c55e; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #166534; text-align: center; }
        .details-box { background-color: #f0fdf4; padding: 15px; border: 1px solid #bbf7d0; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; background-color: #22c55e; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
        .unsubscribe { color: #166534; text-decoration: underline; margin-top: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px; color: #15803d;">🌿 Fit Factor Herbal</h1>
        </div>
        <div class="content">
            <p>Halo <strong>${userName}</strong>,</p>
            <p>Satu langkah lagi untuk memulai perjalanan transformasi tubuh Anda! Pembayaran Anda untuk <strong>Fit Factor Imun Booster</strong> telah berhasil dibuat.</p>
            
            <div class="details-box">
                <table style="width: 100%; color: #166534;">
                    <tr><td>Total Tagihan:</td><td style="text-align: right; font-weight: bold; font-size: 18px;">${formattedAmount}</td></tr>
                    <tr><td>Nomor Referensi:</td><td style="text-align: right;">${safeReference}</td></tr>
                    <tr><td>Metode Pembayaran:</td><td style="text-align: right;">${safePaymentMethod}</td></tr>
                </table>
            </div>

            <p style="text-align: center;">
                <a href="https://wa.me/62895325633487?text=Halo%20Admin%2C%20saya%20ingin%20konfirmasi%20pembayaran%20Fitfactor%20Ref%3A%20${safeReference}" class="button">Konfirmasi via WhatsApp</a>
            </p>

            <p>Segera selesaikan pembayaran agar paket Anda dapat kami proses dan kirimkan hari ini.</p>
        </div>
        <div class="footer">
            <p>© 2026 Fit Factor Herbal. All rights reserved.</p>
            <a href="https://app.elvisiongroup.com/unsubscribe" class="unsubscribe">Unsubscribe from these emails</a>
        </div>
    </div>
</body>
</html>`;
      } else {
        htmlContent = `<!DOCTYPE html>
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
        .details-box { background-color: #f8f9fa; padding: 15px; border: 1px solid #e0e0e0; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background-color: #1a73e8; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .unsubscribe { color: #5f6368; text-decoration: underline; margin-top: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Pembayaran Menunggu</h1>
        </div>
        <div class="content">
            <p>Halo ${userName},</p>
            <p>Pembayaran Anda untuk <strong>${safeSubscriptionType}</strong> telah dibuat dan sedang menunggu konfirmasi.</p>
            
            <div class="details-box">
                <table style="width: 100%;">
                    <tr><td>Jumlah:</td><td style="text-align: right; font-weight: bold;">${formattedAmount}</td></tr>
                    <tr><td>Referensi:</td><td style="text-align: right;">${safeReference}</td></tr>
                    <tr><td>Metode:</td><td style="text-align: right;">${safePaymentMethod}</td></tr>
                </table>
            </div>

            <p style="text-align: center;">
                <a href="https://app.elvisiongroup.com" class="button">Cek Status Pembayaran</a>
            </p>

            <p>Pembayaran akan otomatis diproses setelah kami menerima konfirmasi dari bank.</p>
        </div>
        <div class="footer">
            <p>© 2026 ElVision Group. All rights reserved.</p>
            <a href="https://app.elvisiongroup.com/unsubscribe" class="unsubscribe">Unsubscribe from these emails</a>
        </div>
    </div>
</body>
</html>`;
      }
    } else {
      // payment_completed or success
      subject = isVIP ? "Payment Successful - eL Vision VIP Session" :
        isDrelf ? "Order Confirmed - Drelf Collagen Ritual" :
          isJewelry ? "Order Confirmed - eL Royal Jewelry Masterpiece" :
            isFitfactor ? "Pesanan Diterima - Fit Factor Herbal" :
            "Pembayaran Berhasil - ElVision Group Pro";

      if (isJewelry) {
        htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f6f8fc; margin: 0; padding: 20px; color: #202124; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; background-color: #ffffff; border-radius: 8px; }
        .header { border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #5f6368; text-align: center; }
        .details-box { background-color: #f8f9fa; padding: 15px; border: 1px solid #e0e0e0; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background-color: #1a73e8; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .unsubscribe { color: #5f6368; text-decoration: underline; margin-top: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Order Confirmed</h1>
        </div>
        <div class="content">
            <p>Halo ${userName},</p>
            <p>Terima kasih atas pesanan Anda. Kami telah menerima pembayaran untuk <strong>${safeSubscriptionType}</strong>.</p>
            
            <div class="details-box">
                <p style="margin-top: 0;"><strong>Shipping Information:</strong></p>
                <p>Address: ${body.address || 'Address provided at checkout'}</p>
                <p>Estimated Arrival: 1 - 3 Working Days</p>
            </div>

            <div style="text-align: center; margin: 20px 0;">
                <p>Want to track your shipment?</p>
                <a href="https://wa.me/62895325633487?text=Hi%2C%20I%20have%20paid%20for%20Jewelry%20order%20${safeReference}" style="display: inline-block; background-color: #25D366; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Chat with Concierge</a>
            </div>

            <div style="border-top: 1px solid #eeeeee; padding-top: 15px; margin-top: 20px;">
                <p>Total Paid: <strong>${formattedAmount}</strong></p>
                <p>Reference: ${safeReference}</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 eL Royal Jewelry. All rights reserved.</p>
            <a href="https://app.elvisiongroup.com/unsubscribe" class="unsubscribe">Unsubscribe from these emails</a>
        </div>
    </div>
</body>
</html>`;
      } else if (isDrelf) {
        htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f6f8fc; margin: 0; padding: 20px; color: #202124; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; background-color: #ffffff; border-radius: 8px; }
        .header { border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #5f6368; text-align: center; }
        .details-box { background-color: #f8f9fa; padding: 15px; border: 1px solid #e0e0e0; margin: 20px 0; border-radius: 4px; }
        .unsubscribe { color: #5f6368; text-decoration: underline; margin-top: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Order Confirmed</h1>
        </div>
        <div class="content">
            <p>Halo ${userName},</p>
            <p>Terima kasih atas pesanan Anda. Pembayaran untuk <strong>${safeSubscriptionType}</strong> telah kami terima.</p>

            <div class="details-box">
                <p style="margin-top: 0;"><strong>Shipping Information:</strong></p>
                <p>Address: ${body.address || 'Standard Delivery'}</p>
                <p>Estimated Arrival: 3 - 5 Working Days</p>
            </div>

            <div style="border-top: 1px solid #eeeeee; padding-top: 15px; margin-top: 20px;">
                <p>Total Paid: <strong>${formattedAmount}</strong></p>
                <p>Reference: ${safeReference}</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 ElVision Group. All rights reserved.</p>
            <a href="https://app.elvisiongroup.com/unsubscribe" class="unsubscribe">Unsubscribe from these emails</a>
        </div>
    </div>
</body>
</html>`;
      } else if (isFitfactor) {
        htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesanan Diterima</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f0fdf4; margin: 0; padding: 20px; color: #166534; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #bbf7d0; padding: 20px; background-color: #ffffff; border-radius: 12px; }
        .header { border-bottom: 2px solid #22c55e; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #166534; text-align: center; }
        .details-box { background-color: #f0fdf4; padding: 15px; border: 1px solid #bbf7d0; margin: 20px 0; border-radius: 8px; }
        .button { display: inline-block; background-color: #22c55e; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px; color: #15803d;">🌿 Fit Factor Herbal</h1>
        </div>
        <div class="content">
            <p>Halo <strong>${userName}</strong>,</p>
            <p>Kabar gembira! Pembayaran Anda telah kami terima. Pesanan <strong>Fit Factor Imun Booster</strong> Anda sedang dalam proses pengemasan.</p>

            <div class="details-box">
                <p style="margin-top: 0;"><strong>Detail Pengiriman:</strong></p>
                <p>Alamat: ${body.address || 'Alamat sesuai saat checkout'}</p>
                <p>Estimasi Sampai: 2 - 4 Hari Kerja</p>
            </div>

            <p>Paket Anda akan segera dijemput oleh kurir. Kami akan memberikan update jika barang sudah dalam perjalanan.</p>
            
            <div style="border-top: 1px solid #eeeeee; padding-top: 15px; margin-top: 20px;">
                <p>Total Pembayaran: <strong>${formattedAmount}</strong></p>
                <p>Referensi: ${safeReference}</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 Fit Factor Herbal. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
      } else if (isVIP) {
        htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f6f8fc; margin: 0; padding: 20px; color: #202124; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; background-color: #ffffff; border-radius: 8px; }
        .header { border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #5f6368; text-align: center; }
        .details-box { background-color: #f8f9fa; padding: 15px; border: 1px solid #e0e0e0; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background-color: #1a73e8; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .unsubscribe { color: #5f6368; text-decoration: underline; margin-top: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Payment Successful</h1>
        </div>
        <div class="content">
            <p>Halo ${userName},</p>
            <p>Terima kasih atas pembayaran Anda untuk <strong>${safeSubscriptionType}</strong>.</p>
            
            <p>Silakan hubungi customer service kami untuk rencana kustom Anda:</p>
            <div style="text-align: center;">
                <a href="https://wa.me/62895325633487" class="button">Contact Customer Service</a>
            </div>

            <div class="details-box">
                <p>Total Paid: <strong>${formattedAmount}</strong></p>
                <p>Reference: ${safeReference}</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 ElVision Group. All rights reserved.</p>
            <a href="https://app.elvisiongroup.com/unsubscribe" class="unsubscribe">Unsubscribe from these emails</a>
        </div>
    </div>
</body>
</html>`;
      } else if (isParenting) {
        // --- CO-PARENTING TRACKER TEMPLATE ---
        subject = "Akses Download: Co-Parenting Tracker & Tutorial";
        htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akses Perangkat Co-Parenting</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f6f8fc; margin: 0; padding: 20px; color: #202124; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; background-color: #ffffff; border-radius: 8px; }
        .header { border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #5f6368; text-align: center; }
        .details-box { background-color: #f8f9fa; padding: 15px; border: 1px solid #e0e0e0; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background-color: #1a73e8; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .unsubscribe { color: #5f6368; text-decoration: underline; margin-top: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Akses Konten Co-Parenting</h1>
        </div>
        <div class="content">
            <p>Halo ${userName},</p>
            <p>Terima kasih telah bergabung. Anda sekarang memiliki akses penuh ke Template Co-Parenting Tracker.</p>
            
            <div class="details-box">
                <p style="margin-top: 0;"><strong>Instruksi Akses:</strong></p>
                <ul>
                    <li>Klik tombol di bawah untuk membuka Google Sheets.</li>
                    <li><strong>WAJIB:</strong> Klik 'File' -> 'Make a copy' untuk menyimpan ke akun Google Anda.</li>
                </ul>
            </div>

            <div style="text-align: center;">
                <a href="https://docs.google.com/spreadsheets/d/1u1H6Pv0O5noENH7_P-SEqheHmIqlixAo_0DncVYMuqlY/edit?gid=612184692#gid=612184692" class="button">BUKA TRACKER SEKARANG</a>
            </div>

            <div style="border-top: 1px solid #eeeeee; padding-top: 15px; margin-top: 20px;">
                <p>Produk: ${safeSubscriptionType}</p>
                <p>Referensi: ${safeReference}</p>
            </div>
        </div>
        <div class="footer">
            <p>© 2026 ElVision Group. All rights reserved.</p>
            <a href="https://app.elvisiongroup.com/unsubscribe" class="unsubscribe">Unsubscribe from these emails</a>
        </div>
    </div>
</body>
</html>`;
      } else {
        // Original Pro content
        htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembayaran Berhasil</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f6f8fc; margin: 0; padding: 20px; color: #202124; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; background-color: #ffffff; border-radius: 8px; }
        .header { border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
        .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #5f6368; text-align: center; }
        .details-box { background-color: #f8f9fa; padding: 15px; border: 1px solid #e0e0e0; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background-color: #1a73e8; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0; }
        .unsubscribe { color: #5f6368; text-decoration: underline; margin-top: 10px; display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Pembayaran Berhasil!</h1>
        </div>
        <div class="content">
            <p>Halo ${userName},</p>
            <p>Terima kasih! Pembayaran Anda telah berhasil diproses dan akun Pro Anda telah <strong>AKTIF</strong>.</p>
            
            <div class="details-box">
                <table style="width: 100%;">
                    <tr><td>Paket:</td><td style="text-align: right; font-weight: bold;">${safeSubscriptionType}</td></tr>
                    <tr><td>Jumlah:</td><td style="text-align: right; font-weight: bold;">${formattedAmount}</td></tr>
                    <tr><td>Referensi:</td><td style="text-align: right;">${safeReference}</td></tr>
                </table>
            </div>

            <p style="text-align: center;">
                <a href="https://app.elvisiongroup.com" class="button">Mulai Eksplorasi Pro</a>
            </p>

            <p>Jika ada pertanyaan, silakan hubungi tim kami di support@elvisiongroup.com.</p>
        </div>
        <div class="footer">
            <p>© 2026 ElVision Group. All rights reserved.</p>
            <a href="https://app.elvisiongroup.com/unsubscribe" class="unsubscribe">Unsubscribe from these emails</a>
        </div>
    </div>
</body>
</html>`;
      }
    }

    // --- WHATSAPP NOTIFICATION FOR FITFACTOR ---
    if (isFitfactor) {
      let waMessage = "";
      const userAddress = body.address || body.userAddress || "Alamat tidak tersedia";
      const displayProduct = body.product_name || safeSubscriptionType || "FitFactor Herbal";
      
      if (type === 'payment_completed' || type === 'success') {
        const bonusEbookLink = "https://drive.google.com/file/d/1bIG1_u2PFXWIrXxygojTyUlmSC-J1A5R/view?usp=sharing";
        waMessage = `Halo kak ${userName}! 👋\nSaya Admin dari Fit Factor.\n\nTerima kasih atas pembayaran kakak untuk paket *Fit Factor Imun Booster*.\n\nPembayaran kakak telah kami terima senilai ${formattedAmount}.\n\n*DATA PENGIRIMAN:*\nNama: ${userName}\nEmail: ${recipientEmail}\nTotal: ${formattedAmount}\nRef: ${safeReference}\nAlamat: ${userAddress}\nProduk: ${displayProduct}\n\nBerikut adalah link akses eksklusif untuk mendownload Ebook Bonus kakak:\n👉 ${bonusEbookLink}\n\nSilakan di-download dan disimpan ya kak. Jika ada pertanyaan, kakak bisa langsung balas pesan ini.\n\nSalam hangat,\nAdmin - Fit Factor Herbal`;
      } else if (type === 'payment_created' || type === 'created') {
        waMessage = `Halo kak ${userName}! 👋\nSaya Admin dari *Fit Factor Herbal*.\n\nPembayaran kakak untuk paket *Fit Factor Imun Booster* telah berhasil dibuat senilai *${formattedAmount}*.\n\n*DATA PESANAN:*\nNama: ${userName}\nEmail: ${recipientEmail}\nTotal: ${formattedAmount}\nRef: ${safeReference}\nAlamat: ${userAddress}\nProduk: ${displayProduct}\n\nSilakan selesaikan pembayaran agar paket bisa segera kami proses dan kirimkan hari ini.\n\nJika sudah bayar namun status belum berubah, atau butuh bantuan cara bayar, silakan balas pesan ini ya kak.\n\nTerima kasih! 🌿`;
      }

      // 🔔 CONCURRENT NOTIFICATIONS
      const notificationPromises = [];

      // 1. Customer Notification
      const userPhone = body.userPhone || body.phone || body.phone_number || body.ph;
      if (userPhone && waMessage) {
        let cleanPhone = userPhone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
        else if (cleanPhone.startsWith('8')) cleanPhone = '62' + cleanPhone;

        console.log(`📱 [WATZAPP] Queuing Customer Message to ${cleanPhone}`);
        notificationPromises.push(
          fetch(WAPI_URL, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session: WAPI_SESSION, token: WAPI_TOKEN, to: cleanPhone, message: waMessage })
          }).then(res => res.text().then(txt => console.log(`📡 [WATZAPP] Customer Res: ${res.status}`, txt)))
            .catch(err => console.error(`❌ [WATZAPP] Customer Err:`, err))
        );
      }

      // 2. Admin Notification (For PAID and created)
      if (type === 'payment_completed' || type === 'success' || type === 'payment_created' || type === 'created') {
        const adminPhones = ['6281383838013', '6285664733499'];
        console.log(`🚀 [WATZAPP] Fitfactor Admin Notifications triggered for:`, adminPhones);
        const adminMessage = `🚀 *FITFACTOR NOTIFICATION (${type})*\n\nNama: ${userName}\nEmail: ${recipientEmail}\nWA: ${userPhone || 'N/A'}\nTotal: ${formattedAmount}\nRef: ${safeReference}\nAlamat: ${userAddress}\nProduk: ${displayProduct}`;

        for (const adminPhone of adminPhones) {
          console.log(`🚀 [WATZAPP] Queuing Admin Message to ${adminPhone}`);
          notificationPromises.push(
            fetch(WAPI_URL, {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ session: WAPI_SESSION, token: WAPI_TOKEN, to: adminPhone, message: adminMessage })
            }).then(res => res.text().then(txt => console.log(`📡 [WATZAPP] Admin ${adminPhone} Res: ${res.status}`, txt)))
              .catch(err => console.error(`❌ [WATZAPP] Admin ${adminPhone} Err:`, err))
          );
        }
      }

      // Wait for all WhatsApp notifications to finish before proceeding to Email
      if (notificationPromises.length > 0) {
        console.log(`⏳ Waiting for ${notificationPromises.length} WhatsApp notifications...`);
        await Promise.all(notificationPromises);
        console.log(`✅ All WhatsApp notifications processed.`);
      }
    }

    // --- NEW: WHATSAPP BCC FOR ALL PHYSICAL PRODUCTS (To Admin Group) ---
    if (isPhysical && (type === 'payment_completed' || type === 'success')) {
      const userPhone = body.userPhone || body.phone || body.phone_number || body.ph || 'N/A';
      const userAddress = body.address || body.userAddress || "Alamat tidak tersedia";
      const bccGroupId = "120363401536138177@g.us";
      const bccSenderNumber = "+62 895-3256-33487";
      
      const bccMessage = `Penerima :
${userName}
${userPhone}

Alamat: ${userAddress}

${quantity}x ${brandName}

Pengirim :
${brandName}
${bccSenderNumber}`;

      console.log(`🚀 [BCC] Sending Physical Order Notification to Group ${bccGroupId}`);
      try {
        await fetch(WAPI_URL, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            session: WAPI_SESSION, 
            token: WAPI_TOKEN, 
            to: bccGroupId, 
            message: bccMessage 
          })
        }).then(res => res.text().then(txt => console.log(`📡 [BCC] Group Res: ${res.status}`, txt)));
      } catch (err) {
        console.error(`❌ [BCC] Group Alert Error:`, err);
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

  } catch (error: any) {
    console.error("❌ Error in handler:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error',
      details: error.stack || ''
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

