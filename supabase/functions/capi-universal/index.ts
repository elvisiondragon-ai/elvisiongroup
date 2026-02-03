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

// 🎯 HARDCODED PIXEL CONFIGURATION (Non-Confidential Mapping)
const PIXEL_CONFIG: Record<string, string> = {
  '3319324491540889': 'METACAPI', // EbookIndo Pixel
  '1393383179182528': 'CAPI_USA',  // USA KAYA Pixel
};

// 🎯 TEST CODE MAPPING (Dynamic Source of Truth)
const TEST_CODE_MAPPING: Record<string, string> = {
  'testcode_indo': 'TEST23224', // Current Indo Test Code
  'testcode_usa': 'TEST88049',  // Current USA Test Code
};

// Initialize Supabase Client for Logging (Global Scope for Warm Starts)
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

Deno.serve(async (req) => {
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

  const body = await req.json();
  
  // --- Configuration ---
  const { pixelId, eventName, userData, customData, eventId, testCode, eventSourceUrl, eventTime } = body;

  let productName: string | null = null;
  if (customData) {
    if (customData.content_name) {
      productName = customData.content_name;
    } else if (customData.content_ids && Array.isArray(customData.content_ids) && customData.content_ids.length > 0) {
      productName = customData.content_ids[0];
    } else if (customData.contents && Array.isArray(customData.contents) && customData.contents.length > 0) {
      if (customData.contents[0].title) {
        productName = customData.contents[0].title;
      } else if (customData.contents[0].product_id) {
        productName = customData.contents[0].product_id;
      }
    }
  }

  // 🎯 RESTRICTED EVENTS FILTER
  const allowedEvents = ['Purchase', 'AddToCart', 'AddPaymentInfo'];
  if (!allowedEvents.includes(eventName)) {
    console.log(`⚠️ Skipping event '${eventName}' (not in allowed list) | Product: ${productName || 'N/A'} | URL: ${eventSourceUrl || 'N/A'}`);
    return new Response(JSON.stringify({ message: `Event '${eventName}' skipped (not in allowed list)` }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 1. ROBUST DEDUPLICATION CHECK
  // Check if event exists with ANY status (sent, processing, or failed)
  if (eventId) {
    const { data: existingEvent } = await supabase
      .from('pixel_events')
      .select('status')
      .eq('event_id', eventId)
      .eq('pixel_id', pixelId) 
      .maybeSingle();

    // If we found ANY record, we stop immediately.
    // Even if it failed before, we don't want to risk a double-send race condition without manual intervention.
    if (existingEvent) {
       console.log(`♻️ Deduplication: Event '${eventName}' (ID: ${eventId}) already exists (Status: ${existingEvent.status}). Skipping.`);
       return new Response(JSON.stringify({ message: `Event skipped (duplicate ${existingEvent.status})` }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  // Determine which secret to use
  const secretName = PIXEL_CONFIG[pixelId] || 'METACAPI';
  let FACEBOOK_ACCESS_TOKEN = Deno.env.get(secretName);

  if (!FACEBOOK_ACCESS_TOKEN) {
    console.error(`Configuration Error: ${secretName} Access Token not configured.`);
    return new Response(JSON.stringify({ error: `${secretName} Access Token not configured in environment variables.` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. ATOMIC LOCKING via DB INSERT
    const dbLog: any = {
        pixel_id: pixelId,
        event_name: eventName,
        event_id: eventId,
        user_data: userData,
        custom_data: customData,
        page_url: eventSourceUrl || req.headers.get('referer'),
        status: 'processing',
        product_name: productName,
        external_id: userData?.external_id
    };

    const { data: logData, error: logError } = await supabase
        .from('pixel_events')
        .insert(dbLog)
        .select()
        .single();

    // CRITICAL FIX: Stop if insert fails (likely due to unique constraint race condition)
    if (logError) {
        console.warn('⚠️ Stopped: Failed to acquire event lock (likely duplicate):', logError.message);
        return new Response(JSON.stringify({ message: 'Event skipped (race condition lock)' }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

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
      
      // Unhashed fields from client (with strict FBC case-sensitivity check)
      if (userData.fbp) processedUserData.fbp = userData.fbp;
      
      if (userData.fbc) {
        // Validate fbclid case-sensitivity to prevent Meta warnings about modified/lowercased values
        // Structure: fb.1.timestamp.fbclid
        const fbcParts = userData.fbc.split('.');
        if (fbcParts.length >= 4) {
          const fbclidPart = fbcParts.slice(3).join('.');
          const hasUpper = /[A-Z]/.test(fbclidPart);
          const hasLower = /[a-z]/.test(fbclidPart);
          
          // Meta fbclids MUST be mixed-case if they contain letters.
          // If it has letters but no uppercase, it is corrupted/lowercased.
          if (!hasUpper && hasLower) {
            console.warn(`⚠️ CAPI: Stripping corrupted (lowercased) FBC: ${userData.fbc}`);
          } else {
            processedUserData.fbc = userData.fbc;
          }
        } else {
          processedUserData.fbc = userData.fbc;
        }
      }

      if (userData.external_id) processedUserData.external_id = userData.external_id;
      if (userData.db_id) processedUserData.facebook_login_id = userData.db_id;
    }
    
    // IP and User Agent handling
    const clientIpAddressHeader = userData?.client_ip_address || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    if (clientIpAddressHeader) {
      const firstIp = clientIpAddressHeader.split(',')[0].trim();
      if (firstIp && (firstIp.includes('.') || firstIp.includes(':'))) {
        // IP BLOCKING LOGIC
        const ignoredIps = Deno.env.get('IGNORED_IPS');
        if (ignoredIps) {
            const ipList = ignoredIps.split(',').map(ip => ip.trim());
            if (ipList.includes(firstIp)) {
                return new Response(JSON.stringify({ message: 'Event blocked by IP filter', skipped: true }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                });
            }
        }
        processedUserData.client_ip_address = firstIp;
      }
    }

    const clientUserAgent = userData?.client_user_agent || req.headers.get('user-agent');
    if (clientUserAgent) {
      processedUserData.client_user_agent = clientUserAgent;
    }

    // Construct the event payload
    const event: any = {
      event_name: eventName,
      event_time: eventTime || Math.floor(Date.now() / 1000), // Use provided eventTime or current server time
      action_source: 'website',
      event_source_url: eventSourceUrl || req.headers.get('referer'),
      custom_data: customData, 
      event_id: eventId || undefined, 
    };
    
    if (Object.keys(processedUserData).length > 0) {
      event.user_data = processedUserData;
    }

    const events = [event];
    const payload: any = { data: events };
    
    // Resolve Test Code (lookup in mapping or use direct value)
    if (testCode) {
        payload.test_event_code = TEST_CODE_MAPPING[testCode] || testCode;
    }

    const facebookApiUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${FACEBOOK_ACCESS_TOKEN}`;
    
    const response = await fetch(facebookApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // Update the log
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
      // FAILURE LOG
      console.log(`❌ CAPI Failed | Event: ${eventName} | Pixel: ${pixelId} | Error: ${JSON.stringify(result)}`);
      return new Response(JSON.stringify({ error: 'Failed to send event to Facebook CAPI', details: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // SUCCESS LOG (One single line)
    console.log(`✅ CAPI Success | Event: ${eventName} | Pixel: ${pixelId} | ID: ${eventId || 'N/A'}`);
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