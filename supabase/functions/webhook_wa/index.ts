import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

/**
 * Webhook handler for Macrodroid to send WhatsApp messages
 * 
 * Logic:
 * 1. Receive POST (JSON Body) or GET (Query Params) request from Macrodroid
 * 2. Check if the message contains "ada notif !"
 * 3. Send WhatsApp to a specific number via ShopAuto VPS API
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
      console.log("📱 Incoming POST Webhook from Macrodroid:", JSON.stringify(body, null, 2));
      incomingText = body.message || body.text || body.notification || body.content || "";
    }

    // MACRODROID THIS WA API must sent to one number only: 6285664733499 (dengan format json barusan)
    const targetNumber = "6285664733499"; // Updated target number

    console.log("📝 Received message content:", incomingText);

    // If message contains "ada notif !", send the WhatsApp notification
    if (incomingText && incomingText.toLowerCase().includes("ada notif !")) {
      console.log("🚀 Trigger match! Sending WhatsApp to", targetNumber);
      
      /**
       * WhatsApp API Configuration from Global Context:
       * The ShopAuto WhatsApp VPS API is located at 'https://watzapp.web.id' (standard HTTPS port 443).
       */
      const waApiUrl = "https://watzapp.web.id/api/message"; // Updated API Endpoint
      
      // Attempt to get API Key from env, fallback to new provided default
      const waApiKey = Deno.env.get("WA_API_KEY") || "4f46b29bf8e0e4443d9e631007324b29199443786d8b4befab3a2d529208583f"; // Updated API Key
      
      const payload = {
        token: waApiKey, // Corrected: Use 'token' instead of 'api_key'
        to: targetNumber, // Corrected: Use 'to' instead of 'phone_no'
        message: `🔔 NOTIFIKASI BARU:\n\n${incomingText}`
      };

      console.log("📡 Calling WhatsApp API:", waApiUrl);
      
      const resp = await fetch(waApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "x-api-key": waApiKey // x-api-key might not be needed if token is in payload
        },
        body: JSON.stringify(payload)
      });

      const responseText = await resp.text();
      console.log("✅ WhatsApp API Response:", responseText);

      return new Response(JSON.stringify({ 
        success: true, 
        sent: true,
        api_response: responseText 
      }), {
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
