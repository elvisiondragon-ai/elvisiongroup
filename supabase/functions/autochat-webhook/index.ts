/**
 * AUTOCHAT WEBHOOK - REBUILT 2026-03-06
 * Clean, strict 3-step sequence handler for IG and FB.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || "";
const META_VERIFY_TOKEN = Deno.env.get('AUTOCHAT_WEBHOOK_VERIFY_TOKEN') || "autochatelvision";
const GLOBAL_META_TOKEN = Deno.env.get('META_ACCESS_TOKEN') || "";
const IG_ACCESS_TOKEN = Deno.env.get('IG_ACCESS_TOKEN') || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── UTILS ──────────────────────────────────────────────────────────────────

async function logResult(
    userId: string,
    platform: string,
    username: string,
    keyword: string,
    success: boolean,
    type: string,
    triggerId?: string,
    errorMsg?: string,
    followStatus: string = 'unknown'
) {
    const { error: logErr } = await supabase.from("autochat_audience_logs").insert({
        user_id: userId,
        ig_username: username,
        follow_status: followStatus,
        interaction_type: type,
        interaction_text: keyword,
        auto_chat_status: success ? "sent" : "failed",
        trigger_id: triggerId
    });
    if (logErr) console.error("❌ Failed to insert log:", logErr.message);
}

async function getMetaUserProfile(userId: string, platform: "instagram" | "facebook", token: string): Promise<{ username: string; followStatus: string }> {
    try {
        if (platform === "instagram") {
            const res = await fetch(`https://graph.instagram.com/v22.0/${userId}?fields=username,is_user_follow_business&access_token=${token}`);
            const data = await res.json();
            const followStatus = data.is_user_follow_business === true ? 'follower' :
                (data.is_user_follow_business === false ? 'non_follower' : 'unknown');
            return {
                username: data.username || userId,
                followStatus: followStatus
            };
        } else {
            const res = await fetch(`https://graph.facebook.com/v22.0/${userId}?fields=name&access_token=${token}`);
            const data = await res.json();
            return {
                username: data.name || userId,
                followStatus: 'unknown'
            };
        }
    } catch {
        return { username: userId, followStatus: 'unknown' };
    }
}

function buildMessagePayload(trigger: Record<string, unknown>, platform: "facebook" | "instagram", step: 4 | 5 | 6 = 4) {
    let text = "";
    let btnType = "quick_reply";
    let btn1Text = "";
    let btn1Url = "";
    let btn2Text = "";
    let btn2Url = "";

    if (step === 4) {
        text = (trigger.step4_text as string) || "";
        btnType = (trigger.step4_button_type as string) || "quick_reply";
        btn1Text = (trigger.step4_button1_text as string) || "";
        btn1Url = (trigger.step4_button1_url as string) || "";
        btn2Text = (trigger.step4_button2_text as string) || "";
        btn2Url = (trigger.step4_button2_url as string) || "";
    } else if (step === 5) {
        text = (trigger.step5_text as string) || "";
        btnType = (trigger.step5_button_type as string) || "quick_reply";
        btn1Text = (trigger.step5_button1_text as string) || "";
        btn1Url = (trigger.step5_button1_url as string) || "";
        btn2Text = (trigger.step5_button2_text as string) || "";
        btn2Url = (trigger.step5_button2_url as string) || "";
    } else if (step === 6) {
        text = (trigger.step6_text as string) || "";
        btnType = "web_url";
        btn1Text = (trigger.step6_button_text as string) || "";
        btn1Url = (trigger.step6_button_url as string) || "";
    }

    if (!text) return { text: "Terima kasih." }; // fallback

    const webUrls: { type: string; url: string; title: string }[] = [];
    const postbacks: { title: string; payload: string }[] = [];

    const buttons = [
        { text: btn1Text, url: btn1Url },
        { text: btn2Text, url: btn2Url },
    ];

    for (let i = 0; i < buttons.length; i++) {
        const b = buttons[i];
        if (!b.text) continue;

        if (btnType === "web_url" && b.url) {
            let safeUrl = b.url.trim();
            if (!safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) {
                safeUrl = 'https://' + safeUrl;
            }
            webUrls.push({ type: "web_url", url: safeUrl, title: b.text });
        } else {
            // Add a payload marker for branching/tracking: TR_{id}_S{step}_B{1/2}
            const payloadMarker = `TR_${trigger.id}_S${step}_B${i + 1}`;
            postbacks.push({ title: b.text, payload: payloadMarker });
        }
    }

    if (platform === "facebook") {
        const allButtons = [
            ...webUrls,
            ...postbacks.map((p) => ({ type: "postback", title: p.title, payload: p.payload }))
        ];
        if (allButtons.length > 0) {
            return {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: text,
                        buttons: allButtons.slice(0, 3)
                    }
                }
            };
        }
    } else if (platform === "instagram") {
        if (postbacks.length > 0) {
            let igText = text;
            if (webUrls.length > 0) {
                igText += "\n";
                for (const url of webUrls) {
                    igText += `\n👉 ${url.title}: ${url.url}`;
                }
            }
            return {
                text: igText,
                quick_replies: postbacks.slice(0, 13).map((p) => ({
                    content_type: "text",
                    title: p.title.substring(0, 20),
                    payload: p.payload.substring(0, 1000)
                }))
            };
        } else if (webUrls.length > 0) {
            return {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [{ title: text, buttons: webUrls.slice(0, 3) }],
                    },
                },
            };
        }
    }

    return { text: text };
}

// ─── INSTAGRAM HANDLERS ─────────────────────────────────────────────────────

async function handleIgComment(
    commentId: string,
    fromUserId: string,
    commentText: string,
    client: Record<string, unknown>,
    triggers: Record<string, unknown>[]
) {
    const token = IG_ACCESS_TOKEN || (client.meta_access_token as string);
    const igUserId = client.meta_instagram_id as string;
    const ownerId = client.user_id as string;

    if (!token || !igUserId || fromUserId === igUserId) return;

    const matched = triggers.find((t) => t.is_any_word || commentText.toLowerCase().includes((t.keyword as string).toLowerCase()));
    if (!matched) return;

    console.log(`✅ [IG Comment] Matched Keyword: ${matched.keyword}`);

    // 1. Send Step 4 DM
    const payload = buildMessagePayload(matched, "instagram", 4);
    const dmApiUrl = `https://graph.instagram.com/v22.0/${igUserId}/messages`;

    console.log(`📤 Sending IG DM to ${fromUserId}:\n${JSON.stringify(payload, null, 2)}`);

    const dmRes = await fetch(dmApiUrl, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: { id: fromUserId }, message: payload }),
    });

    const dmResult = await dmRes.json();
    console.log("📨 IG DM Result:", JSON.stringify(dmResult));

    // 2. Reply to the actual comment publicly
    const replies = [matched.comment_reply, matched.comment_reply_2, matched.comment_reply_3].filter(Boolean) as string[];
    const replyText = replies.length > 0 ? replies[Math.floor(Math.random() * replies.length)] : "Cek DM ya kak! 🚀";

    const replyRes = await fetch(`https://graph.instagram.com/v22.0/${commentId}/replies`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText }),
    });

    if (!replyRes.ok) console.error("❌ IG Comment Reply failed:", await replyRes.json());

    const profile = await getMetaUserProfile(fromUserId, "instagram", token);
    await logResult(ownerId, "instagram", profile.username, matched.keyword as string, dmRes.ok, "comment", matched.id as string, dmResult?.error?.message, profile.followStatus);
}

async function handleIgMessage(
    senderId: string,
    messageText: string,
    quickReplyPayload: string | null,
    client: Record<string, unknown>,
    triggers: Record<string, unknown>[]
) {
    const token = IG_ACCESS_TOKEN || (client.meta_access_token as string);
    const igUserId = client.meta_instagram_id as string;
    const ownerId = client.user_id as string;

    if (!token || !igUserId) return;

    let matchedTrigger: Record<string, unknown> | undefined;
    let nextStep: 4 | 5 | 6 = 4;

    const rawPayload = (quickReplyPayload || "").trim();
    const rawText = (messageText || "").trim();
    const searchStr = (rawPayload || rawText).toLowerCase();

    console.log(`🔍 [IG DM] Incoming -> payload: "${quickReplyPayload}", text: "${messageText}", searchStr: "${searchStr}"`);
    console.log(`🚀 [Step 4] Starting Trigger Matching for IG DM...`);

    // 1. Check for Step Markers in Payload (Unambiguous)
    if (quickReplyPayload && quickReplyPayload.startsWith("TR_")) {
        const parts = quickReplyPayload.split("_"); // TR, {id}, S{step}, B{index}
        const triggerId = parts[1];
        const stepDetail = parts[2]; // S4 or S5
        const buttonIndex = parts[3]; // B1 or B2

        matchedTrigger = triggers.find(t => t.id === triggerId);

        if (matchedTrigger) {
            if (stepDetail === "S4") {
                const leadsTo = (buttonIndex === "B1")
                    ? matchedTrigger.step4_button1_leads_to
                    : matchedTrigger.step4_button2_leads_to;

                nextStep = (leadsTo === "step6" || leadsTo === "step6_follower_only") ? 6 : 5;
                console.log(`🎯 [IG DM] Payload Match! Trigger ${triggerId}, Step 4, Button ${buttonIndex} (leads: ${leadsTo}) -> next ${nextStep}`);
            } else if (stepDetail === "S5") {
                const leadsTo = (buttonIndex === "B1")
                    ? matchedTrigger.step5_button1_leads_to
                    : matchedTrigger.step5_button2_leads_to;

                if (leadsTo === "repeat_step5") {
                    nextStep = 5;
                    console.log(`🎯 [IG DM] Payload Match! Trigger ${triggerId}, Step 5, Button ${buttonIndex} (repeat_step5) -> next 5`);
                } else if (leadsTo === "step6_follower_only") {
                    console.log(`🛑 [IG DM] Checking follower status for ${senderId}...`);
                    const profile = await getMetaUserProfile(senderId, "instagram", token);

                    if (profile.followStatus === "follower") {
                        nextStep = 6;
                        console.log(`✅ [IG DM] Follower Verified! Proceeding to Step 6.`);
                    } else {
                        console.log(`❌ [IG DM] Non-follower blocked. Sending warning to ${senderId}.`);
                        const warningPayload = {
                            text: "Sepertinya kamu belum follow akun kami. Follow dulu ya, baru balas lagi! 😊"
                        };
                        try {
                            await fetch(`https://graph.instagram.com/v22.0/${igUserId}/messages`, {
                                method: "POST",
                                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                body: JSON.stringify({ recipient: { id: senderId }, message: warningPayload }),
                            });
                        } catch (err) {
                            console.error(`❌ [IG DM] Failed to send follow warning to ${senderId}`, err);
                        }
                        nextStep = 5;
                    }
                } else {
                    nextStep = 6;
                    console.log(`🎯 [IG DM] Payload Match! Trigger ${triggerId}, Step 5, Button ${buttonIndex} (leads: ${leadsTo}) -> next 6`);
                }
            }
        }
    }

    // 2. Fallback to Text-based matching
    if (!matchedTrigger && searchStr) {
        // Check Step 4 Buttons
        matchedTrigger = triggers.find(t => {
            const b1 = (t.step4_button1_text as string || "").toLowerCase().trim();
            const b2 = (t.step4_button2_text as string || "").toLowerCase().trim();
            if (b1 === searchStr) { nextStep = 5; return true; }
            if (b2 === searchStr) { nextStep = 6; return true; } // Branching fallback
            return false;
        });

        if (!matchedTrigger) {
            // Check Step 5 Buttons
            matchedTrigger = triggers.find(t => {
                const b1 = (t.step5_button1_text as string || "").toLowerCase().trim();
                const b2 = (t.step5_button2_text as string || "").toLowerCase().trim();
                if (b1 === searchStr || b2 === searchStr) { nextStep = 6; return true; }
                return false;
            });
        }
    }

    if (!matchedTrigger) {
        matchedTrigger = triggers.find((t) => {
            const keywordStr = (t.keyword as string).toLowerCase().trim();
            const isMatch = t.is_any_word || searchStr.includes(keywordStr) || rawText.toLowerCase().includes(keywordStr) || rawPayload.toLowerCase().includes(keywordStr);
            const isChatTrigger = !t.trigger_source || t.trigger_source === 'chat_ig_fb' || t.trigger_source === 'komentar_ig_fb';
            return isMatch && isChatTrigger;
        });

        if (matchedTrigger) {
            nextStep = 4;
            console.log(`✅ [IG DM] Matched base Keyword "${matchedTrigger.keyword}"! Starting sequence at Step 4.`);
        }
    }

    if (!matchedTrigger) {
        console.log(`⏭️ [Step 4 Fail] No trigger matched for: "${searchStr}" (Exiting)`);
        return;
    }
    console.log(`✅ [Step 4 Success] Matched Trigger ID: ${matchedTrigger.id}, Keyword: "${matchedTrigger.keyword}"`);

    console.log(`🎯 [IG DM] Final Decision: Serving Step ${nextStep} payload...`);

    const payload = buildMessagePayload(matchedTrigger, "instagram", nextStep);
    const dmApiUrl = `https://graph.instagram.com/v22.0/${igUserId}/messages`;

    console.log(`📤 Sending IG DM to ${senderId}:\n${JSON.stringify(payload, null, 2)}`);

    const res = await fetch(dmApiUrl, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: { id: senderId }, message: payload }),
    });

    const result = await res.json();
    if (!res.ok) {
        console.error("❌ META API ERROR (IG DM):", JSON.stringify(result, null, 2));
        console.error("Payload attempted:", JSON.stringify(payload, null, 2));
    } else {
        console.log("📨 IG DM Success Result:", JSON.stringify(result));
    }

    const profile = await getMetaUserProfile(senderId, "instagram", token);
    await logResult(ownerId, "instagram", profile.username, matchedTrigger.keyword as string, res.ok, "dm", matchedTrigger.id as string, result?.error?.message, profile.followStatus);
}

// ─── FACEBOOK HANDLERS ──────────────────────────────────────────────────────

async function handleFbComment(
    commentId: string,
    fromUserId: string,
    commentText: string,
    pageId: string,
    client: Record<string, unknown>,
    triggers: Record<string, unknown>[]
) {
    const token = GLOBAL_META_TOKEN || (client.meta_access_token as string);
    const ownerId = client.user_id as string;

    if (!token) return;

    const matched = triggers.find((t) => t.is_any_word || commentText.toLowerCase().includes((t.keyword as string).toLowerCase()));
    if (!matched) return;

    console.log(`✅ [FB Comment] Matched: ${matched.keyword}`);

    // FB Private Replies must be plain text
    const payload = buildMessagePayload(matched, "facebook", 4);
    let finalPayload: any = payload;

    if (payload.quick_replies || (payload.attachment as any)?.payload?.elements?.[0]?.buttons) {
        let instruction = `${(matched.step4_text as string) || "Pilih opsi:"}\n\n👇 Klik Link di bawah ini buat Balas Otomatis:\n`;
        const step4Btns = [matched.step4_button1_text, matched.step4_button2_text].filter(Boolean);
        for (const btn of step4Btns) {
            instruction += `👉 https://m.me/${pageId}?text=${encodeURIComponent(btn as string)}\n`;
        }
        finalPayload = { text: instruction };
    }

    console.log(`📤 Sending FB Private Reply DM to ${fromUserId}:\n${JSON.stringify(finalPayload, null, 2)}`);

    const dmRes = await fetch(`https://graph.facebook.com/v22.0/${pageId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token, recipient: { comment_id: commentId }, message: finalPayload }),
    });

    const dmResult = await dmRes.json();
    console.log("📨 FB DM Result:", JSON.stringify(dmResult));

    // Reply to comment publicly
    const replies = [matched.comment_reply, matched.comment_reply_2, matched.comment_reply_3].filter(Boolean) as string[];
    const replyText = replies.length > 0 ? replies[Math.floor(Math.random() * replies.length)] : "Cek DM ya kak! 🚀";

    const replyRes = await fetch(`https://graph.facebook.com/v22.0/${commentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText, access_token: token })
    });

    if (!replyRes.ok) console.error("❌ FB Comment Reply failed:", await replyRes.json());

    const profile = await getMetaUserProfile(fromUserId, "facebook", token);
    await logResult(ownerId, "facebook", profile.username, matched.keyword as string, dmRes.ok, "comment", matched.id as string, dmResult?.error?.message, profile.followStatus);
}

async function handleFbMessage(
    senderId: string,
    messageText: string,
    payloadText: string | null,
    pageId: string,
    client: Record<string, unknown>,
    triggers: Record<string, unknown>[]
) {
    const token = GLOBAL_META_TOKEN || (client.meta_access_token as string);
    const ownerId = client.user_id as string;

    if (!token) return;

    let matchedTrigger: Record<string, unknown> | undefined;
    let nextStep: 4 | 5 | 6 = 4;

    const rawPayload = (payloadText || "").trim();
    const rawText = (messageText || "").trim();
    const searchStr = (rawPayload || rawText).toLowerCase();

    console.log(`🔍 [FB DM] Incoming -> rawPayload: "${rawPayload}", rawText: "${rawText}", searchStr: "${searchStr}"`);
    console.log(`🚀 [Step 4] Starting Trigger Matching for FB DM...`);

    // 1. Check for Step Markers
    if (rawPayload && rawPayload.startsWith("TR_")) {
        const parts = rawPayload.split("_");
        const triggerId = parts[1];
        const stepDetail = parts[2];
        const buttonIndex = parts[3];

        matchedTrigger = triggers.find(t => t.id === triggerId);
        if (matchedTrigger) {
            if (stepDetail === "S4") {
                const leadsTo = (buttonIndex === "B1")
                    ? matchedTrigger.step4_button1_leads_to
                    : matchedTrigger.step4_button2_leads_to;

                nextStep = (leadsTo === "step6" || leadsTo === "step6_follower_only") ? 6 : 5;
                console.log(`🎯 [FB DM] Payload Match! Trigger ${triggerId}, Step 4, Button ${buttonIndex} (leads: ${leadsTo}) -> next ${nextStep}`);
            } else if (stepDetail === "S5") {
                const leadsTo = (buttonIndex === "B1")
                    ? matchedTrigger.step5_button1_leads_to
                    : matchedTrigger.step5_button2_leads_to;

                if (leadsTo === "repeat_step5") {
                    nextStep = 5;
                    console.log(`🎯 [FB DM] Payload Match! Trigger ${triggerId}, Step 5, Button ${buttonIndex} (repeat_step5) -> next 5`);
                } else {
                    nextStep = 6; // FB bypasses follower check seamlessly
                    console.log(`🎯 [FB DM] Payload Match! Trigger ${triggerId}, Step 5, Button ${buttonIndex} (leads: ${leadsTo}) -> next 6`);
                }
            }
        }
    }

    // 2. Fallback to Text
    if (!matchedTrigger && searchStr) {
        matchedTrigger = triggers.find(t => {
            const b1 = (t.step4_button1_text as string || "").toLowerCase().trim();
            const b2 = (t.step4_button2_text as string || "").toLowerCase().trim();
            if (b1 === searchStr) { nextStep = 5; return true; }
            if (b2 === searchStr) { nextStep = 6; return true; }
            return false;
        });

        if (!matchedTrigger) {
            matchedTrigger = triggers.find(t => {
                const b1 = (t.step5_button1_text as string || "").toLowerCase().trim();
                const b2 = (t.step5_button2_text as string || "").toLowerCase().trim();
                if (b1 === searchStr || b2 === searchStr) { nextStep = 6; return true; }
                return false;
            });
        }
    }

    if (!matchedTrigger) {
        matchedTrigger = triggers.find((t) => {
            const keywordStr = (t.keyword as string).toLowerCase().trim();
            const isMatch = t.is_any_word || searchStr.includes(keywordStr) || rawText.toLowerCase().includes(keywordStr) || rawPayload.toLowerCase().includes(keywordStr);
            const isChatTrigger = !t.trigger_source || t.trigger_source === 'chat_ig_fb' || t.trigger_source === 'komentar_ig_fb';
            return isMatch && isChatTrigger;
        });

        if (matchedTrigger) {
            nextStep = 4;
            console.log(`✅ [FB DM] Matched base Keyword "${matchedTrigger.keyword}"! Starting sequence at Step 4.`);
        }
    }

    if (!matchedTrigger) {
        console.log(`⏭️ [Step 4 Fail] No trigger matched for: "${searchStr}" (Exiting)`);
        return;
    }
    console.log(`✅ [Step 4 Success] Matched Trigger ID: ${matchedTrigger.id}, Keyword: "${matchedTrigger.keyword}"`);

    console.log(`🎯 [FB DM] Final Decision: Serving Step ${nextStep} payload...`);

    const payload = buildMessagePayload(matchedTrigger, "facebook", nextStep);

    console.log(`📤 Sending FB DM to ${senderId}:\n${JSON.stringify(payload, null, 2)}`);

    const res = await fetch(`https://graph.facebook.com/v22.0/${pageId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token, recipient: { id: senderId }, message: payload }),
    });

    const result = await res.json();
    if (!res.ok) {
        console.error("❌ META API ERROR (FB DM):", JSON.stringify(result, null, 2));
        console.error("Payload attempted:", JSON.stringify(payload, null, 2));
    } else {
        console.log("📨 FB DM Success Result:", JSON.stringify(result));
    }

    const profile = await getMetaUserProfile(senderId, "facebook", token);
    await logResult(ownerId, "facebook", profile.username, matchedTrigger.keyword as string, res.ok, "dm", matchedTrigger.id as string, result?.error?.message, profile.followStatus);
}

// ─── MAIN HTTP HANDLER ──────────────────────────────────────────────────────

serve(async (req) => {
    console.log(`🔌 [Incoming Request] ${req.method} ${req.url}`);
    if (req.method === "GET") {
        const url = new URL(req.url);
        if (url.searchParams.get("hub.verify_token") === META_VERIFY_TOKEN) {
            return new Response(url.searchParams.get("hub.challenge"), { status: 200 });
        }
        return new Response("Invalid verify token", { status: 403 });
    }

    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

    let body;
    try {
        body = await req.json();
        console.log("✅ [Step 1] Webhook received & JSON parsed.");
    } catch {
        console.error("❌ [Step 1 Fail] Invalid JSON received.");
        return new Response("Invalid JSON", { status: 400 });
    }

    console.log("📩 Webhook received body:", JSON.stringify(body, null, 2));

    if (body.object === "instagram" || body.object === "page") {
        for (const entry of body.entry) {
            const pageOrIgId = entry.id;

            // ⚡ Resilience: Also extract recipient_id (for messages) or from_id (for comments)
            // as these often contain the other ID (Page vs IG) that Meta might have used for entry.id
            let secondaryId = null;
            if (entry.messaging && entry.messaging[0]) {
                secondaryId = entry.messaging[0].recipient?.id;
            } else if (entry.changes && entry.changes[0]?.value) {
                secondaryId = entry.changes[0].value.from?.id;
            }

            console.log(`🆔 [Step 1.5] IDs for lookup -> Entry: ${pageOrIgId}, Secondary: ${secondaryId} (Object: ${body.object})`);

            // Fetch active clients matching either of the IDs found in the payload
            let query = supabase.from("autochat_clients").select("*");

            let filter = `meta_page_id.eq.${pageOrIgId},meta_instagram_id.eq.${pageOrIgId}`;
            if (secondaryId) {
                filter += `,meta_page_id.eq.${secondaryId},meta_instagram_id.eq.${secondaryId}`;
            }

            const { data: clients } = await query.or(filter);

            if (!clients || clients.length === 0) {
                console.log(`⏭️ [Step 2 Fail] No registered client found for IDs ${pageOrIgId}${secondaryId ? ' or ' + secondaryId : ''}`);
                continue;
            }
            console.log(`✅ [Step 2] Found ${clients.length} matching client(s).`);

            for (const client of clients) {
                try {
                    // Fetch active triggers for this client
                    const { data: triggers } = await supabase
                        .from("autochat_triggers")
                        .select("*")
                        .eq("user_id", client.user_id)
                        .eq("is_active", true);

                    if (!triggers || triggers.length === 0) {
                        console.log(`⏭️ [Step 3 Fail] No active triggers found for user ${client.user_id}`);
                        continue;
                    }
                    console.log(`✅ [Step 3] Found ${triggers.length} active triggers for user ${client.user_id}`);

                    // 1. Process Comments
                    const changes = entry.changes || [];
                    console.log(`🔎 [Loop] Checking ${changes.length} changes...`);
                    for (let i = 0; i < changes.length; i++) {
                        const change = changes[i];
                        const val = change.value;
                        if (!val) continue;

                        console.log(`   🔸 [Change ${i}] Field: ${change.field}, Object: ${body.object}`);

                        if (change.field === "comments" && val.text && body.object === "instagram") {
                            const fromId = val.from?.id;
                            if (!fromId) { console.log(`   ⚠️ [Change ${i}] Missing from.id, skipping.`); continue; }
                            await handleIgComment(val.id, fromId, val.text, client, triggers);
                        } else if (change.field === "feed" && val.item === "comment" && val.verb === "add" && body.object === "page") {
                            const fromId = val.from?.id;
                            if (fromId === pageOrIgId || !fromId) continue;
                            await handleFbComment(val.comment_id, fromId, val.message, pageOrIgId, client, triggers);
                        }
                    }

                    // 2. Process DMs
                    const messaging = entry.messaging || [];
                    console.log(`🔎 [Loop] Checking ${messaging.length} messaging events...`);
                    for (let i = 0; i < messaging.length; i++) {
                        const msg = messaging[i];
                        const senderId = msg.sender?.id;
                        if (!senderId || senderId === pageOrIgId) {
                            console.log(`   ⏭️ [Msg ${i}] skipping (sender: ${senderId} == receiver: ${pageOrIgId})`);
                            continue;
                        }

                        if (msg.message) {
                            const text = msg.message.text || "";
                            const payload = msg.message.quick_reply?.payload || msg.postback?.payload || null;
                            console.log(`   ✅ [Msg ${i}] Type: message, search: "${payload || text}"`);
                            if (body.object === "instagram") await handleIgMessage(senderId, text, payload, client, triggers);
                            else await handleFbMessage(senderId, text, payload, pageOrIgId, client, triggers);
                        } else if (msg.postback) {
                            const payload = msg.postback.payload || null;
                            const title = msg.postback.title || "";
                            console.log(`   ✅ [Msg ${i}] Type: postback, title: "${title}"`);
                            if (body.object === "instagram") await handleIgMessage(senderId, title, payload, client, triggers);
                            else await handleFbMessage(senderId, title, payload, pageOrIgId, client, triggers);
                        }
                    }
                } catch (err: any) {
                    console.error("🔥 [CRITICAL FAILURE] Error processing client:", client.user_id);
                    console.error("Stack:", err.stack || err.message || err);
                }
            }
        }
    }

    return new Response("EVENT_RECEIVED", { status: 200 });
});
