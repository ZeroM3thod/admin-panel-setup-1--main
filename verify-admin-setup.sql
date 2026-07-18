-- =====================================================
-- ADMIN SETUP VERIFICATION SCRIPT
-- =====================================================
-- Run this to verify your admin setup is working correctly

-- =====================================================
-- 1. Check if admin_roles table exists
-- =====================================================
SELECT 
  'admin_roles table' as check_name,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'admin_roles'
    ) THEN '✓ EXISTS'
    ELSE '✗ MISSING - Run setup-super-admin.sql'
  END as status;

-- =====================================================
-- 2. Check if hasan.404.dev@gmail.com exists in auth.users
-- =====================================================
SELECT 
  'Super admin user account' as check_name,
  CASE 
    WHEN EXISTS (
      SELECT FROM auth.users 
      WHERE email = 'hasan.404.dev@gmail.com'
    ) THEN '✓ EXISTS'
    ELSE '✗ MISSING - User needs to sign up first'
  END as status;

-- =====================================================
-- 3. Check if super admin role is assigned
-- =====================================================
SELECT 
  'Super admin role assignment' as check_name,
  CASE 
    WHEN EXISTS (
      SELECT FROM admin_roles ar
      JOIN auth.users u ON ar.user_id = u.id
      WHERE u.email = 'hasan.404.dev@gmail.com'
      AND ar.role = 'super_admin'
    ) THEN '✓ ASSIGNED'
    ELSE '✗ NOT ASSIGNED - Run setup-super-admin.sql'
  END as status;

-- =====================================================
-- 4. List all current admins
-- =====================================================
SELECT 
  '=== CURRENT ADMINS ===' as info;

SELECT 
  ar.role,
  u.email,
  u.created_at as user_created,
  ar.created_at as role_granted,
  granter.email as granted_by
FROM admin_roles ar
JOIN auth.users u ON ar.user_id = u.id
LEFT JOIN auth.users granter ON ar.granted_by = granter.id
ORDER BY ar.role DESC, ar.created_at ASC;

-- =====================================================
-- 5. Check RLS policies on admin_roles
-- =====================================================
SELECT 
  '=== ADMIN_ROLES RLS POLICIES ===' as info;

SELECT 
  policyname as policy_name,
  cmd as command,
  qual as using_expression
FROM pg_policies
WHERE tablename = 'admin_roles'
ORDER BY policyname;

-- =====================================================
-- 6. Check RLS policies on profiles (admin access)
-- =====================================================
SELECT 
  '=== PROFILES ADMIN POLICIES ===' as info;

SELECT 
  policyname as policy_name,
  cmd as command
FROM pg_policies
WHERE tablename = 'profiles'
AND policyname LIKE '%admin%'
ORDER BY policyname;

-- =====================================================
-- 7. Check RLS policies on payments (admin access)
-- =====================================================
SELECT 
  '=== PAYMENTS ADMIN POLICIES ===' as info;

SELECT 
  policyname as policy_name,
  cmd as command
FROM pg_policies
WHERE tablename = 'payments'
AND policyname LIKE '%admin%'
ORDER BY policyname;

-- =====================================================
-- 8. Test admin check function
-- =====================================================
SELECT 
  '=== TEST is_admin() FUNCTION ===' as info;

SELECT 
  u.email,
  is_admin(u.id) as has_admin_access
FROM auth.users u
WHERE u.email = 'hasan.404.dev@gmail.com';

-- =====================================================
-- 9. Count admin roles
-- =====================================================
SELECT 
  '=== ADMIN ROLE COUNTS ===' as info;

SELECT 
  role,
  COUNT(*) as count
FROM admin_roles
GROUP BY role
ORDER BY role;

-- =====================================================
-- 10. Check indexes
-- =====================================================
SELECT 
  '=== ADMIN_ROLES INDEXES ===' as info;

SELECT 
  indexname as index_name,
  indexdef as definition
FROM pg_indexes
WHERE tablename = 'admin_roles'
ORDER BY indexname;

-- =====================================================
-- VERIFICATION COMPLETE
-- =====================================================
-- If all checks pass with ✓, your admin setup is ready!
-- If you see ✗, follow the instructions in the status message
-- =====================================================
