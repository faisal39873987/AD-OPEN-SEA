import { NextRequest, NextResponse } from 'next/server'
import { StripeService } from '@/lib/services/stripeService'
import { SubscriptionService } from '@/lib/services/subscriptionService'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const event = StripeService.verifyWebhook(body, signature)

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as {
          mode: string
          metadata?: { user_id?: string }
          subscription?: string
          customer?: string
        }
        
        if (session.mode === 'subscription') {
          const userId = session.metadata?.user_id
          const subscriptionId = session.subscription
          const customerId = session.customer

          if (userId && subscriptionId) {
            // Get subscription details from Stripe
            const subscription = await StripeService.getSubscription(subscriptionId as string)
            
            if (subscription && subscription.items.data.length > 0) {
              // Determine plan ID from price ID
              const priceId = subscription.items.data[0].price.id
              let planId = 'standard' // default
              
              // Map price ID to plan ID (you'll need to configure these)
              if (priceId === process.env.STRIPE_STANDARD_PRICE_ID) {
                planId = 'standard'
              } else if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
                planId = 'pro'
              }

              // Create subscription in database
              await SubscriptionService.createSubscription(
                userId,
                planId,
                subscriptionId as string,
                customerId as string
              )
            }
          }
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as { subscription?: string }
        const subscriptionId = invoice.subscription
        
        if (subscriptionId) {
          // Subscription payment succeeded - update status if needed
          console.log(`Payment succeeded for subscription: ${subscriptionId}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as { subscription?: string }
        const subscriptionId = invoice.subscription
        
        if (subscriptionId) {
          // Payment failed - you might want to update subscription status
          console.log(`Payment failed for subscription: ${subscriptionId}`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as { id: string }
        
        // Handle subscription updates (plan changes, etc.)
        console.log(`Subscription updated: ${subscription.id}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as { id: string, metadata?: { user_id?: string } }
        const userId = subscription.metadata?.user_id
        
        if (userId) {
          // Cancel subscription in database
          await SubscriptionService.cancelSubscription(userId)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
