-- Create an admin role for users
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Add a role column to the auth.users table via the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'user' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT (role = 'admin')::BOOLEAN INTO is_admin
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(is_admin, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies for referral_codes table
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Everyone can read referral codes
CREATE POLICY "Allow public read access to referral_codes" 
  ON public.referral_codes FOR SELECT 
  USING (true);

-- Only admins can insert, update, or delete referral codes
CREATE POLICY "Allow admin insert access to referral_codes" 
  ON public.referral_codes FOR INSERT 
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update access to referral_codes" 
  ON public.referral_codes FOR UPDATE 
  USING (is_admin());

CREATE POLICY "Allow admin delete access to referral_codes" 
  ON public.referral_codes FOR DELETE 
  USING (is_admin());

-- Create RLS policies for categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Everyone can read categories
CREATE POLICY "Allow public read access to categories" 
  ON public.categories FOR SELECT 
  USING (true);

-- Only admins can insert, update, or delete categories
CREATE POLICY "Allow admin insert access to categories" 
  ON public.categories FOR INSERT 
  WITH CHECK (is_admin());

CREATE POLICY "Allow admin update access to categories" 
  ON public.categories FOR UPDATE 
  USING (is_admin());

CREATE POLICY "Allow admin delete access to categories" 
  ON public.categories FOR DELETE 
  USING (is_admin());

-- Create a function to promote a user to admin (to be used by superadmin)
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET role = 'admin'
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if current user is admin (for client-side use)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role::TEXT INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a comment to explain how to promote the first admin
COMMENT ON FUNCTION promote_to_admin IS 
  'To promote the first admin, run the following SQL in the Supabase SQL editor:
   SELECT promote_to_admin(''admin@example.com''); -- Replace with actual admin email';
