// creator-api: Accepts product image (and optional avatar) + prompt.
// 1. Uploads images to 'creator' bucket.
// 2. Uses google/gemini-2.5-flash-image (eL Vision V1) for direct Image-to-Image transformation.
// 3. Uploads result to 'creator' bucket.
// 4. Returns the result URL.

import { createClient } from "npm:@supabase/supabase-js@2.46.1";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") || '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';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const BUCKET = 'creator'; 

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper: Generate filename
function generateFilename(ext: string = 'jpg'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `creator/${timestamp}-${random}.${ext}`;
}

// Helper: Upload to Supabase
async function uploadToSupabase(bucket: string, path: string, file: File | Blob, contentType: string) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: false
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Parse Multipart Form Data
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      throw new Error('Content-Type must be multipart/form-data');
    }

    const formData = await req.formData();
    const productFile = formData.get('product') as File;
    const avatarFile = formData.get('avatar') as File | null;
    const userPrompt = formData.get('prompt') as string || 'Make it beautiful';

    if (!productFile) {
      throw new Error('Product image is required');
    }

    console.log(`Processing request: ${userPrompt}`);

    // 2. Upload Input Images
    const productExt = productFile.type.split('/')[1] || 'jpg';
    const productUrl = await uploadToSupabase(
      BUCKET, 
      generateFilename(productExt), 
      productFile, 
      productFile.type || 'image/jpeg'
    );
    console.log('Product uploaded:', productUrl);

    let avatarUrl = null;
    if (avatarFile) {
      const avatarExt = avatarFile.type.split('/')[1] || 'jpg';
      avatarUrl = await uploadToSupabase(
        BUCKET, 
        generateFilename(avatarExt), 
        avatarFile, 
        avatarFile.type || 'image/jpeg'
      );
      console.log('Avatar uploaded:', avatarUrl);
    }

    // 3. Generate Image with Gemini 2.5 Flash Image (Direct Img2Img)
    console.log('Generating image with google/gemini-2.5-flash-image...');
    
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: userPrompt
          },
          {
            type: 'image_url',
            image_url: { url: productUrl }
          },
          ...(avatarUrl ? [{ type: 'image_url', image_url: { url: avatarUrl } }] : [])
        ]
      }
    ];

    const generationResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://elvisiongroup.com',
        'X-Title': 'eL Vision Creator',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image', 
        messages: messages,
        // Optional: specific parameters if needed, but standard chat often suffices
      })
    });

    if (!generationResponse.ok) {
      const errText = await generationResponse.text();
      console.error(`Generation failed with status ${generationResponse.status}:`, errText);
      throw new Error(`Generation failed: ${errText}`);
    }

    const generationData = await generationResponse.json();
    console.log('Generation Data:', JSON.stringify(generationData));
    
    // Extract Image URL or Base64
    let finalImageUrl = '';

    // Check for standard OpenRouter/OpenAI image response format (often in content for Flux, or images array for others)
    // 1. Check for `images` array (common for generation models on OpenRouter)
    if (generationData.choices?.[0]?.message?.images?.[0]?.image_url?.url) {
        finalImageUrl = generationData.choices[0].message.images[0].image_url.url;
    } 
    // 2. Check for Markdown image in content
    else if (generationData.choices?.[0]?.message?.content) {
        const rawContent = generationData.choices[0].message.content;
        const match = rawContent.match(/\!\[.*?\]\((.*?)\)/);
        if (match && match[1]) {
            finalImageUrl = match[1];
        } else if (rawContent.startsWith('http')) {
            finalImageUrl = rawContent;
        } else if (rawContent.startsWith('data:image')) {
            finalImageUrl = rawContent;
        }
    }

    if (!finalImageUrl) {
        console.error("No image found in response", generationData);
        throw new Error("No image URL found in generation response.");
    }

    console.log('Generated Image URL (External):', finalImageUrl);

    // 4. Download and Upload to Our Storage (to persist it)
    let imageBlob: Blob;
    let resultFilename: string;

    if (finalImageUrl.startsWith('data:image')) {
        // Handle Base64
        const response = await fetch(finalImageUrl);
        imageBlob = await response.blob();
        resultFilename = generateFilename('png');
    } else {
        // Handle URL
        const imageDownload = await fetch(finalImageUrl);
        if (!imageDownload.ok) throw new Error("Failed to download generated image");
        imageBlob = await imageDownload.blob();
        resultFilename = generateFilename('webp'); // Usually webp or png
    }
    
    const resultUrl = await uploadToSupabase(
        BUCKET, 
        resultFilename, 
        imageBlob, 
        imageBlob.type
    );

    console.log('Final Result URL:', resultUrl);

    return new Response(JSON.stringify({ 
      success: true, 
      resultUrl: resultUrl,
      prompt: userPrompt // Return original prompt as we didn't generate an intermediate one
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});