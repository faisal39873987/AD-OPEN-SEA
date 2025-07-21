-- Create sessions table to track user context
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL,
  service_type TEXT,
  location TEXT,
  user_intent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- If session_id exists in chat_sessions table
  CONSTRAINT fk_chat_session
    FOREIGN KEY (session_id) 
    REFERENCES chat_sessions(id)
    ON DELETE CASCADE
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_session_id_idx ON sessions(session_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own sessions
CREATE POLICY "Users can view their own sessions"
  ON sessions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own sessions
CREATE POLICY "Users can insert their own sessions"
  ON sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own sessions
CREATE POLICY "Users can update their own sessions"
  ON sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Sample comment to help understand the purpose
COMMENT ON TABLE sessions IS 'Stores contextual information about user conversations, including location and service preferences';
