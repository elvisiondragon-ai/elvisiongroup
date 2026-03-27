import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { path } = await req.json()

    if (!path) {
      throw new Error('Path is required')
    }

    // The API key is securely stored here on the server side
    const API_KEY = Deno.env.get('API_CO_ID_KEY') ?? 'Z1dEDOcKUpcBsyyaYNTfnD2TtrmOwT3CRNXhGaU9rtFUGrbUr0'
    const TARGET_URL = `https://api.co.id/indonesia${path}`

    console.log(`[api-regional] Fetching ${TARGET_URL}`)

    const response = await fetch(TARGET_URL, {
      method: 'GET',
      headers: {
        'x-api-co-id': API_KEY,
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`[api-regional] Error from API.co.id: ${response.status} ${response.statusText}`)
      const errorText = await response.text()
      console.error(`[api-regional] Error details: ${errorText}`)
      throw new Error(`Failed to fetch from api.co.id: ${response.status}`)
    }

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('[api-regional] Exception:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})