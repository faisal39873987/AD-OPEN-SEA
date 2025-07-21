# Fix for Failed Vercel Deployment

The deployment is failing due to missing environment variables. Here's how to fix it:

## Step 1: Check Your Vercel Environment Variables

1. Go to the [Vercel Dashboard](https://vercel.com)
2. Select your project (ad-open-sea-4dnf)
3. Go to "Settings" > "Environment Variables"
4. Verify that you have all these required variables set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

## Step 2: Set Up Environment Variables

You can manually add the variables through the Vercel UI, or use our script:

```bash
npm run vercel:setup
```

This script will copy your local environment variables to Vercel.

## Step 3: Fix the Failed Build

1. After setting the environment variables, force a fresh build:

```bash
vercel --prod --force
```

2. Monitor the deployment logs to ensure all variables are present

## Common Issues

### Error: "Neither apiKey nor config.apiVersion provided"

This happens when the Stripe secret key is missing or invalid in Vercel. Check:
- That `STRIPE_SECRET_KEY` is properly set in Vercel
- That the API version in your code (`2023-10-16`) matches your Stripe account's API version

### Error: "404 - DEPLOYMENT_NOT_FOUND"

This happens when:
- The deployment process fails due to missing variables
- There's a configuration error in vercel.json
- The build process fails during validation

## Final Verification

After deployment succeeds, check the payment flow by:
1. Accessing your site
2. Initiating a payment process
3. Check the network tab in browser dev tools for any API errors

If you see "Neither apiKey nor config.apiVersion provided" errors in the logs, make sure the `STRIPE_SECRET_KEY` is properly set in your Vercel environment variables.
