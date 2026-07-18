-- =====================================================
-- CRITICAL SECURITY FIX: Admin Role-Based Authentication
-- =====================================================
-- This fixes the critical vulnerability where any user with 
-- email starting with "admin@" gets admin access

-- 1. Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Only super admins can manage admin roles
DROP POLICY IF EXISTS "Super admins can manage admin roles" ON admin_roles;
CREATE POLICY "Super admins can manage admin roles"
  ON admin_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
    )
  );

-- Admins can view their own role
DROP POLICY IF EXISTS "Admins can view own role" ON admin_roles;
CREATE POLICY "Admins can view own role"
  ON admin_roles FOR SELECT
  USING (user_id = auth.uid());

-- =====================================================
-- 2. Update all RLS policies to use admin_roles table
-- =====================================================

-- Profiles table policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Payments table policies
DROP POLICY IF EXISTS "Admins can read all payments" ON payments;
CREATE POLICY "Admins can read all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update payments" ON payments;
CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Asset Main Buttons policies
DROP POLICY IF EXISTS "Admins can manage assets" ON asset_main_buttons;
CREATE POLICY "Admins can manage assets"
  ON asset_main_buttons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Asset Sub Buttons policies
DROP POLICY IF EXISTS "Admins can manage sub assets" ON asset_sub_buttons;
CREATE POLICY "Admins can manage sub assets"
  ON asset_sub_buttons FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Code Files policies
DROP POLICY IF EXISTS "Admins can manage code files" ON code_files;
CREATE POLICY "Admins can manage code files"
  ON code_files FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Activity Logs policies
DROP POLICY IF EXISTS "Admins can read all activity logs" ON activity_logs;
CREATE POLICY "Admins can read all activity logs"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- Component Installs policies
DROP POLICY IF EXISTS "Admins can read all installs" ON component_installs;
CREATE POLICY "Admins can read all installs"
  ON component_installs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles 
      WHERE admin_roles.user_id = auth.uid()
    )
  );

-- =====================================================
-- 3. Create helper function to check admin status
-- =====================================================

CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE admin_roles.user_id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. Insert your first super admin
-- =====================================================
-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user UUID
-- You can find it by running: SELECT id, email FROM auth.users WHERE email = 'your@email.com';

-- Example (REPLACE WITH YOUR ACTUAL USER ID):
-- INSERT INTO admin_roles (user_id, role) 
-- VALUES ('YOUR_USER_ID_HERE', 'super_admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- To add your specific email as super admin, run this after getting your user_id:
-- INSERT INTO admin_roles (user_id, role)
-- SELECT id, 'super_admin'
-- FROM auth.users
-- WHERE email = 'hasan.404.dev@gmail.com'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- =====================================================
-- 5. Indexes for performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_roles_role ON admin_roles(role);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Add your user as super_admin using the INSERT statement above
-- 3. Update frontend code to check admin_roles table instead of email prefix
-- 4. Remove all email.startsWith("admin@") checks from code
-- =====================================================
