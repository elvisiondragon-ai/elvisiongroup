-- SIMPLE 3-LINE CHAT FIX

-- Fix 1: Allow anyone to read chat messages
CREATE POLICY "chat_read" ON chat_messages FOR SELECT USING (true);

-- Fix 2: Allow authenticated users to insert messages  
CREATE POLICY "chat_insert" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix 3: Allow users to delete their own messages
CREATE POLICY "chat_delete" ON chat_messages FOR DELETE USING (auth.uid() = user_id);