-- Add RLS policy to allow users to update their own gpt_mode_enabled
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to update their own gpt_mode_enabled
CREATE POLICY update_gpt_mode_policy
  ON auth.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure profiles table also has appropriate RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view their own profile
CREATE POLICY read_own_profile
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy for authenticated users to update their own profile
CREATE POLICY update_own_profile
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
