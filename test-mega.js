const token = "EAARivNfjDnEBQ4T5clZCkxQFwLWwZAvEKt2OhVHcKpcORLSZAAZACjfyrMQhN75yiyyhpNlmcHFCo14ZBKHjHnWOLDlfXQSMeLltPa2aZCqJE0LKzVkDoIH4jYtZCGAxN5a8BT7eL55cI7NCoUyZAIxXa4ItUDc1vrc6kDCdonZAW5YTWQYdnilWXppwEHvThxr19fwINlCYTUfltPggeGuopZBb6ZAaxUhkaq5tWENq5OVOpIgjpsqZCTIoxyqvJ9l3gQRJ9P9uw3UVpoWB8x83ZBQf5gwZDZD";
const pageId = "518894044637696"; 
const myUserId = "26047262674890797"; 
const igAccountId = "17841400529912607"; 

async function runMissingTests() {
  console.log("🚀 Firing Specific Endpoints for Missing 6 Requirements...");

  try {
    console.log("\n📖 1. Mocking pages_read_user_content...");
    let userContentRes = await fetch(`https://graph.facebook.com/v21.0/${pageId}/visitor_posts?access_token=${token}`);
    let userContentData = await userContentRes.json();
    console.log("Visitor Posts:", userContentData.data?.length || 0);

    console.log("\n💬 2. Mocking pages_messaging...");
    let convRes = await fetch(`https://graph.facebook.com/v21.0/${pageId}/conversations?access_token=${token}`);
    let convData = await convRes.json();
    console.log("Conversations found:", convData.data?.length || 0);
    
    let msgRes = await fetch(`https://graph.facebook.com/v21.0/${pageId}/messages`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token, recipient: { id: myUserId }, message: { text: "Ping" } })
    });
    console.log("Message Send Result:", (await msgRes.json()).error?.message || "Success");

    console.log("\n📸 3. Mocking pages_manage_posts (Posting a photo)...");
    let photoRes = await fetch(`https://graph.facebook.com/v21.0/${pageId}/photos`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token, url: "https://via.placeholder.com/150", published: false })
    });
    console.log("Photo Post Result:", (await photoRes.json()).id ? "Success" : "Failed");

    console.log("\n👍 4. Mocking pages_manage_engagement (Liking a post)...");
    let feedRes = await fetch(`https://graph.facebook.com/v21.0/${pageId}/feed?limit=1&access_token=${token}`);
    let latestPostId = (await feedRes.json()).data?.[0]?.id;
    if (latestPostId) {
       let likeRes = await fetch(`https://graph.facebook.com/v21.0/${latestPostId}/likes`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ access_token: token })
       });
       console.log("Like Result:", (await likeRes.json()).success ? "Success" : "Failed");
    }

    console.log("\n📥 5. Mocking instagram_content_publish (Creating media container)...");
    let igMediaRes = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: token, image_url: "https://via.placeholder.com/150", caption: "Test App Review" })
    });
    console.log("IG Media Container:", (await igMediaRes.json()).id ? "Created" : "Failed");

    console.log("\n💬 6. Mocking instagram_manage_comments (Fetching comments)...");
    let igPosts = await fetch(`https://graph.facebook.com/v21.0/${igAccountId}/media?access_token=${token}`).then(r=>r.json());
    if (igPosts.data?.[0]?.id) {
       let igComments = await fetch(`https://graph.facebook.com/v21.0/${igPosts.data[0].id}/comments?access_token=${token}`).then(r=>r.json());
       console.log("IG Comments found:", igComments.data?.length || 0);
       
       let newIgComment = await fetch(`https://graph.facebook.com/v21.0/${igPosts.data[0].id}/comments`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: token, message: "Testing IG Comments API" })
       });
       console.log("IG Comment Post:", (await newIgComment.json()).id ? "Success" : "Failed");
    }

    console.log("\n✅ Finished all 6 targeted endpoints!");
  } catch(e) { console.error(e); }
}
runMissingTests();
