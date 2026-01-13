import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// GLOBAL RATE LIMITING STORAGE
// Menyimpan waktu terakhir WhatsApp dikirim untuk mencegah spam
let lastWhatsAppSent = 0;
const RATE_LIMIT_MINUTES = 5; // Limit 5 menit sekali

// MAIN EDGE FUNCTION - TELEGRAM TO WHATSAPP
serve(async (req) => {
  console.log('📱 ===== TELEGRAM TO WHATSAPP FUNCTION START =====');
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // =======================================================
    // KODE TELEGRAM - PARSE WEBHOOK
    // Block ini menerima webhook dari Telegram dan extract data message
    // =======================================================
    
    console.log('📱 Parsing Telegram webhook...');
    const telegramUpdate = await req.json();
    
    console.log('📱 Telegram update received:', JSON.stringify(telegramUpdate, null, 2));
    
    // Check if this is a message update
    if (!telegramUpdate.message) {
      console.log('⚠️ No message in update, ignoring');
      // Disini function silent - tidak ada message untuk diproses
      return new Response('OK - No message', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    const message = telegramUpdate.message;
    
    // Extract message info - ambil data dari Telegram webhook
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
      contentType: message.photo ? 'photo' : 
                  message.video ? 'video' : 
                  message.document ? 'document' : 
                  message.voice ? 'voice' : 'text'
    };

    console.log('📱 Message info extracted:', JSON.stringify(messageInfo, null, 2));

    // Skip bot messages - disini function silent untuk pesan dari bot
    if (message.from?.is_bot) {
      console.log('🤖 Message from bot, ignoring to avoid loops');
      // Function silent - tidak proses pesan dari bot untuk hindari loop
      return new Response('OK - Bot message ignored', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    console.log('📱 ===== TELEGRAM PARSING SELESAI =====');

    // =======================================================
    // KODE RATE LIMITING - LIMIT 5 MENIT SEKALI
    // Block ini mengecek apakah sudah boleh kirim WhatsApp atau belum
    // =======================================================
    
    console.log('⏰ ===== RATE LIMITING CHECK START =====');
    
    const currentTime = Date.now();
    const timeSinceLastSent = currentTime - lastWhatsAppSent;
    const rateLimitMs = RATE_LIMIT_MINUTES * 60 * 1000; // 5 menit dalam milliseconds
    
    console.log('⏰ Rate limit check:');
    console.log('   - Current time:', new Date(currentTime).toISOString());
    console.log('   - Last WhatsApp sent:', lastWhatsAppSent ? new Date(lastWhatsAppSent).toISOString() : 'Never');
    console.log('   - Time since last sent:', Math.floor(timeSinceLastSent / 1000) + ' seconds');
    console.log('   - Rate limit:', RATE_LIMIT_MINUTES + ' minutes (' + rateLimitMs + ' ms)');
    
    if (lastWhatsAppSent > 0 && timeSinceLastSent < rateLimitMs) {
      const remainingTime = Math.ceil((rateLimitMs - timeSinceLastSent) / 1000);
      console.log('🚫 RATE LIMITED: WhatsApp blocked for', remainingTime, 'more seconds');
      console.log('📱 Message received from:', `${messageInfo.fromUser.firstName} in ${messageInfo.chat.title}`);
      console.log('📱 Message content:', messageInfo.text.substring(0, 50) + '...');
      console.log('⚠️ WhatsApp NOT sent due to rate limit');
      
      // Disini function silent - pesan diterima tapi WhatsApp tidak dikirim karena rate limit
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
    console.log('⏰ ===== RATE LIMITING CHECK SELESAI =====');

    // =======================================================
    // KODE STARSENDER - WHATSAPP NOTIFICATION
    // Block ini mengirim notifikasi WhatsApp via StarSender API
    // =======================================================
    
    console.log('📱 ===== STARSENDER WHATSAPP NOTIFICATION START =====');
    
    try {
      // STARSENDER CONSTANTS - konfigurasi API StarSender
      const starsenderConfig = {
        apiKey: Deno.env.get('STARSENDER_API_KEY') || '',
        apiUrl: 'https://api.starsender.online/api/send',
        targetPhone: '085295237107', // Admin WhatsApp number
        messageType: 'text'
      };
      
      console.log('📱 StarSender config loaded');
      console.log('📱 Target phone:', starsenderConfig.targetPhone);
      console.log('📱 API Key available:', starsenderConfig.apiKey ? 'Yes ✅' : 'No ❌');
      
      // Format phone number - convert ke format StarSender (Indonesian)
      let formattedPhone = starsenderConfig.targetPhone.replace(/\D/g, ''); // Remove non-digits
      
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '62' + formattedPhone.substring(1); // 085xxx -> 6285xxx
      } else if (!formattedPhone.startsWith('62')) {
        formattedPhone = '62' + formattedPhone; // Add 62 if missing
      }
      
      console.log('📱 Phone formatting:');
      console.log('   - Original:', starsenderConfig.targetPhone);
      console.log('   - Formatted:', formattedPhone);
      
      // PREPARE WHATSAPP MESSAGE - isi pesan yang akan dikirim
      const whatsappMessage = "ADA PESAN DI TELEGRAM KOMUNITAS";
      
      console.log('📱 WhatsApp message prepared:', whatsappMessage);
      
      // STARSENDER API PAYLOAD - data yang dikirim ke StarSender
      const starsenderPayload = {
        messageType: starsenderConfig.messageType,
        to: formattedPhone,
        body: whatsappMessage
      };
      
      console.log('📱 StarSender payload:', JSON.stringify(starsenderPayload, null, 2));
      
      // SEND TO STARSENDER API - kirim request ke StarSender
      console.log('📱 Calling StarSender API...');
      
      const starsenderResponse = await fetch(starsenderConfig.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': starsenderConfig.apiKey
        },
        body: JSON.stringify(starsenderPayload)
      });
      
      console.log('📱 StarSender API status:', starsenderResponse.status);
      console.log('📱 StarSender API ok:', starsenderResponse.ok);
      
      const starsenderResponseText = await starsenderResponse.text();
      console.log('📱 StarSender API response:', starsenderResponseText);
      
      // PARSE STARSENDER RESPONSE - analisa response dari StarSender
      let starsenderResult;
      try {
        starsenderResult = JSON.parse(starsenderResponseText);
        
        if (starsenderResult.success === true) {
          console.log('✅ WHATSAPP SUCCESS: Message sent to admin');
          console.log('📱 StarSender message:', starsenderResult.message || 'Success');
          
          // UPDATE RATE LIMIT TIMESTAMP - catat waktu terakhir WhatsApp dikirim
          lastWhatsAppSent = currentTime;
          console.log('⏰ Rate limit updated, next WhatsApp allowed after:', new Date(currentTime + rateLimitMs).toISOString());
          
        } else {
          console.log('❌ WHATSAPP FAILED: StarSender reported failure');
          console.log('📱 StarSender error:', starsenderResult.message || 'Unknown error');
          // Disini tidak update rate limit karena WhatsApp gagal dikirim
        }
      } catch (parseError) {
        if (starsenderResponse.ok) {
          console.log('✅ WHATSAPP SUCCESS: Response not JSON but HTTP OK');
          starsenderResult = { success: true, response: starsenderResponseText };
          // UPDATE RATE LIMIT karena kemungkinan WhatsApp terkirim
          lastWhatsAppSent = currentTime;
          console.log('⏰ Rate limit updated (assumed success)');
        } else {
          console.log('❌ WHATSAPP FAILED: HTTP error + non-JSON response');
          starsenderResult = { success: false, error: `HTTP ${starsenderResponse.status}` };
          // Tidak update rate limit karena gagal
        }
      }
      
      console.log('📱 ===== STARSENDER WHATSAPP NOTIFICATION SELESAI =====');
      
      // =======================================================
      // KODE LOGGING & RESPONSE - LOG HASIL DAN RETURN RESPONSE
      // Block ini mencatat hasil proses dan mengirim response ke Telegram
      // =======================================================
      
      console.log('📱 ===== FINAL PROCESSING SUMMARY =====');
      console.log('📊 Telegram Message:');
      console.log('   - From:', `${messageInfo.fromUser.firstName} (@${messageInfo.fromUser.username})`);
      console.log('   - Group:', messageInfo.chat.title);
      console.log('   - Text:', messageInfo.text.substring(0, 50) + '...');
      console.log('   - Type:', messageInfo.contentType);
      
      console.log('📱 WhatsApp Notification:');
      console.log('   - Target:', formattedPhone);
      console.log('   - Message:', whatsappMessage);
      console.log('   - Status:', starsenderResult.success ? 'SUCCESS ✅' : 'FAILED ❌');
      console.log('   - Rate limit updated:', starsenderResult.success ? 'YES' : 'NO');
      
      console.log('📱 ===== PROCESSING COMPLETE =====');
      
      // Return success response to Telegram - response sukses ke Telegram webhook
      return new Response(JSON.stringify({
        status: 'success',
        message: 'Telegram message processed and WhatsApp notification sent',
        telegram: {
          from: messageInfo.fromUser.firstName,
          group: messageInfo.chat.title,
          message: messageInfo.text.substring(0, 100)
        },
        whatsapp: {
          sent: starsenderResult.success || false,
          target: formattedPhone,
          message: whatsappMessage,
          rateLimitUpdated: starsenderResult.success || false
        }
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
      
    } catch (starsenderError) {
      // ERROR HANDLING STARSENDER - handle error dari StarSender API
      console.error('💥 STARSENDER ERROR:');
      console.error('   - Error Type:', starsenderError.name);
      console.error('   - Error Message:', starsenderError.message);
      console.error('   - Stack:', starsenderError.stack);
      
      // Still return success to Telegram to avoid webhook retries
      // Tetap return success ke Telegram untuk hindari retry webhook
      return new Response(JSON.stringify({
        status: 'telegram_processed',
        message: 'Telegram message received but WhatsApp failed',
        error: starsenderError.message,
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
    // ERROR HANDLING GENERAL - handle error umum dari proses webhook
    console.error('💥 TELEGRAM WEBHOOK ERROR:');
    console.error('   - Error Type:', error.name);
    console.error('   - Error Message:', error.message);
    console.error('   - Stack:', error.stack);
    
    // Return error response
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