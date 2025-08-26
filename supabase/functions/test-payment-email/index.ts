import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  email: string;
  type: 'payment_created' | 'payment_completed';
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🧪 Test payment email function started');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type }: TestEmailRequest = await req.json();
    console.log('📧 Sending test email to:', email, 'type:', type);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Send payment email with test data
    const emailResponse = await supabaseClient.functions.invoke('send-payment-email', {
      body: {
        email: email,
        userName: email.split('@')[0],
        type: type,
        paymentData: {
          amount: 150000,
          currency: 'IDR',
          reference: 'TEST-' + Date.now(),
          subscriptionType: '1_month',
          paymentMethod: 'Bank Transfer BCA',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
          virtualAccount: '1234567890123456'
        }
      }
    });

    if (emailResponse.error) {
      console.error('❌ Failed to send test email:', emailResponse.error);
      throw emailResponse.error;
    }

    console.log('✅ Test email sent successfully');

    return new Response(JSON.stringify({
      success: true,
      message: `Test ${type} email sent to ${email}`,
      emailResponse: emailResponse.data
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("❌ Error sending test email:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);