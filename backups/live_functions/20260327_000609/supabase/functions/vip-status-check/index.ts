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

    // Check VIP status using database function
    const { data: vipStatus, error } = await supabaseClient
      .rpc('check_vip_status', { p_user_id: user.id });

    if (error) {
      throw error;
    }

    const status = vipStatus?.[0] || {
      is_vip: false,
      subscription_type: null,
      status: null,
      expires_at: null,
      days_remaining: null
    };

    // Auto-kick logic: if trial expired, block access
    if (status.subscription_type === 'trial' && status.status === 'expired') {
      // Could implement IP blocking logic here if needed
      console.log(`Trial expired for user ${user.id}, IP blocking could be implemented`);
    }

    return new Response(JSON.stringify({
      success: true,
      is_vip: status.is_vip,
      subscription_type: status.subscription_type,
      status: status.status,
      expires_at: status.expires_at,
      days_remaining: status.days_remaining
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('VIP status check error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      is_vip: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});