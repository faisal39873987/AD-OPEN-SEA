import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil', // Use the latest API version
});

export async function POST(req: NextRequest) {
  try {
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
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
}
