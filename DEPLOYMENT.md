# Deployment Checklist for AD Pulse

## Prerequisites
- [ ] AWS account configured with proper permissions
- [ ] S3 bucket created for static hosting
- [ ] CloudFront distribution set up for CDN
- [ ] Route53 domain (adplus.app) configured to point to CloudFront
- [ ] Supabase project created and configured
- [ ] OpenAI API key obtained

## Environment Variables
Make sure these environment variables are set in GitHub Secrets:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `OPENAI_API_KEY`
- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_S3_BUCKET_NAME`
- [ ] `AWS_CLOUDFRONT_DISTRIBUTION_ID`
- [ ] `SLACK_WEBHOOK_URL` (optional for notifications)

## Database Setup
- [ ] Run database migrations to create necessary tables
- [ ] Verify service data is loaded
- [ ] Set up full-text search indexes for service descriptions

## Pre-Deployment Tasks
- [ ] Run tests locally
- [ ] Check performance with Lighthouse
- [ ] Ensure all assets are optimized
- [ ] Update version number in package.json

## Deployment Process
1. Push changes to the main branch
2. GitHub Actions will automatically:
   - Build the application
   - Deploy to S3
   - Invalidate CloudFront cache
   - Notify team via Slack

## Post-Deployment Verification
- [ ] Check that the site loads at https://adplus.app
- [ ] Verify authentication flows
- [ ] Test chat functionality with Supabase and OpenAI fallback
- [ ] Verify service search functionality
- [ ] Check mobile responsiveness

## Rollback Plan
If issues are found:
1. Revert the commit in GitHub
2. Manually trigger the deployment workflow
3. Or restore from the previous S3 backup

## Contacts
- Technical Lead: [Your Name]
- DevOps Contact: [DevOps Name]
- Supabase Admin: [DB Admin Name]
