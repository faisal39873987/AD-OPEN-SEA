# Environment Variables Guide

This guide explains how to set up environment variables for AD Pulse Web, both locally and in production environments.

## Required Environment Variables

| Variable Name | Description | Required? | Example |
|---------------|-------------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ | https://yourproject.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ | eyJhbGciOiJIUzI1NiIsIn... |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ | eyJhbGciOiJIUzI1NiIsIn... |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ✅ | pk_test_51RlT1x2ezo... |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ | sk_test_51RlT1x2ezo... |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ✅ | whsec_J7nYo43gePsidkj... |

## Recommended Variables

| Variable Name | Description | Required? | Example |
|---------------|-------------|-----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for GPT fallback | ❔ | sk-1234567890abcdef... |
| `NEXT_PUBLIC_GPT_ASSISTANT_URL` | GPT Assistant URL | ❔ | https://chatgpt.com/g/... |
| `NEXT_PUBLIC_SITE_URL` | Public URL for the site | ❔ | https://adplus.app |
| `NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID` | Stripe price ID | ❔ | price_123456... |

## Environment Files

The project uses the following environment files:

1. `.env.local` - For local development (not committed to git)
2. `.env.production` - For production settings (uses variable interpolation)
3. `.env.example` - Template for setting up environment variables

## Setting Up Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in all required values in `.env.local`.

3. Run the verification script to ensure all variables are set:
   ```bash
   npm run verify:env
   ```

## Setting Up Production Environment (Vercel)

1. Go to your Vercel project settings.
2. Navigate to the "Environment Variables" tab.
3. Add all required environment variables from the table above.
4. Redeploy your application after setting variables.

## Stripe Configuration

For Stripe to work properly:

1. Ensure both `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` are set.
2. The API version in the code matches your Stripe account version (2023-10-16 or later).
3. Test the payment flow locally before deploying to production.

## Troubleshooting

If you encounter errors related to environment variables:

1. Run `npm run verify:env` to check for missing variables.
2. For "STRIPE_SECRET_KEY is not defined" errors, check your Vercel environment variables.
3. For 404 deployment errors, verify your Vercel project configuration.

## Security Notes

- Never commit your actual API keys to git.
- Use environment variables for all sensitive information.
- Consider using Vercel's environment variable encryption for production keys.
