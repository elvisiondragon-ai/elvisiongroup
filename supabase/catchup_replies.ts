// Supabase removed to run locally
const IG_ACCESS_TOKEN = 'IGAANGEBxy0VJBZAFl6NXIzdDJiWnZAhYkZA0SnZAHbWZAvb0VKR185dFBNdUNnWHBwQjliUm9hZAWhuNFZAlc3dKakE3M21mUHFqbXktVGc4S3lGNjNNNzJuTzJiTktLUFNnUUZAIRk16LXpzTlB3ZAGtNQW0xZAFg3QXM1ZAWQyQmxlczBWQQZDZD';
const IG_USER_ID = '17841400529912607';

async function fetchRecentMedia() {
    console.log("Fetching recent media...");
    const url = `https://graph.instagram.com/v21.0/${IG_USER_ID}/media?fields=id,caption&access_token=${IG_ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
}

async function fetchCommentsForMedia(mediaId: string) {
    const url = `https://graph.instagram.com/v21.0/${mediaId}/comments?fields=id,text,from&access_token=${IG_ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
}

async function fetchRepliesForComment(commentId: string) {
    const url = `https://graph.instagram.com/v21.0/${commentId}/replies?access_token=${IG_ACCESS_TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data || [];
}

async function replyToComment(commentId: string, text: string) {
    const url = `https://graph.instagram.com/v21.0/${commentId}/replies`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${IG_ACCESS_TOKEN}`
        },
        body: JSON.stringify({ message: text })
    });

    if (res.ok) {
        console.log(`✅ Successfully replied to comment ${commentId}`);
    } else {
        const err = await res.json();
        console.error(`❌ Failed to reply:`, err);
    }
}

async function sendDM(commentId: string, text: string) {
    const url = `https://graph.instagram.com/v21.0/${IG_USER_ID}/messages`;

    const messagePayload = {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: [
                    {
                        title: text,
                        buttons: [
                            {
                                type: "web_url",
                                url: "https://ai.elvisiongroup.com/darkfeminine",
                                title: "AMBIL EBOOK GRATIS"
                            }
                        ]
                    }
                ]
            }
        }
    };

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${IG_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
            recipient: { comment_id: commentId },
            message: messagePayload
        })
    });

    if (res.ok) {
        console.log(`✅ Successfully sent DM to user`);
    } else {
        const err = await res.json();
        console.error(`❌ Failed to send DM:`, err);
    }
}

async function processMissedComments() {
    if (!IG_ACCESS_TOKEN) {
        console.error("Missing IG_ACCESS_TOKEN in env vars.");
        return;
    }

    const triggers = [{ keyword: 'mau' }];
    if (!triggers || triggers.length === 0) {
        console.log("No active triggers found.");
        return;
    }

    const mediaList = await fetchRecentMedia();
    console.log(`Found ${mediaList.length} recent media posts. Processing top 3...`);

    // Process top 3 most recent posts
    for (const media of mediaList.slice(0, 3)) {
        console.log(`\n--- Fetching comments for Media ID: ${media.id} ---`);
        const comments = await fetchCommentsForMedia(media.id);

        for (const comment of comments) {
            if (comment.from?.id === IG_USER_ID) continue; // Skip own comments

            const commentText = (comment.text || "").toLowerCase();
            const matchedTrigger = triggers.find(t => commentText.includes(t.keyword.toLowerCase()));

            if (matchedTrigger) {
                // Check if we already replied to this comment
                const replies = await fetchRepliesForComment(comment.id);
                const alreadyReplied = replies.some((reply: any) => reply.from?.id === IG_USER_ID);

                // Note: since we already replied earlier, let's just force send the DM to anyone who commented 'mau' in the last 10 comments
                // To avoid spamming everyone, we'll only send if we just replied OR we can just broadcast to all recent 'mau' commenters.
                // We'll broadcast the DM to all matched comments on these recent posts to ensure they get it.

                console.log(`Found trigger comment! ID: ${comment.id} | Text: "${comment.text}"`);
                console.log(`> Sending DM...`);
                await sendDM(comment.id, "Halo kak! Ini link Ebook Dark Feminine gratisnya. Mumpung belum dihapus, silakan diamankan ya 👇");
            }
        }
    }
    console.log("\nFinished processing missed comments.");
}

processMissedComments();
