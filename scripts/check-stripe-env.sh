#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}  Stripe Environment Variable Check   ${NC}"
echo -e "${BLUE}======================================${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}⚠️ .env.local file not found!${NC}"
  echo -e "Creating a sample .env.local file with Stripe variables..."
  
  cat > .env.local <<EOL
# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Existing variables will remain unchanged
EOL

  echo -e "${GREEN}✅ Sample .env.local created!${NC}"
  echo -e "${YELLOW}⚠️ Please edit .env.local and add your actual Stripe API keys${NC}"
else
  echo -e "${GREEN}✅ .env.local file exists${NC}"
  
  # Check if Stripe variables are set in .env.local
  grep -q "STRIPE_SECRET_KEY=" .env.local
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ STRIPE_SECRET_KEY is missing in .env.local${NC}"
    echo -e "Adding it to .env.local..."
    echo -e "\n# Stripe Configuration\nSTRIPE_SECRET_KEY=your_stripe_secret_key_here" >> .env.local
    echo -e "${YELLOW}⚠️ Please update the STRIPE_SECRET_KEY value in .env.local${NC}"
  else
    STRIPE_SECRET_KEY_VALUE=$(grep "STRIPE_SECRET_KEY=" .env.local | cut -d '=' -f2)
    if [ "$STRIPE_SECRET_KEY_VALUE" = "your_stripe_secret_key_here" ] || [ -z "$STRIPE_SECRET_KEY_VALUE" ]; then
      echo -e "${RED}❌ STRIPE_SECRET_KEY is not set with a real value${NC}"
    else
      echo -e "${GREEN}✅ STRIPE_SECRET_KEY is set${NC}"
    fi
  fi
  
  # Check for publishable key
  grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=" .env.local
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing in .env.local${NC}"
    echo -e "Adding it to .env.local..."
    echo -e "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here" >> .env.local
    echo -e "${YELLOW}⚠️ Please update the NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY value in .env.local${NC}"
  else
    echo -e "${GREEN}✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set${NC}"
  fi
fi

echo -e "\n${BLUE}=== Verifying ENV Variables in the Current Shell ===${NC}"
if [ -z "$STRIPE_SECRET_KEY" ]; then
  echo -e "${RED}❌ STRIPE_SECRET_KEY is not set in current shell environment${NC}"
  echo -e "${YELLOW}⚠️ Run: export STRIPE_SECRET_KEY=your_stripe_secret_key_here${NC}"
else
  echo -e "${GREEN}✅ STRIPE_SECRET_KEY is set in current shell environment${NC}"
fi

if [ -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ]; then
  echo -e "${RED}❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set in current shell environment${NC}"
  echo -e "${YELLOW}⚠️ Run: export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here${NC}"
else
  echo -e "${GREEN}✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is set in current shell environment${NC}"
fi

echo -e "\n${BLUE}=== Instructions ===${NC}"
echo -e "${YELLOW}1. Make sure you have added your actual Stripe API keys to .env.local${NC}"
echo -e "${YELLOW}2. For local development, also export the variables in your shell:${NC}"
echo -e "   export STRIPE_SECRET_KEY=your_stripe_secret_key_here"
echo -e "   export NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here"
echo -e "${YELLOW}3. Restart your development server:${NC}"
echo -e "   npm run dev"
echo -e "\n${GREEN}Done!${NC}"
