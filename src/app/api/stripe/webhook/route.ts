import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe-server'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

// Get the webhook secret or log an error if missing
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
if (!endpointSecret) {
  console.error('⚠️ STRIPE_WEBHOOK_SECRET is not defined. Webhook verification will fail.');
}

export async function POST(req: NextRequest) {
  // Verify Stripe is properly configured
  if (!process.env.STRIPE_SECRET_KEY || !endpointSecret) {
    console.error('Missing required Stripe environment variables');
    return NextResponse.json({ error: 'Payment service is not configured correctly' }, { status: 500 });
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  
  // If signature is missing, return an error
  if (!signature) {
    console.error('Stripe signature is missing from the request');
    return NextResponse.json({ error: 'Webhook signature missing' }, { status: 400 });
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      await handleSuccessfulPayment(paymentIntent)
      break

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent
      await handleFailedPayment(failedPayment)
      break

    default:
      // Unhandled event type
  }

  return NextResponse.json({ received: true })
}

async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.bookingId

  if (bookingId) {
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (error) {
      console.error('Error updating booking after successful payment:', error)
    } 
    // Payment succeeded
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.bookingId

  if (bookingId) {
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'failed',
        status: 'payment_failed',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)

    if (error) {
      console.error('Error updating booking after failed payment:', error)
    } else {
      console.log(`Payment failed for booking ${bookingId}`)
    }
  }
}
