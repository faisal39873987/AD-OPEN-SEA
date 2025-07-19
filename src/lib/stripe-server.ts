// This file contains the Stripe server initialization for server-side code
import Stripe from 'stripe';

// Check if the Stripe secret key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('⚠️ STRIPE_SECRET_KEY is not defined. Stripe functionality will not work.');
}

// Initialize Stripe with the secret key from environment variables
// This should ONLY be used in server-side code, never in client components
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'missing_stripe_key', {
  apiVersion: '2025-06-30.basil', // Using the specified API version
});

export default stripe;
