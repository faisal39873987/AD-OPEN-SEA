#!/bin/bash
# Deployment script for AD Pulse Web application
# This script performs a manual deployment to AWS S3 and invalidates CloudFront cache

set -e  # Exit on any error

# Load environment variables from .env.local
if [ -f .env.local ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

# Check for required environment variables
if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$AWS_S3_BUCKET_NAME" ] || [ -z "$AWS_CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "Error: Missing required AWS environment variables."
  echo "Please make sure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME, and AWS_CLOUDFRONT_DISTRIBUTION_ID are set."
  exit 1
fi

echo "🚀 Starting deployment of AD Pulse to adplus.app..."

# Build the application
echo "📦 Building application..."
npm run build

# Deploy to S3
echo "🔄 Deploying to S3 bucket: $AWS_S3_BUCKET_NAME"
aws s3 sync ./out "s3://$AWS_S3_BUCKET_NAME" --delete

# Invalidate CloudFront cache
echo "🧹 Invalidating CloudFront cache: $AWS_CLOUDFRONT_DISTRIBUTION_ID"
aws cloudfront create-invalidation --distribution-id "$AWS_CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"

echo "✅ Deployment complete! The site should be live at https://adplus.app"
echo "⏱️ Note: CloudFront invalidation may take a few minutes to propagate globally."
