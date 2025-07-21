#!/bin/bash
# setup-sessions-table.sh - Create the sessions table in Supabase

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${BOLD}🚀 AD Pulse - Setting Up Sessions Table${NC}"
echo "================================================"
echo

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${RED}❌ Error: .env.local file not found.${NC}"
  echo "Please create .env.local with your Supabase credentials."
  exit 1
fi

# Load environment variables
source .env.local

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}❌ Error: Required environment variables are not set.${NC}"
  echo "Please make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are defined in your .env.local file."
  exit 1
fi

# Create temporary SQL file
TEMP_SQL=$(mktemp)
cat database/create_sessions_table.sql > "$TEMP_SQL"
cat database/session_context_function.sql >> "$TEMP_SQL"

echo -e "\n${BOLD}Creating sessions table and functions...${NC}"

# Execute the SQL using PSQL via the Supabase REST API
RESULT=$(curl -s -X POST \
  "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$(cat "$TEMP_SQL" | tr '\n' ' ' | sed 's/"/\\"/g')\"}")

# Remove temporary file
rm "$TEMP_SQL"

# Check for errors
if [[ $RESULT == *"error"* ]]; then
  echo -e "${RED}❌ Error creating sessions table:${NC}"
  echo "$RESULT" | grep -o '"message":"[^"]*"' | sed 's/"message":"\(.*\)"/\1/'
  exit 1
fi

echo -e "${GREEN}✅ Sessions table and functions created successfully!${NC}"
echo
echo -e "The sessions table is now set up with:${NC}"
echo " - Ability to track user location preferences"
echo " - Service type tracking"
echo " - User intent recognition"
echo " - Automatic context updates via the update_session_context function"
echo
echo -e "${BOLD}Next Steps:${NC}"
echo "1. Restart your application to use the new session tracking"
echo "2. Test the improved chat intelligence by asking about services without location"
echo "3. Observe how the chat assistant asks for more specific information"
echo

exit 0
