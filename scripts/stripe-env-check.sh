#!/bin/bash
# stripe-env-check.sh - Verify Stripe environment variables

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${BOLD}🔐 AD Pulse - Stripe Environment Check${NC}"
echo "==========================================="
echo

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${RED}❌ Error: .env.local file not found.${NC}"
  exit 1
fi

# List of required Stripe environment variables
STRIPE_VARS=(
  "STRIPE_SECRET_KEY"
  "STRIPE_PUBLISHABLE_KEY"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "STRIPE_WEBHOOK_SECRET"
)

# Check each Stripe variable
missing_vars=0
for var in "${STRIPE_VARS[@]}"; do
  if ! grep -q "^${var}=" .env.local || grep -q "^${var}=$" .env.local || grep -q "^${var}=your-" .env.local; then
    echo -e "${RED}❌ Missing or placeholder: ${var}${NC}"
    missing_vars=$((missing_vars+1))
  else
    echo -e "${GREEN}✅ Found: ${var}${NC}"
  fi
done

# If any variables are missing, provide guidance
if [ $missing_vars -gt 0 ]; then
  echo -e "\n${YELLOW}⚠️ Warning: ${missing_vars} Stripe environment variables are missing or have placeholder values.${NC}"
  echo -e "\n${BOLD}How to fix:${NC}"
  echo "1. Get your Stripe API keys from https://dashboard.stripe.com/apikeys"
  echo "2. Add them to your .env.local file"
  echo "3. Make sure they are also added to your Vercel environment variables"
  
  echo -e "\n${BOLD}Example:${NC}"
  echo "STRIPE_SECRET_KEY=sk_test_..."
  echo "STRIPE_PUBLISHABLE_KEY=pk_test_..."
  echo "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_..."
  echo "STRIPE_WEBHOOK_SECRET=whsec_..."
  
  echo -e "\n${BOLD}For Vercel deployment:${NC}"
  echo "1. Go to your Vercel project"
  echo "2. Navigate to Settings > Environment Variables"
  echo "3. Add each variable with its corresponding value"
  echo "4. Redeploy your application"
  
  exit 1
else
  echo -e "\n${GREEN}✅ All required Stripe environment variables are set.${NC}"
fi

exit 0
