// This file contains the Stripe client initialization for client-side code
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key from environment variables
// This is safe to expose in client-side code
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default stripePromise;
