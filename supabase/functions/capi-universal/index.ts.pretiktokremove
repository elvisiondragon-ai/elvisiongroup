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

const PIXEL_ID_EL_VISION = '326442656911776';
const PIXEL_ID_FITFACTOR = '1797660474333865';
const PIXEL_ID_PARFUM = '1315644686235886';
const PIXEL_ID_JEWELRY = '874165095242407';
const PIXEL_ID_HUNGRY = '952231486339176';
const PIXEL_ID_DRELF = '1749197952320359';
const PIXEL_ID_DARKFEMININE = '3319324491540889';
const PIXEL_ID_DREAMHOME = '1572796670108871';

const PIXEL_SECRET_DEFAULT = 'FACEBOOK_ACCESS_TOKEN';
const PIXEL_SECRET_FITFACTOR = 'CAPI_FITFACTOR';
const PIXEL_SECRET_PARFUM = 'CAPI_PARFUM';
const PIXEL_SECRET_JEWELRY = 'CAPI_JEWELRY';
const PIXEL_SECRET_HUNGRY = 'CAPI_HUNGRY';
const PIXEL_SECRET_DRELF = 'CAPI_DRELF';
const PIXEL_SECRET_DARKFEMININE = 'METACAPI';
const PIXEL_SECRET_DREAMHOME = 'CAPI_HOME';

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
  const { eventName, userData, customData, eventId, eventSourceUrl, eventTime, customAccessToken, pixelId, test_event_code } = body;

  const ALLOWED_EVENTS = ["Purchase", "AddPaymentInfo"];
  if (!ALLOWED_EVENTS.includes(eventName)) {
    console.log(`ℹ️ CAPI-UNIVERSAL: Skipping restricted event: ${eventName}`);
    return new Response(JSON.stringify({ 
      message: `Event '${eventName}' is restricted. CAPI only processes ${ALLOWED_EVENTS.join(", ")}.`,
      skipped: true 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  console.log(`🚀 CAPI-UNIVERSAL Received: ${eventName} | Pixel requested: ${pixelId || "DEFAULT"}`);

  // Resolve which Pixel ID and Access Token to use
  let resolvedPixelId = pixelId || PIXEL_ID_EL_VISION;
  let FACEBOOK_ACCESS_TOKEN = customAccessToken;

  if (resolvedPixelId === PIXEL_ID_FITFACTOR) {
    FACEBOOK_ACCESS_TOKEN = FACEBOOK_ACCESS_TOKEN || Deno.env.get(PIXEL_SECRET_FITFACTOR);
  } else if (resolvedPixelId === PIXEL_ID_PARFUM) {
    FACEBOOK_ACCESS_TOKEN = FACEBOOK_ACCESS_TOKEN || Deno.env.get(PIXEL_SECRET_PARFUM);
  } else if (resolvedPixelId === PIXEL_ID_JEWELRY) {
    FACEBOOK_ACCESS_TOKEN = FACEBOOK_ACCESS_TOKEN || Deno.env.get(PIXEL_SECRET_JEWELRY);
  } else if (resolvedPixelId === PIXEL_ID_HUNGRY) {
    FACEBOOK_ACCESS_TOKEN = FACEBOOK_ACCESS_TOKEN || Deno.env.get(PIXEL_SECRET_HUNGRY);
  } else if (resolvedPixelId === PIXEL_ID_DRELF) {
    FACEBOOK_ACCESS_TOKEN = FACEBOOK_ACCESS_TOKEN || Deno.env.get(PIXEL_SECRET_DRELF);
  } else if (resolvedPixelId === PIXEL_ID_DARKFEMININE) {
    FACEBOOK_ACCESS_TOKEN = FACEBOOK_ACCESS_TOKEN || Deno.env.get(PIXEL_SECRET_DARKFEMININE);
  } else if (resolvedPixelId === PIXEL_ID_DREAMHOME) {
    FACEBOOK_ACCESS_TOKEN = FACEBOOK_ACCESS_TOKEN || Deno.env.get(PIXEL_SECRET_DREAMHOME);
  } else {
    FACEBOOK_ACCESS_TOKEN = FACEBOOK_ACCESS_TOKEN || Deno.env.get(PIXEL_SECRET_DEFAULT);
  }

  if (!FACEBOOK_ACCESS_TOKEN) {
    console.error(`Configuration Error: Access Token not configured for Pixel ${resolvedPixelId}.`);
    return new Response(JSON.stringify({ error: `Access Token not configured for Pixel ${resolvedPixelId} in environment variables.` }), {
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
      // Handle both full names and abbreviated CAPI keys (em, ph, fn, etc.)
      const email = userData.email || userData.em;
      if (email) processedUserData.em = await hashSha256(email);
      
      const country = userData.country || userData.ct; // Handle country or ct
      if (country) processedUserData.country = await hashSha256(country);
      if (userData.fn) processedUserData.fn = await hashSha256(userData.fn);
      if (userData.ln) processedUserData.ln = await hashSha256(userData.ln);
      if (userData.city || userData.ct) processedUserData.ct = await hashSha256(userData.city || userData.ct);
      if (userData.state || userData.st) processedUserData.st = await hashSha256(userData.state || userData.st);
      if (userData.zip || userData.zp) processedUserData.zp = await hashSha256(userData.zip || userData.zp);
      
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
        // We've relaxed the strict lowercase check to be more resilient to redirects 
        // that might lowercase query parameters. Meta might still complain if it's 
        // actually invalid, but at least we are sending the data we have.
        processedUserData.fbc = userData.fbc;
      }

      if (userData.external_id) processedUserData.external_id = userData.external_id;
      if (userData.db_id) processedUserData.facebook_login_id = userData.db_id;

      // --- CTWA Business Messaging Fields ---
      let resolvedCtwaClid = userData.ctwa_clid;
      
      if (!resolvedCtwaClid && (userData.phone || userData.ph)) {
        let rawPhone = userData.phone || userData.ph;
        let cleanPhone = rawPhone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
        else if (cleanPhone.startsWith('8')) cleanPhone = '62' + cleanPhone;

        const { data: ctwaData } = await supabase
          .from('global_ctwa')
          .select('ctwa_clid')
          .eq('phone', cleanPhone)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (ctwaData?.ctwa_clid) {
          resolvedCtwaClid = ctwaData.ctwa_clid;
          console.log(`🎯 CAPI: Found CTWA Attribution for ${cleanPhone}: ${resolvedCtwaClid}`);
        }
      }

      if (resolvedCtwaClid) {
        processedUserData.ctwa_clid = resolvedCtwaClid;
        processedUserData.whatsapp_business_account_id = userData.whatsapp_business_account_id || Deno.env.get('WABA_ID');
      }
    }

    // IP and User Agent handling
    const clientIpAddressHeader = userData?.client_ip_address || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
    if (clientIpAddressHeader) {
      const firstIp = clientIpAddressHeader.split(',')[0].trim();
      if (firstIp && (firstIp.includes('.') || firstIp.includes(':'))) {
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
      action_source: body.action_source || (userData?.ctwa_clid ? 'business_messaging' : 'website'),
      event_source_url: eventSourceUrl || req.headers.get('referer'),
      custom_data: {
        ...customData,
        content_type: customData?.content_type || (eventName === 'Purchase' ? 'product' : undefined),
      },
      event_id: eventId || undefined,
    };

    if (userData?.ctwa_clid) {
      event.messaging_channel = 'whatsapp';
    }

    if (Object.keys(processedUserData).length > 0) {
      event.user_data = processedUserData;
    }

    const events = [event];
    const payload: any = { data: events };
    if (test_event_code) {
      payload.test_event_code = test_event_code;
    }

    const facebookApiUrl = `https://graph.facebook.com/v19.0/${resolvedPixelId}/events?access_token=${FACEBOOK_ACCESS_TOKEN}`;

    console.log(`📡 Sending to Meta CAPI | Pixel: ${resolvedPixelId} | Event: ${eventName} | URL: ${facebookApiUrl.substring(0, 50)}...`);
    
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

    // TikTok CAPI — darkfeminine pixel only
    if (resolvedPixelId === '3319324491540889') {
      try {
        const tiktokToken = Deno.env.get('CAPI_DARKFEM_TIKTOK');
        if (tiktokToken) {
          const tiktokEventName = eventName === 'Purchase' ? 'CompletePayment' : eventName;
          const tiktokPayload = {
            pixel_code: 'D1JVHKJC77U2K3H7GGHG',
            event: tiktokEventName,
            timestamp: new Date().toISOString(),
            context: {
              user: {
                email: processedUserData.em,
                phone_number: processedUserData.ph,
              },
              page: {
                url: eventSourceUrl || req.headers.get('referer') || '',
              },
              ip: processedUserData.client_ip_address || '',
              user_agent: processedUserData.client_user_agent || '',
            },
            properties: {
              contents: [
                {
                  content_id: customData?.content_name || '',
                  content_name: customData?.content_name || '',
                  quantity: 1,
                  price: customData?.value || 0,
                },
              ],
              value: customData?.value || 0,
              currency: customData?.currency || 'IDR',
            },
          };

          const tiktokResp = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
            method: 'POST',
            headers: {
              'Access-Token': tiktokToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(tiktokPayload),
          });
          const tiktokResult = await tiktokResp.json();
          if (tiktokResp.ok && tiktokResult.code === 0) {
            console.log(`✅ TikTok CAPI Success | Event: ${tiktokEventName} | Pixel: D1JVHKJC77U2K3H7GGHG`);
          } else {
            console.error(`❌ TikTok CAPI Failed | ${JSON.stringify(tiktokResult)}`);
          }
        }
      } catch (tiktokErr: any) {
        console.error(`❌ TikTok CAPI Failed | ${tiktokErr.message}`);
      }
    }

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
