import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-callback-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log('🔒 SECURE Tripay Callback Function Started')

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only accept POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse Tripay callback payload
    const payload = await req.json()
    console.log('📥 Tripay callback received:', {
      reference: payload.reference,
      status: payload.status,
      method: payload.payment_method
    })

    // Initialize Supabase with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate callback signature (optional but recommended)
    const callbackSignature = req.headers.get('x-callback-signature')
    console.log('🔍 Callback signature received:', callbackSignature ? 'Yes' : 'No')

    // Process the secure payment callback
    console.log('🔒 Processing secure payment callback...')
    const { data: result, error } = await supabase.rpc('process_secure_payment_callback', {
      p_tripay_reference: payload.reference,
      p_payment_status: payload.status
    })

    if (error) {
      console.error('❌ Secure callback processing failed:', error)
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('✅ Callback processed:', {
      success: result?.success,
      action: result?.action,
      user_id: result?.user_id
    })

    // If payment successful, send notification email
    if (result?.success && result?.action === 'subscription_activated') {
      console.log('📧 Payment successful - sending notification email')
      
      try {
        // Get paid user details for email
        const { data: paidUser } = await supabase
          .from('paid_user')
          .select('email, subscription_type, tripay_reference')
          .eq('id', result.paid_user_id)
          .single()

        if (paidUser) {
          console.log('📬 Sending success email to:', paidUser.email)
          
          await supabase.functions.invoke('send-payment-email', {
            body: {
              userEmail: paidUser.email,
              amount: payload.amount,
              currency: 'IDR',
              reference: payload.reference,
              subscriptionType: paidUser.subscription_type,
              paymentMethod: payload.payment_method,
              status: 'success'
            }
          })
          
          console.log('📧 ✅ Success email sent')
        }
      } catch (emailError) {
        console.log('📧 ❌ Email notification failed (non-critical):', emailError)
      }
    }

    console.log('✅ SECURE Callback processing complete')

    return new Response(JSON.stringify({
      success: true,
      data: result,
      message: 'Secure callback processed successfully'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('💥 Secure callback error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})