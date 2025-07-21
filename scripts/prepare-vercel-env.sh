#!/bin/bash

# Prepare Vercel Environment Variables
echo "🚀 Preparing Vercel environment variables..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "❌ .env.local file not found!"
  exit 1
fi

# Create .env.production file for Vercel
echo "📝 Creating .env.production for Vercel..."
cp .env.local .env.production

echo "✅ Environment file created: .env.production"
echo "🔍 Now you can deploy to Vercel with: vercel --prod"
echo ""
echo "⚠️  IMPORTANT: After deployment, verify in Vercel dashboard that all"
echo "   environment variables are correctly set under 'Settings > Environment Variables'."
