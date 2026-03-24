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

// 🎯 PIXEL EL VISION (META CAPI)
const PIXEL_ID_EL_VISION = '3319324491540889';
const PIXEL_SECRET_NAME = 'METACAPI';

// Initialize Supabase Client for Logging (Global Scope for Warm Starts)
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
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

  // --- Configuration (ALways PIXEL EL VISION) ---
  const { eventName, userData, customData, eventId, eventSourceUrl, eventTime, customAccessToken } = body;

  const resolvedPixelId = PIXEL_ID_EL_VISION;
  const FACEBOOK_ACCESS_TOKEN = customAccessToken || Deno.env.get(PIXEL_SECRET_NAME);

  if (!FACEBOOK_ACCESS_TOKEN) {
    console.error(`Configuration Error: ${PIXEL_SECRET_NAME} Access Token not configured.`);
    return new Response(JSON.stringify({ error: `${PIXEL_SECRET_NAME} Access Token not configured in environment variables.` }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. ATOMIC LOCKING via DB INSERT
    const dbLog: any = {
      pixel_id: resolvedPixelId,
      event_name: eventName,
      event_id: eventId,
      user_data: userData,
      custom_data: customData,
      page_url: eventSourceUrl || req.headers.get('referer'),
      status: 'processing',
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
      if (userData.country) processedUserData.country = await hashSha256(userData.country);
      
      // --- PHONE SANITIZATION (E.164) ---
      if (userData.phone || userData.ph) {
        let rawPhone = userData.phone || userData.ph;
        let cleanPhone = rawPhone.replace(/\D/g, '');
        // Indonesia default normalization
        if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
        else if (cleanPhone.startsWith('8')) cleanPhone = '62' + cleanPhone;
        processedUserData.ph = await hashSha256(cleanPhone);
      }

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
      event_time: eventTime || Math.floor(Date.now() / 1000),
      action_source: 'website',
      event_source_url: eventSourceUrl || req.headers.get('referer'),
      custom_data: {
        ...customData,
        // Ensure content_type is 'product' for Purchase events if not specified
        content_type: customData?.content_type || (eventName === 'Purchase' ? 'product' : undefined),
      },
      event_id: eventId || undefined,
    };

    if (Object.keys(processedUserData).length > 0) {
      event.user_data = processedUserData;
    }

    const events = [event];
    const payload: any = { data: events };

    const facebookApiUrl = `https://graph.facebook.com/v19.0/${resolvedPixelId}/events?access_token=${FACEBOOK_ACCESS_TOKEN}`;

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
      console.log(`❌ CAPI Failed | Event: ${eventName} | Pixel: ${resolvedPixelId} | Error: ${JSON.stringify(result)}`);
      return new Response(JSON.stringify({ error: 'Failed to send event to Facebook CAPI', details: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // SUCCESS LOG (One single line)
    console.log(`✅ CAPI Success | Event: ${eventName} | Pixel: ${resolvedPixelId} | ID: ${eventId || 'N/A'}`);
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
