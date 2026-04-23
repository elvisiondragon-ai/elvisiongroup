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
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function isMetaDmPaused(senderId: string): Promise<boolean> {
    const { data } = await supabase.from('wapivps_vip_chats')
        .select('messages').eq('ref', senderId).single();
    const msgs: any = data?.messages;
    if (msgs && !Array.isArray(msgs) && msgs.paused === true) return true;
    return false;
}

async function setMetaDmPaused(senderId: string, paused: boolean): Promise<void> {
    const { data } = await supabase.from('wapivps_vip_chats')
        .select('messages').eq('ref', senderId).single();
    const existing: any = data?.messages;
    const history = Array.isArray(existing) ? existing : (existing?.history || []);
    const now = new Date().toISOString();
    await supabase.from('wapivps_vip_chats')
        .upsert({ ref: senderId, messages: { history, paused }, topic: 'meta_dm', updated_at: now }, { onConflict: 'ref' });
}

async function callRenataAI(senderId: string, userMessage: string): Promise<string> {
    // Load history from Supabase (tolerate legacy array shape and new {history, paused} shape)
    const { data: chat } = await supabase.from('wapivps_vip_chats')
        .select('messages').eq('ref', senderId).single();
    const raw: any = chat?.messages;
    const messages: {role:string,content:string,ts:string}[] = Array.isArray(raw) ? raw : (raw?.history || []);
    const pausedFlag: boolean = (!Array.isArray(raw) && raw?.paused === true);
    const history = messages.slice(-10).map((m: any) => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: userMessage });

    // Load Renata KB
    const { data: kb } = await supabase.from('wapivps_knowledge')
        .select('knowledge_text').eq('uid', '8c2cd3b1-6b77-4df9-92c5-467182ecd13d').eq('session_name', 'renata').eq('status', 'active').single();
    const systemInstruction = kb?.knowledge_text || '';

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
                ...history
            ],
            temperature: 0.3, top_p: 0.9, frequency_penalty: 0.5, presence_penalty: 0.4, max_tokens: 1000
        })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || '';

    if (reply) {
        const now = new Date().toISOString();
        const newMessages = [
            ...messages,
            { role: 'user', content: userMessage, ts: now },
            { role: 'assistant', content: reply, ts: now }
        ];
        await supabase.from('wapivps_vip_chats')
            .upsert({ ref: senderId, messages: { history: newMessages, paused: pausedFlag }, topic: 'meta_dm', updated_at: now }, { onConflict: 'ref' });

        // Booking trigger — detect confirmation in AI reply
        if (reply.toLowerCase().includes('you are booked')) {
            await triggerBookingActions(senderId, newMessages, reply);
        }
    }
    return reply;
}

async function triggerBookingActions(senderId: string, allMessages: any[], aiReply: string) {
    const wapiUrl = 'https://api.elvisiongroup.com';
    const wapiToken = 'rvpwk8dkih9m';
    const adminNumbers = ['62895325633487', '6285664733499'];

    // Build full conversation summary from messages
    const transcript = allMessages.slice(-20)
        .map((m: any) => `${m.role === 'user' ? 'Client' : 'Renata'}: ${m.content}`)
        .join('\n');

    const notifText = `*NEW VIP BOOKING - eL Vision Group*\n\n${aiReply}\n\n*Full Conversation:*\n${transcript}`;

    for (const adminNumber of adminNumbers) {
        try {
            await fetch(`${wapiUrl}/api/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: 'renata',
                    token: wapiToken,
                    to: adminNumber,
                    message: notifText
                })
            });
            console.log(`[BOOKING] Notif sent to ${adminNumber}`);
        } catch(e: any) {
            console.error(`[BOOKING] Failed to notify ${adminNumber}: ${e.message}`);
        }
    }
}

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

    let btn3Text = "";
    let btn3Url = "";

    if (step === 4) {
        text = (trigger.step4_text as string) || "";
        btnType = (trigger.step4_button_type as string) || "quick_reply";
        btn1Text = (trigger.step4_button1_text as string) || "";
        btn1Url = (trigger.step4_button1_url as string) || "";
        btn2Text = (trigger.step4_button2_text as string) || "";
        btn2Url = (trigger.step4_button2_url as string) || "";
        btn3Text = (trigger.step4_button3_text as string) || "";
        btn3Url = (trigger.step4_button3_url as string) || "";
    } else if (step === 5) {
        text = (trigger.step5_text as string) || "";
        btnType = (trigger.step5_button_type as string) || "quick_reply";
        btn1Text = (trigger.step5_button1_text as string) || "";
        btn1Url = (trigger.step5_button1_url as string) || "";
        btn2Text = (trigger.step5_button2_text as string) || "";
        btn2Url = (trigger.step5_button2_url as string) || "";
        btn3Text = (trigger.step5_button3_text as string) || "";
        btn3Url = (trigger.step5_button3_url as string) || "";
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
        { text: btn3Text, url: btn3Url },
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

    const profile = await getMetaUserProfile(fromUserId, "instagram", token);
    const keyword = matched.keyword as string;

    // log 1. Check Request
    console.log(`🚀 Keyword Focus Requested from instagram @${profile.username} status ${profile.followStatus}`);

    // log 2. matching
    console.log(`matching autochat_triggers exist ${keyword} and autochat_clients valid`);

    // 1. Send Step 4 DM
    const payload = buildMessagePayload(matched, "instagram", 4);
    const dmApiUrl = `https://graph.instagram.com/v22.0/${igUserId}/messages`;

    const dmRes = await fetch(dmApiUrl, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: { id: fromUserId }, message: payload }),
    });

    const dmResult = await dmRes.json();

    // 2. Reply to the actual comment publicly
    const replies = [matched.comment_reply, matched.comment_reply_2, matched.comment_reply_3].filter(Boolean) as string[];
    const replyText = replies.length > 0 ? replies[Math.floor(Math.random() * replies.length)] : "Cek DM ya kak! 🚀";

    const replyRes = await fetch(`https://graph.instagram.com/v22.0/${commentId}/replies`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText }),
    });

    if (!replyRes.ok) console.error("❌ IG Comment Reply failed:", await replyRes.json());

    // log 3. Sent
    console.log(`Sent 🚀 Reply Comment ${replyText} sending dm {Step 4}`);

    await logResult(ownerId, "instagram", profile.username, keyword, dmRes.ok, "comment", matched.id as string, dmResult?.error?.message, profile.followStatus);
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
                    : (buttonIndex === "B2")
                    ? matchedTrigger.step4_button2_leads_to
                    : matchedTrigger.step4_button3_leads_to;

                nextStep = (leadsTo === "step6" || leadsTo === "step6_follower_only") ? 6 : 5;
                console.log(`🎯 [IG DM] Payload Match! Trigger ${triggerId}, Step 4, Button ${buttonIndex} (leads: ${leadsTo}) -> next ${nextStep}`);
            } else if (stepDetail === "S5") {
                const leadsTo = (buttonIndex === "B1")
                    ? matchedTrigger.step5_button1_leads_to
                    : (buttonIndex === "B2")
                    ? matchedTrigger.step5_button2_leads_to
                    : matchedTrigger.step5_button3_leads_to;

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
            const isChatTrigger = !t.trigger_source || t.trigger_source === 'chat_ig_fb';
            return isMatch && isChatTrigger;
        });

        if (matchedTrigger) {
            nextStep = 4;
            console.log(`✅ [IG DM] Matched base Keyword "${matchedTrigger.keyword}"! Starting sequence at Step 4.`);
        }
    }

    if (!matchedTrigger) {
        if (client.ig_autoreply_enabled && messageText) {
            const reply = await callRenataAI(senderId, messageText);
            if (reply) {
                const igToken = IG_ACCESS_TOKEN || token;
                const dmApiUrl = `https://graph.instagram.com/v22.0/${igUserId}/messages`;
                const sendRes = await fetch(dmApiUrl, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${igToken}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ recipient: { id: senderId }, message: { text: reply } })
                });
                const sendData = await sendRes.json();
                if (sendData.error) console.error(`[RENATA-IG] Send error: ${JSON.stringify(sendData.error)}`);
                else console.log(`[RENATA-IG] Replied to ${senderId}`);
            }
        }
        return;
    }

    const profile = await getMetaUserProfile(senderId, "instagram", token);
    const keyword = matchedTrigger.keyword as string;

    // log 1. Check Request
    console.log(`🚀 Keyword Focus Requested from instagram DM @${profile.username} status ${profile.followStatus}`);

    // log 2. matching
    console.log(`matching autochat_triggers exist ${keyword} and autochat_clients valid`);

    const payload = buildMessagePayload(matchedTrigger, "instagram", nextStep);
    const dmApiUrl = `https://graph.instagram.com/v22.0/${igUserId}/messages`;

    const res = await fetch(dmApiUrl, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: { id: senderId }, message: payload }),
    });

    const result = await res.json();
    if (!res.ok) {
        console.error("❌ META API ERROR (IG DM):", JSON.stringify(result, null, 2));
    }

    // log 3. Sent
    console.log(`Sent 🚀 sending dm {Step ${nextStep}}`);

    await logResult(ownerId, "instagram", profile.username, keyword, res.ok, "dm", matchedTrigger.id as string, result?.error?.message, profile.followStatus);
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

    const profile = await getMetaUserProfile(fromUserId, "facebook", token);
    const keyword = matched.keyword as string;

    // log 1. Check Request
    console.log(`🚀 Keyword Focus Requested from facebook @${profile.username} status ${profile.followStatus}`);

    // log 2. matching
    console.log(`matching autochat_triggers exist ${keyword} and autochat_clients valid`);

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

    const dmRes = await fetch(`https://graph.facebook.com/v22.0/${pageId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token, recipient: { comment_id: commentId }, message: finalPayload }),
    });

    const dmResult = await dmRes.json();

    // Reply to comment publicly
    const replies = [matched.comment_reply, matched.comment_reply_2, matched.comment_reply_3].filter(Boolean) as string[];
    const replyText = replies.length > 0 ? replies[Math.floor(Math.random() * replies.length)] : "Cek DM ya kak! 🚀";

    const replyRes = await fetch(`https://graph.facebook.com/v22.0/${commentId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText, access_token: token })
    });

    if (!replyRes.ok) console.error("❌ FB Comment Reply failed:", await replyRes.json());

    // log 3. Sent
    console.log(`Sent 🚀 Reply Comment ${replyText} sending dm {Step 4}`);

    await logResult(ownerId, "facebook", profile.username, keyword, dmRes.ok, "comment", matched.id as string, dmResult?.error?.message, profile.followStatus);
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
                    : (buttonIndex === "B2")
                    ? matchedTrigger.step4_button2_leads_to
                    : matchedTrigger.step4_button3_leads_to;

                nextStep = (leadsTo === "step6" || leadsTo === "step6_follower_only") ? 6 : 5;
                console.log(`🎯 [FB DM] Payload Match! Trigger ${triggerId}, Step 4, Button ${buttonIndex} (leads: ${leadsTo}) -> next ${nextStep}`);
            } else if (stepDetail === "S5") {
                const leadsTo = (buttonIndex === "B1")
                    ? matchedTrigger.step5_button1_leads_to
                    : (buttonIndex === "B2")
                    ? matchedTrigger.step5_button2_leads_to
                    : matchedTrigger.step5_button3_leads_to;

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
            const isChatTrigger = !t.trigger_source || t.trigger_source === 'chat_ig_fb';
            return isMatch && isChatTrigger;
        });

        if (matchedTrigger) {
            nextStep = 4;
            console.log(`✅ [FB DM] Matched base Keyword "${matchedTrigger.keyword}"! Starting sequence at Step 4.`);
        }
    }

    if (!matchedTrigger) {
        if (client.fb_autoreply_enabled && messageText) {
            const reply = await callRenataAI(senderId, messageText);
            if (reply) {
                await fetch(`https://graph.facebook.com/v22.0/${pageId}/messages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ recipient: { id: senderId }, message: { text: reply }, access_token: token })
                });
                console.log(`[RENATA-FB] Replied to ${senderId}`);
            }
        }
        return;
    }

    const profile = await getMetaUserProfile(senderId, "facebook", token);
    const keyword = matchedTrigger.keyword as string;

    // log 1. Check Request
    console.log(`🚀 Keyword Focus Requested from facebook DM @${profile.username} status ${profile.followStatus}`);

    // log 2. matching
    console.log(`matching autochat_triggers exist ${keyword} and autochat_clients valid`);

    const payload = buildMessagePayload(matchedTrigger, "facebook", nextStep);

    const res = await fetch(`https://graph.facebook.com/v22.0/${pageId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token, recipient: { id: senderId }, message: payload }),
    });

    const result = await res.json();
    if (!res.ok) {
        console.error("❌ META API ERROR (FB DM):", JSON.stringify(result, null, 2));
    }

    // log 3. Sent
    console.log(`Sent 🚀 sending dm {Step ${nextStep}}`);

    await logResult(ownerId, "facebook", profile.username, keyword, res.ok, "dm", matchedTrigger.id as string, result?.error?.message, profile.followStatus);
}

async function handleMetaLead(leadgenId: string, pageId: string, client: Record<string, unknown>) {
    const token = GLOBAL_META_TOKEN || (client.meta_access_token as string);
    if (!token) return;

    try {
        console.log(`🚀 [LEADGEN] Fetching Lead ID: ${leadgenId}`);
        const res = await fetch(`https://graph.facebook.com/v20.0/${leadgenId}?access_token=${token}`);
        const data = await res.json();

        if (data.error) {
            console.error("❌ META API ERROR (LeadGen):", data.error);
            return;
        }

        const fieldData: { name: string; values: string[] }[] = data.field_data || [];
        let name = "Unknown", email = "", phone = "";
        let surveyAnswers: Record<string, string> = {};

        // Parse Standard & Custom Fields
        for (const field of fieldData) {
            const fieldName = field.name.toLowerCase();
            const val = field.values[0] || "";
            if (fieldName.includes("name")) name = val;
            else if (fieldName.includes("email")) email = val;
            else if (fieldName.includes("phone")) phone = val;
            else {
                surveyAnswers[fieldName] = val;
            }
        }

        let q1 = "", q2 = "", q3 = "", q4 = "", q5 = "";
        const customKeys = Object.keys(surveyAnswers);
        if (customKeys.length > 0) q1 = surveyAnswers[customKeys[0]];
        if (customKeys.length > 1) q2 = surveyAnswers[customKeys[1]];
        if (customKeys.length > 2) q3 = surveyAnswers[customKeys[2]];
        if (customKeys.length > 3) q4 = surveyAnswers[customKeys[3]];
        if (customKeys.length > 4) q5 = surveyAnswers[customKeys[4]];

        // Insert into global_leads
        const { error } = await supabase.from('global_leads').insert({
            name: name,
            email: email,
            phone: phone,
            source: 'Meta Lead Ad Form',
            meta_lead_id: leadgenId,
            status: 'New',
            survey_q1: q1,
            survey_q2: q2,
            survey_q3: q3,
            survey_q4: q4,
            survey_q5: q5
        });

        if (error) console.error("❌ DB Insert Error (LeadGen):", error.message);
        else console.log(`✅ [LEADGEN] Lead inserted into global_leads: ${name} / ${phone}`);
    } catch (e: any) {
        console.error("❌ Exception (LeadGen):", e.message);
    }
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
    } catch {
        return new Response("Invalid JSON", { status: 400 });
    }

    if (body.object === "instagram" || body.object === "page") {
        for (const entry of body.entry) {
            const pageOrIgId = entry.id;

            let secondaryId = null;
            if (entry.messaging && entry.messaging[0]) {
                secondaryId = entry.messaging[0].recipient?.id;
            } else if (entry.changes && entry.changes[0]?.value) {
                secondaryId = entry.changes[0].value.from?.id;
            }

            // Fetch active clients matching either of the IDs found in the payload
            let query = supabase.from("autochat_clients").select("*");

            let filter = `meta_page_id.eq.${pageOrIgId},meta_instagram_id.eq.${pageOrIgId}`;
            if (secondaryId) {
                filter += `,meta_page_id.eq.${secondaryId},meta_instagram_id.eq.${secondaryId}`;
            }

            const { data: clients } = await query.or(filter);

            if (!clients || clients.length === 0) {
                continue;
            }

            for (const client of clients) {
                try {
                    // Fetch active triggers for this client
                    const { data: triggers } = await supabase
                        .from("autochat_triggers")
                        .select("*")
                        .eq("user_id", client.user_id)
                        .eq("is_active", true);

                    if (!triggers || triggers.length === 0) {
                        continue;
                    }

                    // 1. Process Comments
                    const changes = entry.changes || [];
                    for (let i = 0; i < changes.length; i++) {
                        const change = changes[i];
                        const val = change.value;
                        if (!val) continue;

                        if (change.field === "comments" && val.text && body.object === "instagram") {
                            const fromId = val.from?.id;
                            if (fromId) await handleIgComment(val.id, fromId, val.text, client, triggers);
                        } else if (change.field === "feed" && val.item === "comment" && val.verb === "add" && body.object === "page") {
                            const fromId = val.from?.id;
                            if (fromId && fromId !== pageOrIgId) {
                                await handleFbComment(val.comment_id, fromId, val.message, pageOrIgId, client, triggers);
                            }
                        } else if (change.field === "leadgen" && val.leadgen_id) {
                            await handleMetaLead(val.leadgen_id, pageOrIgId, client);
                        }
                    }

                    // 2. Process DMs
                    const messaging = entry.messaging || [];
                    for (let i = 0; i < messaging.length; i++) {
                        const msg = messaging[i];
                        const senderId = msg.sender?.id;

                        // Owner echo — handle /pause, /stop, /wait, /sebentar, /start, /silahkan
                        if (msg.message?.is_echo === true && msg.message?.text) {
                            const recipientId = msg.recipient?.id;
                            const echoCmd = msg.message.text.trim().toLowerCase();
                            if (!recipientId) continue;
                            if (echoCmd === '/pause' || echoCmd === '/stop' || echoCmd === '/wait' || echoCmd.includes('/sebentar')) {
                                await setMetaDmPaused(recipientId, true);
                                console.log(`[AUTOCHAT] AI PAUSED for ${recipientId}`);
                                continue;
                            }
                            if (echoCmd === '/start' || echoCmd.includes('/silahkan')) {
                                await setMetaDmPaused(recipientId, false);
                                console.log(`[AUTOCHAT] AI RESUMED for ${recipientId}`);
                                continue;
                            }
                            continue;
                        }

                        if (!senderId || senderId === pageOrIgId) continue;

                        if (await isMetaDmPaused(senderId)) {
                            console.log(`[AUTOCHAT] AI silent (paused) for ${senderId}`);
                            continue;
                        }

                        if (msg.message) {
                            const text = msg.message.text || "";
                            const payload = msg.message.quick_reply?.payload || msg.postback?.payload || null;
                            if (body.object === "instagram") await handleIgMessage(senderId, text, payload, client, triggers);
                            else await handleFbMessage(senderId, text, payload, pageOrIgId, client, triggers);
                        } else if (msg.postback) {
                            const payload = msg.postback.payload || null;
                            const title = msg.postback.title || "";
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
