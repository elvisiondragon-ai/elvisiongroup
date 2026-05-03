import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

const WAPI_TOKEN = Deno.env.get('WAPI_TOKEN') || "rvpwk8dkih9m";
const WAPI_URL = Deno.env.get('WAPI_URL') || "https://api.elvisiongroup.com/api/send";
const WAPI_SESSION = Deno.env.get('WAPI_SESSION') || "renata";

serve(async (req) => {
  console.log("🚀 RO33-NOTIFICATION Triggered");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();
    console.log("Raw body:", bodyText);
    
    if (!bodyText) {
      return new Response(JSON.stringify({ error: "Empty request body" }), { 
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const payload = JSON.parse(bodyText);
    console.log("📥 Received Webhook Payload:", JSON.stringify(payload, null, 2));

    const newMember = payload.record;
    
    if (!newMember || !newMember.whatsapp) {
      return new Response(JSON.stringify({ error: "No valid record or whatsapp found" }), { 
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const { nama, whatsapp, email, status, company, bidang_usaha, domisili, tujuan_meetup, skala_bisnis } = newMember;

    let cleanPhone = whatsapp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('8')) {
      cleanPhone = '62' + cleanPhone;
    }

    // 1. Pesan ke Member
    const memberMessage = `Halo ${nama}, salam kenal.\n\nSaya El Reyzandra.\n\nTerima kasih telah mendaftarkan diri di *Ro33 (Organization of Result Orientation 33)*.\n\nInformasi Anda telah saya terima:\nNama: ${nama}\nStatus: ${status}\nCompany: ${company}\nDomisili: ${domisili}\n\nRo33 adalah ruang bagi founder untuk menjernihkan pikiran dan berbagi energi. Jika profil Anda cocok dengan visi lingkaran kecil ini, saya atau tim akan segera menghubungi Anda kembali untuk mengatur jadwal pertemuan (meet-up) di Jakarta Barat.\n\nSampai jumpa.\n\nSalam,\nEl Reyzandra\neL Vision Group`;

    const waResponse = await fetch(WAPI_URL, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          session: WAPI_SESSION,
          token: WAPI_TOKEN,
          to: cleanPhone,
          message: memberMessage
      })
    });

    if (waResponse.ok) {
      console.log(`✅ WhatsApp sent successfully to member: ${cleanPhone}`);
    } else {
      console.error(`⚠️ WhatsApp API returned status ${waResponse.status} for member: ${cleanPhone}`);
    }

    // 2. Pesan ke Admin
    const adminPhones = ['6281383838013', '6285664733499'];
    const adminMessage = `🔔 *RO33 MEMBER BARU*\n\nAda pendaftar baru untuk Organization of Result Orientation 33:\n\n*Nama:* ${nama}\n*Status:* ${status}\n*Company:* ${company}\n*Bidang:* ${bidang_usaha}\n*Skala Bisnis:* ${skala_bisnis || '-'}\n*Domisili:* ${domisili}\n*WA:* ${whatsapp}\n*Email:* ${email}\n\n*Tujuan:* ${tujuan_meetup}\n\nMohon direview apakah cocok untuk diundang meet-up.`;

    for (const adminPhone of adminPhones) {
      try {
        const cleanAdminPhone = adminPhone.replace(/\D/g, '');
        const waResponseAdmin = await fetch(WAPI_URL, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              session: WAPI_SESSION,
              token: WAPI_TOKEN,
              to: cleanAdminPhone,
              message: adminMessage
          })
        });
        if (waResponseAdmin.ok) console.log(`✅ WhatsApp sent to admin: ${adminPhone}`);
      } catch (waError) {
        console.error(`❌ Error sending WhatsApp to admin ${adminPhone}:`, waError);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
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
