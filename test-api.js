const fetch = require("node-fetch");
const token = "EAARivNfjDnEBQZBIDDjkfxAzF8OFBRuysdpsttRZAjLv6pgU0VRYjbgr8DtWMS2JZAmWVY31hZAAHpRPU7SVZCuMNOYtGYlT3EfsCFxZAHthw0TMAJRuxPweoPVHNd1A9QxpXK9f90FmKSJGyGbhI1lGT4fZCMRmJq4ydHmMLn6V159O8WovXqvTpLCtmT7E2KKMDoOm62GBmFevENRx5cRfB6n5ujjZBid8aiwc9rYYHqSZCdgb1WDTu85ykYmyme3Brum20KjVWTT8y";
const pageId = "518894044637696"; 
const myUserId = "26047262674890797"; 

async function triggerApiTests() {
  console.log("🚀 Starting API tests...");

  // 1. pages_read_engagement
  let res1 = await fetch(`https://graph.facebook.com/v21.0/${pageId}?fields=id,name,engagement&access_token=${token}`);
  console.log("Read Page:", await res1.json());
  
  let res2 = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed?limit=2&access_token=${token}`);
  console.log("Read Feed:", (await res2.json()).data?.length);

  // 2. business_management
  let res3 = await fetch(`https://graph.facebook.com/v21.0/me/businesses?access_token=${token}`);
  console.log("Businesses:", await res3.json());

  // 3. pages_messaging
  let res4 = await fetch(`https://graph.facebook.com/v21.0/${pageId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_token: token,
      recipient: { id: myUserId },
      message: { text: "API Test Message" }
    })
  });
  console.log("Send Message Result:", await res4.json());
}
triggerApiTests().catch(console.error);
