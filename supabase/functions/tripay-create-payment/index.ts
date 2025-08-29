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
    
    console.log('🔍 Raw auth header:', authHeader)
    const token = authHeader.replace('Bearer ', '')
    console.log('🔍 Extracted token (first 20 chars):', token.substring(0, 20) + '...')

    // Create client with anon key to verify user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user || !user.id) {
      console.log('❌ Authentication failed or user.id is null:', authError?.message)
      console.log('❌ User object:', JSON.stringify(user))
      return new Response(
        JSON.stringify({ error: 'Authentication failed - user ID is null' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Found user from auth token:', user.id)
    console.log('🔍 User object:', JSON.stringify(user))

    // Parse request body
    console.log('📥 Parsing request body...')
    const body = await req.json()
    console.log('✅ Received body:', JSON.stringify(body))
    console.log('🔍 Body userEmail:', body.userEmail)
    console.log('🔍 User email from auth:', user.email)

    // VPS URL
    const vpsUrl = "https://payment.elvisiongroup.com/create-payment"
    
    // Map to VPS expected format (serverjs.txt line 104)
    const vpsPayload = {
      subscriptionType: body.subscriptionType,
      paymentMethod: body.paymentMethod,
      userName: body.userName || body.fullName || user.email?.split('@')[0] || 'Anonymous',
      userEmail: body.userEmail || user.email,
      phoneNumber: body.phoneNumber || '08123456789'
    }
    
    // Forward to VPS directly
    console.log('🌐 Sending to VPS...')
    const vpsResponse = await fetch(vpsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(vpsPayload)
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
      console.log('🕒 expiredTime value:', vpsResult.expiredTime, 'type:', typeof vpsResult.expiredTime)
      console.log('💳 payCode value:', vpsResult.payCode)
      console.log('📱 qrUrl value:', vpsResult.qrUrl)
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
    console.log('🔍 vpsResult.expired_time value:', vpsResult.expired_time, 'type:', typeof vpsResult.expired_time);
    
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
      
      console.log('🔍 DEBUG VALUES:')
      console.log('  - user.id:', user.id)
      console.log('  - body.userEmail:', body.userEmail)
      console.log('  - user.email:', user.email)

      const { data: subscription, error: subError } = await supabase
        .from('pro_subscriptions')
        .insert({
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
          user_email: body.userEmail,
          tripay_reference: vpsResult.tripay_reference || vpsResult.reference,
          tripay_merchant_ref: vpsResult.merchantRef,
          payment_method: body.paymentMethod,
          amount: body.amount || vpsResult.amount,
          currency: body.currency || 'IDR',
          status: 'pending',
          payment_url: vpsResult.checkoutUrl,
          payment_instructions: JSON.stringify(vpsResult.instructions || []),
          expires_at: vpsResult.expiredTime ? new Date(vpsResult.expiredTime * 1000).toISOString() : null,
          bank_account: vpsResult.payCode,
          unique_code: vpsResult.qrString || vpsResult.payCode,
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
      
      // Return successful response mapping VPS fields correctly (serverjs.txt lines 199-214)
      return new Response(JSON.stringify({
        success: vpsResult.success,
        paymentType: vpsResult.paymentType,
        checkoutUrl: vpsResult.checkoutUrl,
        payCode: vpsResult.payCode,
        tripay_reference: vpsResult.tripay_reference,
        reference: vpsResult.reference,
        merchantRef: vpsResult.merchantRef,
        amount: vpsResult.amount,
        expiredTime: vpsResult.expiredTime,
        paymentMethod: vpsResult.paymentMethod,
        instructions: vpsResult.instructions,
        qrString: vpsResult.qrString,
        qrUrl: vpsResult.qrUrl,
        status: vpsResult.status
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
        success: vpsResult.success,
        paymentType: vpsResult.paymentType,
        checkoutUrl: vpsResult.checkoutUrl,
        payCode: vpsResult.payCode,
        tripay_reference: vpsResult.tripay_reference,
        reference: vpsResult.reference,
        merchantRef: vpsResult.merchantRef,
        amount: vpsResult.amount,
        expiredTime: vpsResult.expiredTime,
        paymentMethod: vpsResult.paymentMethod,
        instructions: vpsResult.instructions,
        qrString: vpsResult.qrString,
        qrUrl: vpsResult.qrUrl,
        status: vpsResult.status,
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