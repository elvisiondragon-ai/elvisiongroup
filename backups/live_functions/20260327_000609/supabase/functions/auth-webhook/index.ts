// autochat-webhook — Multi-tenant IG + FB webhook
// Routes each comment event to the correct client's tokens & triggers
// Replaces the personal ig-webhook for ALL autochat_clients users
//
// Webhook URL to set in Meta App Dashboard:
//   https://nlrgdhpmsittuwiiindq.supabase.co/functions/v1/autochat-webhook
//
// Verify token: set AUTOCHAT_WEBHOOK_VERIFY_TOKEN in Supabase secrets

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const VERIFY_TOKEN = Deno.env.get("AUTOCHAT_WEBHOOK_VERIFY_TOKEN") || "autochat_el_vision_2026";
const GLOBAL_IG_TOKEN = Deno.env.get("IG_ACCESS_TOKEN");   // IGAAN... — for graph.instagram.com
const GLOBAL_FB_TOKEN = Deno.env.get("FB_PAGE_TOKEN");      // EAA... — for graph.facebook.com

const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildMessagePayload(trigger: Record<string, unknown>) {
    const buttons: Record<string, unknown>[] = [];
    if (trigger.button_url && trigger.button_text) {
        buttons.push({ type: "web_url", url: trigger.button_url, title: trigger.button_text });
    }
    if (trigger.button_url_2 && trigger.button_text_2) {
        buttons.push({ type: "web_url", url: trigger.button_url_2, title: trigger.button_text_2 });
    }
    if (buttons.length > 0) {
        return {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{ title: trigger.reply_message, buttons }],
                },
            },
        };
    }
    return { text: trigger.reply_message };
}

async function logResult(
    userId: string,
    platform: string,
    igUsername: string,
    keyword: string,
    ok: boolean,
    type: "comment" | "dm" | "story_reply",
    triggerId?: string,
    errorMsg?: string
) {
    // autochat_audience_logs is the new multi-tenant log table
    await supabase.from("autochat_audience_logs").insert({
        user_id: userId,
        ig_username: igUsername,
        interaction_type: type,
        interaction_text: keyword,
        auto_chat_status: ok ? "sent" : "failed",
        trigger_id: triggerId,
        follow_status: "unknown"
    });

    if (!ok && errorMsg) {
        console.error(`❌ ${platform.toUpperCase()} Interaction failed:`, errorMsg);
    }
}

// ─── Instagram: send DM + reply to comment ────────────────────────────────────

async function handleIgComment(
    commentId: string,
    fromUserId: string,
    commentText: string,
    client: Record<string, unknown>,
    triggers: Record<string, unknown>[]
) {
    // Prioritize GLOBAL_TOKEN if present, otherwise use DB
    const token = GLOBAL_IG_TOKEN || (client.meta_access_token as string);
    const igUserId = client.meta_instagram_id as string;
    const ownerId = client.user_id as string;

    if (!token || !igUserId) {
        console.log(`⚠️ Client ${ownerId} missing IG token (Check Secret or DB)`);
        return;
    }

    // Skip own account
    if (fromUserId === igUserId) return;

    const matched = triggers.find((t) =>
        commentText.includes((t.keyword as string).toLowerCase())
    );
    if (!matched) return;

    console.log(`✅ [IG] Client ${ownerId} — keyword "${matched.keyword}" matched`);

    const payload = buildMessagePayload(matched);
    const apiUrl = `https://graph.instagram.com/v22.0/${igUserId}/messages`;

    console.log(`🔌 IG DM URL: ${apiUrl} (Token starts with: ${token.substring(0, 5)}...)`);

    const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipient: { comment_id: commentId }, message: payload }),
    });
    const result = await res.json();
    console.log("📨 IG DM result:", JSON.stringify(result));

    // Reply to comment
    const replyText = (matched.comment_reply as string) || "kak silahkan cek dm sudah dikirim 🚀";
    try {
        const replyRes = await fetch(`https://graph.instagram.com/v22.0/${commentId}/replies`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: replyText }),
        });
        if (replyRes.ok) {
            console.log(`✅ IG Comment REPLY sent!`);
        } else {
            const replyErr = await replyRes.json();
            console.error(`❌ IG Comment REPLY failed:`, replyErr);
        }
    } catch (e) {

        console.error("❌ IG Comment reply fetch failed:", e);
    }

    await logResult(ownerId, "instagram", fromUserId, matched.keyword as string, res.ok, "comment", matched.id as string, result?.error?.message);
}
// ─── Instagram: send DM only (Trigger Source: chat_ig_fb) ─────────────────────

async function handleIgMessage(
    senderId: string,
    messageText: string,
    client: Record<string, unknown>,
    triggers: Record<string, unknown>[]
) {
    const token = (client.meta_access_token as string) || GLOBAL_IG_TOKEN;
    const igUserId = client.meta_instagram_id as string;
    const ownerId = client.user_id as string;

    if (!token || !igUserId) {
        console.log(`⚠️ Client ${ownerId} missing IG DM token (DB or Secret)`);
        return;
    }

    // We only trigger for chat_ig_fb triggers, unless trigger_source is empty in older rows
    const matched = triggers.find((t) => {
        const isMatch = messageText.includes((t.keyword as string).toLowerCase());
        const isChatTrigger = t.trigger_source === 'chat_ig_fb' || !t.trigger_source;
        return isMatch && isChatTrigger;
    });
    if (!matched) return;

    console.log(`✅ [IG DM] Client ${ownerId} — keyword "${matched.keyword}" matched`);

    const payload = buildMessagePayload(matched);
    const apiUrl = `https://graph.instagram.com/v22.0/${igUserId}/messages`;
    console.log(`🔌 IG DM URL: ${apiUrl} (Token starts with: ${token.substring(0, 5)}...)`);

    const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipient: { id: senderId }, message: payload }),
    });
    const result = await res.json();
    console.log("📨 IG DM reply result:", JSON.stringify(result));

    await logResult(ownerId, "instagram", senderId, matched.keyword as string, res.ok, "dm", matched.id as string, result?.error?.message);
}
// ─── Facebook: private reply to comment ──────────────────────────────────────
// LOG HARUS LENGKAP UNTUK SETIAP IG DAN FB AGAR TAU KESALAHAN

async function handleFbComment(
    commentId: string,
    fromUserId: string,
    commentText: string,
    pageId: string,
    client: Record<string, unknown>,
    triggers: Record<string, unknown>[]
) {
    const token = GLOBAL_FB_TOKEN || (client.meta_access_token as string);
    const ownerId = client.user_id as string;

    console.log(`🔍 [FB Comment] Processing for client ${ownerId}`);
    console.log(`🔍 [FB Comment] Token source: ${GLOBAL_FB_TOKEN ? 'FB_PAGE_TOKEN secret ✅' : (client.meta_access_token ? 'DB meta_access_token ✅' : '❌ NO TOKEN FOUND')}`);
    console.log(`🔍 [FB Comment] Comment text: "${commentText}" | Triggers count: ${triggers.length}`);

    if (!token) {
        console.error(`❌ [FB Comment] Client ${ownerId} — NO FB TOKEN. Set FB_PAGE_TOKEN in Supabase Secrets!`);
        return;
    }

    const matched = triggers.find((t) =>
        commentText.includes((t.keyword as string).toLowerCase())
    );

    if (!matched) {
        console.log(`⏭️ [FB Comment] No keyword matched. Comment: "${commentText}" | Keywords: [${triggers.map((t: any) => t.keyword).join(', ')}]`);
        return;
    }

    console.log(`✅ [FB] Client ${ownerId} — keyword "${matched.keyword}" matched`);

    const payload = buildMessagePayload(matched);
    console.log(`📤 [FB] Sending DM to commenter via page ${pageId}/messages...`);

    const res = await fetch(`https://graph.facebook.com/v22.0/${pageId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            access_token: token,
            recipient: { comment_id: commentId },
            message: payload,
        }),
    });
    const result = await res.json();
    console.log("📨 FB DM reply result:", JSON.stringify(result));

    // Reply to comment
    const replyText = (matched.comment_reply as string) || "kak silahkan cek dm sudah dikirim 🚀";
    console.log(`📤 [FB] Replying to comment ${commentId}...`);
    try {
        const replyRes = await fetch(`https://graph.facebook.com/v22.0/${commentId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: replyText, access_token: token })
        });
        if (replyRes.ok) {
            console.log(`✅ FB Comment REPLY sent!`);
        } else {
            console.error(`❌ FB Comment REPLY failed:`, await replyRes.json());
        }
    } catch (e) {
        console.error("❌ FB Comment reply fetch failed:", e);
    }

    await logResult(ownerId, "facebook", fromUserId, matched.keyword as string, res.ok, "comment", matched.id as string, result?.error?.message);
}

// ─── Facebook: send DM only (Trigger Source: chat_ig_fb) ─────────────────────

async function handleFbMessage(
    senderId: string,
    messageText: string,
    pageId: string,
    client: Record<string, unknown>,
    triggers: Record<string, unknown>[]
) {
    const token = GLOBAL_FB_TOKEN || (client.meta_access_token as string);
    const ownerId = client.user_id as string;

    if (!token) {
        console.log(`⚠️ Client ${ownerId} missing FB DM token (DB or Secret)`);
        return;
    }

    // We only trigger for chat_ig_fb
    const matched = triggers.find((t) => {
        const isMatch = messageText.includes((t.keyword as string).toLowerCase());
        const isChatTrigger = t.trigger_source === 'chat_ig_fb' || !t.trigger_source;
        return isMatch && isChatTrigger;
    });
    if (!matched) return;

    console.log(`✅ [FB DM] Client ${ownerId} — keyword "${matched.keyword}" matched`);

    const payload = buildMessagePayload(matched);

    const res = await fetch(`https://graph.facebook.com/v22.0/${pageId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            access_token: token,
            recipient: { id: senderId },
            message: payload,
        }),
    });
    const result = await res.json();
    console.log("📨 FB DM reply result:", JSON.stringify(result));

    await logResult(ownerId, "facebook", senderId, matched.keyword as string, res.ok, "dm", matched.id as string, result?.error?.message);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

serve(async (req) => {
    const url = new URL(req.url);

    // ── GET: Webhook verification ──────────────────────────────────────────────
    if (req.method === "GET") {
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("✅ WEBHOOK_VERIFIED");
            return new Response(challenge, { status: 200 });
        }
        return new Response("Forbidden", { status: 403 });
    }

    // ── POST: Incoming events ──────────────────────────────────────────────────
    if (req.method === "POST") {
        try {
            const body = await req.json();
            console.log("📩 Webhook received body:", JSON.stringify(body, null, 2));

            if (!body.object) {
                console.log("⚠️ No object field in body");
            }

            // ── Instagram events ─────────────────────────────────────────────────
            if (body.object === "instagram") {
                for (const entry of body.entry ?? []) {
                    const igAccountId = entry.id as string; // The IG account that owns the page

                    // 1. Handle DMs (Messaging)
                    if (entry.messaging) {
                        for (const messaging of entry.messaging) {
                            if (!messaging.message || !messaging.message.text) continue;

                            const messageText = messaging.message.text.toLowerCase().trim();
                            const senderId = messaging.sender.id;

                            // Skip echo from self
                            if (senderId === igAccountId) continue;

                            // Find the client whose instagram account received this message
                            const { data: clients } = await supabase
                                .from("autochat_clients")
                                .select("*")
                                .eq("meta_instagram_id", igAccountId); // removed .eq("status", "paid") for testability

                            if (!clients || clients.length === 0) continue;

                            for (const client of clients) {
                                const { data: triggers } = await supabase
                                    .from("autochat_triggers")
                                    .select("*")
                                    .eq("user_id", client.user_id)
                                    .eq("is_active", true);

                                if (!triggers?.length) continue;
                                await handleIgMessage(senderId, messageText, client, triggers);
                            }
                        }
                    }

                    // 2. Handle Comments (Changes)
                    for (const change of entry.changes ?? []) {
                        if (change.field !== "comments") continue;

                        const commentText = (change.value.text || "").toLowerCase().trim();
                        const fromUserId = change.value.from?.id as string;
                        const commentId = change.value.id as string;

                        // Find the client whose instagram account received this comment
                        const { data: clients } = await supabase
                            .from("autochat_clients")
                            .select("*")
                            .eq("meta_instagram_id", igAccountId); // only paid clients run automations

                        if (!clients || clients.length === 0) continue;

                        for (const client of clients) {
                            // Fetch active triggers for this client
                            const { data: triggers } = await supabase
                                .from("autochat_triggers")
                                .select("*")
                                .eq("user_id", client.user_id)
                                .eq("is_active", true);

                            // For comments, we want to ensure trigger_source is 'komentar_ig_fb' or empty
                            const validTriggers = (triggers || []).filter((t: any) =>
                                t.trigger_source === 'komentar_ig_fb' || !t.trigger_source
                            );

                            if (!validTriggers.length) continue;
                            await handleIgComment(commentId, fromUserId, commentText, client, validTriggers);
                        }
                    }
                }
            }

            // ── Facebook Page events ─────────────────────────────────────────────
            if (body.object === "page") {
                for (const entry of body.entry ?? []) {
                    const pageId = entry.id as string;

                    // 1. Handle DMs (Messaging)
                    if (entry.messaging) {
                        for (const messaging of entry.messaging) {
                            if (!messaging.message || !messaging.message.text) continue;

                            const messageText = messaging.message.text.toLowerCase().trim();
                            const senderId = messaging.sender.id;

                            // Skip echo from self
                            if (senderId === pageId) continue;

                            const { data: clients } = await supabase
                                .from("autochat_clients")
                                .select("*")
                                .eq("meta_page_id", pageId);

                            if (!clients || clients.length === 0) continue;

                            for (const client of clients) {
                                const { data: triggers } = await supabase
                                    .from("autochat_triggers")
                                    .select("*")
                                    .eq("user_id", client.user_id)
                                    .eq("is_active", true);

                                if (!triggers?.length) continue;
                                await handleFbMessage(senderId, messageText, pageId, client, triggers);
                            }
                        }
                    }

                    // 2. Handle Comments (Changes)
                    for (const change of entry.changes ?? []) {
                        if (change.field !== "feed" || change.value.item !== "comment") continue;

                        // FB sometimes sends message in 'message' OR 'text' field
                        const commentText = (change.value.message || change.value.text || "").toLowerCase().trim();
                        const fromUserId = change.value.from?.id as string;
                        const commentId = change.value.comment_id as string;

                        console.log(`💬 [FB Page] Comment raw: message="${change.value.message}" text="${change.value.text}"`);
                        console.log(`💬 [FB Page] Comment resolved: "${commentText}" from ${fromUserId}`);
                        console.log(`💬 [FB Page] comment_id: ${commentId}`);

                        const { data: clients, error: clientErr } = await supabase
                            .from("autochat_clients")
                            .select("*")
                            .eq("meta_page_id", pageId);

                        console.log(`🔍 [FB Page] Clients found for page ${pageId}: ${clients?.length ?? 0}`);
                        if (clientErr) console.error(`❌ [FB Page] DB error:`, clientErr);

                        if (!clients || clients.length === 0) {
                            console.log(`⚠️ [FB Page] No client has meta_page_id = ${pageId}`);
                            continue;
                        }

                        for (const client of clients) {
                            // Fetch active triggers for this client
                            const { data: triggers } = await supabase
                                .from("autochat_triggers")
                                .select("*")
                                .eq("user_id", client.user_id)
                                .eq("is_active", true);

                            const validTriggers = (triggers || []).filter((t: any) =>
                                t.trigger_source === 'komentar_ig_fb' ||
                                t.trigger_source === 'komentar_ig' ||
                                !t.trigger_source ||
                                t.trigger_source === ''
                            );

                            console.log(`🔍 [FB Page] Total triggers: ${triggers?.length ?? 0}, Valid for FB comment: ${validTriggers.length}`);
                            validTriggers.forEach((t: any) => console.log(`   - "${t.keyword}" (source: ${t.trigger_source || 'null'})`));

                            if (!validTriggers.length) continue;
                            await handleFbComment(commentId, fromUserId, commentText, pageId, client, validTriggers);
                        }
                    }
                }
            }

            return new Response("EVENT_RECEIVED", { status: 200 });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unknown error";
            console.error("❌ Webhook error:", msg);
            return new Response("EVENT_RECEIVED", { status: 200 }); // Always 200 to Meta
        }
    }

    return new Response("OK", { status: 200 });
});
