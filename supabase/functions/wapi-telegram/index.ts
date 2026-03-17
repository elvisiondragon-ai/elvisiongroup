import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

/**
 * TELEGRAM TO WHATSAPP - WAPI Unified Version
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

// GLOBAL RATE LIMITING
let lastWhatsAppSent = 0;
const RATE_LIMIT_MINUTES = 5;

serve(async (req) => {
  console.log('📱 ===== WAPI TELEGRAM NOTIFIER START =====');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const telegramUpdate = await req.json();
    if (!telegramUpdate.message) {
      return new Response('OK - No message', { status: 200, headers: corsHeaders });
    }

    const message = telegramUpdate.message;
    const messageInfo = {
      fromUser: `${message.from?.first_name || 'Unknown'} ${message.from?.last_name || ''} (@${message.from?.username || 'no_username'})`,
      chatTitle: message.chat.title || 'Private Chat',
      text: message.text || '[Media/Document]',
      contentType: message.photo ? 'photo' : message.video ? 'video' : message.document ? 'document' : message.voice ? 'voice' : 'text'
    };

    if (message.from?.is_bot) {
      return new Response('OK - Bot message ignored', { status: 200, headers: corsHeaders });
    }

    // RATE LIMITING
    const currentTime = Date.now();
    const timeSinceLastSent = currentTime - lastWhatsAppSent;
    const rateLimitMs = RATE_LIMIT_MINUTES * 60 * 1000;

    if (lastWhatsAppSent > 0 && timeSinceLastSent < rateLimitMs) {
      console.log('🚫 RATE LIMITED');
      return new Response(JSON.stringify({ success: true, reason: 'rate_limited' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // WAPI NOTIFICATION
    const WAPI_URL = Deno.env.get("WAPI_URL") || "https://api.elvisiongroup.com/api/send";
    const WAPI_TOKEN = Deno.env.get("WAPI_TOKEN");
    const WAPI_SESSION = Deno.env.get("WAPI_SESSION");
    const TARGET_PHONE = '6281383838013';

    const whatsappMessage = `🚀 *ROCKET NOTIFIKASI* 🚀\n\n🔔 *ADA PESAN TELEGRAM*\n\n👤 Dari: ${messageInfo.fromUser}\n📁 Group: ${messageInfo.chatTitle}\n📝 Tipe: ${messageInfo.contentType}\n\n💬 Pesan:\n${messageInfo.text.substring(0, 200)}`;

    const waResponse = await fetch(WAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session: telegramUpdate.session || WAPI_SESSION,
        token: telegramUpdate.token || WAPI_TOKEN,
        to: TARGET_PHONE,
        message: whatsappMessage
      })
    });

    const result = await waResponse.text();
    console.log(`📡 [WAPI] Result:`, result);

    if (waResponse.ok) {
        lastWhatsAppSent = currentTime;
    }

    return new Response(JSON.stringify({ success: true, wapi_response: result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('💥 ERROR:', error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
