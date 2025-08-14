import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    // Get user's IP address
    const userIP = req.headers.get('x-forwarded-for') || 
                   req.headers.get('x-real-ip') || 
                   'unknown';

    // Check if user already has an active subscription or trial
    const { data: existingSub } = await supabaseClient
      .from('vip_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingSub && existingSub.status === 'active') {
      return new Response(JSON.stringify({
        success: false,
        error: 'User already has an active VIP subscription'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Check if IP address already used trial (anti-abuse)
    const { data: ipSubs } = await supabaseClient
      .from('vip_subscriptions')
      .select('id')
      .eq('ip_address', userIP)
      .eq('subscription_type', 'trial');

    if (ipSubs && ipSubs.length > 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Trial already used from this IP address'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Start trial using database function
    const { data: subscriptionId, error } = await supabaseClient
      .rpc('start_vip_trial', {
        p_user_id: user.id,
        p_email: user.email,
        p_ip_address: userIP
      });

    if (error) {
      throw error;
    }

    // Get trial details
    const { data: vipStatus } = await supabaseClient
      .rpc('check_vip_status', { p_user_id: user.id });

    const status = vipStatus?.[0];

    return new Response(JSON.stringify({
      success: true,
      subscription_id: subscriptionId,
      trial_expires_at: status?.expires_at,
      days_remaining: status?.days_remaining
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Trial start error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});