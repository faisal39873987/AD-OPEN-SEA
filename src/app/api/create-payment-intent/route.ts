import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe-server'

export async function POST(req: NextRequest) {
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
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    )
  }
}
