import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  console.log('🔒 SECURE Payment Creation Function Started')

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only accept POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify user authentication
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user?.id) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ User authenticated:', user.id)

    // Parse and validate request
    const body = await req.json()
    const {
      subscriptionType,
      paymentMethod,
      userName,
      userEmail,
      phoneNumber
    } = body

    // Strict validation - ALL fields required
    if (!subscriptionType || !paymentMethod || !userName?.trim() || !userEmail?.trim() || !phoneNumber?.trim()) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'All fields required: subscriptionType, paymentMethod, userName, userEmail, phoneNumber' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate phone number format
    if (!/^08[0-9]{8,11}$/.test(phoneNumber)) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid phone format. Use: 08xxxxxxxxxx' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already has active Pro subscription
    const { data: existingPro } = await supabase.rpc('check_secure_pro_status', {
      p_user_id: user.id
    })

    if (existingPro && existingPro.length > 0 && existingPro[0].is_pro) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'User already has active Pro subscription' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔒 Security checks passed, creating payment...')

    // Get amount for subscription type
    const amounts = {
      '1_day': 4000,
      '1_week': 30000,
      '1_month': 100000,
      '1_year': 800000
    }
    
    const amount = amounts[subscriptionType as keyof typeof amounts]
    if (!amount) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid subscription type' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate unique Tripay reference
    const tripayReference = `SECURE_${Date.now()}_${subscriptionType}_${user.id.substring(0, 8)}`

    console.log('📝 Creating secure payment transaction...')

    // Create secure payment transaction
    const { data: paymentResult, error: paymentError } = await supabase.rpc('create_secure_payment_transaction', {
      p_user_id: user.id,
      p_subscription_type: subscriptionType,
      p_payment_method: paymentMethod,
      p_user_phone: phoneNumber,
      p_user_full_name: userName,
      p_user_email: userEmail,
      p_amount: amount,
      p_tripay_reference: tripayReference
    })

    if (paymentError || !paymentResult?.success) {
      console.error('❌ Payment transaction creation failed:', paymentError || paymentResult?.error)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: paymentResult?.error || 'Failed to create payment transaction' 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('✅ Payment transaction created:', paymentResult.transaction_id)

    // Forward to VPS for Tripay API call
    const vpsUrl = "https://payment.elvisiongroup.com/create-payment"
    const vpsPayload = {
      subscriptionType,
      paymentMethod,
      userName,
      userEmail,
      phoneNumber
    }
    
    console.log('🌐 Forwarding to VPS for Tripay API...')
    const vpsResponse = await fetch(vpsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(vpsPayload)
    })

    if (!vpsResponse.ok) {
      console.error('❌ VPS call failed:', vpsResponse.status)
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Payment provider unavailable' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const vpsData = await vpsResponse.json()
    
    console.log('✅ SECURE Payment creation completed')
    console.log('📋 VPS Response success:', vpsData.success)

    return new Response(JSON.stringify({
      success: vpsData.success,
      data: vpsData,
      tripay_reference: tripayReference,
      transaction_id: paymentResult.transaction_id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('💥 Secure payment creation error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})