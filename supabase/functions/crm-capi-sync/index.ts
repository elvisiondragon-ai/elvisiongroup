import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CAPI_TOKEN = Deno.env.get('VIP_30JT') || Deno.env.get('METACAPI') || "";

serve(async (req) => {
    try {
        const payload = await req.json();
        
        // Ensure this is an UPDATE event from Supabase Webhooks
        if (payload.type !== "UPDATE") {
            return new Response("Not an UPDATE event", { status: 200 });
        }

        const oldRecord = payload.old_record || {};
        const newRecord = payload.record || {};

        // Only trigger if the status actually changed
        if (oldRecord.status === newRecord.status) {
            return new Response("Status unchanged", { status: 200 });
        }

        const newStatus = newRecord.status; // Intake, Qualified, Converted, Lost, Not Qualified
        const leadId = newRecord.meta_lead_id;
        const pixelId = newRecord.pixel_id || '1275074677473419'; // Default to VIP pixel

        if (!leadId) {
            console.log("No meta_lead_id found, skipping CAPI sync.");
            return new Response("No meta_lead_id", { status: 200 });
        }

        console.log(`🚀 Status changed from ${oldRecord.status} to ${newStatus} for Lead ID: ${leadId}`);

        // Map CRM status to Meta Standard/Custom Events
        let eventName = newStatus;
        if (newStatus === "Intake") eventName = "Lead";
        if (newStatus === "Converted") eventName = "Purchase";
        
        // Prepare CAPI payload
        // Note: For CRM events, action_source is usually 'system_generated'
        const capiPayload = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: "system_generated",
                    user_data: {
                        lead_id: leadId
                    }
                }
            ]
        };

        const capiUrl = `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${CAPI_TOKEN}`;
        
        console.log(`📡 Sending CAPI Event: ${eventName}`);
        const capiRes = await fetch(capiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(capiPayload)
        });

        const capiResult = await capiRes.json();
        if (!capiRes.ok) {
            console.error("❌ CAPI Error:", capiResult);
        } else {
            console.log("✅ CAPI Success:", capiResult);
        }

        return new Response(JSON.stringify({ success: true, event: eventName }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (e: any) {
        console.error("❌ Webhook processing error:", e.message);
        return new Response("Error", { status: 500 });
    }
});
