# Admin Setup Checklist

Complete this checklist to set up your admin panel with hasan.404.dev@gmail.com as super admin.

---

## 📋 Pre-Setup Requirements

- [ ] You have access to Supabase Dashboard
- [ ] You have the SQL Editor open in Supabase
- [ ] You have the project files downloaded
- [ ] You know your Supabase project URL and anon key

---

## 🔧 Step 1: Database Setup

### 1.1 Check Current State
- [ ] Open Supabase SQL Editor
- [ ] Run `verify-admin-setup.sql` to see current state
- [ ] Note which checks fail (if any)

### 1.2 Run Main Setup
- [ ] Open `setup-super-admin.sql` in Supabase SQL Editor
- [ ] Click "Run" to execute the entire file
- [ ] Wait for confirmation (should see "Success" messages)
- [ ] Verify no error messages appear

### 1.3 Verify Database Changes
- [ ] Run `verify-admin-setup.sql` again
- [ ] Confirm all checks show ✓ symbols
- [ ] Verify `admin_roles` table exists in Supabase Table Editor

---

## 👤 Step 2: User Account Setup

### 2.1 Create/Login User Account
- [ ] Go to your application's sign-up page
- [ ] Sign up with email: `hasan.404.dev@gmail.com`
  - OR log in if account already exists
- [ ] Verify email if required
- [ ] Confirm you can access the main application

### 2.2 Verify User in Database
- [ ] In Supabase SQL Editor, run:
```sql
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'hasan.404.dev@gmail.com';
```
- [ ] Confirm the user exists and note the `id` (UUID)

### 2.3 Verify Admin Role Assignment
- [ ] In Supabase SQL Editor, run:
```sql
SELECT ar.role, u.email, ar.created_at
FROM admin_roles ar
JOIN auth.users u ON ar.user_id = u.id
WHERE u.email = 'hasan.404.dev@gmail.com';
```
- [ ] Confirm role is `super_admin`
- [ ] If role doesn't exist, re-run the relevant section from `setup-super-admin.sql`

---

## 🔐 Step 3: Access Testing

### 3.1 Test Middleware Protection
- [ ] While logged OUT, try to visit `/admin/dashboard`
- [ ] Confirm you get redirected to `/signin`
- [ ] This proves middleware is working ✓

### 3.2 Test Admin Access
- [ ] Log in with `hasan.404.dev@gmail.com`
- [ ] Navigate to `/admin/dashboard`
- [ ] Confirm you can access the page (no redirect)
- [ ] Page should show "Verifying access..." briefly, then load

### 3.3 Test All Admin Pages
- [ ] Visit `/admin/dashboard` - should load
- [ ] Visit `/admin/assets` - should load
- [ ] Visit `/admin/payment` - should load  
- [ ] Visit `/admin/user` - should load
- [ ] All pages should display without errors

### 3.4 Test Non-Admin Access
- [ ] Create a test user account with different email
- [ ] Log in with the test user
- [ ] Try to visit `/admin/dashboard`
- [ ] Confirm you get redirected to `/` (homepage)
- [ ] This proves protection is working ✓

---

## 🎯 Step 4: Feature Testing

### 4.1 Dashboard Features
- [ ] Dashboard displays statistics
- [ ] Activity logs are visible
- [ ] Stats show numbers (even if 0)

### 4.2 Assets Management
- [ ] Can add a main category
- [ ] Can add a sub-component
- [ ] Can edit components
- [ ] Can delete components

### 4.3 Payment Management
- [ ] Payment list is visible (empty or with data)
- [ ] Filter buttons work
- [ ] Can see payment details

### 4.4 User Management
- [ ] User list displays
- [ ] Search functionality works
- [ ] Can change user plans (dropdown works)
- [ ] Can suspend/activate users

---

## 📊 Step 5: Database Verification

### 5.1 Check RLS Policies
- [ ] In Supabase SQL Editor, run:
```sql
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE policyname LIKE '%admin%'
ORDER BY tablename, policyname;
```
- [ ] Confirm policies exist for:
  - [ ] profiles
  - [ ] payments
  - [ ] asset_main_buttons
  - [ ] asset_sub_buttons
  - [ ] code_files
  - [ ] activity_logs
  - [ ] component_installs
  - [ ] admin_roles

### 5.2 Check Indexes
- [ ] Run:
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename = 'admin_roles';
```
- [ ] Confirm indexes exist:
  - [ ] `idx_admin_roles_user_id`
  - [ ] `idx_admin_roles_role`

---

## 🧪 Step 6: Additional Admin Testing (Optional)

### 6.1 Test Adding Regular Admin
- [ ] Open `add-admin-helper.sql`
- [ ] Create a test user account (different email)
- [ ] Use the SQL command to add them as regular `admin`
- [ ] Log in with that account
- [ ] Confirm they can access `/admin/*` pages
- [ ] Confirm they CANNOT add other admins

### 6.2 Test Admin Removal
- [ ] Remove the test admin with:
```sql
DELETE FROM admin_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'test-admin@example.com');
```
- [ ] Log in with removed admin account
- [ ] Confirm they can NO LONGER access `/admin/*`

---

## 🎉 Step 7: Final Verification

### 7.1 Complete Verification Script
- [ ] Run `verify-admin-setup.sql` one final time
- [ ] All checks should show ✓
- [ ] Admin count should show at least 1 super_admin

### 7.2 Documentation Review
- [ ] Save `QUICK-REFERENCE.txt` for easy access
- [ ] Bookmark `ADMIN-SETUP-GUIDE.md` for full docs
- [ ] Keep `add-admin-helper.sql` ready for future admins

### 7.3 Security Checklist
- [ ] Regular users CANNOT access `/admin/*`
- [ ] Only users in `admin_roles` table have access
- [ ] Super admin can manage other admins
- [ ] Regular admins cannot add/remove admins
- [ ] All admin routes require authentication

---

## ✅ Setup Complete!

If all items are checked, your admin panel is fully set up and secured.

### Your Super Admin Details:
- **Email:** hasan.404.dev@gmail.com
- **Role:** super_admin
- **Access:** All admin features + admin management

### Admin Routes:
- `/admin/dashboard` - Analytics & Activity
- `/admin/assets` - Component Management
- `/admin/payment` - Payment Approvals
- `/admin/user` - User Management

### Quick Commands Reference:

**List all admins:**
```sql
SELECT ar.role, u.email FROM admin_roles ar
JOIN auth.users u ON ar.user_id = u.id;
```

**Add new admin:**
```sql
INSERT INTO admin_roles (user_id, role, granted_by)
SELECT u.id, 'admin', (SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com')
FROM auth.users u WHERE u.email = 'NEW_ADMIN@example.com';
```

**Remove admin:**
```sql
DELETE FROM admin_roles 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ADMIN@example.com');
```

---

## 🐛 Troubleshooting

If any step fails, refer to:
1. `ADMIN-SETUP-GUIDE.md` - Full documentation
2. `verify-admin-setup.sql` - Diagnostic script
3. Check browser console for errors
4. Check Supabase logs for database errors

---

**Setup Date:** _________________

**Completed By:** _________________

**Notes:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
