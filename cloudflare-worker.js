/**
 * Cloudflare Worker for handling Tripay and Moota webhooks
 * Provides static IP solution for payment gateway webhooks
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Callback-Signature',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route webhooks based on path
      if (path === '/tripay/process') {
        return await handleTripayWebhook(request, env);
      } else if (path === '/api/moota-webhook') {
        return await handleMootaWebhook(request, env);
      } else {
        return new Response('Webhook endpoint not found', { 
          status: 404,
          headers: corsHeaders 
        });
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Handle Tripay webhook callbacks
 */
async function handleTripayWebhook(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await request.text();
  const signature = request.headers.get('X-Callback-Signature');
  
  // Verify Tripay signature
  const privateKey = env.TRIPAY_PRIVATE_KEY || 'DEV-Wr3eLhJGnGECQ1WsRGh9fvNjVZi6vLKpW52ksKmS';
  const expectedSignature = await generateHMAC(privateKey, body);
  
  if (signature !== expectedSignature) {
    console.error('Invalid Tripay signature');
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid signature' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Forward to Supabase edge function
  const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/tripay-callback';
  
  const response = await fetch(supabaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw'}`,
    },
    body: body
  });

  const result = await response.text();
  
  console.log('Tripay webhook forwarded:', {
    status: response.status,
    result: result
  });

  return new Response(result, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Handle Moota webhook callbacks
 */
async function handleMootaWebhook(request, env) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const body = await request.text();
  let webhookData;
  
  try {
    webhookData = JSON.parse(body);
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid JSON' 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Verify Moota webhook token
  const webhookToken = env.MOOTA_WEBHOOK_SECRET || 'FPtVHJck';
  const providedToken = webhookData.token || request.headers.get('X-Webhook-Token');
  
  if (providedToken !== webhookToken) {
    console.error('Invalid Moota webhook token');
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Invalid webhook token' 
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Forward to Supabase edge function
  const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/moota-webhook-handler';
  
  const response = await fetch(supabaseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDk0NTQsImV4cCI6MjA2OTk4NTQ1NH0.62U0WBImD8aT8mJvHv4xysGsp4IyV1A4a26OlTdOpVw'}`,
    },
    body: body
  });

  const result = await response.text();
  
  console.log('Moota webhook forwarded:', {
    status: response.status,
    result: result
  });

  return new Response(result, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * Generate HMAC SHA256 signature for Tripay
 */
async function generateHMAC(key, message) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}