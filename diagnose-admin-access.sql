-- =====================================================
-- DIAGNOSTIC: Check Admin Setup Status
-- =====================================================
-- Run this to diagnose why admin access is not working

-- 1. Check if admin_roles table exists
SELECT 
  'Step 1: admin_roles table exists' as check_step,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'admin_roles'
    ) THEN '✓ YES'
    ELSE '✗ NO - Table does not exist! Run setup-super-admin.sql'
  END as result;

-- 2. Check if hasan.404.dev@gmail.com exists in auth.users
SELECT 
  'Step 2: User account exists' as check_step,
  CASE 
    WHEN EXISTS (
      SELECT FROM auth.users 
      WHERE email = 'hasan.404.dev@gmail.com'
    ) THEN '✓ YES'
    ELSE '✗ NO - User must sign up first at /signup'
  END as result;

-- 3. Show the user ID if exists
SELECT 
  'Step 3: User ID' as check_step,
  COALESCE(
    (SELECT id::text FROM auth.users WHERE email = 'hasan.404.dev@gmail.com'),
    'User not found'
  ) as result;

-- 4. Check if admin role is assigned
SELECT 
  'Step 4: Admin role assigned' as check_step,
  CASE 
    WHEN EXISTS (
      SELECT FROM admin_roles ar
      JOIN auth.users u ON ar.user_id = u.id
      WHERE u.email = 'hasan.404.dev@gmail.com'
    ) THEN '✓ YES'
    ELSE '✗ NO - Role not assigned!'
  END as result;

-- 5. Show the actual role if exists
SELECT 
  'Step 5: Role type' as check_step,
  COALESCE(
    (SELECT ar.role FROM admin_roles ar
     JOIN auth.users u ON ar.user_id = u.id
     WHERE u.email = 'hasan.404.dev@gmail.com'),
    'No role found'
  ) as result;

-- 6. List ALL users in auth.users (to see what emails exist)
SELECT 
  '==================== ALL USERS IN SYSTEM ====================' as info;

SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- 7. List ALL admin roles
SELECT 
  '==================== ALL ADMIN ROLES ====================' as info;

SELECT 
  ar.id,
  ar.user_id,
  ar.role,
  u.email,
  ar.created_at
FROM admin_roles ar
LEFT JOIN auth.users u ON ar.user_id = u.id
ORDER BY ar.created_at DESC;

-- 8. Check RLS is enabled on admin_roles
SELECT 
  'Step 8: RLS enabled on admin_roles' as check_step,
  CASE 
    WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'admin_roles') 
    THEN '✓ YES'
    ELSE '✗ NO - RLS not enabled!'
  END as result;

-- =====================================================
-- QUICK FIX: If user exists but role missing
-- =====================================================
-- Uncomment and run this if Step 2 = YES but Step 4 = NO

/*
INSERT INTO admin_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'hasan.404.dev@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

SELECT 'Admin role added!' as result;
*/

-- =====================================================
-- RESULT INTERPRETATION
-- =====================================================
-- All steps should show ✓ YES
-- If any show ✗ NO, follow the instructions in the result message
