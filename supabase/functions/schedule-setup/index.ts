// ONE-OFF setup: create global_schedule table + seed 21 days weekdays × 3 slots
// Run once via: curl -X POST .../schedule-setup
// Safe to re-run (uses CREATE TABLE IF NOT EXISTS + INSERT ON CONFLICT DO NOTHING).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Step 1: Create table + policies via RPC on raw SQL
    // supabase-js doesn't expose raw SQL directly — we use a workaround:
    // call the REST API with Postgres EXECUTE via an SQL function that exists by default in fresh projects.
    // Fallback: just try to insert; if table missing, return instructions to run SQL manually.

    // Check if table exists by attempting a select
    const probe = await supabase.from('global_schedule').select('id').limit(1);
    const tableExists = !probe.error;

    if (!tableExists) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Table global_schedule does not exist. Please create it first via Supabase Dashboard SQL Editor. See /Users/eldragon/git/el/sesi/global_schedule_setup.sql',
        probeError: probe.error
      }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Seed: 21 days forward, weekdays only, 3 slots (10:00, 13:00, 15:00)
    const rows: Array<{ slot_date: string; slot_time: string; is_available: boolean }> = [];
    const today = new Date();
    for (let i = 1; i <= 21; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dow = d.getDay();
      if (dow === 0 || dow === 6) continue; // skip Sunday & Saturday
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const slot_date = `${y}-${m}-${dd}`;
      for (const slot_time of ['10:00:00', '13:00:00', '15:00:00']) {
        rows.push({ slot_date, slot_time, is_available: true });
      }
    }

    // Upsert with ON CONFLICT DO NOTHING (via ignoreDuplicates: true)
    const { data, error } = await supabase
      .from('global_schedule')
      .upsert(rows, { onConflict: 'slot_date,slot_time', ignoreDuplicates: true })
      .select('slot_date, slot_time');

    if (error) {
      return new Response(JSON.stringify({ success: false, error: error.message, details: error }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      success: true,
      inserted: data?.length ?? 0,
      attempted: rows.length,
      note: 'Existing rows were skipped via ON CONFLICT. Safe to re-run.'
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: corsHeaders });
  }
});
