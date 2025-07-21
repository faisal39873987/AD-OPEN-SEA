#!/bin/bash
# setup-vercel-env.sh - Set up environment variables in Vercel

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${BOLD}🚀 AD Pulse - Vercel Environment Setup${NC}"
echo "=========================================="
echo

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}⚠️ Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install Vercel CLI.${NC}"
    echo "Please install manually with: npm install -g vercel"
    exit 1
  fi
fi

echo -e "${BOLD}This script will help you set up your environment variables in Vercel.${NC}"
echo -e "It will read from your .env.local file and push the variables to Vercel."
echo

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${RED}❌ Error: .env.local file not found.${NC}"
  echo "Please create a .env.local file first."
  exit 1
fi

# Confirm action
read -p "Do you want to continue? (y/N): " continue_action
if [[ ! "$continue_action" =~ ^[Yy]$ ]]; then
  echo -e "Setup cancelled."
  exit 0
fi

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

# Read critical environment variables from .env.local
CRITICAL_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "NEXT_PUBLIC_SITE_URL"
  "OPENAI_API_KEY"
  "STRIPE_SECRET_KEY"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID"
  "NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID"
  "NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID"
  "NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID"
  "NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID"
)

# Set each environment variable in Vercel
success_count=0
for var in "${CRITICAL_VARS[@]}"; do
  value=$(grep "^${var}=" .env.local | cut -d '=' -f 2-)
  
  # Skip if variable not found or has placeholder value
  if [ -z "$value" ] || [[ $value == "your-"* ]]; then
    echo -e "${YELLOW}⚠️ Skipping ${var}: Not set or has placeholder value${NC}"
    continue
  fi
  
  echo -e "Setting ${var}..."
  vercel env add plain ${var} production <<< "$value" &>/dev/null
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully added ${var}${NC}"
    success_count=$((success_count+1))
  else
    echo -e "${YELLOW}⚠️ Variable may already exist in Vercel: ${var}${NC}"
  fi
done

echo -e "\n${GREEN}✅ Completed setting up $success_count environment variables in Vercel.${NC}"
echo -e "\n${BOLD}Next Steps:${NC}"
echo "1. If you received warnings, verify those variables in the Vercel dashboard"
echo "2. Run 'vercel --prod' to deploy your application with the new environment variables"
echo "3. Verify your deployment works correctly with the Stripe integration"

exit 0
