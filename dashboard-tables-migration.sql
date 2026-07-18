-- Activity Logs table to track user activities
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('USER_CREATED', 'USER_UPDATED', 'PAYMENT_SUBMITTED', 'PAYMENT_APPROVED', 'PAYMENT_REJECTED', 'ASSET_DOWNLOADED', 'PLAN_UPGRADED', 'USER_SUSPENDED', 'USER_ACTIVATED')),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read all activity logs" ON activity_logs;
CREATE POLICY "Admins can read all activity logs"
  ON activity_logs FOR SELECT
  USING (
    auth.jwt() ->> 'email' LIKE 'admin@%' OR auth.jwt() ->> 'email' = 'hasan.404.dev@gmail.com'
  );

DROP POLICY IF EXISTS "System can insert activity logs" ON activity_logs;
CREATE POLICY "System can insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (true);

-- Component Installs table to track component downloads/installs
CREATE TABLE IF NOT EXISTS component_installs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  component_id UUID REFERENCES asset_sub_buttons(id) ON DELETE CASCADE,
  component_name TEXT NOT NULL,
  user_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE component_installs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read all installs" ON component_installs;
CREATE POLICY "Admins can read all installs"
  ON component_installs FOR SELECT
  USING (
    auth.jwt() ->> 'email' LIKE 'admin@%' OR auth.jwt() ->> 'email' = 'hasan.404.dev@gmail.com'
  );

DROP POLICY IF EXISTS "Users can read own installs" ON component_installs;
CREATE POLICY "Users can read own installs"
  ON component_installs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can insert installs" ON component_installs;
CREATE POLICY "Authenticated users can insert installs"
  ON component_installs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_component_installs_created_at ON component_installs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_activity_type ON activity_logs(activity_type);

-- Function to auto-log user creation
CREATE OR REPLACE FUNCTION log_user_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activity_logs (user_id, user_email, activity_type, description)
  VALUES (
    NEW.id,
    NEW.email,
    'USER_CREATED',
    'New user signup: ' || NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_user_creation();

-- Function to auto-log payment submissions
CREATE OR REPLACE FUNCTION log_payment_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.activity_logs (user_id, user_email, activity_type, description, metadata)
    VALUES (
      NEW.user_id,
      NEW.user_email,
      'PAYMENT_SUBMITTED',
      'Payment submitted for ' || NEW.requested_plan || ' plan',
      jsonb_build_object('amount', NEW.amount, 'coin', NEW.coin, 'plan', NEW.requested_plan)
    );
  ELSIF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) THEN
    IF (NEW.status = 'approved') THEN
      INSERT INTO public.activity_logs (user_id, user_email, activity_type, description, metadata)
      VALUES (
        NEW.user_id,
        NEW.user_email,
        'PAYMENT_APPROVED',
        'Payment approved for ' || NEW.requested_plan || ' plan',
        jsonb_build_object('amount', NEW.amount, 'plan', NEW.requested_plan)
      );
    ELSIF (NEW.status = 'rejected') THEN
      INSERT INTO public.activity_logs (user_id, user_email, activity_type, description, metadata)
      VALUES (
        NEW.user_id,
        NEW.user_email,
        'PAYMENT_REJECTED',
        'Payment rejected for ' || NEW.requested_plan || ' plan',
        jsonb_build_object('amount', NEW.amount, 'plan', NEW.requested_plan)
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_payment_activity ON payments;
CREATE TRIGGER on_payment_activity
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION log_payment_activity();

-- Function to auto-log profile updates
CREATE OR REPLACE FUNCTION log_profile_updates()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status != NEW.status) THEN
    IF (NEW.status = 'suspended') THEN
      INSERT INTO public.activity_logs (user_id, user_email, activity_type, description)
      VALUES (
        NEW.id,
        NEW.email,
        'USER_SUSPENDED',
        'User account suspended: ' || NEW.email
      );
    ELSIF (NEW.status = 'active' AND OLD.status = 'suspended') THEN
      INSERT INTO public.activity_logs (user_id, user_email, activity_type, description)
      VALUES (
        NEW.id,
        NEW.email,
        'USER_ACTIVATED',
        'User account activated: ' || NEW.email
      );
    END IF;
  END IF;
  
  IF (OLD.plan != NEW.plan) THEN
    INSERT INTO public.activity_logs (user_id, user_email, activity_type, description, metadata)
    VALUES (
      NEW.id,
      NEW.email,
      'PLAN_UPGRADED',
      'Plan upgraded from ' || OLD.plan || ' to ' || NEW.plan,
      jsonb_build_object('old_plan', OLD.plan, 'new_plan', NEW.plan)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
CREATE TRIGGER on_profile_updated
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION log_profile_updates();
