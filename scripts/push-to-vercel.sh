#!/bin/bash

# Script to push environment variables to Vercel
echo "🚀 Pushing environment variables to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI not found. Installing..."
  npm install -g vercel
fi

# Login to Vercel if needed
vercel whoami &> /dev/null || vercel login

# Link to Vercel project if needed
echo "🔗 Linking to Vercel project..."
vercel link

# Read variables from .env.local and push to Vercel
if [ ! -f .env.local ]; then
  echo "❌ .env.local file not found!"
  exit 1
fi

echo "📝 Setting environment variables in Vercel..."

# Define critical variables
CRITICAL_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "STRIPE_SECRET_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "NEXT_PUBLIC_SITE_URL"
  "NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID"
  "NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID"
  "NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID"
  "NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID"
  "NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID"
)

# Push each variable to Vercel
for var in "${CRITICAL_VARS[@]}"; do
  value=$(grep "^${var}=" .env.local | cut -d '=' -f 2-)
  
  if [ -z "$value" ]; then
    echo "⚠️ Warning: $var not found in .env.local"
    continue
  fi
  
  echo "Setting $var..."
  vercel env add plain $var production <<< "$value"
done

echo "✅ Environment variables pushed to Vercel."
echo "🚀 Run 'vercel --prod' to deploy with the new variables."
