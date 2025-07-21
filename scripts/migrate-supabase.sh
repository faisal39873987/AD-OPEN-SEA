#!/bin/bash
# Supabase Database Migration Script
# This script helps you execute the migration SQL in your Supabase project

# Colors for better output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== AD PLUS Assistant Database Migration ===${NC}"
echo "This script will help you migrate your Supabase database."
echo

# Step 1: Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Supabase CLI is not installed.${NC}"
    echo "Please install it first with:"
    echo "  npm install -g supabase"
    echo "  or"
    echo "  brew install supabase/tap/supabase"
    exit 1
fi

echo -e "${GREEN}✓ Supabase CLI found${NC}"

# Step 2: Find the migration SQL file
SQL_FILE="./database/supabase_migration.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}Migration SQL file not found at: $SQL_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found migration SQL file${NC}"
echo

# Step 3: Show instructions
echo -e "${YELLOW}=== Migration Instructions ===${NC}"
echo "Since Supabase CLI doesn't directly support executing arbitrary SQL,"
echo "we'll guide you through manual execution in the Supabase Dashboard."
echo
echo "1. Go to your Supabase dashboard: https://app.supabase.com"
echo "2. Select your project with URL: https://cceuyhebxxqafmrmnqhq.supabase.co"
echo "3. Click on 'SQL Editor' in the left sidebar"
echo "4. Click 'New query'"
echo "5. Copy and paste the following SQL into the editor:"
echo
echo -e "${YELLOW}--- SQL Content Start ---${NC}"
cat "$SQL_FILE"
echo -e "${YELLOW}--- SQL Content End ---${NC}"
echo
echo -e "${GREEN}Then click 'Run' to execute the SQL.${NC}"
echo
echo "After running the SQL, you should see the following tables in your Table Editor:"
echo "- services (with 8 sample records)"
echo "- user_requests (empty)"
echo "- user_feedback (empty)"
echo
echo "The old tables (messages, subscription, schema_migrations) should be deleted."

# Step 4: Offer to open the file
echo 
echo -e "${YELLOW}Would you like to open the SQL file now? (y/n)${NC}"
read -r answer

if [[ "$answer" =~ ^[Yy]$ ]]; then
    # Try to open with different commands depending on OS
    if command -v open &> /dev/null; then
        open "$SQL_FILE"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$SQL_FILE"
    elif command -v start &> /dev/null; then
        start "$SQL_FILE"
    else
        echo -e "${RED}Could not open the file automatically.${NC}"
        echo "Please open it manually at: $SQL_FILE"
    fi
fi

echo
echo -e "${GREEN}Migration script complete. Please follow the instructions above.${NC}"
echo "Once completed, verify your tables in the Table Editor of your Supabase Dashboard."
