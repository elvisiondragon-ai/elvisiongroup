import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

/**
 * Webhook handler for Macrodroid to send WhatsApp messages
 * 
 * Logic:
 * 1. Receive POST (JSON Body) or GET (Query Params) request from Macrodroid
 * Logic:
 * 1. Receive POST (JSON Body) or GET (Query Params) request from Macrodroid
 * 2. Check if the message contains "ada notif !"
 * 3. Send WhatsApp to a specific number via WAPI VPS API
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    let incomingText = "";
    
    // Handle GET Request (Query Params)
    if (req.method === 'GET') {
      const url = new URL(req.url);
      incomingText = url.searchParams.get("message") || url.searchParams.get("text") || url.searchParams.get("notification") || "";
      console.log("📱 Incoming GET Request from Macrodroid:", incomingText);
    } 
    // Handle POST Request (JSON Body)
    else if (req.method === 'POST') {
      const body = await req.json();
      console.log("📱 Incoming POST Webhook:", JSON.stringify(body, null, 2));
      
      // 1. Check for DIRECT SEND (WA Blast Mode)
      if (body.to && body.message) {
        const target = body.to.replace(/\D/g, '');
        const content = body.message;
        const wapiApiUrl = Deno.env.get("WAPI_URL") || "https://api.elvisiongroup.get/api/send";
        const wapiToken = body.token || Deno.env.get("WAPI_TOKEN");
        const wapiSession = body.session || Deno.env.get("WAPI_SESSION");
        
        console.log("🚀 WAPI Blast mode detected! Sending to", target);
        
        const resp = await fetch(wapiApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            session: wapiSession,
            token: wapiToken,
            to: target, 
            message: content 
          })
        });

        const result = await resp.json();
        return new Response(JSON.stringify({ success: true, api_response: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        });
      }

      incomingText = body.message || body.text || body.notification || body.content || "";
    }

    // 2. OLD LOGIC: MACRODROID / SHOPEE TRIGGER (Sent to multiple numbers)
    const legacyTargetNumbers = ["6285664733499", "6281383838013"]; 
    console.log("📝 Received message content for trigger check:", incomingText);

    if (incomingText && incomingText.toLowerCase().includes("ada notif !")) {
      console.log("🚀 Shopee Trigger match! Sending notifications...");
      
      const wapiApiUrl = Deno.env.get("WAPI_URL") || "https://api.elvisiongroup.com/api/send";
      const wapiToken = Deno.env.get("WAPI_TOKEN");
      const wapiSession = Deno.env.get("WAPI_SESSION");
      
      const results = [];
      for (const num of legacyTargetNumbers) {
        const payload = {
          session: wapiSession,
          token: wapiToken,
          to: num,
          message: `🔔 NOTIFIKASI BARU:\n\n${incomingText}`
        };

        const resp = await fetch(wapiApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        results.push(await resp.json());
      }

      return new Response(JSON.stringify({ success: true, sent: true, api_responses: results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      });
    }

    console.log("⚠️ Message did not match trigger phrase 'ada notif !' or was empty.");
    return new Response(JSON.stringify({ 
      success: true, 
      sent: false, 
      reason: "No trigger match or empty message" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200
    });

  } catch (error) {
    console.error("💥 Webhook Error:", error.message);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400
    });
  }
});
