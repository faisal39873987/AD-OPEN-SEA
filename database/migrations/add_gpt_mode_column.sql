-- Add gpt_mode_enabled column to auth.users table
ALTER TABLE auth.users ADD COLUMN gpt_mode_enabled BOOLEAN DEFAULT true;

-- Create a function to handle profile updates
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Copy gpt_mode_enabled setting to profiles table if needed
  UPDATE public.profiles
  SET gpt_mode_enabled = NEW.gpt_mode_enabled
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync updates
CREATE TRIGGER on_user_updated
  AFTER UPDATE OF gpt_mode_enabled ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_user_update();

-- Ensure profiles table has the same column if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    BEGIN
      ALTER TABLE public.profiles ADD COLUMN gpt_mode_enabled BOOLEAN DEFAULT true;
    EXCEPTION
      WHEN duplicate_column THEN NULL;
    END;
  END IF;
END $$;
