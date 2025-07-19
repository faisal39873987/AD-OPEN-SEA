import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe-server'

export async function POST(req: NextRequest) {
  // Verify Stripe API key is available
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY environment variable');
    return NextResponse.json(
      { error: 'Payment service is not configured correctly' },
      { status: 500 }
    );
  }

  try {
    const { amount, currency = 'aed', description, metadata = {} } = await req.json()

    // Validate the input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Amount should be in the smallest currency unit (cents for USD, fils for AED)
    const amountInSmallestUnit = Math.round(amount * 100)

    // Create a PaymentIntent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currency.toLowerCase(),
      description,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        description,
        ...metadata,
      },
    })

    // Return the client secret to the client
    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error('Error creating payment intent:', error.message);
    
    // Handle specific Stripe errors
    if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { error: 'Payment service authentication failed' },
        { status: 500 }
      );
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Invalid payment request' },
        { status: 400 }
      );
    }
    
    // Generic error response
    return NextResponse.json(
      { error: 'Error processing payment' },
      { status: 500 }
    )
  }
}
