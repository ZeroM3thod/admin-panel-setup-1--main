-- Profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'professional')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  joined_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    auth.jwt() ->> 'email' LIKE 'admin@%' OR auth.jwt() ->> 'email' = 'hasan.404.dev@gmail.com'
  );

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    auth.jwt() ->> 'email' LIKE 'admin@%' OR auth.jwt() ->> 'email' = 'hasan.404.dev@gmail.com'
  );

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  requested_plan TEXT NOT NULL CHECK (requested_plan IN ('pro', 'professional')),
  amount NUMERIC NOT NULL,
  coin TEXT NOT NULL,
  network TEXT NOT NULL,
  deposit_address TEXT NOT NULL,
  tx_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own payments" ON payments;
CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read all payments" ON payments;
CREATE POLICY "Admins can read all payments"
  ON payments FOR SELECT
  USING (
    auth.jwt() ->> 'email' LIKE 'admin@%' OR auth.jwt() ->> 'email' = 'hasan.404.dev@gmail.com'
  );

DROP POLICY IF EXISTS "Users can insert own payments" ON payments;
CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update payments" ON payments;
CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  USING (
    auth.jwt() ->> 'email' LIKE 'admin@%' OR auth.jwt() ->> 'email' = 'hasan.404.dev@gmail.com'
  );

-- Assets / Main Buttons table
CREATE TABLE IF NOT EXISTS asset_main_buttons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Boxes',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE asset_main_buttons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read assets" ON asset_main_buttons;
CREATE POLICY "Anyone can read assets"
  ON asset_main_buttons FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage assets" ON asset_main_buttons;
CREATE POLICY "Admins can manage assets"
  ON asset_main_buttons FOR ALL
  USING (
    auth.jwt() ->> 'email' LIKE 'admin@%' OR auth.jwt() ->> 'email' = 'hasan.404.dev@gmail.com'
  );

-- Asset Sub Buttons table
CREATE TABLE IF NOT EXISTS asset_sub_buttons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  main_button_id UUID NOT NULL REFERENCES asset_main_buttons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Square',
  preview_link TEXT NOT NULL DEFAULT '',
  zip_link TEXT NOT NULL DEFAULT '',
  access TEXT[] NOT NULL DEFAULT '{free}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE asset_sub_buttons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read sub assets" ON asset_sub_buttons;
CREATE POLICY "Anyone can read sub assets"
  ON asset_sub_buttons FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage sub assets" ON asset_sub_buttons;
CREATE POLICY "Admins can manage sub assets"
  ON asset_sub_buttons FOR ALL
  USING (
    auth.jwt() ->> 'email' LIKE 'admin@%' OR auth.jwt() ->> 'email' = 'hasan.404.dev@gmail.com'
  );

-- Code Files table
CREATE TABLE IF NOT EXISTS code_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_button_id UUID NOT NULL REFERENCES asset_sub_buttons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE code_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read code files" ON code_files;
CREATE POLICY "Anyone can read code files"
  ON code_files FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage code files" ON code_files;
CREATE POLICY "Admins can manage code files"
  ON code_files FOR ALL
  USING (
    auth.jwt() ->> 'email' LIKE 'admin@%' OR auth.jwt() ->> 'email' = 'hasan.404.dev@gmail.com'
  );

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, plan, status, joined_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    'free',
    'active',
    CURRENT_DATE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
