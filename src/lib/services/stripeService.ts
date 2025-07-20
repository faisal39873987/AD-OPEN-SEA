import Stripe from 'stripe'

let stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    
    stripe = new Stripe(secretKey, {
      apiVersion: '2025-06-30.basil',
    })
  }
  
  return stripe
}

export class StripeService {
  
  /**
   * Create a Stripe customer
   */
  static async createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    const stripe = getStripe()
    return await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'abu_dhabi_opensea'
      }
    })
  }

  /**
   * Create a checkout session for subscription
   */
  static async createCheckoutSession(
    priceId: string,
    customerId: string,
    successUrl: string,
    cancelUrl: string,
    userId?: string
  ): Promise<Stripe.Checkout.Session> {
    const stripe = getStripe()
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      metadata: {
        user_id: userId || '',
        source: 'abu_dhabi_opensea'
      },
      subscription_data: {
        metadata: {
          user_id: userId || '',
          source: 'abu_dhabi_opensea'
        }
      }
    })
  }

  /**
   * Create a one-time payment session (for testing)
   */
  static async createPaymentSession(
    amount: number,
    currency: string = 'aed',
    successUrl: string,
    cancelUrl: string,
    description?: string
  ): Promise<Stripe.Checkout.Session> {
    const stripe = getStripe()
    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: description || 'Abu Dhabi OpenSea Service',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    })
  }

  /**
   * Get subscription details
   */
  static async getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const stripe = getStripe()
      return await stripe.subscriptions.retrieve(subscriptionId)
    } catch (error) {
      console.error('Error retrieving subscription:', error)
      return null
    }
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
    try {
      const stripe = getStripe()
      return await stripe.subscriptions.cancel(subscriptionId)
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return null
    }
  }

  /**
   * Create a customer portal session
   */
  static async createPortalSession(customerId: string, returnUrl: string): Promise<Stripe.BillingPortal.Session> {
    const stripe = getStripe()
    return await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhook(payload: string, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set')
    }

    const stripe = getStripe()
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  }

  /**
   * Get customer by email
   */
  static async getCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    const stripe = getStripe()
    const customers = await stripe.customers.list({
      email,
      limit: 1
    })

    return customers.data.length > 0 ? customers.data[0] : null
  }

  /**
   * Create or get customer
   */
  static async createOrGetCustomer(email: string, name?: string): Promise<Stripe.Customer> {
    const existingCustomer = await this.getCustomerByEmail(email)
    
    if (existingCustomer) {
      return existingCustomer
    }

    return await this.createCustomer(email, name)
  }
}

export { getStripe as stripe }
