# Admin System Architecture

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER VISITS /admin/*                        │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE.TS (Server-Side)                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 1. Check if user is authenticated (Supabase session)          │  │
│  │ 2. Query admin_roles table for user_id                        │  │
│  │ 3. Verify role exists (admin or super_admin)                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌─────────────────────┐   ┌─────────────────────┐
        │   ✗ NO ROLE FOUND   │   │  ✓ ROLE VERIFIED    │
        │                     │   │                     │
        │  Redirect to "/"    │   │  Allow Access       │
        └─────────────────────┘   └──────────┬──────────┘
                                             │
                                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   ADMIN-SHELL.TSX (Client-Side)                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ 1. Double-check admin role from client                        │  │
│  │ 2. Show loading state during verification                     │  │
│  │ 3. Render admin navigation if verified                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        ADMIN PAGES RENDER                           │
│  • /admin/dashboard  → Analytics & Logs                             │
│  • /admin/assets     → Component Management                         │
│  • /admin/payment    → Payment Approvals                            │
│  • /admin/user       → User Management                              │
└─────────────────────────────────────────────────────────────────────┘
```

## Database Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                          auth.users (Supabase)                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ id (UUID)            │ Primary Key                             │  │
│  │ email                │ hasan.404.dev@gmail.com                 │  │
│  │ created_at           │ Timestamp                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ Referenced by
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          admin_roles (Custom)                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ id (UUID)            │ Primary Key                             │  │
│  │ user_id (UUID)       │ FK → auth.users.id (UNIQUE)             │  │
│  │ role (TEXT)          │ 'admin' or 'super_admin'                │  │
│  │ granted_by (UUID)    │ FK → auth.users.id (who granted)        │  │
│  │ created_at           │ Timestamp                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Controls access to
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         PROTECTED TABLES                            │
│  • profiles              → User accounts                            │
│  • payments              → Payment submissions                      │
│  • asset_main_buttons    → Component categories                     │
│  • asset_sub_buttons     → Components                               │
│  • code_files            → Component code                           │
│  • activity_logs         → System activity                          │
│  • component_installs    → Download tracking                        │
└─────────────────────────────────────────────────────────────────────┘
```

## RLS Policy Logic

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ROW LEVEL SECURITY (RLS)                         │
└─────────────────────────────────────────────────────────────────────┘

Every protected table has policies like:

┌─────────────────────────────────────────────────────────────────────┐
│ POLICY: "Admins can read all profiles"                              │
│                                                                      │
│   USING (                                                            │
│     EXISTS (                                                         │
│       SELECT 1 FROM admin_roles                                      │
│       WHERE admin_roles.user_id = auth.uid()                         │
│     )                                                                │
│   )                                                                  │
│                                                                      │
│ Translation: Only users with entry in admin_roles can access        │
└─────────────────────────────────────────────────────────────────────┘
```

## Admin Roles Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPER ADMIN                                 │
│                  hasan.404.dev@gmail.com                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ✓ View Dashboard                                              │  │
│  │ ✓ Manage Assets                                               │  │
│  │ ✓ Approve Payments                                            │  │
│  │ ✓ Manage Users                                                │  │
│  │ ✓ Add/Remove Admins         ← EXCLUSIVE                       │  │
│  │ ✓ Promote/Demote Admins     ← EXCLUSIVE                       │  │
│  │ ✓ Full Database Access                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ Can grant role to
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        REGULAR ADMIN                                │
│                     admin@example.com                               │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ✓ View Dashboard                                              │  │
│  │ ✓ Manage Assets                                               │  │
│  │ ✓ Approve Payments                                            │  │
│  │ ✓ Manage Users                                                │  │
│  │ ✗ Add/Remove Admins                                           │  │
│  │ ✗ Promote/Demote Admins                                       │  │
│  │ ✗ Cannot access admin_roles table                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ No access to admin management
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        REGULAR USER                                 │
│                     user@example.com                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ ✗ No admin access at all                                      │  │
│  │ ✓ Can use front-end features                                  │  │
│  │ ✓ Can submit payments                                         │  │
│  │ ✓ Can view own profile                                        │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LAYER 1: MIDDLEWARE                          │
│                      Server-Side Protection                         │
│  • Runs before page loads                                           │
│  • Checks Supabase session                                          │
│  • Queries admin_roles table                                        │
│  • Redirects unauthorized users                                     │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │ If passed
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      LAYER 2: CLIENT COMPONENT                      │
│                      Client-Side Verification                       │
│  • AdminShell component checks role again                           │
│  • Prevents UI from rendering for non-admins                        │
│  • Shows "Verifying access..." during check                         │
│  • Redirects if role not found                                      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │ If passed
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       LAYER 3: DATABASE RLS                         │
│                      Database-Level Security                        │
│  • Every query checks admin_roles                                   │
│  • Blocks unauthorized data access                                  │
│  • Works even if middleware/client is bypassed                      │
│  • Enforced by PostgreSQL                                           │
└─────────────────────────────────────────────────────────────────────┘
```

## Setup Process Flow

```
1. Run setup-super-admin.sql
   ↓
   • Creates admin_roles table
   • Sets up RLS policies on all tables
   • Creates is_admin() helper function
   • Adds hasan.404.dev@gmail.com as super_admin
   • Creates performance indexes
   ↓
2. User logs in with hasan.404.dev@gmail.com
   ↓
3. Visit /admin/dashboard
   ↓
   • Middleware checks admin_roles → ✓ Pass
   • AdminShell checks admin_roles → ✓ Pass
   • Database RLS allows queries → ✓ Pass
   ↓
4. Full Admin Access Granted! 🎉
```

## Adding New Admins Flow

```
Super Admin (hasan.404.dev@gmail.com)
   ↓
   Runs SQL command:
   INSERT INTO admin_roles (user_id, role, granted_by)
   SELECT u.id, 'admin', (SELECT id FROM auth.users WHERE email = 'hasan.404.dev@gmail.com')
   FROM auth.users u WHERE u.email = 'new-admin@example.com'
   ↓
New admin can now access /admin/*
   ↓
System tracks who granted the role (granted_by column)
```

## File Relationships

```
middleware.ts
    ↓ calls
createClient() from @/lib/supabase
    ↓ queries
admin_roles table in Supabase
    ↓ allows/blocks
Admin routes (/admin/*)
    ↓ renders
admin-shell.tsx (layout wrapper)
    ↓ contains
Individual admin pages
    ↓ use
useAdmin() hook from @/lib/admin-store
    ↓ fetches data from
Protected tables (profiles, payments, assets, etc.)
```
