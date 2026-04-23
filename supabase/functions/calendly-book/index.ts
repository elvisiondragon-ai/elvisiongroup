// Calendly booking edge function
// Customer picks a date+time from sesi/index.html survey step 6.
// This function creates a Scheduling Link on-demand (One-Off event type),
// then returns the booking URL. Customer is redirected there — Calendly
// handles the invitee form + auto email to customer & Founder.
// After success: global_schedule row is marked booked (source of truth for AI).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const CALENDLY_API = 'https://api.calendly.com';

async function calendly(path: string, token: string, init: RequestInit = {}) {
  const res = await fetch(`${CALENDLY_API}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* non-json */ }
  if (!res.ok) {
    console.error(`Calendly ${path} failed ${res.status}. Raw body:`, text);
    const detail = json?.details ? JSON.stringify(json.details) : '';
    throw new Error(`Calendly ${path} ${res.status}: ${json?.message || json?.title || text} ${detail}`);
  }
  return json;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const token = Deno.env.get('CALENDLY_PAT');
    if (!token) {
      return new Response(JSON.stringify({ error: 'CALENDLY_PAT secret not configured' }), { status: 500, headers: corsHeaders });
    }

    const body = await req.json();
    const { name, email, phone, selectedDate, selectedTime, surveyAnswers } = body;

    if (!name || !email || !selectedDate || !selectedTime) {
      return new Response(JSON.stringify({ error: 'Missing required fields: name, email, selectedDate, selectedTime' }), { status: 400, headers: corsHeaders });
    }

    // 1. Get current user (founder's Calendly account)
    const me = await calendly('/users/me', token);
    const userUri = me.resource.uri;

    // 2. Parse date+time (WIB = UTC+7) into ISO UTC
    // selectedDate format: "YYYY-MM-DD", selectedTime format: "HH:mm"
    const [y, m, d] = selectedDate.split('-').map(Number);
    const [hh, mm] = selectedTime.split(':').map(Number);
    const startWIB = new Date(Date.UTC(y, m - 1, d, hh - 7, mm, 0));
    const endWIB = new Date(startWIB.getTime() + 60 * 60 * 1000);
    const startIso = startWIB.toISOString();
    const endIso = endWIB.toISOString();

    // 3. Create One-Off Event Type (specific time slot locked by Calendly)
    // Docs: https://developer.calendly.com/api-docs/create-one-off-event-type
    const eventType = await calendly('/one_off_event_types', token, {
      method: 'POST',
      body: JSON.stringify({
        name: `Sesi 1:1 · 60 Menit — ${name}`,
        host: userUri,
        co_hosts: [],
        duration: 60,
        timezone: 'Asia/Jakarta',
        date_setting: {
          type: 'date_range',
          start_date: selectedDate,
          end_date: selectedDate
        },
        location: {
          kind: 'google_conference'
        }
      })
    });

    const schedulingUrl = eventType.resource.scheduling_url;

    // 4. Prefill invitee data so customer just clicks confirm
    const prefillParams = new URLSearchParams({
      name,
      email,
      a1: phone || '',
      a2: surveyAnswers?.q1 || '',
      a3: surveyAnswers?.q2 || ''
    });
    const bookingUrl = `${schedulingUrl}?${prefillParams.toString()}`;

    // 5. Mark slot as booked in global_schedule (source of truth for AI)
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      const { error: updErr } = await supabase
        .from('global_schedule')
        .update({
          is_available: false,
          booked_by_name: name,
          booked_by_email: email,
          booked_by_phone: phone || null,
          calendly_event_uri: eventType.resource.uri,
          booking_url: bookingUrl,
          booked_at: new Date().toISOString()
        })
        .eq('slot_date', selectedDate)
        .eq('slot_time', selectedTime);
      if (updErr) console.error('global_schedule update failed:', updErr);
    } catch (dbErr) {
      console.error('global_schedule update exception:', dbErr);
    }

    // 6. Send WhatsApp notifications via wapivps (customer + admins)
    try {
      const WAPI_URL = Deno.env.get('WAPI_URL') || 'https://api.elvisiongroup.com/api/send';
      const WAPI_SESSION = Deno.env.get('WAPI_SESSION') || 'renata';
      const WAPI_TOKEN = Deno.env.get('WAPI_TOKEN') || 'rvpwk8dkih9m';
      const cleanPhone = (phone || '').replace(/\D/g, '');

      const customerMsg = `Halo kak ${name}! 👋\n\nBooking *Sesi 1:1 60 Menit* kakak dengan Founder eL Vision sudah kami terima.\n\n📅 *Tanggal:* ${selectedDate}\n⏰ *Jam:* ${selectedTime} WIB\n\nUntuk *konfirmasi final*, silakan klik link Calendly berikut agar jadwal terkunci di kalender Founder:\n👉 ${bookingUrl}\n\nKakak akan menerima email reminder dari Calendly mendekati sesi.\n\nJika ada pertanyaan, balas pesan ini ya kak.\n\nSalam hangat,\nAdmin - eL Vision`;

      const adminMsg = `📅 *BOOKING SESI BARU*\n\nNama: ${name}\nEmail: ${email}\nWA: ${cleanPhone || 'N/A'}\n\n🗓 Tanggal: ${selectedDate}\n⏰ Jam: ${selectedTime} WIB\n\nCalendly Link:\n${bookingUrl}${surveyAnswers?.q1 ? `\n\nMasalah: ${surveyAnswers.q1}` : ''}${surveyAnswers?.q2 ? `\nDetail: ${surveyAnswers.q2}` : ''}`;

      const sendWA = async (to: string, message: string, label: string) => {
        try {
          const res = await fetch(WAPI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session: WAPI_SESSION, token: WAPI_TOKEN, to, message })
          });
          const body = await res.text();
          if (!res.ok) { console.error(`❌ WA FAIL ${label} (${to}) http=${res.status} body=${body}`); return; }
          if (body.includes('"success":false')) { console.error(`❌ WA REJECTED ${label} (${to}) body=${body}`); return; }
          console.log(`✅ WA sent to ${label}: ${to}`);
        } catch (e) { console.error(`❌ WA ERROR ${label} (${to}):`, e); }
      };

      if (cleanPhone) await sendWA(cleanPhone, customerMsg, 'customer');
      for (const adminPhone of ['6281383838013', '6285664733499']) {
        await sendWA(adminPhone, adminMsg, 'admin');
      }
    } catch (waErr) {
      console.error('WA notification block exception:', waErr);
    }

    return new Response(JSON.stringify({
      success: true,
      bookingUrl,
      eventTypeUri: eventType.resource.uri,
      requestedSlot: { date: selectedDate, time: selectedTime, startIso, endIso }
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (e: any) {
    console.error('calendly-book error:', e);
    return new Response(JSON.stringify({ error: e?.message || String(e) }), { status: 500, headers: corsHeaders });
  }
});
