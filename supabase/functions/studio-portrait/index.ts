// studio-portrait: accepts multipart/form-data with multiple `images` files.
// 1. Uploads all sample images into public `samplebooth` bucket.
// 2. Sends public URLs of samples + text prompt + model to OpenRouter for generation.
// 3. Uploads the final generated image into `booth` bucket.
// 4. Returns { transformed: [processed_public_url] }
import { createClient } from "npm:@supabase/supabase-js@2.46.1";
// --- KONFIGURASI ---
const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const SAMPLE_BUCKET = 'samplebooth'; // Bucket untuk menyimpan gambar sampel dari user
const OUTPUT_BUCKET = 'booth'; // Bucket untuk menyimpan hasil gambar akhir
const DEFAULT_PROMPT = 'Ultra realistic studio portrait retouch based on the sample photos. Preserve the subject’s facial identity, gender, and ethnicity from the sample images. Enhance lighting, professional attire, and a neutral studio background. Do not change the person\'s core features.';
// Model default jika tidak ada yang dikirim dari client
const DEFAULT_MODEL = 'google/gemini-2.5-flash-image'; // eL Vision V1
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
// --- FUNGSI HELPER ---
function randSuffix(len = 6) {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes).map((b)=>b.toString(16).padStart(2, '0')).join('');
}
function filenameFor(contentType, prefix = 'images') {
  const ts = Date.now();
  const ext = contentType.split('/')[1] || 'jpg';
  return `${prefix}/${ts}-${randSuffix(4)}.${ext}`;
}
async function readMultipartData(req) {
  const ct = req.headers.get('content-type') || '';
  if (!ct.toLowerCase().includes('multipart/form-data')) return null;
  const form = await req.formData();
  // Mengambil SEMUA file yang dikirim dengan nama field 'images'
  const files = form.getAll('images').filter((val)=>val instanceof File);
  const prompt = form.get('prompt')?.toString() || DEFAULT_PROMPT;
  const model = form.get('model')?.toString() || null; // Ambil model dari form
  const rawMessages = form.get('messages')?.toString();
  return {
    files,
    prompt,
    model,
    rawMessages
  };
}
// Membangun payload permintaan untuk OpenRouter dengan multiple image URLs
function buildChatRequestMessages(prompt, sampleUrls) {
  const imageContent = sampleUrls.map((url)=>({
      type: 'image_url',
      image_url: {
        url
      }
    }));
  return [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: prompt
        },
        ...imageContent
      ]
    }
  ];
}
// Fungsi untuk mengekstrak gambar (base64) dari respons JSON OpenRouter
async function extractImageFromResponse(json) {
  if (json?.choices?.[0]?.message?.images?.[0]?.image_url?.url) {
    const dataUrl = json.choices[0].message.images[0].image_url.url;
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
      const [header, base64] = dataUrl.split(',');
      const contentType = header.replace('data:', '').replace(';base64', '');
      const bin = atob(base64);
      const bytes = new Uint8Array(bin.length);
      for(let i = 0; i < bin.length; i++){
        bytes[i] = bin.charCodeAt(i);
      }
      return {
        bytes,
        contentType
      };
    }
  }
  return null;
}
// --- FUNGSI UTAMA TRANSFORMASI ---
async function generateWithOpenRouter(prompt, sampleImageUrls, requestedModel) {
  if (!OPENROUTER_API_KEY) {
    console.error("OPENROUTER_API_KEY is not set.");
    return null;
  }
  if (sampleImageUrls.length === 0) {
    console.error("No sample images provided for generation.");
    return null;
  }
  // Gunakan model yang diminta, atau fallback ke env var, atau ke default
  const model = requestedModel || Deno.env.get('OPENROUTER_IMAGE_MODEL') || DEFAULT_MODEL;
  const requestBody = {
    model,
    messages: buildChatRequestMessages(prompt, sampleImageUrls),
    modalities: [
      'image',
      'text'
    ],
    stream: false
  };
  console.info('OpenRouter request prepared', {
    model,
    sampleCount: sampleImageUrls.length
  });
  try {
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    if (!resp.ok) {
      const text = await resp.text();
      console.error('OpenRouter API call failed', {
        status: resp.status,
        text
      });
      return null;
    }
    const json = await resp.json();
    const extracted = await extractImageFromResponse(json);
    if (extracted) {
      console.info('OpenRouter generation succeeded', {
        model,
        bytes: extracted.bytes.length
      });
      return {
        ...extracted,
        model
      };
    } else {
      console.warn('OpenRouter response did not contain a valid image', {
        preview: JSON.stringify(json).slice(0, 500)
      });
      return null;
    }
  } catch (err) {
    console.error('Error calling OpenRouter', {
      message: err?.message
    });
    return null;
  }
}
// --- SERVER UTAMA ---
console.info('Studio-portrait function started (multi-sample mode)');
Deno.serve(async (req)=>{
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    const multipartData = await readMultipartData(req);
    if (!multipartData || multipartData.files.length === 0) {
      return new Response(JSON.stringify({
        error: 'Missing images. Send multipart/form-data with one or more file fields named `images`.'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const { files, prompt, model } = multipartData; // Ambil model di sini
    console.info(`Received ${files.length} sample images for processing. Model: ${model || 'default'}`);
    // 1. Upload semua gambar sampel ke bucket 'samplebooth'
    const uploadPromises = files.map(async (file)=>{
      const filePath = filenameFor(file.type, 'samples');
      const { error } = await supabaseService.storage.from(SAMPLE_BUCKET).upload(filePath, file, {
        contentType: file.type,
        upsert: false
      });
      if (error) throw new Error(`Failed to upload sample: ${error.message}`);
      const { data } = supabaseService.storage.from(SAMPLE_BUCKET).getPublicUrl(filePath);
      return data.publicUrl;
    });
    const sampleImageUrls = await Promise.all(uploadPromises);
    console.info('All sample images uploaded to Supabase Storage.', {
      urls: sampleImageUrls
    });
    // 2. Gunakan URL publik untuk menghasilkan gambar baru via OpenRouter
    // Teruskan 'model' yang diminta ke fungsi generate
    const transformed = await generateWithOpenRouter(prompt, sampleImageUrls, model);
    if (!transformed?.bytes?.length) {
      throw new Error('Image generation failed or returned no data.');
    }
    // 3. Upload gambar hasil ke bucket 'booth'
    const processedPath = filenameFor(transformed.contentType, 'images/processed');
    const { error: upProcError, data: upProcData } = await supabaseService.storage.from(OUTPUT_BUCKET).upload(processedPath, transformed.bytes, {
      contentType: transformed.contentType
    });
    if (upProcError) {
      throw new Error(`Failed to upload processed image: ${upProcError.message}`);
    }
    const { data: pubProc } = supabaseService.storage.from(OUTPUT_BUCKET).getPublicUrl(upProcData.path);
    const processedUrl = pubProc.publicUrl;
    const payload = {
      transformed: [
        processedUrl
      ]
    };
    console.info('Successfully generated and stored new portrait.', payload);
    return new Response(JSON.stringify(payload), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (err) {
    console.error('Unhandled error in studio-portrait function', {
      message: err?.message,
      stack: err?.stack
    });
    return new Response(JSON.stringify({
      error: err?.message ?? 'Unexpected server error'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
