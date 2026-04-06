import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

// WhatsApp API Configuration (WAPI) via Renata
const WAPI_TOKEN = Deno.env.get('WAPI_TOKEN') || "rvpwk8dkih9m";
const WAPI_URL = Deno.env.get('WAPI_URL') || "https://api.elvisiongroup.com/api/send";
const WAPI_SESSION = Deno.env.get('WAPI_SESSION') || "renata";

// Send WhatsApp message via ELVision WAPI
async function sendWhatsApp(phone: string, message: string) {
    try {
        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.slice(1);
        } else if (cleanPhone.startsWith('8')) {
            cleanPhone = '62' + cleanPhone;
        }

        console.log(`🚀 [WATZAPP] Sending message to ${cleanPhone}...`);
        
        const response = await fetch(WAPI_URL, {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                session: WAPI_SESSION,
                token: WAPI_TOKEN,
                to: cleanPhone, 
                message: message 
            })
        });
        
        if (response.ok) {
            console.log(`✅ WhatsApp sent to ${cleanPhone}`);
            return true;
        } else {
            console.error(`⚠️ Failed to send WA (WAPI) to ${cleanPhone}`, await response.text());
            return false;
        }
    } catch (error) {
        console.error('❌ WhatsApp Error:', error);
        return false;
    }
}

const handler = async (req: Request) => {
    console.log('🚀 SEND-INDORELAX-NOTIF Edge Function Started');

    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        const { 
            type, 
            doctor_phone, doctor_name, 
            client_phone, client_name, 
            schedule_date, schedule_time, issue 
        } = body;

        let docSent = false;
        let clientSent = false;

        // NEW_BOOKING EVENT
        if (type === 'NEW_BOOKING') {
            // 1. Send WA to Doctor
            if (doctor_phone) {
                const docMsg = `Halo ${doctor_name} 🩺,\n\nAnda memiliki pesanan jadwal konsultasi baru di *IndoRelax*!\n\n*Pasien:* ${client_name}\n*Keluhan:* ${issue || 'Kecemasan / Depresi'}\n*Jadwal Praktik:* ${schedule_date} | ${schedule_time}\n\nMohon pastikan Anda standby di Dashboard Dr. Portal Anda pada jam tersebut ya. Semangat melayani! 🌿\n\n- Renata (IndoRelax Assist)`;
                docSent = await sendWhatsApp(doctor_phone, docMsg);
            }

            // 2. Send WA to Client
            if (client_phone) {
                const clientMsg = `Halo Kak ${client_name} 👋,\n\nBooking sesi konsultasi psikiatri Anda telah berhasil dikonfirmasi!\n\n*Psikiater:* ${doctor_name}\n*Waktu:* ${schedule_date} pada ${schedule_time}\n\nSilakan bersiap dan masuk ke *Portal IndoRelax* pada jam tersebut. Link: https://indorelax.pages.dev/\n\nSemoga lekas merasa lebih baik! 💚\n\n- Renata (IndoRelax Assist)`;
                clientSent = await sendWhatsApp(client_phone, clientMsg);
            }
        } else if (type === 'SESSION_DONE') {
            // After Consultation
            if (client_phone) {
                const finishMsg = `Halo Kak ${client_name},\n\nSesi konsultasi dengan ${doctor_name} telah selesai. Dokter telah menerbitkan **Resep Digital** untuk Anda.\n\nSilakan tebus resep Anda di Dashboard IndoRelax ya kak, agar obat segera dikirim hari ini juga! 🚀\n\nLink: https://indorelax.pages.dev/`;
                clientSent = await sendWhatsApp(client_phone, finishMsg);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Notifications processed',
            doc_sent: docSent,
            client_sent: clientSent
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });

    } catch (error: any) {
        console.error("❌ Error in send-indorelax-notif:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders }
        });
    }
};

serve(handler);
