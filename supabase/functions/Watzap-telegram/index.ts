import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};
// GLOBAL RATE LIMITING STORAGE
let lastWhatsAppSent = 0;
const RATE_LIMIT_MINUTES = 5;
// MAIN EDGE FUNCTION - TELEGRAM TO WHATSAPP
serve(async (req)=>{
  console.log('📱 ===== TELEGRAM TO WHATSAPP FUNCTION START =====');
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    // Parse Telegram webhook
    console.log('📱 Parsing Telegram webhook...');
    const telegramUpdate = await req.json();
    console.log('📱 Telegram update received:', JSON.stringify(telegramUpdate, null, 2));
    // Check if this is a message update
    if (!telegramUpdate.message) {
      console.log('⚠️ No message in update, ignoring');
      return new Response('OK - No message', {
        status: 200,
        headers: corsHeaders
      });
    }
    const message = telegramUpdate.message;
    // Extract message info
    const messageInfo = {
      messageId: message.message_id,
      fromUser: {
        id: message.from?.id,
        firstName: message.from?.first_name || 'Unknown',
        lastName: message.from?.last_name || '',
        username: message.from?.username || 'no_username'
      },
      chat: {
        id: message.chat.id,
        type: message.chat.type,
        title: message.chat.title || 'Private Chat'
      },
      text: message.text || '[Media/Document]',
      date: new Date(message.date * 1000).toISOString(),
      contentType: message.photo ? 'photo' : message.video ? 'video' : message.document ? 'document' : message.voice ? 'voice' : 'text'
    };
    console.log('📱 Message info extracted:', JSON.stringify(messageInfo, null, 2));
    // Skip bot messages
    if (message.from?.is_bot) {
      console.log('🤖 Message from bot, ignoring to avoid loops');
      return new Response('OK - Bot message ignored', {
        status: 200,
        headers: corsHeaders
      });
    }
    // RATE LIMITING CHECK
    console.log('⏰ ===== RATE LIMITING CHECK START =====');
    const currentTime = Date.now();
    const timeSinceLastSent = currentTime - lastWhatsAppSent;
    const rateLimitMs = RATE_LIMIT_MINUTES * 60 * 1000;
    console.log('⏰ Rate limit check:');
    console.log('   - Current time:', new Date(currentTime).toISOString());
    console.log('   - Last WhatsApp sent:', lastWhatsAppSent ? new Date(lastWhatsAppSent).toISOString() : 'Never');
    console.log('   - Time since last sent:', Math.floor(timeSinceLastSent / 1000) + ' seconds');
    if (lastWhatsAppSent > 0 && timeSinceLastSent < rateLimitMs) {
      const remainingTime = Math.ceil((rateLimitMs - timeSinceLastSent) / 1000);
      console.log('🚫 RATE LIMITED: WhatsApp blocked for', remainingTime, 'more seconds');
      return new Response(JSON.stringify({
        status: 'rate_limited',
        message: 'Telegram message received but WhatsApp rate limited',
        telegram: {
          from: messageInfo.fromUser.firstName,
          group: messageInfo.chat.title,
          message: messageInfo.text.substring(0, 100)
        },
        whatsapp: {
          sent: false,
          reason: 'Rate limited',
          remainingSeconds: remainingTime
        }
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    console.log('✅ RATE LIMIT PASSED: WhatsApp can be sent');
    // WATZAP WHATSAPP NOTIFICATION
    console.log('📱 ===== WATZAP WHATSAPP NOTIFICATION START =====');
    try {
      // WATZAP CONFIG
      const watzapConfig = {
        apiKey: Deno.env.get('WATZAP_API_KEY') || '',
        numberKey: Deno.env.get('WATZAP_NUMBER_KEY') || '',
        apiUrl: 'https://api.watzap.id/v1/send_message',
        targetPhone: '6281383838013'
      };
      console.log('📱 WatZap config loaded');
      console.log('📱 Target phone:', watzapConfig.targetPhone);
      console.log('📱 API Key available:', watzapConfig.apiKey ? 'Yes ✅' : 'No ❌');
      console.log('📱 Number Key available:', watzapConfig.numberKey ? 'Yes ✅' : 'No ❌');
      // PREPARE WHATSAPP MESSAGE
      const whatsappMessage = `🔔 ADA PESAN DI TELEGRAM KOMUNITAS

👤 Dari: ${messageInfo.fromUser.firstName} ${messageInfo.fromUser.lastName}
🏷️ Username: @${messageInfo.fromUser.username}
📁 Group: ${messageInfo.chat.title}
📅 Waktu: ${new Date(messageInfo.date).toLocaleString('id-ID')}
📝 Tipe: ${messageInfo.contentType}

💬 Pesan:
${messageInfo.text.substring(0, 200)}${messageInfo.text.length > 200 ? '...' : ''}`;
      console.log('📱 WhatsApp message prepared:', whatsappMessage);
      // WATZAP API PAYLOAD
      const watzapPayload = {
        api_key: watzapConfig.apiKey,
        number_key: watzapConfig.numberKey,
        phone_no: watzapConfig.targetPhone,
        message: whatsappMessage,
        wait_until_send: "1"
      };
      console.log('📱 WatZap payload:', JSON.stringify(watzapPayload, null, 2));
      // SEND TO WATZAP API
      console.log('📱 Calling WatZap API...');
      const watzapResponse = await fetch(watzapConfig.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(watzapPayload)
      });
      console.log('📱 WatZap API status:', watzapResponse.status);
      console.log('📱 WatZap API ok:', watzapResponse.ok);
      const watzapResponseText = await watzapResponse.text();
      console.log('📱 WatZap API response:', watzapResponseText);
      // PARSE WATZAP RESPONSE
      let watzapResult;
      try {
        watzapResult = JSON.parse(watzapResponseText);
        if (watzapResult.status === "200" || watzapResult.status === 200) {
          console.log('✅ WHATSAPP SUCCESS: Message sent to admin');
          console.log('📱 WatZap message:', watzapResult.message || 'Success');
          // UPDATE RATE LIMIT TIMESTAMP
          lastWhatsAppSent = currentTime;
          console.log('⏰ Rate limit updated, next WhatsApp allowed after:', new Date(currentTime + rateLimitMs).toISOString());
        } else {
          console.log('❌ WHATSAPP FAILED: WatZap reported failure');
          console.log('📱 WatZap error code:', watzapResult.status);
          console.log('📱 WatZap error message:', watzapResult.message || 'Unknown error');
          const errorMessages = {
            "1002": "Invalid API Key - Check WATZAP_API_KEY",
            "1003": "Invalid Number Key - Check WATZAP_NUMBER_KEY",
            "1004": "Pairing Failed - WhatsApp number not connected",
            "1005": "Fatal Error with Dynamic Message",
            "1006": "Other Error"
          };
          const errorDetail = errorMessages[watzapResult.status] || 'Unknown error code';
          console.log('📱 Error detail:', errorDetail);
        }
      } catch (parseError) {
        if (watzapResponse.ok) {
          console.log('✅ WHATSAPP SUCCESS: Response not JSON but HTTP OK');
          watzapResult = {
            status: "200",
            success: true,
            response: watzapResponseText
          };
          lastWhatsAppSent = currentTime;
          console.log('⏰ Rate limit updated (assumed success)');
        } else {
          console.log('❌ WHATSAPP FAILED: HTTP error + non-JSON response');
          watzapResult = {
            status: watzapResponse.status.toString(),
            success: false,
            error: `HTTP ${watzapResponse.status}`
          };
        }
      }
      console.log('📱 ===== WATZAP WHATSAPP NOTIFICATION SELESAI =====');
      // FINAL PROCESSING SUMMARY
      console.log('📱 ===== FINAL PROCESSING SUMMARY =====');
      console.log('📊 Telegram Message:');
      console.log('   - From:', `${messageInfo.fromUser.firstName} (@${messageInfo.fromUser.username})`);
      console.log('   - Group:', messageInfo.chat.title);
      console.log('   - Text:', messageInfo.text.substring(0, 50) + '...');
      console.log('   - Type:', messageInfo.contentType);
      console.log('📱 WhatsApp Notification:');
      console.log('   - Target:', watzapConfig.targetPhone);
      console.log('   - Message:', whatsappMessage.substring(0, 50) + '...');
      console.log('   - Status:', watzapResult.status === "200" || watzapResult.status === 200 ? 'SUCCESS ✅' : 'FAILED ❌');
      console.log('   - Rate limit updated:', watzapResult.status === "200" || watzapResult.status === 200 ? 'YES' : 'NO');
      console.log('📱 ===== PROCESSING COMPLETE =====');
      // Return success response to Telegram
      return new Response(JSON.stringify({
        status: 'success',
        message: 'Telegram message processed and WhatsApp notification sent',
        telegram: {
          from: messageInfo.fromUser.firstName,
          group: messageInfo.chat.title,
          message: messageInfo.text.substring(0, 100)
        },
        whatsapp: {
          sent: watzapResult.status === "200" || watzapResult.status === 200,
          target: watzapConfig.targetPhone,
          message: whatsappMessage.substring(0, 100) + '...',
          rateLimitUpdated: watzapResult.status === "200" || watzapResult.status === 200,
          watzapStatus: watzapResult.status,
          watzapMessage: watzapResult.message || watzapResult.error
        }
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    } catch (watzapError) {
      console.error('💥 WATZAP ERROR:', watzapError.message);
      return new Response(JSON.stringify({
        status: 'telegram_processed',
        message: 'Telegram message received but WhatsApp failed',
        error: watzapError.message,
        rateLimitUpdated: false
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('💥 TELEGRAM WEBHOOK ERROR:', error.message);
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Failed to process Telegram webhook',
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
