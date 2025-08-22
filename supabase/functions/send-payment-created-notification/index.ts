import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentNotificationRequest {
  userId: string;
  subscriptionType: string;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  reference?: string;
  virtualAccount?: string;
  expiresAt?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const {
      userId,
      subscriptionType,
      amount,
      currency = 'IDR',
      paymentMethod,
      reference,
      virtualAccount,
      expiresAt
    }: PaymentNotificationRequest = await req.json();

    console.log('📧 Sending payment created notification for user:', userId);

    // Get user email from auth
    const { data: userData, error: userError } = await supabaseClient.auth.admin.getUserById(userId);
    
    if (userError || !userData.user?.email) {
      throw new Error('User not found or email not available');
    }

    // Send payment created email
    const emailResponse = await supabaseClient.functions.invoke('send-payment-email', {
      body: {
        email: userData.user.email,
        userName: userData.user.email.split('@')[0],
        type: 'payment_created',
        paymentData: {
          amount,
          currency,
          reference,
          subscriptionType,
          paymentMethod,
          expiresAt,
          virtualAccount
        }
      }
    });

    if (emailResponse.error) {
      console.error('❌ Failed to send payment created email:', emailResponse.error);
      throw emailResponse.error;
    }

    console.log('✅ Payment created notification sent successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment created notification sent'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error sending payment notification:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});