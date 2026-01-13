import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { message_id, sender_id, sender_name, message } = await req.json()
    
    console.log('Processing chat notification:', { message_id, sender_id, sender_name })

    // Get all users except the sender who have notifications enabled
    const { data: usersWithTokens, error: usersError } = await supabase
      .from('device_tokens')
      .select(`
        user_id,
        token,
        platform,
        notification_settings!inner(chat_notifications_enabled)
      `)
      .neq('user_id', sender_id)
      .eq('notification_settings.chat_notifications_enabled', true)

    if (usersError) {
      console.error('Error fetching users with tokens:', usersError)
      throw usersError
    }

    console.log('Found users with tokens:', usersWithTokens?.length)

    if (!usersWithTokens || usersWithTokens.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No users to notify' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For now, we'll log the notifications that would be sent
    // In a real implementation, you would integrate with FCM/APNs here
    const notifications = usersWithTokens.map(user => ({
      token: user.token,
      platform: user.platform,
      title: 'Pesan Baru di Komunitas',
      body: `${sender_name}: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`,
      data: {
        type: 'chat_message',
        message_id,
        sender_id,
        sender_name
      }
    }))

    console.log('Notifications to send:', notifications.length)
    
    // Here you would actually send the notifications using FCM/APNs
    // For this demo, we'll just log them
    notifications.forEach(notification => {
      console.log(`Would send to ${notification.platform} device:`, {
        token: notification.token.substring(0, 20) + '...',
        title: notification.title,
        body: notification.body
      })
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        notifications_sent: notifications.length,
        message: 'Notifications processed successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in send-chat-notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})