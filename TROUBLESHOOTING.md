# 🔧 TROUBLESHOOTING: Admin Access Issues

## Your Specific Problem

**Issue 1:** After login, redirects to `/lib` instead of admin panel  
**Issue 2:** When trying to access `/admin/assets`, get redirected to homepage `/`

---

## 🎯 Quick Fix (Follow These Steps)

### Step 1: Run Diagnostic Script

1. Open **Supabase SQL Editor**
2. Run the file: **`diagnose-admin-access.sql`**
3. Check the results - all steps should show ✓

### Step 2: Check Your Email

Make sure you're signing in with **exactly** this email (case-sensitive):
```
hasan.404.dev@gmail.com
```

### Step 3: Verify User Account Exists

In Supabase SQL Editor, run:
```sql
SELECT id, email FROM auth.users WHERE email = 'hasan.404.dev@gmail.com';
```

**Expected Result:**
- Should show 1 row with the user ID and email
- If **NO ROWS**: You need to sign up first at `/signup`

### Step 4: Check Admin Role

Run this:
```sql
SELECT ar.role, u.email 
FROM admin_roles ar
JOIN auth.users u ON ar.user_id = u.id
WHERE u.email = 'hasan.404.dev@gmail.com';
```

**Expected Result:**
- Should show: `super_admin` | `hasan.404.dev@gmail.com`
- If **NO ROWS**: Run the Quick Fix below

### Step 5: Quick Fix - Add Admin Role

If Step 4 showed no rows, run this:
```sql
INSERT INTO admin_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'hasan.404.dev@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
```

### Step 6: Clear Browser Cache

1. **Chrome/Edge:** Press `Ctrl + Shift + Delete`, clear cookies and cache
2. **Or**: Open an incognito/private window
3. Log out completely
4. Log in again with `hasan.404.dev@gmail.com`

### Step 7: Test Access

1. After logging in, go to: `/admin/dashboard`
2. Should load without redirect
3. Try `/admin/assets`, `/admin/payment`, `/admin/user`
4. All should work

---

## 🔍 Common Causes & Solutions

### Problem: "Redirects to /lib after login"

**Cause:** The sign-in page redirects non-admins to `/lib`

**Solution:** ✅ Already fixed in the code update
- Now redirects admins to `/admin/dashboard`
- Non-admins still go to `/lib`

### Problem: "Redirects to / when accessing /admin/assets"

**Cause:** Middleware can't find admin role in database

**Possible Reasons:**

#### Reason 1: Admin role not assigned
**Fix:**
```sql
INSERT INTO admin_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'hasan.404.dev@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
```

#### Reason 2: Wrong email (typo or case mismatch)
**Fix:** Sign in with exact email: `hasan.404.dev@gmail.com`

#### Reason 3: User hasn't signed up yet
**Fix:** Go to `/signup` and create account with `hasan.404.dev@gmail.com`

#### Reason 4: RLS policies blocking the query
**Fix:** Re-run the RLS policy section from `setup-super-admin.sql`

#### Reason 5: admin_roles table doesn't exist
**Fix:** Run the complete `setup-super-admin.sql` file

---

## 🔬 Deep Diagnostic

### Check Middleware Logs

The updated middleware now logs admin access attempts. Check your terminal/console for:

```
Admin access denied for: hasan.404.dev@gmail.com Error: [error message]
```

or

```
Admin access granted for: hasan.404.dev@gmail.com Role: super_admin
```

### Check Browser Console

1. Press `F12` to open browser developer tools
2. Go to **Console** tab
3. Try to access `/admin/dashboard`
4. Look for error messages

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Click **Logs** in sidebar
3. Filter by **Postgres Logs**
4. Look for errors related to `admin_roles` table

---

## 📋 Complete Checklist

Run through this checklist:

- [ ] `admin_roles` table exists in Supabase
- [ ] User account exists for `hasan.404.dev@gmail.com`
- [ ] Admin role assigned to this user
- [ ] Role is `super_admin` (not just `admin`)
- [ ] RLS is enabled on `admin_roles` table
- [ ] RLS policies allow super admins to query the table
- [ ] Browser cache cleared
- [ ] Logged out and logged in again
- [ ] Using exact email (case-sensitive)

---

## 🛠️ Manual Setup (If Everything Else Fails)

### Step 1: Create the Table
```sql
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'super_admin')),
  granted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
```

### Step 2: Create RLS Policies
```sql
DROP POLICY IF EXISTS "Super admins can manage admin roles" ON admin_roles;
CREATE POLICY "Super admins can manage admin roles"
  ON admin_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles ar
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view own role" ON admin_roles;
CREATE POLICY "Admins can view own role"
  ON admin_roles FOR SELECT
  USING (user_id = auth.uid());
```

### Step 3: Add Your Super Admin Role
```sql
-- First, find your user ID
SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com';

-- Then insert the role (replace USER_ID_HERE with the actual UUID)
INSERT INTO admin_roles (user_id, role)
VALUES ('USER_ID_HERE', 'super_admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
```

### Step 4: Verify
```sql
SELECT ar.role, u.email 
FROM admin_roles ar
JOIN auth.users u ON ar.user_id = u.id
WHERE u.email = 'hasan.404.dev@gmail.com';
```

Should return:
```
role         | email
-------------+----------------------
super_admin  | hasan.404.dev@gmail.com
```

---

## 🎯 Expected Behavior After Fix

### Correct Login Flow for Admin:
1. Go to `/signin`
2. Enter `hasan.404.dev@gmail.com` + password
3. Click "Sign In"
4. ✅ Redirected to `/admin/dashboard`
5. ✅ Can access `/admin/assets`
6. ✅ Can access `/admin/payment`
7. ✅ Can access `/admin/user`

### Correct Login Flow for Regular User:
1. Go to `/signin`
2. Enter regular user email + password
3. Click "Sign In"
4. ✅ Redirected to `/lib`
5. ❌ Cannot access `/admin/*` (redirected to `/`)

---

## 📞 Still Not Working?

### Check These Environment Variables

Make sure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Try Disabling RLS Temporarily (Testing Only)

⚠️ **WARNING: Only for testing, re-enable immediately after**

```sql
ALTER TABLE admin_roles DISABLE ROW LEVEL SECURITY;

-- Test if admin access works now
-- If YES: The problem is RLS policies
-- If NO: The problem is elsewhere

-- Re-enable immediately:
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
```

### Check Server Logs

If using Next.js dev server, check the terminal for:
```
Admin access denied for: [email] Error: [message]
```

This will tell you exactly why the middleware is blocking access.

---

## ✅ Success Indicators

You'll know it's working when:

1. **Login:** After signing in, URL changes to `/admin/dashboard`
2. **Access:** Can navigate to all `/admin/*` pages
3. **Data:** Dashboard shows stats and activity logs
4. **No Redirects:** Stays on admin pages, doesn't redirect to `/`
5. **Console:** Logs show "Admin access granted for: hasan.404.dev@gmail.com"

---

**Last Updated:** 2026-07-18  
**For Issue:** Redirect to /lib and blocked admin access
