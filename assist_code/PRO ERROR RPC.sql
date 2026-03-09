Lines 120-133 - Replaced the direct table query with RPC function:

  // OLD CODE (was causing RLS issues):
  // const { data: subscriptions } = await supabase
  //   .from('pro_subscriptions')
  //   .select('user_id, subscription_type')
  //   .in('user_id', userIds)
  //   .eq('status', 'active');

  // NEW CODE (bypasses RLS):
  // Fetch Pro status for all chat users using public RPC (bypasses RLS)
  const { data: subscriptions } = await supabase
    .rpc('get_public_pro_status', { user_ids: userIds });

  // Create subscription map
  const subscriptionMap = new Map();
  subscriptions?.forEach(sub => {
    if (sub.is_pro) {
      subscriptionMap.set(sub.user_id, {
        is_pro: true,
        subscription_type: sub.subscription_type
      });
    }
  });

  File: /Users/eldragon/git/elvisiongroup/src/components/ProBadge.tsx

  Lines 12-19 - Removed usePro hook dependency:

  // OLD CODE (was mixing current user data with target user data):
  // const { proStatus } = usePro();
  // const subscriptionType = targetUserSubscriptionType !== undefined 
  //   ? targetUserSubscriptionType 
  //   : proStatus.subscriptionType;

  // NEW CODE (uses only target user data):
  // Use only the passed subscription type - no fallback to current user
  const subscriptionType = targetUserSubscriptionType;

  // Only show badge if target user has a subscription
  if (!subscriptionType) {
    return null;
  }

  Summary of Changes:

  1. Chat.tsx: Uses RPC function instead of direct table query to bypass RLS
  2. ProBadge.tsx: Removed usePro() hook to eliminate cache/viewer
  contamination
  3. Database: Added get_public_pro_status() RPC function to allow public
  Pro status viewing

-- RPC function to get Pro status for chat users (public information)
-- This bypasses RLS to allow all users to see Pro badges in chat

CREATE OR REPLACE FUNCTION get_public_pro_status(user_ids UUID[])
RETURNS TABLE (
  user_id UUID,
  is_pro BOOLEAN,
  subscription_type TEXT
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    ps.user_id,
    true as is_pro,
    ps.subscription_type
  FROM pro_subscriptions ps
  WHERE ps.user_id = ANY(user_ids)
    AND ps.status = 'active'
    AND ps.subscription_end_date > NOW();
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_public_pro_status(UUID[]) TO authenticated;