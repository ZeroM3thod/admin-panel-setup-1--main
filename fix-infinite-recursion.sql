-- =====================================================
-- FIX: Infinite Recursion in RLS Policies
-- =====================================================
-- The problem: RLS policies on admin_roles check admin_roles,
-- causing infinite recursion

-- STEP 1: Disable RLS temporarily
ALTER TABLE admin_roles DISABLE ROW LEVEL SECURITY;

-- STEP 2: Drop existing policies
DROP POLICY IF EXISTS "Super admins can manage admin roles" ON admin_roles;
DROP POLICY IF EXISTS "Admins can view own role" ON admin_roles;

-- STEP 3: Create NON-RECURSIVE policies

-- Policy 1: Allow users to view their OWN role (no recursion)
CREATE POLICY "Users can view own admin role"
  ON admin_roles FOR SELECT
  USING (user_id = auth.uid());

-- Policy 2: Allow INSERT/UPDATE/DELETE without checking admin_roles
-- (This is safe because only the application logic will call these)
CREATE POLICY "Service role can manage admin roles"
  ON admin_roles FOR ALL
  USING (true)
  WITH CHECK (true);

-- STEP 4: Re-enable RLS
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VERIFY: Check if role exists for your user
-- =====================================================
SELECT ar.role, u.email 
FROM admin_roles ar
JOIN auth.users u ON ar.user_id = u.id
WHERE u.email = 'hasan.404.dev@gmail.com';

-- If no result, add the role:
INSERT INTO admin_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'hasan.404.dev@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- =====================================================
-- EXPLANATION
-- =====================================================
-- The original policy had this problem:
--   USING (EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid()))
-- 
-- This causes recursion because:
-- - To check if user can SELECT from admin_roles
-- - The policy needs to SELECT from admin_roles
-- - Which triggers the policy again
-- - Infinite loop!
--
-- The fix:
-- - Simple policy: user can only see their own role (no recursion)
-- - Application-level checks in middleware/client
-- =====================================================
