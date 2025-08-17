import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// URL endpoint VPS Anda
const ENDPOINT = "https://payment.elvisiongroup.com/api/create-payment";
const ACCESS_KEY = Deno.env.get("AKSES_CURL") || "";
const SIGNA1 = Deno.env.get("SIGNA1") || "";
const SIGNA2 = Deno.env.get("SIGNA2") || "";

// Fungsi generate signature HMAC-SHA256
async function generateSignature(payload: object, keyString: string) {
  const encoder = new TextEncoder();
  const key = encoder.encode(keyString);
  const data = encoder.encode(JSON.stringify(payload));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, data);
  return Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  console.log("Received request:", req.method, req.url);

  // Handler untuk CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-access-key, x-callback-signature",
      },
    });
  }

  if (req.method !== "POST") {
    console.log("Method not allowed");
    return new Response("Only POST allowed", { status: 405 });
  }

  const payload = await req.json();
  console.log("Payload:", payload);

  // Pilih key sesuai kebutuhan (misal: SIGNA1 default, SIGNA2 jika payload.pakai2)
  let keyToUse = SIGNA1;
  if (payload.pakai2) keyToUse = SIGNA2;
  console.log("Using key:", keyToUse === SIGNA1 ? "SIGNA1" : "SIGNA2");

  const signature = await generateSignature(payload, keyToUse);
  console.log("Generated signature:", signature);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-key": ACCESS_KEY,
        "x-callback-signature": signature,
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('VPS Response:', text);

    return new Response(text, {
      status: res.status,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Fetch to VPS failed:", err);
    return new Response("VPS fetch error", { status: 500 });
  }
});
