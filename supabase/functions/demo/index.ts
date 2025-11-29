// Use pinned npm specifier (no bare imports)
import OpenAI from "npm:openai@4.67.3";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
Deno.serve(async (req)=>{
  // Required: path must start with /demo for routing
  const { pathname } = new URL(req.url);
  if (!pathname.startsWith("/demo")) {
    return new Response(JSON.stringify({
      error: "Not Found"
    }), {
      status: 404,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
  // Handle preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method Not Allowed"
    }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
  const { message } = await req.json().catch(()=>({}));
  if (!message) {
    return new Response(JSON.stringify({
      error: "Message is required"
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY")
  });
  try {
    const completion = await openai.chat.completions.create({
      // gpt-3.5-turbo is deprecated; use a current small model
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Renata, an AI assistant for DEV elvisiongroup. You can build and create all apps users want. You are helping a user with a free demo. All work is done in 24 hours, starting from $100. You were made by eL Vision Group."
        },
        {
          role: "user",
          content: message
        }
      ]
    });
    const botMessage = completion.choices[0]?.message?.content?.trim();
    if (botMessage) {
      return new Response(JSON.stringify({
        message: botMessage
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    } else {
      return new Response(JSON.stringify({
        error: "Failed to get response from AI"
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({
      error: "Failed to get response from AI"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
