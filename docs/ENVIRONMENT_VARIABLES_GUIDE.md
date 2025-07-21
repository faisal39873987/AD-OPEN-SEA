# Environment Variables Guide

This document provides guidance on how to configure and manage environment variables for the AD Pulse application.

## Environment Files

The project uses multiple environment files for different purposes:

- `.env.local`: Local development environment variables (not committed to Git)
- `.env.example`: Example environment variables template (committed to Git)
- `.env.production`: Production environment variables (committed to Git, but uses placeholders)

## Required Environment Variables

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

- **NEXT_PUBLIC_SUPABASE_URL**: The URL of your Supabase project
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: The public anon key for client-side Supabase access
- **SUPABASE_SERVICE_ROLE_KEY**: The service role key for server-side Supabase access

### OpenAI Configuration
```
OPENAI_API_KEY=your-openai-api-key
```

- **OPENAI_API_KEY**: Your OpenAI API key for GPT integration

### Stripe Configuration
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: The publishable key for Stripe client-side SDK
- **STRIPE_SECRET_KEY**: The secret key for Stripe server-side API
- **STRIPE_WEBHOOK_SECRET**: The webhook secret for validating Stripe webhook events

### Deployment URLs
```
NEXT_PUBLIC_SITE_URL=https://adplus.app
NEXT_PUBLIC_VERCEL_URL=
```

- **NEXT_PUBLIC_SITE_URL**: The primary URL of your application
- **NEXT_PUBLIC_VERCEL_URL**: Automatically set by Vercel in production

### Stripe Product IDs
```
NEXT_PUBLIC_STRIPE_STANDARD_PRODUCT_ID=prod_...
NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID=price_...
```

## Environment Setup for Different Platforms

### Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in all the required values with real API keys
3. Never commit `.env.local` to Git (it's in `.gitignore`)

### Vercel Deployment

1. Add all environment variables in the Vercel project settings
2. Ensure variables marked as `NEXT_PUBLIC_` are exposed to the browser
3. The `.env.production` file uses placeholders that Vercel will replace

### GitHub Actions

1. Add all sensitive environment variables as GitHub Secrets
2. Reference them in your GitHub Actions workflow files
3. Example: `OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}`

## Verification

You can verify your environment variables are set correctly by running:

```bash
npm run verify:all
```

This will check:
1. All required environment variables are set
2. Supabase connection is working
3. Stripe API connection is working

If you need to verify just the Stripe configuration:

```bash
npm run verify:stripe
```

## Security Best Practices

1. Never commit real API keys to Git
2. Use different API keys for development and production
3. Regularly rotate your API keys
4. Use the most restrictive permissions possible for each key
5. Only expose variables to the browser when necessary (using `NEXT_PUBLIC_` prefix)
