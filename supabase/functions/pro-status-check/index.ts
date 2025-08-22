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

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get user from JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    console.log('Checking pro status for user:', user.id);

    // Call the database function to check pro status
    const { data: proStatusData, error: proStatusError } = await supabaseClient
      .rpc('check_pro_status', {
        p_user_id: user.id
      });

    if (proStatusError) {
      console.error('Pro status check error:', proStatusError);
      throw proStatusError;
    }

    console.log('Pro status result:', proStatusData);

    // Return the pro status data
    return new Response(
      JSON.stringify({
        success: true,
        data: proStatusData && proStatusData.length > 0 ? proStatusData[0] : {
          is_pro: false,
          subscription_type: null,
          status: null,
          expires_at: null,
          days_remaining: null
        }
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error checking pro status:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
        status: 500,
      }
    );
  }
});