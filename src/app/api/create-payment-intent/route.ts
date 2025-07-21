import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Check if the secret key is defined before initializing Stripe
if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY is not defined in environment variables');
}

// Initialize Stripe with proper typing and configuration
const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2023-10-16',
  appInfo: {
    name: 'AD Pulse',
    version: '1.0.0'
  }
});

export async function POST(req: NextRequest) {
  try {
    // Verify that Stripe is properly configured
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please set the STRIPE_SECRET_KEY environment variable.' },
        { status: 500 }
      );
    }

    const { amount, currency = 'usd', metadata } = await req.json();

    // Validate request data
    if (!amount || isNaN(amount)) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: metadata || {},
    });

    // Return the client secret to the client
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });

  } catch (error) {
    console.error('Payment Intent Error:', error);
    
    // Provide more specific error information
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error creating payment intent';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
