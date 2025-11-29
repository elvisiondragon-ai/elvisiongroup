import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
const handler = async (req)=>{
  console.log('🚀 Auth webhook function started');
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const event = await req.json();
    console.log('📧 Auth event received:', event.type, event.record?.email);
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: {
        persistSession: false
      }
    });
    // Handle user signup completion (email confirmed)
    if (event.type === 'INSERT' && event.table === 'users' && event.record.email_confirmed_at) {
      console.log('🎉 New user confirmed email, sending welcome email');
      const userName = event.record.raw_user_meta_data?.display_name || event.record.email.split('@')[0];
      // Send welcome email
      const emailResponse = await supabaseClient.functions.invoke('send-welcome-email', {
        body: {
          email: event.record.email,
          userName: userName
        }
      });
      if (emailResponse.error) {
        console.error('❌ Failed to send welcome email:', emailResponse.error);
      } else {
        console.log('✅ Welcome email sent successfully');
      }
    }
    // Handle email confirmation events
    if (event.type === 'UPDATE' && event.table === 'users' && event.record.email_confirmed_at && !event.old_record?.email_confirmed_at) {
      console.log('📧 User confirmed their email, sending welcome email');
      const userName = event.record.raw_user_meta_data?.display_name || event.record.email.split('@')[0];
      // Send welcome email for late confirmations
      const emailResponse = await supabaseClient.functions.invoke('send-welcome-email', {
        body: {
          email: event.record.email,
          userName: userName
        }
      });
      if (emailResponse.error) {
        console.error('❌ Failed to send welcome email:', emailResponse.error);
      } else {
        console.log('✅ Welcome email sent successfully');
      }
    }
    return new Response(JSON.stringify({
      success: true,
      message: 'Auth webhook processed successfully'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("❌ Error processing auth webhook:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};
serve(handler);
