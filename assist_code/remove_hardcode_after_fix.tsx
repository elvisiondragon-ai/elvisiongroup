// After fixing RLS, replace the hardcoded section in Chat.tsx with this:

// Get admin users from database (no hardcoding needed)
let adminUsers = new Set();
try {
  const { data: adminRoles, error: adminError } = await supabase
    .from('admin_roles')
    .select('user_id')
    .eq('role', 'admin')
    .eq('is_active', true);
  
  if (adminError) {
    console.error('Admin roles query error:', adminError);
  } else {
    adminUsers = new Set(adminRoles?.map(ar => ar.user_id) || []);
    console.log('Admin users from database:', Array.from(adminUsers));
  }
} catch (adminErr) {
  console.error('Failed to fetch admin roles:', adminErr);
}

// This replaces lines 124-150 in Chat.tsx after RLS is fixed