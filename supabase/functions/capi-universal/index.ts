import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// Helper function to hash data with SHA256 (for Facebook CAPI user_data)
async function hashSha256(value: string): Promise<string> {
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexHash;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (req) => {
  // First, clone the request so we can read the body twice
  const reqClone = req.clone();
  
  // Log the raw body for debugging
  try {
    const rawBody = await reqClone.text();
    console.log('--- CAPI-UNIVERSAL Raw Request Body ---');
    console.log(rawBody);
  } catch (e) {
    console.error('Error reading raw request body:', e);
  }

  console.log('--- CAPI-UNIVERSAL Edge Function Start ---');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // --- Configuration ---
  const { pixelId, eventName, userData, customData, eventId, testCode } = await req.json();

  let FACEBOOK_ACCESS_TOKEN = Deno.env.get('METACAPI');
  
  // Specific Token for 3000 Coaching Pixel
  if (pixelId === '1393383179182528') {
      const token3000 = Deno.env.get('METACAPI_3000');
      if (token3000) {
          console.log('Using specific Access Token for Pixel 3000');
          FACEBOOK_ACCESS_TOKEN = token3000;
      } else {
          console.warn('⚠️ Warning: Pixel 1393... requested but METACAPI_3000 not found. Falling back to default.');
      }
  }

  if (!FACEBOOK_ACCESS_TOKEN) {
    console.error('Configuration Error: METACAPI Access Token not configured.');
    return new Response(JSON.stringify({ error: 'METACAPI Access Token not configured in environment variables.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log('Incoming Universal Event:', { pixelId, eventName, email: userData?.email, eventId });

    if (!pixelId) {
      return new Response(JSON.stringify({ error: 'pixelId is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!eventName) {
      return new Response(JSON.stringify({ error: 'eventName is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare user data for Facebook CAPI (hash sensitive information)
    const processedUserData: Record<string, string | undefined> = {};
    if (userData) {
      if (userData.email) processedUserData.em = await hashSha256(userData.email);
      if (userData.phone) processedUserData.ph = await hashSha256(userData.phone);
      if (userData.fn) processedUserData.fn = await hashSha256(userData.fn);
      if (userData.ln) processedUserData.ln = await hashSha256(userData.ln);
      if (userData.ct) processedUserData.ct = await hashSha256(userData.ct);
      if (userData.st) processedUserData.st = await hashSha256(userData.st);
      if (userData.zp) processedUserData.zp = await hashSha256(userData.zp);
      if (userData.country) processedUserData.country = await hashSha256(userData.country);
      
      // Unhashed fields from client
      if (userData.fbp) processedUserData.fbp = userData.fbp;
      if (userData.fbc) processedUserData.fbc = userData.fbc;
      if (userData.external_id) processedUserData.external_id = userData.external_id;
      if (userData.db_id) processedUserData.db_id = userData.db_id; // Facebook Login ID
    }
    
    // Always try to get IP and User Agent from headers as a fallback
    const clientIpAddressHeader = userData?.client_ip_address || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    if (clientIpAddressHeader) {
      // The x-forwarded-for header can be a comma-separated list of IPs.
      // We take the first one, which is the most likely to be the client's IP.
      const firstIp = clientIpAddressHeader.split(',')[0].trim();
      
      // Basic validation: A real IP address must contain a dot.
      // This prevents sending invalid values like "localhost".
      if (firstIp && firstIp.includes('.')) {
        console.log(`Valid IP detected: ${firstIp}`);
        processedUserData.client_ip_address = firstIp;
      } else {
        console.log(`Invalid or localhost IP detected and skipped: ${firstIp}`);
      }
    }

    const clientUserAgent = userData?.client_user_agent || req.headers.get('user-agent');
    if (clientUserAgent) {
      processedUserData.client_user_agent = clientUserAgent;
    }

    // Construct the event payload
    const event: any = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      custom_data: customData, 
      event_id: eventId || undefined, 
    };
    
    // Only include user_data if it's not empty
    if (Object.keys(processedUserData).length > 0) {
      event.user_data = processedUserData;
    }

    const events = [event];

    // Add test_event_code if provided (for testing in Events Manager)
    const payload: any = { data: events };
    if (testCode) {
        payload.test_event_code = testCode;
    }

    const facebookApiUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${FACEBOOK_ACCESS_TOKEN}`;
    console.log(`Sending event '${eventName}' to Pixel ID: ${pixelId}`);

    const response = await fetch(facebookApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Meta CAPI Error:', result);
      return new Response(JSON.stringify({ error: 'Failed to send event to Facebook CAPI', details: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Meta CAPI Success:', result);
    return new Response(JSON.stringify({ message: 'Event sent successfully', result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('CAPI-UNIVERSAL Internal Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
