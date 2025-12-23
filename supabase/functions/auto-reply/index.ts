// supabase/functions/renata/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.46.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT =
  "Your name is Renata. You are a friendly chatbot that provides warm welcomes and short, positive chats. Do not ask questions.";

function mask(str?: string | null, keep = 4) {
  if (!str) return "null";
  const visible = Math.min(keep, str.length);
  return `${str.slice(0, visible)}...len:${str.length}`;
}

function summarizeHeaders(headers: Headers) {
  const keys = ["authorization", "content-type", "x-client-info", "apikey", "origin"];
  const out: Record<string, string | null> = {};
  for (const k of keys) out[k] = headers.get(k);
  return out;
}

Deno.serve(async (req: Request) => {
  const reqId = crypto.randomUUID();
  const start = Date.now();
  console.info(`[renata] [${reqId}] START method=${req.method} url=${req.url}`);
  console.info(`[renata] [${reqId}] headers=`, summarizeHeaders(req.headers));

  if (req.method === "OPTIONS") {
    console.info(`[renata] [${reqId}] CORS preflight`);
    return new Response("ok", { headers: corsHeaders });
  }

  let reply = "";

  try {
    // Parse body
    let body: unknown = {};
    try {
      body = await req.json();
      console.info(`[renata] [${reqId}] body parsed OK`);
    } catch (e) {
      console.warn(`[renata] [${reqId}] body parse failed:`, e?.message || String(e));
      body = {};
    }

    const { messages } = (body || {}) as {
      messages?: Array<{ role: string; content: string }>;
    };
    console.info(
      `[renata] [${reqId}] messages present=${Array.isArray(messages)} count=${Array.isArray(messages) ? messages.length : 0}`,
    );

    if (!messages || !Array.isArray(messages)) {
      const res = { error: 'The "messages" array is required in the request body.' };
      console.warn(`[renata] [${reqId}] validation failed: missing messages`);
      return new Response(JSON.stringify(res), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Check secrets
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    console.info(
      `[renata] [${reqId}] env OPENAI_API_KEY=${OPENAI_API_KEY ? "present" : "MISSING"} SUPABASE_URL=${mask(SUPABASE_URL)} SERVICE_ROLE=${SERVICE_ROLE ? `present(${SERVICE_ROLE.length})` : "MISSING"}`,
    );

    if (!OPENAI_API_KEY) {
      const res = { error: "OPENAI_API_KEY is not set in project secrets." };
      console.error(`[renata] [${reqId}] missing OPENAI_API_KEY`);
      return new Response(JSON.stringify(res), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Build OpenAI request
    const fullMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];
    console.info(
      `[renata] [${reqId}] calling OpenAI model=gpt-4o-mini messages_count=${fullMessages.length}`,
    );

    const openAiPayload = {
      model: "gpt-4o-mini",
      messages: fullMessages,
      max_tokens: 350,
      temperature: 0.3,
    };

    // Do not log full content to avoid leaking PII; log lengths instead
    console.debug(
      `[renata] [${reqId}] openAI payload summary: ${JSON.stringify({
        model: openAiPayload.model,
        max_tokens: openAiPayload.max_tokens,
        temperature: openAiPayload.temperature,
        messages_count: openAiPayload.messages.length,
        first_user_message_length:
          openAiPayload.messages.find((m) => m.role === "user")?.content.length ?? 0,
      })}`,
    );

    const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(openAiPayload),
    });

    console.info(
      `[renata] [${reqId}] OpenAI response status=${aiResp.status} ok=${aiResp.ok}`,
    );

    if (!aiResp.ok) {
      const errorBody = await aiResp.text();
      console.error(
        `[renata] [${reqId}] OpenAI API request failed status=${aiResp.status} body=${errorBody}`,
      );
      return new Response(
        JSON.stringify({ error: `OpenAI API request failed: ${aiResp.status}` }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    const data = await aiResp.json().catch((e) => {
      console.error(`[renata] [${reqId}] OpenAI JSON parse error:`, e?.message || String(e));
      return {};
    });

    reply = ((data as any)?.choices?.[0]?.message?.content || "").trim();
    console.info(
      `[renata] [${reqId}] generated reply length=${reply.length} empty=${reply.length === 0}`,
    );

    // Insert bot reply into chat_messages
    if (reply) {
      const BOT_USER_ID = "3da83afb-aa8c-4c55-b3b0-8aa64000205f";

      if (!SUPABASE_URL || !SERVICE_ROLE) {
        console.error(
          `[renata] [${reqId}] missing Supabase admin credentials (URL or SERVICE_ROLE)`,
        );
      } else {
        console.info(
          `[renata] [${reqId}] initializing supabase admin client url=${mask(SUPABASE_URL)}`,
        );
        const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE);

        const insertPayload: Record<string, unknown> = {
          user_id: BOT_USER_ID,
          user_name: "Renata",
          user_level: 99,
          message: reply,
          channel_id: "community",
          is_pro: true,
          subscription_type: "lifetime",
        };

        console.debug(
          `[renata] [${reqId}] insert payload keys=${Object.keys(insertPayload).join(",")}`,
        );

        const { error: insertError } = await supabaseAdmin
          .from("chat_messages")
          .insert(insertPayload);

        if (insertError) {
          console.error(
            `[renata] [${reqId}] insert into chat_messages FAILED code=${insertError.code} details=${insertError.details} hint=${insertError.hint} message=${insertError.message}`,
          );
        } else {
          console.info(`[renata] [${reqId}] insert into chat_messages OK`);
        }
      }
    } else {
      console.warn(`[renata] [${reqId}] reply empty, skipping insert`);
    }

    const duration = Date.now() - start;
    console.info(`[renata] [${reqId}] END 200 duration_ms=${duration}`);
    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    const duration = Date.now() - start;
    console.error(
      `[renata] [${reqId}] FATAL error=${e?.message || String(e)} duration_ms=${duration}`,
    );
    return new Response(JSON.stringify({ error: e?.message || "Unexpected error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});