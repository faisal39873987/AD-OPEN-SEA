#!/bin/bash

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${BOLD}🚀 AD Pulse - Manual Vercel Environment Setup${NC}"
echo "=========================================="
echo

# Login to Vercel if needed
echo -e "\n${BOLD}Verifying Vercel login...${NC}"
vercel whoami &>/dev/null
if [ $? -ne 0 ]; then
  echo -e "Please log in to Vercel:"
  vercel login
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to log in to Vercel.${NC}"
    exit 1
  fi
fi

echo -e "\n${BOLD}Setting up environment variables in Vercel...${NC}"

# Manually setting each variable
echo "Setting NEXT_PUBLIC_SUPABASE_URL..."
vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "Setting NEXT_PUBLIC_SUPABASE_ANON_KEY..."
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "Setting SUPABASE_SERVICE_ROLE_KEY..."
vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo "Setting NEXT_PUBLIC_SITE_URL..."
vercel env add NEXT_PUBLIC_SITE_URL production
echo "Setting OPENAI_API_KEY..."
vercel env add OPENAI_API_KEY production
echo "Setting STRIPE_SECRET_KEY..."
vercel env add STRIPE_SECRET_KEY production
echo "Setting NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY..."
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
echo "Setting STRIPE_WEBHOOK_SECRET..."
vercel env add STRIPE_WEBHOOK_SECRET production
echo "Setting NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID..."
vercel env add NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID production
echo "Setting NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID..."
vercel env add NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID production
echo "Setting NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID..."
vercel env add NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID production
echo "Setting NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID..."
vercel env add NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID production
echo "Setting NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID..."
vercel env add NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID production
echo "Setting SUPABASE_SECRET_KEY..."
vercel env add SUPABASE_SECRET_KEY production
echo "Setting SUPABASE_PUBLISHABLE_KEY..."
vercel env add SUPABASE_PUBLISHABLE_KEY production
echo "Setting SUPABASE_DB_PASSWORD..."
vercel env add SUPABASE_DB_PASSWORD production
echo "Setting SUPABASE_JWT_SECRET..."
vercel env add SUPABASE_JWT_SECRET production
echo "Setting SUPABASE_STANDBY_KEY..."
vercel env add SUPABASE_STANDBY_KEY production
echo "Setting SUPABASE_CURRENT_KEY..."
vercel env add SUPABASE_CURRENT_KEY production

echo -e "\n${GREEN}✅ Environment setup process completed.${NC}"
echo -e "\n${BOLD}Next Steps:${NC}"
echo "1. Verify the variables in the Vercel dashboard"
echo "2. Run 'vercel --prod' to deploy your application with the new environment variables"
echo "3. Verify your deployment works correctly with all integrations"

exit 0
