import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export interface PaymentIntentData {
  amount: number
  currency?: string
  bookingId: string
  userId: string
  serviceProviderId: string
}

export interface CreatePaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

/**
 * Create a payment intent for booking payment
 */
export async function createPaymentIntent(
  data: PaymentIntentData
): Promise<CreatePaymentIntentResponse> {
  // Verify Stripe is properly configured
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Payment service is not configured correctly');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100), // Convert to cents
      currency: data.currency || 'usd',
      metadata: {
        bookingId: data.bookingId,
        userId: data.userId,
        serviceProviderId: data.serviceProviderId,
      },
    })

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    }
  } catch (error: any) {
    console.error('Error creating payment intent:', error.message);
    
    // More descriptive error based on the error type
    if (error.type === 'StripeAuthenticationError') {
      throw new Error('Payment service authentication failed');
    } else if (error.type === 'StripeInvalidRequestError') {
      throw new Error(`Invalid payment request: ${error.message}`);
    } else if (error.type === 'StripeAPIError') {
      throw new Error('Payment service temporarily unavailable');
    } else {
      throw new Error('Failed to process payment');
    }
  }
}

/**
 * Confirm payment and update booking status
 */
export async function confirmPayment(paymentIntentId: string, bookingId: string) {
  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    
    if (paymentIntent.status === 'succeeded') {
      // Update booking payment status in Supabase
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: 'paid',
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)

      if (error) {
        throw new Error('Failed to update booking status')
      }

      return { success: true, paymentIntent }
    } else {
      return { success: false, status: paymentIntent.status }
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    throw new Error('Failed to confirm payment')
  }
}

/**
 * Get payment history for a user
 */
export async function getPaymentHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        total_amount,
        payment_status,
        created_at,
        service_type,
        service_providers (
          name,
          category
        )
      `)
      .eq('user_id', userId)
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Failed to fetch payment history')
    }

    return data
  } catch (error) {
    console.error('Error fetching payment history:', error)
    throw new Error('Failed to fetch payment history')
  }
}
