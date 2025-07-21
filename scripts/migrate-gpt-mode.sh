#!/bin/bash

# Execute GPT Mode column and RLS policies migrations

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting GPT Mode database migration...${NC}"

# Check if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo -e "${RED}Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be set.${NC}"
  echo -e "You can set them with:"
  echo -e "export SUPABASE_URL=your_supabase_url"
  echo -e "export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
  exit 1
fi

# Execute the migrations using the Supabase API
echo -e "${YELLOW}Adding gpt_mode_enabled column to users table...${NC}"
curl -X POST \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d @./database/migrations/add_gpt_mode_column.sql \
  "$SUPABASE_URL/rest/v1/rpc/exec_sql"

echo -e "${YELLOW}Setting up RLS policies for gpt_mode_enabled...${NC}"
curl -X POST \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d @./database/migrations/add_gpt_mode_rls_policies.sql \
  "$SUPABASE_URL/rest/v1/rpc/exec_sql"

echo -e "${GREEN}GPT Mode migration completed successfully!${NC}"
echo -e "Users can now personalize their GPT mode preference, which will be stored in their profile."
echo -e "See docs/GPT_MODE_PERSONALIZATION.md for implementation details."
