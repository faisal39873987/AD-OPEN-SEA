# Stripe Integration Setup

## Overview

The AD Pulse platform uses Stripe for processing payments. This document provides instructions for setting up and configuring Stripe integration in your development and production environments.

## Required API Keys

You'll need the following Stripe API keys:

1. **Secret Key**: Used for server-side operations like creating payment intents
2. **Publishable Key**: Used for client-side operations and Stripe Elements
3. **Webhook Secret**: Used for verifying webhook events from Stripe (for production)

## Environment Variables

Add the following environment variables to your `.env.local` file for development:

```
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_key
```

For production, these should be set in your deployment platform (Vercel, AWS, etc.).

## API Version

We're currently using Stripe API version `2023-10-16`. This is specified in the API client initialization:

```typescript
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16' as any,
});
```

## Testing Stripe Integration

### 1. Check Environment Variables

Run the verification script:

```bash
./scripts/check-stripe-env.sh
```

This will:
- Verify that your `.env.local` file contains the necessary Stripe keys
- Check if the keys are set in your current shell environment
- Provide instructions for setting up missing variables

### 2. Test Payment Processing

To test a payment flow:

1. Start the development server: `npm run dev`
2. Navigate to a subscription or checkout page
3. Use Stripe's test card numbers:
   - Success: `4242 4242 4242 4242`
   - Require Authentication: `4000 0025 0000 3155`
   - Decline: `4000 0000 0000 0002`

## Troubleshooting

### Common Issues

1. **API Key Errors**

   ```
   Error: Neither apiKey nor config.authenticator provided
   ```

   This occurs when the STRIPE_SECRET_KEY environment variable is not available to the API route. Solutions:
   
   - Check that STRIPE_SECRET_KEY is set in your `.env.local` file
   - Make sure your deployment platform has the correct environment variables
   - Restart your development server after making changes to environment variables

2. **Invalid API Version**

   If you see errors about an invalid API version, check the Stripe documentation for currently supported versions and update the apiVersion in the Stripe client initialization.

3. **Build Errors**

   If build errors occur related to Stripe, ensure that you have a dummy key for build purposes but that it's not used for actual API calls:
   
   ```typescript
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build', {...});
   ```

## Resources

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Stripe Elements React Documentation](https://stripe.com/docs/stripe-js/react)

## Security Notes

- Never expose your Stripe Secret Key in client-side code
- Always use environment variables for sensitive keys
- Use Stripe's test mode for development and testing
- Implement proper error handling and validation for payment operations
