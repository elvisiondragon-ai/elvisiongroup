**To:** support@supabase.io

**Subject:** postgres_changes not working but broadcast works fine

---

Hey,

My postgres_changes listeners aren't firing at all in my project. Broadcast events work perfectly, but postgres_changes callbacks never trigger.

I've checked everything:
- Replication slots are active ✅
- chat_messages is in supabase_realtime publication ✅
- Replica identity is FULL ✅
- RLS has SELECT policy ✅
- Channel connects successfully ✅

Tested with:
- Regular INSERT listener - doesn't fire
- Wildcard event: '*' listener - doesn't fire
- Inserts via UI - doesn't fire
- Inserts via SQL Editor - doesn't fire

My code:
```javascript
const channel = supabase.channel('chat-community');
channel.on('postgres_changes', {
  event: 'INSERT',
  schema: 'public',
  table: 'chat_messages'
}, (payload) => {
  console.log('Got it:', payload); // NEVER LOGS
});
channel.subscribe(); // Connects fine
```

Meanwhile, broadcast works perfectly:
```javascript
channel.on('broadcast', { event: 'message_added' }, (payload) => {
  console.log('Got it:', payload); // WORKS ✅
});
```

Can you check if there's something disabled at the project level?

**Project ID:** [YOUR PROJECT ID]
**Table:** public.chat_messages

Thanks!
