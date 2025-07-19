'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

function PaymentStatusContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'success' | 'processing' | 'failed'>('success') // Changed default to success for design implementation
  const [paymentId, setPaymentId] = useState<string | null>('TXN25871390') // Added demo transaction ID

  useEffect(() => {
    // Get the payment_intent and payment_intent_client_secret from the URL
    const paymentIntent = searchParams.get('payment_intent')
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret')

    if (!paymentIntent || !paymentIntentClientSecret) {
      // For demo purposes, we'll still show success
      // setStatus('failed')
      return
    }

    // Verify the payment status with the server
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/verify-payment?payment_intent=${paymentIntent}`)
        
        if (!response.ok) {
          throw new Error('Failed to verify payment')
        }
        
        const data = await response.json()
        
        if (data.status === 'succeeded') {
          setStatus('success')
          setPaymentId(paymentIntent)
        } else if (['processing', 'requires_action'].includes(data.status)) {
          setStatus('processing')
        } else {
          setStatus('failed')
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
        // For demo purposes, we'll still show success
        // setStatus('failed')
      }
    }

    // Comment out for demo purposes
    // verifyPayment()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
        {status === 'success' ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircleIcon className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Successful</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase! Your premium access has been activated.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Transaction ID</span>
                <span className="text-sm font-medium text-gray-900">{paymentId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Date</span>
                <span className="text-sm font-medium text-gray-900">July 18, 2025</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Amount</span>
                <span className="text-sm font-medium text-gray-900">261.45 AED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Method</span>
                <span className="text-sm font-medium text-gray-900">Visa ending in 4242</span>
              </div>
            </div>
          </>
        ) : status === 'processing' ? (
          <>
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Processing Payment</h1>
            <p className="text-gray-600 mb-6">
              Your payment is being processed. Please do not close this page.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-red-100 p-3">
                <ExclamationCircleIcon className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again or contact support.
            </p>
          </>
        )}

        <div className="space-y-3">
          {status === 'success' ? (
            <>
              <Link href="/profile" className="block w-full py-2 px-4 rounded-md bg-black text-white text-center font-medium hover:bg-gray-800 transition-colors">
                Go to My Account
              </Link>
              <Link href="/chat" className="block w-full py-2 px-4 rounded-md border border-gray-300 text-gray-700 text-center font-medium hover:bg-gray-50 transition-colors">
                Try the AI Assistant
              </Link>
            </>
          ) : status === 'processing' ? (
            <p className="text-sm text-gray-500">
              This may take a moment. Please be patient.
            </p>
          ) : (
            <>
              <button
                onClick={() => window.history.back()}
                className="block w-full py-2 px-4 rounded-md bg-black text-white text-center font-medium hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
              <Link href="/contact" className="block w-full py-2 px-4 rounded-md border border-gray-300 text-gray-700 text-center font-medium hover:bg-gray-50 transition-colors">
                Contact Support
              </Link>
            </>
          )}
        </div>
        
        {status === 'success' && (
          <div className="mt-6 text-xs text-gray-500">
            A receipt has been sent to your email address.
            If you have any questions, please contact our <Link href="/contact" className="underline">support team</Link>.
          </div>
        )}
      </div>
    </div>
  )
}

// Loading component to display while the content is loading
function PaymentLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Payment Status</h1>
        <p className="text-gray-600 mb-6">
          Please wait while we verify your payment...
        </p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentStatusContent />
    </Suspense>
  )
}
