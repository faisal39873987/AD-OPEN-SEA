// This file contains the Stripe server initialization for server-side code
import Stripe from 'stripe';

// Check if the Stripe secret key is available
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('⚠️ STRIPE_SECRET_KEY is not defined. Please check your environment variables.');
}

// Initialize Stripe with the secret key from environment variables
// This should ONLY be used in server-side code, never in client components
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil', // Using the required API version
});

export default stripe;
