import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log('🚀 Edge Function started')
  console.log('Request method:', req.method)
  console.log('Request URL:', req.url)

  // Handle CORS
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight handled')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only accept POST
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method)
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase client for database operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get auth token from request headers and verify user
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      console.log('❌ No authorization header')
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with anon key to verify user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    if (authError || !user) {
      console.log('❌ Authentication failed:', authError?.message)
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Found user from auth token:', user.id)

    // Parse request body
    console.log('📥 Parsing request body...')
    const body = await req.json()
    console.log('✅ Received body:', JSON.stringify(body))

    // VPS URL
    const vpsUrl = "https://payment.elvisiongroup.com/create-payment"
    
    // Forward to VPS directly
    console.log('🌐 Sending to VPS...')
    const vpsResponse = await fetch(vpsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    console.log('📡 VPS Response status:', vpsResponse.status)
    console.log('📡 VPS Response ok:', vpsResponse.ok)

    // Read response as text first
    const responseText = await vpsResponse.text()
    console.log('📄 VPS Response text length:', responseText.length)
    console.log('📄 VPS Response preview:', responseText.substring(0, 200))

    // Try to parse as JSON
    let vpsResult
    try {
      vpsResult = JSON.parse(responseText)
      console.log('✅ Parsed JSON successfully')
      console.log('📋 Result keys:', Object.keys(vpsResult))
    } catch (parseError) {
      console.log('⚠️ JSON parse failed:', parseError.message)
      return new Response(
        JSON.stringify({ 
          error: 'Invalid VPS response format',
          message: 'Payment service returned invalid data'
        }), 
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // If VPS returns error status
    if (vpsResponse.status !== 200) {
      console.log('💥 VPS Error detected:', vpsResponse.status)
      return new Response(
        JSON.stringify({ 
          error: 'Payment service error',
          message: 'VPS backend service returned an error.',
          vps_response: vpsResult
        }), 
        {
          status: vpsResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Database operations - Create subscription and payment records
    console.log('💾 ===== DATABASE OPERATIONS START =====')
    
    try {
      // Create subscription record
      console.log('💾 Creating subscription record:', {
        user_id: user.id,
        user_email: body.userEmail,
        subscription_type: body.subscriptionType,
        amount_paid: body.amount || vpsResult.amount,
        currency: body.currency || 'IDR',
        status: 'pending',
        tripay_reference: vpsResult.reference,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      const { data: subscription, error: subError } = await supabase
        .from('pro_subscriptions')
        .upsert({
          user_id: user.id,
          user_email: body.userEmail,
          subscription_type: body.subscriptionType,
          amount_paid: body.amount || vpsResult.amount,
          currency: body.currency || 'IDR',
          status: 'pending',
          tripay_reference: vpsResult.reference,
          ip_address: req.headers.get('x-forwarded-for') || 'unknown',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'tripay_reference'
        })
        .select()
        .single()

      if (subError) {
        console.log('❌ Subscription creation error:', subError)
        throw new Error(`Subscription creation failed: ${subError.message}`)
      }

      console.log('✅ Created/updated subscription ID:', subscription.id)

      // Create payment transaction record
      console.log('💾 Creating payment record:', {
        subscription_id: subscription.id,
        user_id: user.id,
        tripay_reference: vpsResult.reference,
        tripay_merchant_ref: vpsResult.merchant_ref || `EVG_${Date.now()}_${body.subscriptionType}`,
        payment_method: body.paymentMethod,
        amount: body.amount || vpsResult.amount,
        currency: body.currency || 'IDR',
        status: 'pending',
        payment_url: vpsResult.checkout_url,
        payment_instructions: JSON.stringify(vpsResult.instructions || []),
        expires_at: vpsResult.expired_time,
        bank_account: vpsResult.pay_code,
        unique_code: vpsResult.qr_string || vpsResult.pay_code,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      const { data: payment, error: payError } = await supabase
        .from('payment_transactions')
        .insert({
          subscription_id: subscription.id,
          user_id: user.id,
          tripay_reference: vpsResult.reference,
          tripay_merchant_ref: vpsResult.merchant_ref || `EVG_${Date.now()}_${body.subscriptionType}`,
          payment_method: body.paymentMethod,
          amount: body.amount || vpsResult.amount,
          currency: body.currency || 'IDR',
          status: 'pending',
          payment_url: vpsResult.checkout_url,
          payment_instructions: JSON.stringify(vpsResult.instructions || []),
          expires_at: vpsResult.expired_time,
          bank_account: vpsResult.pay_code,
          unique_code: vpsResult.qr_string || vpsResult.pay_code,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (payError) {
        console.log('❌ Payment record creation error:', payError)
        throw new Error(`Payment record creation failed: ${payError.message}`)
      }

      console.log('✅ Payment creation complete')
      
      // Return successful response with checkout URL
      return new Response(JSON.stringify({
        success: true,
        checkoutUrl: vpsResult.checkout_url,
        tripay_reference: vpsResult.reference,
        amount: body.amount || vpsResult.amount,
        payment_method: body.paymentMethod,
        expires_at: vpsResult.expired_time
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      })

    } catch (dbError) {
      console.log('❌ Database operations failed:', dbError.message)
      console.log('⚠️ Continuing with payment creation despite database error...')
      
      // Return VPS response even if database fails
      return new Response(JSON.stringify({
        success: true,
        checkoutUrl: vpsResult.checkout_url,
        tripay_reference: vpsResult.reference,
        warning: 'Database storage failed but payment created'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      })
    }

  } catch (error) {
    console.error('💥 Edge Function error:', error.message)
    console.error('💥 Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})