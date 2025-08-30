import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

export default async function handler(req) {
  console.log('🎉 ===== PAYMENT PROCESSING STARTED =====');
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log('🔄 CORS preflight request handled');
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  
  try {
    const payload = await req.json();
    console.log('📥 Tripay callback received:', payload);
    console.log('🔍 Processing payment reference:', payload.reference);
    console.log('💰 Payment status:', payload.status);
    console.log('💳 Payment method:', payload.payment_method || 'Unknown');
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '', 
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    console.log('🔗 Supabase client initialized');
    
    // Verify callback signature if needed (add your verification logic here)
    // const isValidSignature = verifyTripaySignature(payload)
    // if (!isValidSignature) {
    //   return new Response(JSON.stringify({ error: 'Invalid signature' }), {
    //     status: 401,
    //     headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    //   })
    // }
    
    console.log('🚀 Calling process_tripay_payment_callback function...');
    
    // UPDATED: Use the new callback processing function
    const { data: result, error } = await supabase.rpc('process_tripay_payment_callback', {
      p_tripay_reference: payload.reference,
      p_payment_status: payload.status,
      p_payment_method: payload.payment_method || 'Unknown'
    });
    
    if (error) {
      console.error('❌ Callback processing error:', error);
      console.log('🎉 ===== PAYMENT PROCESSING COMPLETE =====');
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    console.log('✅ Callback processed successfully:', result);
    console.log('🔍 Result action:', result?.action);
    console.log('🔍 Result success:', result?.success);
    console.log('🔍 Subscription ID:', result?.subscription_id);
    
    // If payment was successful, send notification email
    if (result.success && result.action === 'subscription_activated') {
      console.log('📧 Payment successful - preparing to send email notification');
      
      try {
        console.log('🔍 Fetching subscription details for email...');
        
        // Get user details for email
        const { data: subscription } = await supabase
          .from('pro_subscriptions')
          .select('user_email, subscription_type, amount_paid, currency')
          .eq('id', result.subscription_id)
          .single();
        
        if (subscription) {
          console.log('📬 Subscription found for email:');
          console.log('   📧 Email:', subscription.user_email);
          console.log('   💰 Amount:', subscription.amount_paid, subscription.currency);
          console.log('   📦 Type:', subscription.subscription_type);
          console.log('   🔗 Reference:', payload.reference);
          
          console.log('🚀 Invoking send-payment-email function...');
          
          // Send success email
          await supabase.functions.invoke('send-payment-email', {
            body: {
              userEmail: subscription.user_email,
              amount: subscription.amount_paid,
              currency: subscription.currency,
              reference: payload.reference,
              subscriptionType: subscription.subscription_type,
              paymentMethod: payload.payment_method,
              status: 'success'
            }
          });
          
          console.log('📧 ✅ Success email sent to:', subscription.user_email);
        } else {
          console.log('⚠️ No subscription found for ID:', result.subscription_id);
        }
      } catch (emailError) {
        console.log('📧 ❌ Email notification failed (non-critical):', emailError);
      }
    } else {
      console.log('ℹ️ Payment not successful or not activation - skipping email');
      console.log('   Success:', result?.success);
      console.log('   Action:', result?.action);
    }
    
    console.log('✅ ===== CALLBACK PROCESSED SUCCESSFULLY =====');
    console.log('🚀 Edge Function raw response preparation...');
    
    const responseData = {
      success: true,
      data: result
    };
    
    console.log('📤 Sending response:', responseData);
    
    const response = new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🎉 ===== PAYMENT PROCESSING COMPLETE =====');
    
    return response;
    
  } catch (error) {
    console.error('💥 Callback handler error:', error);
    console.error('💥 Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    console.log('❌ Edge Function JSON parse error or processing error occurred');
    console.log('⚠️ Continuing anyway - callback acknowledged');
    console.log('❌ Edge Function failed but continuing...');
    console.log('🎉 ===== PAYMENT PROCESSING COMPLETE =====');
    
    return new Response(JSON.stringify({
      success: false,
      error: 'Callback processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
}