// supabase/functions/renata/index.ts
import { createClient } from "npm:@supabase/supabase-js@2.46.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// System prompt for Renata
const SYSTEM_PROMPT =
  "Your name is Renata. You are a friendly chatbot that provides warm welcomes and short, positive chats. Do not ask questions.";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { messages } = body as { messages?: Array<{ role: string; content: string }> };

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'The "messages" array is required in the request body.' }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "OPENAI_API_KEY is not set in project secrets." }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const fullMessages = [{ role: "system", content: SYSTEM_PROMPT }, ...messages];

    const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: fullMessages,
        max_tokens: 350,
        temperature: 0.3,
      }),
    });

    if (!aiResp.ok) {
      const errorBody = await aiResp.text();
      console.error("OpenAI API request failed", aiResp.status, errorBody);
      return new Response(JSON.stringify({ error: `OpenAI API request failed: ${aiResp.status}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const data = await aiResp.json();
    const reply = (data?.choices?.[0]?.message?.content || "").trim();

    // Insert bot reply into chat_messages using service role (bypasses RLS)
    if (reply) {
      const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
      const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
      const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE);

      const BOT_USER_ID = "3da83afb-aa8c-4c55-b3b0-8aa64000205f";

      // Only include columns that exist in chat_messages
      const insertPayload: Record<string, unknown> = {
        user_id: BOT_USER_ID,
        user_name: "Renata",
        user_level: 99,
        message: reply,
        channel_id: "community",
        is_pro: true,
        subscription_type: "lifetime",
        // created_at will default to now() if column default exists; include if you need a custom time:
        // created_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabaseAdmin
        .from("chat_messages")
        .insert(insertPayload);

      if (insertError) {
        console.error("Failed to insert bot message into chat_messages:", insertError);
        // Do not fail the HTTP response, just return the reply
      }
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e: any) {
    console.error("Function error:", e?.message || e);
    return new Response(JSON.stringify({ error: e?.message || "Unexpected error" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});