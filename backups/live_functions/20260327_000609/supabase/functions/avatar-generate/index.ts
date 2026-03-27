import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { action, session_id, config } = await req.json();
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        if (action === 'start') {
            // 1. Create session (Simplified: NO BACKGROUND FLOW)
            const { data: session, error: sessionError } = await supabase
                .from('avatar-sessions')
                .insert({
                    config,
                    status: 'pending' // UI will wait for local bot to change this
                })
                .select()
                .single();

            if (sessionError) throw sessionError;

            console.log(`✅ Session created: ${session.id}. Ready for local bot.`);

            return new Response(JSON.stringify({ success: true, sessionId: session.id }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            });
        }

        if (action === 'find-best-angle') {
            // User requested NO API, so we disable this or make it a stub
            // Ideally the local bot should also handle the final refinement
            return new Response(JSON.stringify({
                success: true,
                message: "Refinement should be handled by the local bot for 'NO API' compliance."
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            });
        }

        return new Response(JSON.stringify({ error: 'Invalid action' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
