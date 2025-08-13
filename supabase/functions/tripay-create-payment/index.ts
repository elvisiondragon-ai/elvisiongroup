// In your Supabase function (tripay-create-payment/index.ts)

// ... inside the serve(async (req)=>{ ... }) block

const vpsProxyUrl = 'https://payment.elvisiongroup.com/create-payment'; // Use the correct endpoint
const tripayResponse = await fetch(vpsProxyUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-proxy-key': Deno.env.get("PROXY_API_KEY") ?? "" // Add this header
  },
  body: JSON.stringify(proxyPayload)
});

// ... rest of the function