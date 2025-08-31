// Test broadcast notification to identify the issue
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://nlrgdhpmsittuwiiindq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role key for admin operations

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.log('Set it with: export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testBroadcast() {
  console.log('🔧 Testing broadcast notification system...\n');

  try {
    // First, check if tables exist and get user count
    console.log('1. Checking profiles table...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, user_id, display_name')
      .limit(5);
    
    if (profilesError) {
      console.error('❌ Error checking profiles:', profilesError);
      return;
    }
    
    console.log(`✅ Found ${profiles?.length || 0} profiles in sample`);
    if (profiles && profiles.length > 0) {
      console.log('Sample profiles:', profiles.map(p => ({ id: p.id, user_id: p.user_id, name: p.display_name })));
    }

    // Check notifications table
    console.log('\n2. Checking notifications table...');
    const { data: notifications, error: notifError } = await supabase
      .from('notifications')
      .select('id, user_id, title')
      .limit(3);
    
    if (notifError) {
      console.error('❌ Error checking notifications:', notifError);
      return;
    }
    
    console.log(`✅ Notifications table accessible, found ${notifications?.length || 0} recent notifications`);

    // Test the problematic query
    console.log('\n3. Testing broadcast INSERT query...');
    const testTitle = '🧪 TEST BROADCAST';
    const testMessage = 'Test broadcast message - ' + new Date().toLocaleString();
    
    // Method 1: Direct SQL approach (what user tried)
    console.log('Method 1: Raw SQL INSERT with SELECT...');
    try {
      const { data: rawResult, error: rawError } = await supabase.rpc('sql', {
        query: `INSERT INTO notifications (user_id, title, message, type)
                SELECT user_id, $1, $2, 'info' FROM profiles`,
        params: [testTitle, testMessage]
      });
      
      console.log('Raw SQL result:', rawResult);
      if (rawError) {
        console.error('❌ Raw SQL failed:', rawError);
      }
    } catch (err) {
      console.log('Raw SQL method not available, trying alternative...');
    }

    // Method 2: Get all user_ids first, then insert individually
    console.log('\nMethod 2: Get users and insert individually...');
    const { data: allProfiles, error: getAllError } = await supabase
      .from('profiles')
      .select('user_id');
    
    if (getAllError) {
      console.error('❌ Error getting all profiles:', getAllError);
      return;
    }
    
    console.log(`✅ Found ${allProfiles?.length || 0} total users`);
    
    if (allProfiles && allProfiles.length > 0) {
      // Create notifications for all users
      const notificationData = allProfiles.map(profile => ({
        user_id: profile.user_id,
        title: testTitle + ' (Method 2)',
        message: testMessage + ' via individual inserts',
        type: 'success'
      }));
      
      console.log(`Inserting ${notificationData.length} notifications...`);
      
      const { data: insertResult, error: insertError } = await supabase
        .from('notifications')
        .insert(notificationData);
      
      if (insertError) {
        console.error('❌ Batch insert failed:', insertError);
      } else {
        console.log('✅ Batch insert successful!');
        console.log('Insert result:', insertResult);
      }
    }

    // Method 3: Try with RPC function
    console.log('\nMethod 3: Creating RPC function for broadcast...');
    
    // Create the RPC function
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION broadcast_notification(
        notification_title text,
        notification_message text,
        notification_type text DEFAULT 'info'
      )
      RETURNS integer
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        inserted_count integer;
      BEGIN
        INSERT INTO notifications (user_id, title, message, type)
        SELECT user_id, notification_title, notification_message, notification_type 
        FROM profiles
        WHERE user_id IS NOT NULL;
        
        GET DIAGNOSTICS inserted_count = ROW_COUNT;
        RETURN inserted_count;
      END;
      $$;
    `;
    
    const { error: createFuncError } = await supabase.rpc('sql', {
      query: createFunctionSQL
    }).catch(() => {
      // Try alternative method to create function
      return supabase.from('_sql').select('*').eq('query', createFunctionSQL);
    });
    
    if (createFuncError) {
      console.log('⚠️  Could not create RPC function via client');
      console.log('Please create this function manually in Supabase SQL Editor:');
      console.log(createFunctionSQL);
    } else {
      console.log('✅ RPC function created successfully');
      
      // Test the RPC function
      const { data: rpcResult, error: rpcError } = await supabase
        .rpc('broadcast_notification', {
          notification_title: testTitle + ' (RPC)',
          notification_message: testMessage + ' via RPC function',
          notification_type: 'warning'
        });
      
      if (rpcError) {
        console.error('❌ RPC broadcast failed:', rpcError);
      } else {
        console.log(`✅ RPC broadcast successful! Inserted ${rpcResult} notifications`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testBroadcast().then(() => {
  console.log('\n🏁 Test completed');
}).catch(console.error);