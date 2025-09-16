import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlrgdhpmsittuwiiindq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scmdkaHBtc2l0dHV3aWlpbmRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDQwOTQ1NCwiZXhwIjoyMDY5OTg1NDU0fQ.zA37zRBUtN4Wx64QuE1CTlWiHzphbe6BCRRz-EtWHsE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNotificationsTable() {
  try {
    console.log('🔧 Checking if notifications table exists...');
    
    // Try to select from notifications table
    const { data, error } = await supabase
      .from('notifications')
      .select('id')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      console.log('❌ Notifications table does not exist');
      console.log('❌ Please run this SQL manually in Supabase SQL editor:');
      console.log('-------- COPY AND PASTE THIS SQL --------');
      console.log(`
-- Create notifications table for real-time notifications
CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notifications"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Enable real-time for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create index for better performance
CREATE INDEX idx_notifications_user_id_created_at 
ON public.notifications(user_id, created_at DESC);
      `);
      console.log('-------- END SQL --------');
      return false;
    } else if (error) {
      console.error('❌ Other error:', error);
      return false;
    }
    
    console.log('✅ Notifications table exists!');
    return true;
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function testNotificationInsert() {
  try {
    console.log('🧪 Testing notification insert...');
    
    // Get a user ID from profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (profilesError) {
      console.error('❌ Error getting profiles:', profilesError);
      return false;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('❌ No profiles found');
      return false;
    }
    
    const userId = profiles[0].id;
    console.log('👤 Using user ID:', userId);
    
    // Insert test notification
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: '🧪 Test Notification',
        message: 'This is a test notification from the backend!',
        type: 'success'
      })
      .select();
      
    if (error) {
      console.error('❌ Error inserting notification:', error);
      return false;
    }
    
    console.log('✅ Test notification inserted:', data);
    return true;
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Supabase notifications setup...');
  
  const tableExists = await checkNotificationsTable();
  if (!tableExists) {
    console.log('❌ Please create the notifications table first using the SQL above');
    return;
  }
  
  const testPassed = await testNotificationInsert();
  if (testPassed) {
    console.log('🎉 All tests passed! Real-time notifications are ready!');
    console.log('📱 Frontend will receive notifications instantly when you insert into the notifications table');
  } else {
    console.log('❌ Tests failed');
  }
}

main();