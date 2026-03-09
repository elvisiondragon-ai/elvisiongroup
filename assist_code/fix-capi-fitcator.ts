import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// CORS headers - CRITICAL for frontend requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify your domain: 'https://app.elvisiongroup.com'
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Helper function to hash data with SHA256 (for Facebook CAPI user_data)
async function hashSha256(value: string): Promise<string> {
  const textEncoder = new TextEncoder();
  const data = textEncoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hexHash;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  console.log('--- capi-fitfactor Edge Function Start ---');
  
  if (req.method !== 'POST') {
    console.log('Method Not Allowed:', req.method);
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // --- Configuration ---
  const FACEBOOK_PIXEL_ID = Deno.env.get('FACEBOOK_PIXEL_ID');
  const FACEBOOK_ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN');

  if (!FACEBOOK_PIXEL_ID || !FACEBOOK_ACCESS_TOKEN) {
    console.error('Configuration Error: Facebook Pixel ID or Access Token not configured.');
    return new Response(JSON.stringify({ error: 'Facebook Pixel ID or Access Token not configured in environment variables.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { eventName, userData, customData, eventId } = await req.json();

    console.log('Incoming Event Data:', { eventName, userData, customData, eventId });

    if (!eventName) {
      console.log('Validation Error: eventName is required.');
      return new Response(JSON.stringify({ error: 'eventName is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Helper function to extract and validate IP address
    const getValidClientIP = (): string | undefined => {
      // Try multiple header sources
      const forwardedFor = req.headers.get('x-forwarded-for');
      const realIp = req.headers.get('x-real-ip');
      const cfConnectingIp = req.headers.get('cf-connecting-ip'); // Cloudflare
      
      let ip = userData?.client_ip_address || forwardedFor || realIp || cfConnectingIp;
      
      if (!ip) return undefined;
      
      // x-forwarded-for can contain multiple IPs (client, proxy1, proxy2...)
      // We want the first one (the original client IP)
      if (ip.includes(',')) {
        ip = ip.split(',')[0].trim();
      }
      
      // Validate IP format (basic IPv4 and IPv6 validation)
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
      
      if (ipv4Regex.test(ip) || ipv6Regex.test(ip)) {
        return ip;
      }
      
      console.warn('Invalid IP address format:', ip);
      return undefined;
    };

    // Prepare user data for Facebook CAPI (hash sensitive information)
    const processedUserData: Record<string, string | undefined> = {};
    if (userData) {
      if (userData.email) processedUserData.em = await hashSha256(userData.email);
      if (userData.phone) processedUserData.ph = await hashSha256(userData.phone);
      
      // fbp: Facebook browser ID, fbc: Facebook click ID
      if (userData.fbp) processedUserData.fbp = userData.fbp;
      if (userData.fbc) processedUserData.fbc = userData.fbc;
      
      // Client IP Address - validated
      const clientIpAddress = getValidClientIP();
      if (clientIpAddress) {
        processedUserData.client_ip_address = clientIpAddress;
      }

      // Client User Agent - get from request headers
      const clientUserAgent = userData.client_user_agent || req.headers.get('user-agent');
      if (clientUserAgent) processedUserData.client_user_agent = clientUserAgent;
    }
    console.log('Processed User Data:', processedUserData);

    // Get test event code from query params (optional, for testing)
    const url = new URL(req.url);
    const testEventCode = url.searchParams.get('test_event_code');
    
    // Construct the event payload for Facebook Conversions API
    const events = [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
      action_source: 'website', // This indicates it's from your website
      user_data: processedUserData,
      custom_data: customData,
      event_id: eventId || undefined, // Include event_id for deduplication with browser pixel
    }];
    
    const payload: any = { data: events };
    if (testEventCode) {
      payload.test_event_code = testEventCode; // For Meta Test Events tool
    }
    console.log('Constructed Facebook Events Payload:', JSON.stringify(payload, null, 2));

    const facebookApiUrl = `https://graph.facebook.com/v19.0/${FACEBOOK_PIXEL_ID}/events?access_token=${FACEBOOK_ACCESS_TOKEN}`;
    console.log('Sending to Facebook API URL:', facebookApiUrl);

    const response = await fetch(facebookApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('Facebook API Response Status:', response.status);
    console.log('Facebook API Response Body:', JSON.stringify(result, null, 2));

    if (!response.ok) {
      console.error('Error sending event to Facebook CAPI:', result);
      return new Response(JSON.stringify({ error: 'Failed to send event to Facebook CAPI', details: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('--- capi-fitfactor Edge Function End ---');
    return new Response(JSON.stringify({ message: 'Event sent to Facebook CAPI successfully', result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error in capi-fitfactor function:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});