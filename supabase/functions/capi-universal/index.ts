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

  // Debugging: Log before parsing request body
  console.log('CAPI-UNIVERSAL: Attempting to parse request body...');
  const body = await req.json();
  console.log('CAPI-UNIVERSAL: Request body parsed successfully.');
  // --- Configuration ---
  const { pixelId, eventName, userData, customData, eventId, testCode, eventSourceUrl } = body;

  // Initialize Supabase Client for Logging
  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const supabase = createClient(supabaseUrl, supabaseKey);

  let FACEBOOK_ACCESS_TOKEN = Deno.env.get('METACAPI');

  // 🔀 DYNAMIC TOKEN SWITCHING
  // Fix for Pixel 1393... (USA/3000 Coaching) which requires a separate token
  if (pixelId === '1393383179182528') {
      const tokenUSA = Deno.env.get('CAPI_USA');
      if (tokenUSA) {
          console.log('🔀 Switching to CAPI_USA for USA Pixel');
          FACEBOOK_ACCESS_TOKEN = tokenUSA;
      } else {
          console.warn('⚠️ USA Pixel detected but CAPI_USA not set! Using default.');
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
    console.log('Raw userData received:', userData); // Log raw userData before hashing

    // Prepare DB Log Object
    const dbLog: any = {
        pixel_id: pixelId,
        event_name: eventName,
        event_id: eventId,
        user_data: userData, // Log raw user data passed to function (be careful with PII in prod logs, maybe mask?)
        custom_data: customData,
        page_url: eventSourceUrl || req.headers.get('referer'),
        status: 'processing'
    };

    // Attempt to log immediately
    const { data: logData, error: logError } = await supabase
        .from('pixel_events')
        .insert(dbLog)
        .select()
        .single();

    if (logError) console.error('Failed to insert pixel_event log:', logError);

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
      if (userData.db_id) processedUserData.facebook_login_id = userData.db_id; // Map db_id to facebook_login_id
    }
    
    // Always try to get IP and User Agent from headers as a fallback
    const clientIpAddressHeader = userData?.client_ip_address || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    if (clientIpAddressHeader) {
      // The x-forwarded-for header can be a comma-separated list of IPs.
      // We take the first one, which is the most likely to be the client's IP.
      const firstIp = clientIpAddressHeader.split(',')[0].trim();
      
      // Basic validation: A real IP address must contain a dot (IPv4) or colon (IPv6).
      // This prevents sending invalid values like "localhost".
      if (firstIp && (firstIp.includes('.') || firstIp.includes(':'))) {
        console.log(`Valid IP detected: ${firstIp}`);
        
        // 🛑 IP BLOCKING LOGIC
        const ignoredIps = Deno.env.get('IGNORED_IPS');
        if (ignoredIps) {
            const ipList = ignoredIps.split(',').map(ip => ip.trim());
            if (ipList.includes(firstIp)) {
                console.log(`🚫 IP ${firstIp} is in IGNORED_IPS list. Blocking event.`);
                return new Response(JSON.stringify({ 
                    message: 'Event blocked by IP filter (Success response to client)', 
                    skipped: true 
                }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }

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
      event_source_url: eventSourceUrl || req.headers.get('referer'), // Add URL tracking
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

    // Update the log with the result
    if (logData) {
        await supabase
            .from('pixel_events')
            .update({ 
                status: response.ok ? 'sent' : 'failed',
                meta_response: result 
            })
            .eq('id', logData.id);
    }

    if (!response.ok) {
      console.error('Meta CAPI Error:', result);
      return new Response(JSON.stringify({ error: 'Failed to send event to Facebook CAPI', details: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`✅ Meta CAPI Success for '${eventName}':`, result);
    return new Response(JSON.stringify({ message: `Event '${eventName}' sent successfully`, result }), {
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
