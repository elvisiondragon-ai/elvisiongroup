// supabase/functions/refresh-ig-token/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async () => {
    // Fetch all clients with tokens
    const { data: clients, error } = await supabase
        .from("autochat_clients")
        .select("id, user_id, meta_access_token, ig_token_expires_at")
        .not("meta_access_token", "is", null);

    if (error) {
        console.error("DB Error:", error.message);
        return new Response(JSON.stringify({ error: "DB Error", message: error.message }), { status: 500 });
    }

    const results = [];

    for (const client of clients ?? []) {
        try {
            const token = client.meta_access_token;
            const expiresAt = client.ig_token_expires_at
                ? new Date(client.ig_token_expires_at * 1000)
                : null;

            // Refresh if expires in 30 days or no expiry data exists
            const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            const shouldRefresh = !expiresAt || expiresAt < thirtyDaysFromNow;

            if (!shouldRefresh) {
                results.push({ id: client.id, status: "skipped - still valid" });
                continue;
            }

            console.log(`Refreshing token for client ${client.id}...`);
            const res = await fetch(
                `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`
            );
            const data = await res.json();

            if (data.error) {
                console.error(`❌ Client ${client.id}:`, data.error.message);
                results.push({ id: client.id, status: "failed", error: data.error.message });
                continue;
            }

            // Update new token to DB
            const { error: updateErr } = await supabase
                .from("autochat_clients")
                .update({
                    meta_access_token: data.access_token,
                    ig_token_expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
                    ig_token_refreshed_at: new Date().toISOString(),
                })
                .eq("id", client.id);

            if (updateErr) throw updateErr;

            results.push({
                id: client.id,
                status: "refreshed ✅",
                expires_in_days: Math.floor(data.expires_in / 86400)
            });
            console.log(`✅ Refreshed token for client ${client.id}`);

        } catch (err: any) {
            console.error(`Error processing client ${client.id}:`, err.message);
            results.push({ id: client.id, status: "error", error: err.message });
        }
    }

    return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
    });
});
