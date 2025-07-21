# Fixing Vercel Deployment Issues

This guide helps resolve common issues with Vercel deployments, particularly related to environment variables and API configurations.

## Common Deployment Errors

### 1. Environment Variables Missing or Misconfigured

When you see errors like:

```
Error: Neither apiKey nor config.apiVersion provided
```

or

```
Error: STRIPE_SECRET_KEY is not defined in environment variables
```

This indicates that your environment variables are not properly set in Vercel.

### 2. 404 Deployment Not Found

When your deployment shows a 404 error with code `DEPLOYMENT_NOT_FOUND`, it typically means one of these issues:

- The deployment failed to build due to missing environment variables
- There's a configuration issue in your vercel.json file
- API routes are not properly set up or have runtime errors

## Step-by-Step Resolution

### 1. Verify Local Environment First

Run the verification script to ensure your local environment is properly configured:

```bash
npm run verify:env
```

This checks that all necessary environment variables are present in your `.env.local` file.

### 2. Set Up Vercel Environment Variables

Use the provided script to transfer your local environment variables to Vercel:

```bash
npm run vercel:setup
# OR
chmod +x scripts/setup-vercel-env.sh && ./scripts/setup-vercel-env.sh
```

This script reads your `.env.local` file and sets the same variables in your Vercel project.

### 3. Verify Stripe Configuration

The most common deployment issues are related to Stripe configuration. Make sure:

- `STRIPE_SECRET_KEY` is correctly set in Vercel
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is correctly set in Vercel
- The Stripe API version in your code (`2023-10-16`) matches your Stripe account's API version

### 4. Fix Specific Vercel Deployment Issues

If the error persists after setting environment variables:

1. Check your Vercel project settings:
   - Go to the Vercel dashboard
   - Open your project
   - Navigate to "Settings" > "Environment Variables"
   - Ensure all required variables are set for Production

2. Try forcing a clean deployment:
   ```bash
   vercel --prod --force
   ```

3. Check for specific API errors:
   - Open the "Functions" tab in your Vercel dashboard
   - Look for endpoints with errors (particularly payment-related ones)
   - Check the logs for specific error messages

### 5. Check vercel.json Configuration

Ensure your `vercel.json` file has proper configuration:

```json
{
  "version": 2,
  "buildCommand": "npm run verify:env && npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "src/app/api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

## Testing the Fix

After making these changes:

1. Run `vercel --prod` to deploy with the new configuration
2. Test the Stripe payment flow in production
3. Check the Network tab in browser DevTools for any API errors

If you see specific errors in the Vercel logs, you may need to update your API code to handle those cases.

## Further Assistance

If you continue to experience issues, verify:

1. Stripe API version compatibility
2. Network requests in the browser console
3. Server-side logs in the Vercel dashboard

The most important environment variables for Stripe functionality are:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` 
- `STRIPE_WEBHOOK_SECRET`
