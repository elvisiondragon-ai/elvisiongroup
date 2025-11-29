import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const endpoint = 'auth_check';
    console.log(`🛡️ Rate limit check for IP: ${clientIP}`);
    // Check rate limit
    const { data: rateLimitResult, error } = await supabase.rpc('check_rate_limit', {
      p_ip_address: clientIP,
      p_endpoint: endpoint,
      p_max_requests: 10,
      p_window_minutes: 1
    });
    if (error) {
      console.error('Rate limit check failed:', error);
      return new Response(JSON.stringify({
        error: 'Rate limit check failed'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    if (!rateLimitResult.allowed) {
      console.log(`🚫 Rate limit exceeded for IP: ${clientIP}`);
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: rateLimitResult.retry_after
      }), {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': rateLimitResult.retry_after.toString()
        }
      });
    }
    // Rate limit passed
    return new Response(JSON.stringify({
      success: true,
      remaining: rateLimitResult.remaining,
      message: 'Rate limit check passed'
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Auth rate limit error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
