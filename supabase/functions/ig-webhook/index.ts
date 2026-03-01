import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const VERIFY_TOKEN = Deno.env.get('IG_WEBHOOK_VERIFY_TOKEN') || 'tokentestig123!@#';
const IG_ACCESS_TOKEN = Deno.env.get('IG_ACCESS_TOKEN');

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const IG_USER_ID = '17841400529912607';

serve(async (req) => {
    const url = new URL(req.url);

    // ====== 1. Webhook Verification (GET) ======
    if (req.method === 'GET') {
        const mode = url.searchParams.get('hub.mode');
        const token = url.searchParams.get('hub.verify_token');
        const challenge = url.searchParams.get('hub.challenge');
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            return new Response(challenge, { status: 200 });
        }
        return new Response('Forbidden', { status: 403 });
    }

    // ====== 2. Receiving Events (POST) ======
    if (req.method === 'POST') {
        try {
            const body = await req.json();
            console.log('📩 Webhook received');

            if (body.object === 'instagram') {
                for (const entry of body.entry) {
                    if (entry.changes) {
                        for (const change of entry.changes) {
                            if (change.field === 'comments') {
                                const commentText = (change.value.text || '').toLowerCase().trim();
                                const fromUserId = change.value.from?.id;
                                const commentId = change.value.id;

                                if (fromUserId === IG_USER_ID) {
                                    console.log('⏭️ Skipping own comment');
                                    continue;
                                }

                                console.log(`💬 IG Comment: "${commentText}" from ${fromUserId}`);

                                // Fetch triggers
                                const { data: triggers, error } = await supabase
                                    .from('ig_triggers')
                                    .select('*')
                                    .eq('is_active', true);

                                if (error || !triggers || triggers.length === 0) {
                                    console.log('⚠️ No triggers in DB');
                                    continue;
                                }

                                const matchedTrigger = triggers.find(t =>
                                    commentText.includes(t.keyword.toLowerCase())
                                );

                                if (matchedTrigger) {
                                    console.log(`✅ Match: "${matchedTrigger.keyword}" → Sending IG DM...`);
                                    await sendDMviaComment(commentId, fromUserId, matchedTrigger);
                                } else {
                                    console.log(`⏭️ No trigger matched`);
                                }
                            }
                        }
                    }
                }
            } else if (body.object === 'page') {
                for (const entry of body.entry) {
                    if (entry.changes) {
                        for (const change of entry.changes) {
                            if (change.field === 'feed' && change.value.item === 'comment') {
                                // Skip if the comment is from the page itself
                                // Unlike IG, FB comments have from.id and we'll just check if it's not empty
                                // Ideally we'd skip our own Page ID, but let's at least process it first
                                const commentText = (change.value.message || '').toLowerCase().trim();
                                const fromUserId = change.value.from?.id;
                                const commentId = change.value.comment_id;
                                const pageId = entry.id;

                                console.log(`💬 FB Page Comment: "${commentText}" from ${fromUserId} on Page ${pageId}`);

                                // Fetch triggers
                                const { data: triggers, error } = await supabase
                                    .from('ig_triggers')
                                    .select('*')
                                    .eq('is_active', true);

                                if (error || !triggers || triggers.length === 0) {
                                    console.log('⚠️ No triggers in DB');
                                    continue;
                                }

                                const matchedTrigger = triggers.find(t =>
                                    commentText.includes(t.keyword.toLowerCase())
                                );

                                if (matchedTrigger) {
                                    console.log(`✅ Match: "${matchedTrigger.keyword}" → Sending FB Private Reply...`);
                                    await sendFBPrivateReply(commentId, fromUserId, matchedTrigger, pageId);
                                } else {
                                    console.log(`⏭️ No trigger matched`);
                                }
                            }
                        }
                    }
                }
            }

            return new Response('EVENT_RECEIVED', { status: 200 });
        } catch (error) {
            console.error('❌ Webhook error:', error);
            return new Response('EVENT_RECEIVED', { status: 200 });
        }
    }

    return new Response('OK', { status: 200 });
});

// ====== Send DM with Button Template ======
async function sendDMviaComment(commentId: string, userId: string, trigger: any) {
    if (!IG_ACCESS_TOKEN) {
        console.error('❌ Missing IG_ACCESS_TOKEN!');
        return;
    }

    const apiUrl = `https://graph.instagram.com/v21.0/${IG_USER_ID}/messages`;

    // Jika ada button_url dan button_text → kirim sebagai Generic Template dengan tombol
    // Jika tidak ada → kirim sebagai teks biasa
    let messagePayload: any;
    const buttons = [];

    if (trigger.button_url && trigger.button_text) {
        buttons.push({
            type: "web_url",
            url: trigger.button_url,
            title: trigger.button_text
        });
    }

    if (trigger.button_url_2 && trigger.button_text_2) {
        buttons.push({
            type: "web_url",
            url: trigger.button_url_2,
            title: trigger.button_text_2
        });
    }

    if (buttons.length > 0) {
        // Template Message dengan tombol klik
        messagePayload = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: trigger.reply_message,
                            buttons: buttons
                        }
                    ]
                }
            }
        };
        console.log(`📤 Sending BUTTON template DM with ${buttons.length} button(s)`);
    } else {
        // Plain text fallback
        messagePayload = { text: trigger.reply_message };
        console.log('📤 Sending TEXT DM');
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${IG_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipient: { comment_id: commentId },
                message: messagePayload
            })
        });

        const result = await response.json();
        console.log('📨 Meta API Response:', JSON.stringify(result));

        // 2. JIKA DM BERHASIL, KITA REPLY KOMENTARNYA
        if (response.ok) {
            console.log(`✅ DM SENT to ${userId}! 🎉`);
        } else {
            console.error(`❌ DM FAILED:`, result.error);
        }

        // Tetap reply komentar meskipun DM diblokir oleh Meta (Syarat App Review)
        const replyUrl = `https://graph.instagram.com/v21.0/${commentId}/replies`;
        try {
            const replyRes = await fetch(replyUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${IG_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: "kak silahkan cek dm sudah dikirim 🚀"
                })
            });

            if (replyRes.ok) {
                console.log(`✅ Comment REPLY sent!`);
            } else {
                const replyErr = await replyRes.json();
                console.error(`❌ Comment REPLY failed:`, replyErr);
            }
        } catch (replyErr) {
            console.error(`❌ Failed to send comment reply:`, replyErr);
        }

        await supabase.from('ig_logs').insert({
            ig_user_id: userId,
            trigger_keyword: trigger.keyword,
            status: response.ok ? 'success' : 'failed',
            error_message: response.ok ? null : (result.error?.message || 'Unknown')
        });

    } catch (err: any) {
        console.error('❌ Fetch error:', err.message);
    }
}

// ====== Send FB Private Reply ======
async function sendFBPrivateReply(commentId: string, userId: string, trigger: any, pageId: string) {
    const FB_PAGE_TOKEN = Deno.env.get('FB_PAGE_TOKEN') || Deno.env.get('FB2_PAGE_TOKEN');
    if (!FB_PAGE_TOKEN) {
        console.error('❌ Missing FB_PAGE_TOKEN!');
        return;
    }

    const apiUrl = `https://graph.facebook.com/v21.0/${pageId}/messages`;

    // FB Private Replies API accepts 'message' payload similarly
    let messagePayload: any;
    const buttons = [];

    if (trigger.button_url && trigger.button_text) {
        buttons.push({
            type: "web_url",
            url: trigger.button_url,
            title: trigger.button_text
        });
    }

    if (trigger.button_url_2 && trigger.button_text_2) {
        buttons.push({
            type: "web_url",
            url: trigger.button_url_2,
            title: trigger.button_text_2
        });
    }

    if (buttons.length > 0) {
        messagePayload = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [
                        {
                            title: trigger.reply_message,
                            buttons: buttons
                        }
                    ]
                }
            }
        };
        console.log(`📤 Sending FB BUTTON template DM with ${buttons.length} button(s)`);
    } else {
        messagePayload = { text: trigger.reply_message };
        console.log('📤 Sending FB TEXT DM');
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                access_token: FB_PAGE_TOKEN,
                recipient: { comment_id: commentId },
                message: messagePayload
            })
        });

        const result = await response.json();
        console.log('📨 Meta API Response (FB):', JSON.stringify(result));

        if (response.ok) {
            console.log(`✅ FB DM SENT to ${userId}! 🎉`);
        } else {
            console.error(`❌ FB DM FAILED:`, result.error);
        }

        // Opsional: Reply ke komentar FB juga (Tetap jalan meski pesan DM gagal terkirim)
        const replyUrl = `https://graph.facebook.com/v21.0/${commentId}/comments?access_token=${FB_PAGE_TOKEN}`;
        try {
            const replyRes = await fetch(replyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: "kak silahkan cek dm sudah dikirim 🚀"
                })
            });
            if (replyRes.ok) {
                console.log(`✅ FB Comment REPLY sent!`);
            } else {
                const replyErr = await replyRes.json();
                console.error(`❌ FB Comment REPLY failed:`, replyErr);
            }
        } catch (e) {
            console.error(`❌ FB Comment REPLY failed:`, e);
        }

        await supabase.from('ig_logs').insert({
            ig_user_id: userId || 'FB_USER',
            trigger_keyword: trigger.keyword,
            status: response.ok ? 'success' : 'failed',
            error_message: response.ok ? null : (result.error?.message || 'Unknown')
        });

    } catch (err: any) {
        console.error('❌ Fetch error (FB):', err.message);
    }
}

