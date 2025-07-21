#!/bin/bash
# setup-complete.sh - Complete setup script for AD Pulse
# This script verifies the database, inserts sample data, and checks environment variables

# Text formatting
BOLD="\033[1m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${BOLD}🚀 AD Pulse - Complete Setup Script${NC}"
echo "================================================"
echo

# Check if scripts exist and are executable
if [ ! -f ./scripts/verify-supabase.sh ] || [ ! -f ./scripts/insert-sample-data.sh ]; then
  echo -e "${RED}❌ Error: Required scripts not found.${NC}"
  echo "Please ensure you're running this from the project root directory and that the following files exist:"
  echo "  - scripts/verify-supabase.sh"
  echo "  - scripts/insert-sample-data.sh"
  exit 1
fi

# Make scripts executable
chmod +x ./scripts/verify-supabase.sh
chmod +x ./scripts/insert-sample-data.sh

# Check for .env.local file
echo -e "${BOLD}Checking environment setup...${NC}"
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}⚠️ Warning: .env.local file not found${NC}"
  
  # Check if .env.example exists to copy from
  if [ -f .env.example ]; then
    echo -e "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo -e "${GREEN}✅ Created .env.local from template${NC}"
    echo -e "${YELLOW}⚠️ Remember to update the values in .env.local with your actual keys!${NC}"
  else
    echo -e "${RED}❌ No .env.example found to create from.${NC}"
    echo "Please create a .env.local file manually with the required environment variables."
    exit 1
  fi
fi

# Check for required environment variables
echo -e "\n${BOLD}Checking required environment variables...${NC}"
required_vars=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "NEXT_PUBLIC_SITE_URL"
  "OPENAI_API_KEY"
)

missing_vars=0
for var in "${required_vars[@]}"; do
  if ! grep -q "^${var}=" .env.local || grep -q "^${var}=$" .env.local; then
    echo -e "${RED}❌ Missing or empty: ${var}${NC}"
    missing_vars=$((missing_vars+1))
  else
    echo -e "${GREEN}✅ Found: ${var}${NC}"
  fi
done

if [ $missing_vars -gt 0 ]; then
  echo -e "\n${YELLOW}⚠️ Warning: ${missing_vars} environment variables are missing or empty.${NC}"
  echo "Please update your .env.local file before continuing."
  read -p "Continue anyway? (y/N): " continue_anyway
  if [[ ! "$continue_anyway" =~ ^[Yy]$ ]]; then
    echo "Setup aborted. Please fix the environment variables and try again."
    exit 1
  fi
fi

# Run database verification script
echo -e "\n${BOLD}Running database verification...${NC}"
./scripts/verify-supabase.sh

# Check if verification succeeded
if [ $? -ne 0 ]; then
  echo -e "\n${RED}❌ Database verification failed.${NC}"
  echo "Please check the error messages above and fix any issues before continuing."
  exit 1
fi

# Ask user if they want to insert sample data
echo -e "\n${BOLD}Sample Data${NC}"
read -p "Do you want to insert sample service data into Supabase? (y/N): " insert_sample
if [[ "$insert_sample" =~ ^[Yy]$ ]]; then
  echo -e "\n${BOLD}Inserting sample data...${NC}"
  ./scripts/insert-sample-data.sh
  
  if [ $? -ne 0 ]; then
    echo -e "\n${RED}❌ Sample data insertion failed.${NC}"
    echo "Please check the error messages above and fix any issues."
    # Continue anyway since this is not critical
  fi
else
  echo -e "\n${YELLOW}ℹ️ Skipping sample data insertion.${NC}"
fi

# Check if npm packages are installed
echo -e "\n${BOLD}Checking for dependencies...${NC}"
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}⚠️ node_modules not found. Installing dependencies...${NC}"
  npm install
  
  if [ $? -ne 0 ]; then
    echo -e "\n${RED}❌ Dependency installation failed.${NC}"
    echo "Please check the error messages above and fix any issues."
    exit 1
  fi
else
  echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

# Setup sessions table for intelligent follow-up
echo -e "\n${BOLD}Setting up sessions table for intelligent follow-up...${NC}"
if [ -f "./scripts/setup-sessions-table.sh" ]; then
  chmod +x ./scripts/setup-sessions-table.sh
  ./scripts/setup-sessions-table.sh
  
  if [ $? -ne 0 ]; then
    echo -e "\n${YELLOW}⚠️ Sessions table setup failed, but continuing...${NC}"
    echo "You can manually set up the sessions table later with: ./scripts/setup-sessions-table.sh"
  fi
else
  echo -e "${RED}❌ sessions table setup script not found${NC}"
  echo "Please ensure scripts/setup-sessions-table.sh exists"
fi

# Final success message
echo -e "\n${GREEN}${BOLD}✅ Setup completed successfully!${NC}"
echo -e "\nYou can now start the development server with:"
echo -e "${BOLD}npm run dev${NC}"
echo -e "\nTry these example queries in the chat:"
echo -e "- \"Looking for a plumber\""
echo -e "- \"Cleaning services in Reem\""
echo -e "- \"I need AC repair\""
echo -e "\nTo deploy to production, merge to main branch:"
echo -e "${BOLD}git checkout main && git merge clean-branch && git push origin main${NC}"
echo -e "\nThank you for setting up AD Pulse! 🎉"
