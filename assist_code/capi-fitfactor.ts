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

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // --- Configuration ---
  const FACEBOOK_PIXEL_ID = Deno.env.get('FACEBOOK_PIXEL_ID');
  const FACEBOOK_ACCESS_TOKEN = Deno.env.get('FACEBOOK_ACCESS_TOKEN');

  if (!FACEBOOK_PIXEL_ID || !FACEBOOK_ACCESS_TOKEN) {
    return new Response(JSON.stringify({ error: 'Facebook Pixel ID or Access Token not configured in environment variables.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { eventName, userData, customData } = await req.json();

    if (!eventName) {
      return new Response(JSON.stringify({ error: 'eventName is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prepare user data for Facebook CAPI (hash sensitive information)
    const processedUserData: Record<string, string | undefined> = {};
    if (userData) {
      if (userData.email) processedUserData.em = await hashSha256(userData.email);
      if (userData.phone) processedUserData.ph = await hashSha256(userData.phone);
      // Add other user data fields as needed, hashing them
      // fbp: Facebook browser ID, fbc: Facebook click ID
      if (userData.fbp) processedUserData.fbp = userData.fbp;
      if (userData.fbc) processedUserData.fbc = userData.fbc;
      
      // Client IP Address - get from request headers if not provided by frontend
      // The edge function itself can get the IP, but if the frontend sends it, use that.
      const clientIpAddress = userData.client_ip_address || req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip');
      if (clientIpAddress) processedUserData.client_ip_address = clientIpAddress;

      // Client User Agent - get from request headers
      const clientUserAgent = userData.client_user_agent || req.headers.get('user-agent');
      if (clientUserAgent) processedUserData.client_user_agent = clientUserAgent;
    }

    // Construct the event payload for Facebook Conversions API
    const events = [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
      action_source: 'website', // or 'app', 'physical_store', etc.
      user_data: processedUserData,
      custom_data: customData, // e.g., { value: 100, currency: 'USD' }
      // event_id: unique ID for deduplication if you send from browser and server
    }];

    const facebookApiUrl = `https://graph.facebook.com/v19.0/${FACEBOOK_PIXEL_ID}/events?access_token=${FACEBOOK_ACCESS_TOKEN}`;

    const response = await fetch(facebookApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: events }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Error sending event to Facebook CAPI:', result);
      return new Response(JSON.stringify({ error: 'Failed to send event to Facebook CAPI', details: result }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Event sent to Facebook CAPI successfully', result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error in capi-fitfactor function:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});