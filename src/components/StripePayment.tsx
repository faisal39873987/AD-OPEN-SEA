'use client'

import { useState, useEffect } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import stripePromise from '@/lib/stripe-client'

interface PaymentProps {
  amount: number
  currency?: string
  description: string
  clientSecret: string
  onSuccess: (paymentId: string) => void
  onCancel: () => void
}

const PaymentForm = ({ 
  amount, 
  currency = 'AED', 
  description, 
  clientSecret, 
  onSuccess, 
  onCancel 
}: PaymentProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        setError(error.message || 'An error occurred with your payment')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id)
      }
    } catch (e) {
      setError('An unexpected error occurred')
      console.error('Payment error:', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700">Amount:</span>
          <span className="font-semibold">{currency} {amount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-6">
        <PaymentElement />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={`px-6 py-2 bg-black text-white rounded-lg font-medium ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'
          }`}
        >
          {isLoading ? 'Processing...' : `Pay ${currency} ${amount.toFixed(2)}`}
        </button>
      </div>
    </form>
  )
}

export default function StripePayment(props: {
  amount: number
  description: string
  metadata?: Record<string, string>
  currency?: string
  onClose: () => void
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  // Create a payment intent when the component mounts
  useState(() => {
    const createPaymentIntent = async () => {
      try {
        const baseUrl = typeof window !== 'undefined' 
                       ? window.location.origin 
                       : process.env.NEXT_PUBLIC_SITE_URL || 'https://adplus.app';
        const response = await fetch(`${baseUrl}/api/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: props.amount,
            currency: props.currency || 'AED',
            description: props.description,
            metadata: props.metadata || {},
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create payment intent')
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
      }
    }

    createPaymentIntent()
  })

  const handleSuccess = (paymentId: string) => {
    // Redirect to success page with payment ID
    window.location.href = `/payment-success?payment_intent=${paymentId}`;
  }

  if (!clientSecret) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Preparing payment...</span>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm 
        amount={props.amount}
        description={props.description}
        currency={props.currency}
        clientSecret={clientSecret}
        onSuccess={handleSuccess}
        onCancel={props.onClose}
      />
    </Elements>
  )
}
