// List available schedule slots from global_schedule
// Used by sesi/index.html step 6 and AI knowledge queries

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data, error } = await supabase
      .from('global_schedule')
      .select('slot_date, slot_time, is_available, booked_by_name')
      .gte('slot_date', new Date().toISOString().split('T')[0])
      .order('slot_date', { ascending: true })
      .order('slot_time', { ascending: true });

    if (error) throw error;

    const available = data.filter(r => r.is_available);
    const booked = data.filter(r => !r.is_available);

    return new Response(JSON.stringify({
      success: true,
      available,
      booked,
      total: data.length,
      timezone: 'Asia/Jakarta'
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (e: any) {
    console.error('schedule-list error:', e);
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: corsHeaders });
  }
});
