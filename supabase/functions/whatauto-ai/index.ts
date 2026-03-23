import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      throw new Error("Missing or invalid 'messages' array in request body");
    }

    const payload = {
      model: "gpt-4o-mini",
      messages: messages, // Rely strictly on the injected payload from server.js
      max_tokens: 1000,
      temperature: 0.8,
      top_p: 1
    };

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!openAiResponse.ok) {
      const errBody = await openAiResponse.text();
      throw new Error("OpenAI Error: " + errBody);
    }

    const data = await openAiResponse.json();
    const completion = data.choices[0].message?.content || "";

    return new Response(JSON.stringify({ reply: completion }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
