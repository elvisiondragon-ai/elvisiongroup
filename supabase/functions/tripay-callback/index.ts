import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TripayCallbackPayload {
  reference: string
  tripay_reference?: string
  status: string
  payment_method: string
  payment_method_code?: string
  amount?: number
  total_amount?: string
  currency?: string
  merchant_ref?: string
  paid_at?: string
  payment_name?: string
  payment_email?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  order_items?: any[]
  instructions?: any[]
  expired_time?: string
  [key: string]: any
}

export default async function handler(req: Request): Promise<Response> {
  console.log('🚀 Tripay callback function started')
  console.log('📝 Method:', req.method)
  console.log('📝 URL:', req.url)
  
  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight handled')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('📥 Parsing request body...')
    const payload: TripayCallbackPayload = await req.json()
    console.log('📥 Tripay callback received:', JSON.stringify(payload, null, 2))

    console.log('🔧 Initializing Supabase client...')
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    console.log('✅ Supabase client initialized')

    // Verify callback signature if needed (add your verification logic here)
    // const isValidSignature = verifyTripaySignature(payload)
    // if (!isValidSignature) {
    //   return new Response(JSON.stringify({ error: 'Invalid signature' }), {
    //     status: 401,
    //     headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    //   })
    // }

    // UPDATED: Use the new callback processing function
    console.log('🔄 Calling process_tripay_payment_callback with params:', {
      p_tripay_reference: payload.reference,
      p_payment_status: payload.status, 
      p_payment_method: payload.payment_method || 'Unknown'
    })
    
    const { data: result, error } = await supabase.rpc('process_tripay_payment_callback', {
      p_tripay_reference: payload.reference,
      p_payment_status: payload.status, 
      p_payment_method: payload.payment_method || 'Unknown'
    })

    console.log('🔄 RPC call completed')
    console.log('📊 Result:', result)
    console.log('❓ Error:', error)

    if (error) {
      console.error('❌ Callback processing error:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      return new Response(
        JSON.stringify({ success: false, error: error.message, details: error }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('✅ Callback processed successfully:', JSON.stringify(result, null, 2))

    // If payment was successful, send notification email
    if (result.success && result.action === 'subscription_activated') {
      try {
        // Get user details for email
        const { data: subscription } = await supabase
          .from('pro_subscriptions')
          .select('user_email, subscription_type, amount_paid, currency')
          .eq('id', result.subscription_id)
          .single()

        if (subscription) {
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
          })
          console.log('📧 Success email sent to:', subscription.user_email)
        }
      } catch (emailError) {
        console.log('📧 Email notification failed (non-critical):', emailError)
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('💥 Callback handler error:', error)
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('💥 Error details:', JSON.stringify(error, null, 2))
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Callback processing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}