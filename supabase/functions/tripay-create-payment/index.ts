import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Ambil environment variable dari secret keys Supabase
const ENDPOINT = Deno.env.get("URL_PAYMENT") || "https://payment.elvisiongroup.com/api/create-payment";
const ACCESS_KEY = Deno.env.get("AKSES_CURL") || "";
const SIGNA1 = Deno.env.get("SIGNA1") || "";
const SIGNA2 = Deno.env.get("SIGNA2") || "";

// Fungsi untuk generate signature HMAC-SHA256
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
  if (req.method !== "POST") {
    return new Response("Only POST allowed", { status: 405 });
  }

  const payload = await req.json();

  // Pilih key yang akan dipakai (misal: gunakan SIGNA1 jika ada field "pakai1" di payload, SIGNA2 jika ada "pakai2")
  let keyToUse = SIGNA1;
  if (payload.pakai2) keyToUse = SIGNA2;

  const signature = await generateSignature(payload, keyToUse);

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
  return new Response(text, { status: res.status });
});
