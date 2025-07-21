#!/bin/bash
# verify-deployment.sh - Check that all required services are working

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${BOLD}🔍 AD Pulse - Deployment Verification${NC}"
echo "========================================"
echo

# Get the site URL from arguments or use default
SITE_URL="${1:-https://adplus.app}"

echo -e "Checking deployment at ${BOLD}$SITE_URL${NC}"
echo

# Function to check a URL and report status
check_url() {
  local url="$1"
  local description="$2"
  local expected_status="$3"
  
  echo -n "Checking $description... "
  
  # Make the request and capture status code
  status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$status_code" = "$expected_status" ]; then
    echo -e "${GREEN}✅ Success ($status_code)${NC}"
    return 0
  else
    echo -e "${RED}❌ Failed (Expected: $expected_status, Got: $status_code)${NC}"
    return 1
  fi
}

# Check main page
check_url "$SITE_URL" "Main page" "200"
main_status=$?

# Check API endpoint
check_url "$SITE_URL/api/chat" "Chat API" "405"  # POST only, so expect 405 Method Not Allowed
api_status=$?

# Check that chat page loads
check_url "$SITE_URL" "Chat interface" "200"
chat_status=$?

# Check API health endpoint (if exists)
check_url "$SITE_URL/api/health" "Health API" "200"
health_status=$?

echo
echo -e "${BOLD}Deployment Status Summary:${NC}"
echo "==============================="

failures=0
if [ $main_status -eq 0 ]; then
  echo -e "${GREEN}✓ Main page is accessible${NC}"
else
  echo -e "${RED}✗ Main page is NOT accessible${NC}"
  failures=$((failures+1))
fi

if [ $api_status -eq 0 ]; then
  echo -e "${GREEN}✓ API endpoints are accessible${NC}"
else
  echo -e "${RED}✗ API endpoints are NOT accessible${NC}"
  failures=$((failures+1))
fi

if [ $chat_status -eq 0 ]; then
  echo -e "${GREEN}✓ Chat interface is loading${NC}"
else
  echo -e "${RED}✗ Chat interface is NOT loading${NC}"
  failures=$((failures+1))
fi

echo

if [ $failures -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✅ Deployment verification PASSED!${NC}"
  echo -e "Your application appears to be properly deployed and accessible."
else
  echo -e "${RED}${BOLD}❌ Deployment verification FAILED with $failures issues${NC}"
  echo -e "Please check your deployment configuration and logs."
fi

echo
echo -e "${BOLD}Next steps:${NC}"
echo "1. Manually test the chat functionality with different queries"
echo "2. Verify that Supabase integration is working properly"
echo "3. Test the payment process if applicable"
echo

exit $failures
