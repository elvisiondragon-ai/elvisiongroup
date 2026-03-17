import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Mailketing API configuration  
const MAILKETING_API_URL = Deno.env.get('MAILKETING_API_URL') || 'https://api.mailketing.co.id/api/v1';
const MAILKETING_API_KEY = Deno.env.get('MAILKETING_API_KEY') || '1858bc5ce747873d3eab0334c055cb9a';
const MAILKETING_EMAIL = Deno.env.get('MAILKETING_EMAIL') || 'support@elvisiongroup.com';

// Send expiry warning email
async function sendExpiryWarningEmail(email, name, daysRemaining) {
  try {
    console.log(`📧 Sending expiry warning email to: ${email} (${daysRemaining} days remaining)`);
    
    const subject = `⚠️ Langganan Pro Anda Akan Berakhir ${daysRemaining} Hari Lagi!`;
    const htmlContent = `
      <div style="width: 90%; max-width: none; margin: 0 auto; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: 15px; overflow: hidden;">
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px 15px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 700;">⚠️ Perhatian!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Langganan Pro Anda akan berakhir ${daysRemaining} hari lagi</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 20px 15px; border-radius: 0 0 15px 15px;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 22px;">Halo ${name}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin: 0 0 15px 0; font-size: 16px;">
            Kami ingin mengingatkan bahwa langganan Pro ElVision Group Anda akan berakhir dalam ${daysRemaining} hari.
          </p>
          
          <!-- Benefits Reminder -->
          <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #ffa000; margin: 15px 0; border-radius: 10px;">
            <h3 style="color: #333; margin: 0 0 12px 0; font-size: 18px;">💎 Jangan lewatkan akses Pro:</h3>
            <ul style="color: #856404; line-height: 1.6; margin: 0; padding-left: 18px; font-size: 15px;">
              <li>Verse lengkap tanpa batas</li>
              <li>Audio therapy premium</li>
              <li>Fitur AI spiritual advanced</li>
              <li>Spiritual journal unlimited</li>
              <li>Konten eksklusif Pro member</li>
            </ul>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://app.elvisiongroup.com" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              🚀 Perpanjang Sekarang
            </a>
          </div>
          
          <!-- Footer -->
          <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Butuh bantuan? Hubungi kami di <a href="mailto:support@elvisiongroup.com" style="color: #667eea; text-decoration: none;">support@elvisiongroup.com</a>
            </p>
          </div>
        </div>
      </div>
    `;

    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY,
      email: MAILKETING_EMAIL,
      from_name: 'Support eL Vision Group',
      from_email: 'support@elvisiongroup.com',
      recipient: email,
      subject: subject,
      content: htmlContent
    });

    const mailketingParams = {
      api_token: MAILKETING_API_KEY,
      email: MAILKETING_EMAIL,
      from_name: 'Support eL Vision Group',
      from_email: 'support@elvisiongroup.com',
      recipient: email,
      subject: subject,
      content: htmlContent
    };

    console.log('📤 Sending to Mailketing /send:', JSON.stringify(mailketingParams, null, 2));

    const response = await fetch(`${MAILKETING_API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(mailketingParams).toString()
    });

    const result = await response.text();
    console.log('RAW RESULT:', result);
    console.log(`📧 Expiry warning email result for ${email}:`, result);
    return response.ok;
  } catch (error) {
    console.error(`❌ Failed to send expiry warning email to ${email}:`, error);
    return false;
  }
}

// Send just expired email (0 hour notification)
async function sendJustExpiredEmail(email, name) {
  try {
    console.log(`📧 Sending just expired email to: ${email}`);

    const subject = `⏰ Langganan Pro Anda Baru Saja Berakhir!`;
    const htmlContent = `
      <div style="width: 90%; max-width: none; margin: 0 auto; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: 15px; overflow: hidden;">
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 20px 15px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 700;">⏰ Langganan Berakhir</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Langganan Pro Anda baru saja berakhir</p>
        </div>

        <!-- Main Content -->
        <div style="background: white; padding: 20px 15px; border-radius: 0 0 15px 15px;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 22px;">Halo ${name}! 👋</h2>

          <p style="color: #666; line-height: 1.6; margin: 0 0 15px 0; font-size: 16px;">
            Langganan Pro ElVision Group Anda baru saja berakhir. Jangan biarkan perjalanan spiritual Anda terhenti!
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://app.elvisiongroup.com" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
              🚀 Perpanjang Sekarang
            </a>
          </div>

          <!-- Footer -->
          <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Butuh bantuan? Hubungi kami di <a href="mailto:support@elvisiongroup.com" style="color: #667eea; text-decoration: none;">support@elvisiongroup.com</a>
            </p>
          </div>
        </div>
      </div>
    `;

    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY,
      email: MAILKETING_EMAIL,
      from_name: 'Support eL Vision Group',
      from_email: 'support@elvisiongroup.com',
      recipient: email,
      subject: subject,
      content: htmlContent
    });

    const response = await fetch(`${MAILKETING_API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const result = await response.text();
    console.log(`📧 Just expired email result for ${email}:`, result);
    return response.ok;
  } catch (error) {
    console.error(`❌ Failed to send just expired email to ${email}:`, error);
    return false;
  }
}

// Send expired email
async function sendExpiredEmail(email, name) {
  try {
    console.log(`📧 Sending expired email to: ${email}`);
    
    const subject = `😞 Langganan Pro Anda Telah Berakhir - Mari Kembali!`;
    const htmlContent = `
      <div style="width: 90%; max-width: none; margin: 0 auto; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: 15px; overflow: hidden;">
        <!-- Header Section -->
        <div style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 20px 15px; text-align: center; border-radius: 15px 15px 0 0;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 700;">😞 Langganan Berakhir</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Kami merindukan Anda sebagai member Pro</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 20px 15px; border-radius: 0 0 15px 15px;">
          <h2 style="color: #333; margin: 0 0 15px 0; font-size: 22px;">Halo ${name}! 👋</h2>
          
          <p style="color: #666; line-height: 1.6; margin: 0 0 15px 0; font-size: 16px;">
            Langganan Pro ElVision Group Anda telah berakhir. Kami merindukan kehadiran Anda sebagai member Pro!
          </p>
          
          <!-- Special Offer -->
          <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border: 1px solid #c3e6cb; padding: 15px; margin: 15px 0; border-radius: 10px;">
            <h3 style="color: #155724; margin: 0 0 12px 0; font-size: 18px; text-align: center;">🎁 Penawaran Khusus!</h3>
            <p style="margin: 0; color: #155724; text-align: center; font-weight: 500; font-size: 15px;">
              <strong>Kembali ke Pro sekarang dengan benefit yang sama:</strong><br/>
              Hanya 4Ribu per hari untuk akses penuh ke semua fitur premium!
            </p>
          </div>
          
          <!-- What You're Missing -->
          <div style="background: #f8f9ff; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; border-radius: 10px;">
            <h3 style="color: #333; margin: 0 0 12px 0; font-size: 18px;">💔 Yang terlewat tanpa Pro:</h3>
            <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 18px; font-size: 15px;">
              <li>Akses verse terbatas</li>
              <li>Audio therapy basic saja</li>
              <li>Fitur AI spiritual terbatas</li>
              <li>Spiritual journal terbatas</li>
              <li>Tidak ada akses konten eksklusif</li>
            </ul>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 20px 0;">
            <a href="https://app.elvisiongroup.com" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
              🎯 Aktifkan Pro Lagi
            </a>
          </div>
          
          <!-- Footer -->
          <div style="border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px; text-align: center;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Butuh bantuan? Hubungi kami di <a href="mailto:support@elvisiongroup.com" style="color: #667eea; text-decoration: none;">support@elvisiongroup.com</a>
            </p>
          </div>
        </div>
      </div>
    `;

    const params = new URLSearchParams({
      api_token: MAILKETING_API_KEY,
      email: MAILKETING_EMAIL,
      from_name: 'Support eL Vision Group',
      from_email: 'support@elvisiongroup.com',
      recipient: email,
      subject: subject,
      content: htmlContent
    });

    const response = await fetch(`${MAILKETING_API_URL}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const result = await response.text();
    console.log(`📧 Expired email result for ${email}:`, result);
    return response.ok;
  } catch (error) {
    console.error(`❌ Failed to send expired email to ${email}:`, error);
    return false;
  }
}

const handler = async (req) => {
  console.log('🚀 Expire Subscriptions Function Started');
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const results = {
      warnings_sent: 0,
      expired_emails_sent: 0,
      subscriptions_expired: 0,
      expired_records_deleted: false,
      errors: []
    };

    // Get users with subscriptions expiring in 3 days or less (warning)
    const { data: expiringUsers, error: expiringError } = await supabase
      .from('pro_subscriptions')
      .select('user_id, user_email, subscription_end_date, subscription_type')
      .eq('status', 'active')
      .not('subscription_end_date', 'is', null)
      .gt('subscription_end_date', new Date().toISOString()) // > now (not expired)
      .lte('subscription_end_date', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()); // <= 3 days from now

    if (expiringError) {
      console.error('Error fetching expiring users:', expiringError);
      results.errors.push(`Expiring users query error: ${expiringError.message}`);
    } else if (expiringUsers && expiringUsers.length > 0) {
      console.log(`📅 Found ${expiringUsers.length} users with subscriptions expiring within 3 days`);
      
      for (const user of expiringUsers) {
        try {
          const endDate = new Date(user.subscription_end_date);
          const daysRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const userName = user.user_email.split('@')[0];
          
          const sent = await sendExpiryWarningEmail(user.user_email, userName, daysRemaining);
          if (sent) {
            results.warnings_sent++;
          }
        } catch (error) {
          console.error(`Error sending warning to ${user.user_email}:`, error);
          results.errors.push(`Warning email error for ${user.user_email}: ${error.message}`);
        }
      }
    }

    // Get users with subscriptions that just expired (within last hour) - immediate notification
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const now = new Date().toISOString();

    const { data: justExpiredUsers, error: justExpiredError } = await supabase
      .from('pro_subscriptions')
      .select('user_id, user_email, subscription_end_date, subscription_type')
      .eq('status', 'active')
      .not('subscription_end_date', 'is', null)
      .gte('subscription_end_date', oneHourAgo)
      .lt('subscription_end_date', now);

    if (justExpiredError) {
      console.error('Error fetching just expired users:', justExpiredError);
      results.errors.push(`Just expired users query error: ${justExpiredError.message}`);
    } else if (justExpiredUsers && justExpiredUsers.length > 0) {
      console.log(`📅 Found ${justExpiredUsers.length} users with subscriptions that just expired`);

      for (const user of justExpiredUsers) {
        try {
          const userName = user.user_email.split('@')[0];

          const sent = await sendJustExpiredEmail(user.user_email, userName);
          if (sent) {
            results.expired_emails_sent++;
          }
        } catch (error) {
          console.error(`Error sending just expired email to ${user.user_email}:`, error);
          results.errors.push(`Just expired email error for ${user.user_email}: ${error.message}`);
        }
      }
    }

    // CRITICAL FIX: Actually expire subscriptions that have passed their end date
    const { data: expiredUsers, error: expiredError } = await supabase
      .from('pro_subscriptions')
      .select('user_id, user_email, subscription_end_date, subscription_type')
      .eq('status', 'active')
      .not('subscription_end_date', 'is', null)
      .lt('subscription_end_date', now); // All subscriptions that have expired

    if (expiredError) {
      console.error('Error fetching expired users:', expiredError);
      results.errors.push(`Expired users query error: ${expiredError.message}`);
    } else if (expiredUsers && expiredUsers.length > 0) {
      console.log(`🔥 CRITICAL: Found ${expiredUsers.length} users with expired subscriptions that are still active!`);
      
      // STEP 1: Send comeback emails to recently expired (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const recentlyExpired = expiredUsers.filter(user => user.subscription_end_date >= yesterday);
      
      for (const user of recentlyExpired) {
        try {
          const userName = user.user_email.split('@')[0];
          const sent = await sendExpiredEmail(user.user_email, userName);
          if (sent) {
            results.expired_emails_sent++;
          }
        } catch (error) {
          console.error(`Error sending expired email to ${user.user_email}:`, error);
          results.errors.push(`Expired email error for ${user.user_email}: ${error.message}`);
        }
      }

      // STEP 2: ACTUALLY EXPIRE THE SUBSCRIPTIONS - UPDATE DATABASE
      console.log(`💾 Updating ${expiredUsers.length} expired subscriptions to 'expired' status...`);
      
      const userIds = expiredUsers.map(user => user.user_id);
      const { error: updateError } = await supabase
        .from('pro_subscriptions')
        .update({ 
          status: 'expired',
          updated_at: now 
        })
        .in('user_id', userIds)
        .eq('status', 'active')
        .lt('subscription_end_date', now);

      if (updateError) {
        console.error('❌ CRITICAL ERROR: Failed to update expired subscriptions:', updateError);
        results.errors.push(`Failed to expire subscriptions: ${updateError.message}`);
      } else {
        console.log(`✅ SUCCESS: Updated ${expiredUsers.length} expired subscriptions to 'expired' status`);
        results.subscriptions_expired = expiredUsers.length;
      }

      // STEP 3: Delete expired subscriptions (trigger cleanup)
      console.log(`🗑️ Deleting expired subscriptions to free database space...`);
      
      const { error: deleteError } = await supabase
        .from('pro_subscriptions')
        .delete()
        .eq('status', 'expired');

      if (deleteError) {
        console.error('⚠️ Warning: Failed to delete expired subscriptions:', deleteError);
        results.errors.push(`Failed to delete expired subscriptions: ${deleteError.message}`);
      } else {
        console.log(`🗑️ SUCCESS: Cleaned up expired subscription records`);
        results.expired_records_deleted = true;
      }
    }

    console.log("✅ Expire subscriptions function completed successfully");
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Expire subscriptions processed successfully',
      results: results
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("❌ Error in expire subscriptions function:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};

serve(handler);