# Admin Panel Setup Guide

Complete guide to setting up admin access for your application with role-based authentication.

## 🚀 Quick Start

### 1. Run the Main Setup (One Time Only)

Open your **Supabase SQL Editor** and run the entire `setup-super-admin.sql` file.

This will:
- Create the `admin_roles` table
- Set up all RLS policies for secure access
- **Make hasan.404.dev@gmail.com a super admin**
- Create performance indexes

### 2. Test Your Access

After running the SQL:

1. Sign up or log in with **hasan.404.dev@gmail.com**
2. Navigate to `/admin/dashboard`
3. You should now have full access to:
   - `/admin/dashboard` - Analytics and activity logs
   - `/admin/assets` - Manage components and assets
   - `/admin/payment` - Approve/reject payments
   - `/admin/user` - Manage user accounts and plans

---

## 👥 Admin Roles

### Super Admin
- ✅ Full access to all admin features
- ✅ Can manage users, payments, assets
- ✅ Can add/remove other admins
- ✅ Can promote/demote admin roles

### Regular Admin
- ✅ Can manage users, payments, assets
- ❌ Cannot add/remove other admins
- ❌ Cannot view admin_roles table

---

## ➕ Adding Additional Admins

Use the `add-admin-helper.sql` file for adding more admins.

### Add Regular Admin

```sql
INSERT INTO admin_roles (user_id, role, granted_by)
SELECT 
  u.id, 
  'admin',
  (SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com')
FROM auth.users u
WHERE u.email = 'new-admin@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

### Add Super Admin

```sql
INSERT INTO admin_roles (user_id, role, granted_by)
SELECT 
  u.id, 
  'super_admin',
  (SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com')
FROM auth.users u
WHERE u.email = 'new-super-admin@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
```

---

## 🔍 Useful Admin Queries

### List All Admins

```sql
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
```

### Find User ID by Email

```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'user@example.com';
```

### Remove Admin Access

```sql
DELETE FROM admin_roles 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin-to-remove@example.com'
);
```

### Promote Admin to Super Admin

```sql
UPDATE admin_roles 
SET role = 'super_admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@example.com'
);
```

### Demote Super Admin to Regular Admin

```sql
UPDATE admin_roles 
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'super-admin@example.com'
);
```

---

## 🔒 Security Features

### Middleware Protection
All `/admin/*` routes are protected by middleware that:
1. Checks if user is authenticated
2. Verifies user has an entry in `admin_roles` table
3. Redirects non-admins to homepage

**File:** `middleware.ts`

### Client-Side Protection
The AdminShell component double-checks admin status:
1. Fetches user's role from `admin_roles` table
2. Shows loading state during verification
3. Redirects non-admins to homepage

**File:** `components/admin/admin-shell.tsx`

### Database Security (RLS Policies)
Row Level Security ensures:
- Only admins can view/edit admin-only tables
- Users can only see their own data
- Super admins control the `admin_roles` table

---

## 📁 File Structure

```
admin-panel-setup-1--main/
├── setup-super-admin.sql          # Main setup (run once)
├── add-admin-helper.sql            # Helper for adding admins
├── ADMIN-SETUP-GUIDE.md           # This guide
├── middleware.ts                   # Route protection
├── app/admin/
│   ├── layout.tsx                 # Admin layout wrapper
│   ├── page.tsx                   # Admin home/redirect
│   ├── dashboard/page.tsx         # Analytics dashboard
│   ├── assets/page.tsx            # Asset management
│   ├── payment/page.tsx           # Payment approval
│   └── user/page.tsx              # User management
└── components/admin/
    └── admin-shell.tsx            # Admin sidebar & navigation
```

---

## 🐛 Troubleshooting

### "Access Denied" after running setup
1. Make sure you ran `setup-super-admin.sql` completely
2. Verify the email matches exactly: `hasan.404.dev@gmail.com`
3. Check if the user exists in `auth.users`:
   ```sql
   SELECT * FROM auth.users WHERE email = 'hasan.404.dev@gmail.com';
   ```
4. Check if admin role was created:
   ```sql
   SELECT * FROM admin_roles WHERE user_id IN (
     SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com'
   );
   ```

### Cannot add other admins
- Only **super admins** can add/remove admins
- Make sure your account has role = `'super_admin'`, not just `'admin'`

### RLS Policy Errors
If you get permission errors, the RLS policies might not have updated. Re-run the policy section from `setup-super-admin.sql`.

---

## 🎯 Admin Features

### Dashboard (`/admin/dashboard`)
- Total revenue and user statistics
- Recent activity feed
- Component install tracking
- Real-time metrics

### Assets (`/admin/assets`)
- Create main categories (Components, Blocks, etc.)
- Add sub-components with code files
- Set access levels (free, pro, professional)
- Upload preview and download links

### Payments (`/admin/payment`)
- View pending payment submissions
- Approve/reject payments
- Automatically upgrade user plans on approval
- Track revenue statistics

### Users (`/admin/user`)
- View all registered users
- Change user plans manually
- Suspend/activate accounts
- Search users by name or email

---

## ✅ Post-Setup Checklist

- [ ] Run `setup-super-admin.sql` in Supabase SQL Editor
- [ ] Log in with hasan.404.dev@gmail.com
- [ ] Access `/admin/dashboard` successfully
- [ ] Test other admin pages (assets, payments, users)
- [ ] Add a test admin using `add-admin-helper.sql` (optional)
- [ ] Verify regular users cannot access `/admin/*`

---

## 📞 Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Verify your Supabase environment variables are correct
3. Check browser console for errors
4. Review Supabase logs in the dashboard

---

**Last Updated:** 2026-07-18
**Version:** 1.0
