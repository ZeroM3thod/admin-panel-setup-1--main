-- =====================================================
-- HELPER: Add Additional Admins
-- =====================================================
-- Use this file to add more admins after initial setup
-- Only super admins can execute these commands

-- =====================================================
-- Method 1: Add Regular Admin (by email)
-- =====================================================
-- Regular admins can manage users, payments, and assets
-- but CANNOT add/remove other admins

INSERT INTO admin_roles (user_id, role, granted_by)
SELECT 
  u.id, 
  'admin',
  (SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com')
FROM auth.users u
WHERE u.email = 'NEW_ADMIN_EMAIL@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- =====================================================
-- Method 2: Add Super Admin (by email)
-- =====================================================
-- Super admins have full access including managing other admins

INSERT INTO admin_roles (user_id, role, granted_by)
SELECT 
  u.id, 
  'super_admin',
  (SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com')
FROM auth.users u
WHERE u.email = 'NEW_SUPER_ADMIN_EMAIL@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- =====================================================
-- Method 3: Add Admin by User ID (if you have the UUID)
-- =====================================================

INSERT INTO admin_roles (user_id, role, granted_by)
VALUES (
  'USER_UUID_HERE',
  'admin', -- or 'super_admin'
  (SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com')
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- =====================================================
-- Utility Queries
-- =====================================================

-- List all current admins
SELECT 
  ar.role,
  u.email,
  u.id as user_id,
  ar.created_at,
  granter.email as granted_by_email
FROM admin_roles ar
JOIN auth.users u ON ar.user_id = u.id
LEFT JOIN auth.users granter ON ar.granted_by = granter.id
ORDER BY ar.created_at DESC;

-- Find user ID by email
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'SEARCH_EMAIL@example.com';

-- Remove admin access (super admin only)
DELETE FROM admin_roles 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'ADMIN_TO_REMOVE@example.com'
);

-- Change admin role (promote/demote)
UPDATE admin_roles 
SET role = 'super_admin' -- or 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'ADMIN_EMAIL@example.com'
);

-- =====================================================
-- Quick Examples
-- =====================================================

-- Example: Add john@example.com as regular admin
/*
INSERT INTO admin_roles (user_id, role, granted_by)
SELECT 
  u.id, 
  'admin',
  (SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com')
FROM auth.users u
WHERE u.email = 'john@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
*/

-- Example: Add sarah@example.com as super admin
/*
INSERT INTO admin_roles (user_id, role, granted_by)
SELECT 
  u.id, 
  'super_admin',
  (SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com')
FROM auth.users u
WHERE u.email = 'sarah@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
*/
