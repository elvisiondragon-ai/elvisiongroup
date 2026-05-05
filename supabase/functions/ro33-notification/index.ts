import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const WAPI_TOKEN = Deno.env.get('WAPI_TOKEN') || "rvpwk8dkih9m";
const WAPI_URL = Deno.env.get('WAPI_URL') || "https://api.elvisiongroup.com/api/send";
const WAPI_SESSION = Deno.env.get('WAPI_SESSION') || "renata";

const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY');
const RO33_LIST_ID = '89219';

const ADMIN_PHONES = ['62895325633487', '6281383838013', '6285664733499'];

async function sendWA(to: string, message: string) {
  const cleanPhone = to.replace(/\D/g, '');
  await fetch(WAPI_URL, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session: WAPI_SESSION, token: WAPI_TOKEN, to: cleanPhone, message })
  });
}

serve(async (req) => {
  console.log("🚀 RO33-NOTIFICATION Triggered");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();
    if (!bodyText) {
      return new Response(JSON.stringify({ error: "Empty request body" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const payload = JSON.parse(bodyText);
    const record = payload.record;

    if (!record) {
      return new Response(JSON.stringify({ error: "No record in payload" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // ─── SURVEY SUBMISSION (ro33_surveys) ───────────────────────────────────
    if (record.pain_point !== undefined) {
      console.log("📋 Survey submission detected");

      const { nama, pain_point, kronologis, ekspektasi, kesiapan, meetup } = record;

      const surveyMessage =
        `📋 *RO33 SURVEY BARU*\n\n` +
        `*Nama:* ${nama || '-'}\n\n` +
        `*Pain Point Utama:*\n${pain_point || '-'}\n\n` +
        `*Kronologis:*\n${kronologis || '-'}\n\n` +
        `*Ekspektasi dari Ro33:*\n${ekspektasi || '-'}\n\n` +
        `*Kesiapan Berbagi:* ${kesiapan || '-'}\n\n` +
        `*Kesiapan Meet-up (Jakarta Barat):* ${meetup || '-'}`;

      for (const phone of ADMIN_PHONES) {
        try {
          await sendWA(phone, surveyMessage);
          console.log(`✅ Survey notif sent to admin: ${phone}`);
        } catch (e) {
          console.error(`❌ Failed to send survey notif to ${phone}:`, e);
        }
      }

      return new Response(JSON.stringify({ success: true, type: 'survey' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // ─── MEMBER REGISTRATION (ro33_members) ─────────────────────────────────
    if (!record.whatsapp) {
      return new Response(JSON.stringify({ error: "No valid record or whatsapp found" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { nama, whatsapp, email, status, company, bidang_usaha, domisili, tujuan_meetup, skala_bisnis } = record;

    let cleanPhone = whatsapp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
    else if (cleanPhone.startsWith('8')) cleanPhone = '62' + cleanPhone;

    // 1. Pesan ke Member
    const memberMessage =
      `Halo ${nama}, salam kenal.\n\nSaya El Reyzandra.\n\n` +
      `Terima kasih telah mendaftarkan diri di *Ro33 (Result Origin 33)*.\n\n` +
      `Informasi Anda telah saya terima:\nNama: ${nama}\nStatus: ${status}\nCompany: ${company}\nDomisili: ${domisili}\n\n` +
      `Ro33 adalah ruang bagi founder untuk menjernihkan pikiran dan berbagi energi. ` +
      `Jika profil Anda cocok dengan visi lingkaran kecil ini, saya atau tim akan segera menghubungi Anda untuk mengatur jadwal meet-up di Jakarta Barat.\n\n` +
      `Sampai jumpa.\n\nSalam,\nEl Reyzandra\neL Vision Group`;

    try {
      await sendWA(cleanPhone, memberMessage);
      console.log(`✅ WhatsApp sent to member: ${cleanPhone}`);
    } catch (e) {
      console.error(`❌ Failed to send WA to member:`, e);
    }

    // 2. Pesan ke Admin
    const adminMessage =
      `🔔 *RO33 MEMBER BARU*\n\n` +
      `*Nama:* ${nama}\n*Status:* ${status}\n*Company:* ${company}\n` +
      `*Bidang:* ${bidang_usaha}\n*Skala Bisnis:* ${skala_bisnis || '-'}\n` +
      `*Domisili:* ${domisili}\n*WA:* ${whatsapp}\n*Email:* ${email}\n\n` +
      `*Tujuan:* ${tujuan_meetup}\n\nMohon direview apakah cocok untuk diundang meet-up.`;

    for (const phone of ADMIN_PHONES) {
      try {
        await sendWA(phone, adminMessage);
        console.log(`✅ WhatsApp sent to admin: ${phone}`);
      } catch (e) {
        console.error(`❌ Failed to send WA to admin ${phone}:`, e);
      }
    }

    // 3. Add to Mailketing list (Ro33)
    if (email && MAILKETING_API_KEY) {
      try {
        const firstName = nama ? nama.split(' ')[0] : email.split('@')[0];
        const lastName = nama ? nama.split(' ').slice(1).join(' ') : '';
        const params = new URLSearchParams({
          api_token: MAILKETING_API_KEY,
          list_id: RO33_LIST_ID,
          email, first_name: firstName, last_name: lastName
        });
        await fetch(`${MAILKETING_API_URL}/addsubtolist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        });
        console.log(`✅ Added to Mailketing Ro33 list: ${email}`);
      } catch (mkError) {
        console.error('❌ Mailketing add failed:', mkError);
      }
    }

    // 4. Trigger Meta CAPI Lead (Server-Side)
    try {
      const eventIdLead = 'ld_' + new Date().getTime() + '_' + Math.floor(Math.random() * 1000);
      const capiPayload = {
        pixelId: '3723313531141818',
        eventName: 'Lead',
        eventId: eventIdLead,
        eventSourceUrl: record.page_url || "https://ro33.org/",
        secretName: 'CAPI_RO33',
        customData: { value: 1, currency: 'IDR' },
        userData: {
          em: email,
          ph: whatsapp,
          fn: nama ? nama.split(' ')[0] : null,
          ln: nama ? nama.split(' ').slice(1).join(' ') : null,
          client_user_agent: record.user_agent || null,
          client_ip_address: record.ip_address || null
        }
      };

      // Call capi-universal directly from this edge function
      await fetch('https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/capi-universal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiPayload)
      }).then(r => r.json()).then(res => {
        console.log('✅ CAPI Lead Sent via Server:', JSON.stringify(res));
      });
    } catch (capiError) {
      console.error('❌ Server-side CAPI Lead failed:', capiError);
    }

    return new Response(JSON.stringify({ success: true, type: 'member' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
