import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN")
const PHONE_NUMBER_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")
const RECIPIENT_NUMBER = Deno.env.get("ADMIN_PHONE_NUMBER") // Your number to receive alerts

serve(async (req) => {
  try {
    const { record } = await req.json()

    // Data from the pro_subscriptions table
    const email = record.user_email || 'Unknown'
    const amount = record.amount_paid || '0'
    const currency = record.currency || 'IDR'
    const type = record.subscription_type || 'pro'

    console.log(`Sending WhatsApp notification for: ${email}, ${amount} ${currency}`)

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: RECIPIENT_NUMBER,
          type: "template",
          template: {
            name: "payment_notification", // Ensure this matches your Meta Template Name
            language: { code: "en_US" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: email },    // Variable {{1}}
                  { type: "text", text: `${amount} ${currency}` }, // Variable {{2}}
                  { type: "text", text: type }      // Variable {{3}}
                ],
              },
            ],
          },
        }),
      }
    )

    const result = await response.json()
    console.log("WhatsApp API Response:", result)

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
      status: response.ok ? 200 : 400,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})
