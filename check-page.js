const FB_TOKEN = process.env.FB_PAGE_TOKEN;

async function check() {
  const res = await fetch(`https://graph.facebook.com/v21.0/me/subscribed_apps?access_token=${FB_TOKEN}`);
  const data = await res.json();
  console.log("Subscribed Apps:", JSON.stringify(data, null, 2));
}

check();
