-- Function to update session context
CREATE OR REPLACE FUNCTION update_session_context(
  p_session_id UUID,
  p_service_type TEXT DEFAULT NULL,
  p_location TEXT DEFAULT NULL,
  p_user_intent TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_existing_session_id UUID;
BEGIN
  -- Get the user_id from the chat_sessions table
  SELECT user_id INTO v_user_id
  FROM chat_sessions
  WHERE id = p_session_id;
  
  -- Check if there's already a session context record
  SELECT id INTO v_existing_session_id
  FROM sessions
  WHERE session_id = p_session_id;
  
  IF v_existing_session_id IS NULL THEN
    -- Insert new record
    INSERT INTO sessions (
      user_id,
      session_id,
      service_type,
      location,
      user_intent
    ) VALUES (
      v_user_id,
      p_session_id,
      p_service_type,
      p_location,
      p_user_intent
    );
  ELSE
    -- Update existing record
    UPDATE sessions
    SET
      service_type = COALESCE(p_service_type, service_type),
      location = COALESCE(p_location, location),
      user_intent = COALESCE(p_user_intent, user_intent),
      updated_at = NOW()
    WHERE session_id = p_session_id;
  END IF;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
