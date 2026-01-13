import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdateSubscriptionRequest {
  subscription_id: string;
  status: 'active' | 'pending' | 'expired';
  subscription_type: 'trial' | '1_month' | '1_week' | '1_year' | '1_day';
  duration_type?: '1_day' | '1_week' | '1_month' | '1_year';
}

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

    const requestData: UpdateSubscriptionRequest = await req.json();
    const { subscription_id, status, subscription_type, duration_type = '1_month' } = requestData;

    console.log('Processing manual subscription update:', {
      subscription_id,
      status,
      subscription_type,
      duration_type,
      admin_user: user.id
    });

    // Call the database function to update subscription
    const { data: result, error: functionError } = await supabaseClient
      .rpc('update_subscription_status_manually', {
        p_subscription_id: subscription_id,
        p_status: status,
        p_subscription_type: subscription_type,
        p_duration_type: duration_type
      });

    if (functionError) {
      console.error('Database function error:', functionError);
      throw functionError;
    }

    console.log('Subscription updated successfully:', result);

    return new Response(JSON.stringify({
      success: true,
      result: result,
      message: 'Subscription status updated successfully and user pro status synced'
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error updating subscription status:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});