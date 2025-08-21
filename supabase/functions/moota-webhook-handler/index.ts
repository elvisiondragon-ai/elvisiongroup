import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const webhookData = await req.json();
    console.log('Received Moota webhook:', webhookData);

    // Extract payment information from webhook
    const { 
      amount, 
      description, 
      mutation_id,
      account_number,
      date,
      type
    } = webhookData;

    // Only process credit transactions (incoming payments)
    if (type !== 'CR') {
      console.log('Ignoring non-credit transaction');
      return new Response(JSON.stringify({ success: true, message: 'Ignored non-credit transaction' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract virtual account or reference from description
    const referenceMatch = description?.match(/MOOTA-[A-Za-z0-9-]+/) || 
                          description?.match(/88808\d{8}/);
    
    if (!referenceMatch) {
      console.log('No reference found in description:', description);
      return new Response(JSON.stringify({ success: true, message: 'No reference found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const reference = referenceMatch[0];
    console.log('Processing payment for reference:', reference);

    // Find the transaction by merchant reference or virtual account
    const { data: transaction, error: transError } = await supabaseClient
      .from('payment_transactions')
      .select('*')
      .or(`tripay_merchant_ref.eq.${reference},tripay_reference.eq.${reference}`)
      .eq('status', 'pending')
      .single();

    if (transError || !transaction) {
      console.error('Transaction not found:', reference, transError);
      return new Response(JSON.stringify({ success: false, error: 'Transaction not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify amount matches (with some tolerance for bank fees)
    const expectedAmount = Number(transaction.amount);
    const receivedAmount = Number(amount);
    const amountDifference = Math.abs(expectedAmount - receivedAmount);
    
    if (amountDifference > 1000) { // Allow 1000 IDR difference for fees
      console.error('Amount mismatch:', { expected: expectedAmount, received: receivedAmount });
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Amount mismatch: expected ${expectedAmount}, received ${receivedAmount}` 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update transaction status
    const { error: updateTransError } = await supabaseClient
      .from('payment_transactions')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        moota_mutation_id: mutation_id,
        moota_webhook_data: webhookData,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    if (updateTransError) {
      console.error('Failed to update transaction:', updateTransError);
      throw new Error('Failed to update transaction');
    }

    // Update VIP subscription
    const subscriptionEndDate = new Date();
    if (transaction.subscription_type === 'yearly') {
      subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
    } else {
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
    }

    const { error: updateSubError } = await supabaseClient
      .from('vip_subscriptions')
      .update({
        status: 'active',
        subscription_start_date: new Date().toISOString(),
        subscription_end_date: subscriptionEndDate.toISOString(),
        amount_paid: receivedAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.subscription_id);

    if (updateSubError) {
      console.error('Failed to update subscription:', updateSubError);
      throw new Error('Failed to update subscription');
    }

    // Sync pro status for the user after subscription is activated
    await supabaseClient.rpc('sync_pro_status_from_subscription', {
      p_user_id: transaction.user_id
    });

    console.log('Payment processed successfully:', {
      transactionId: transaction.id,
      subscriptionId: transaction.subscription_id,
      amount: receivedAmount,
      reference: reference
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment processed successfully',
      data: {
        transaction_id: transaction.id,
        subscription_id: transaction.subscription_id,
        amount: receivedAmount
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Moota webhook processing error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});