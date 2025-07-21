#!/bin/bash
# Script to verify and create required tables in Supabase

echo "🔍 Verifying Supabase database connection and tables..."

# Check if we have the required environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ Error: Missing Supabase environment variables."
  echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
  exit 1
fi

# Create services table SQL
SERVICES_SQL="
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  description TEXT,
  phone TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT now()
);
"

# Create chat_log table SQL
CHAT_LOG_SQL="
CREATE TABLE IF NOT EXISTS chat_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  question TEXT,
  answer TEXT,
  source TEXT,
  created_at TIMESTAMP DEFAULT now()
);
"

# Create temporary SQL file
TMP_SQL_FILE=$(mktemp)
echo "$SERVICES_SQL" > "$TMP_SQL_FILE"
echo "$CHAT_LOG_SQL" >> "$TMP_SQL_FILE"

echo "📊 Creating tables if they don't exist..."
echo "⏳ Running SQL commands on Supabase..."

# Use curl to execute the SQL against the Supabase REST API
curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"sql\":\"$(cat $TMP_SQL_FILE | tr '\n' ' ')\"}"

# Check if the request was successful
if [ $? -eq 0 ]; then
  echo "✅ Database tables created/verified successfully!"
else
  echo "❌ Error: Failed to execute SQL on Supabase."
  echo "Please check your Supabase connection and credentials."
  exit 1
fi

# Clean up the temporary file
rm "$TMP_SQL_FILE"

echo "🎉 Database verification complete! Your Supabase instance is ready."
