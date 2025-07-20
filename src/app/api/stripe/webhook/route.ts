import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil', // Most recent API version as of 2025
});

// Webhook signing secret (prevents fraud)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle specific event types
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCompletedCheckout(session);
      break;
      
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      await handleSuccessfulPayment(invoice);
      break;
      
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionChange(subscription, event.type);
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Handler functions for specific webhook events
async function handleCompletedCheckout(session: Stripe.Checkout.Session) {
  try {
    // Basic event recording to database
    const { error } = await supabase.from('payments').insert({
      stripe_session_id: session.id,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      payment_status: session.payment_status,
      created_at: new Date().toISOString()
    });
    
    if (error) throw error;
    console.log(`Checkout session ${session.id} processed successfully`);
  } catch (error) {
    console.error('Error processing checkout session:', error);
  }
}

async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  try {
    console.log(`Invoice ${invoice.id} paid successfully`);
    // Implementation would update subscription status, credits, etc.
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription, eventType: string) {
  try {
    const userId = subscription.metadata?.user_id;
    
    if (!userId) {
      console.log('No user ID in subscription metadata');
      return;
    }
    
    if (eventType === 'customer.subscription.updated') {
      // Update user's subscription status
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          status: subscription.status,
          price_id: subscription.items.data[0]?.price.id,
          quantity: subscription.items.data[0]?.quantity,
          cancel_at_period_end: subscription.cancel_at_period_end,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
    } else if (eventType === 'customer.subscription.deleted') {
      // Update user's subscription status to canceled
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);
        
      if (error) throw error;
    }
    
    console.log(`Subscription ${subscription.id} ${eventType.split('.')[2]} successfully`);
  } catch (error) {
    console.error(`Error processing subscription ${eventType}:`, error);
  }
}
