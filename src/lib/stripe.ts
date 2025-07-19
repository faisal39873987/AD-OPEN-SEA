import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Client-side Stripe (for frontend)
// Add a check for the publishable key
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (typeof window !== 'undefined' && !publishableKey) {
  console.warn('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

export const stripePromise = publishableKey 
  ? loadStripe(publishableKey) 
  : null;

// Check for server-side Stripe key
if (!process.env.STRIPE_SECRET_KEY && typeof window === 'undefined') {
  console.error('⚠️ STRIPE_SECRET_KEY is not defined. Stripe API calls will fail.');
}

// Server-side Stripe (for API routes)
// Note: We're using non-null assertion (!) to tell TypeScript we know this might be null
// but we'll handle that at runtime in the API routes that use this
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});
