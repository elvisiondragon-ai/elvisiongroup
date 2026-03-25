import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || "";
const META_VERIFY_TOKEN = Deno.env.get('WA_VERIFY_TOKEN') || "ctwa_track_verify";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  const url = new URL(req.url);

  // 1. Handle Webhook Verification (GET) - Required by Meta
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === META_VERIFY_TOKEN) {
      console.log("✅ Meta Webhook Verified!");
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // 2. Handle Incoming Notifications (POST)
  if (req.method === "POST") {
    try {
      const body = await req.json();
      console.log("📥 Incoming Webhook Payload:", JSON.stringify(body, null, 2));

      // Meta Cloud API structure: entry[] -> changes[] -> value -> messages[]
      if (body.entry) {
        for (const entry of body.entry) {
          if (!entry.changes) continue;
          for (const change of entry.changes) {
            const value = change.value;
            if (!value || !value.messages) continue;
            
            for (const message of value.messages) {
              const from = message.from; // User's phone number
              const referral = message.referral; // Referral object containing CTWA Click ID

              if (referral && referral.ctwa_clid) {
                const ctwa_clid = referral.ctwa_clid;
                const ad_id = referral.source_id;
                console.log(`🎯 CTWA Detected! Phone: ${from}, ID: ${ctwa_clid}, AdID: ${ad_id}`);

                // Insert/Update attribution in global_ctwa
                const { error } = await supabase
                  .from('global_ctwa')
                  .upsert({ 
                    phone: from, 
                    ctwa_clid: ctwa_clid,
                    ad_id: ad_id
                  }, { 
                    onConflict: 'phone' 
                  });

                if (error) {
                  console.error("❌ DB Error:", error.message);
                } else {
                  console.log(`✅ CTWA Link Saved: ${from} -> ${ctwa_clid}`);
                }
              } else {
                console.log(`📩 Regular message from ${from} (No referral object)`);
              }
            }
          }
        }
      }

      return new Response("EVENT_RECEIVED", { status: 200 });
    } catch (err: any) {
      console.error("🔥 Webhook Fail:", err.message);
      return new Response("Error", { status: 500 });
    }
  }

  return new Response("Method Not Allowed", { status: 405 });
});
