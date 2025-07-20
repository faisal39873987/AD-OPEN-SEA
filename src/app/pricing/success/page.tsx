'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { PricingPlan } from '@/components/subscription/SubscriptionPage'

const SUCCESS_PLANS: Record<string, PricingPlan> = {
  'free': {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'AED',
    features: [
      'Basic access to AD PLUS Assistant',
      'Up to 5 messages per day',
      'Standard response time',
      'Access to basic templates',
      'Community support'
    ]
  },
  'plus': {
    id: 'plus',
    name: 'Plus',
    monthlyPrice: 49,
    yearlyPrice: 499,
    currency: 'AED',
    mostPopular: true,
    features: [
      'Full access to AD PLUS Assistant',
      'Unlimited messages',
      'Priority response time',
      'Access to all templates',
      'Advanced analytics',
      'Email support',
      'Custom exports'
    ]
  },
  'team': {
    id: 'team',
    name: 'Team',
    monthlyPrice: 99,
    yearlyPrice: 999,
    currency: 'AED',
    features: [
      'Everything in Plus',
      'Team collaboration features',
      'Shared workspaces',
      'Admin dashboard',
      'Usage analytics',
      'Advanced customization',
      'Dedicated account manager',
      'Premium support',
      'API access'
    ]
  }
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planId = searchParams.get('plan')
  const interval = searchParams.get('interval') as 'month' | 'year' || 'month'
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<PricingPlan | null>(null)

  useEffect(() => {
    if (planId && SUCCESS_PLANS[planId]) {
      setPlan(SUCCESS_PLANS[planId])
      setLoading(false)
    } else {
      router.push('/pricing')
    }
  }, [planId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Welcome to {plan?.name}! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your subscription has been activated successfully. You now have access to all the premium features.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <SparklesIcon className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">What&apos;s Included</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {plan?.features.map((feature: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + (index * 0.1) }}
                className="flex items-start space-x-3"
              >
                <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">Your Subscription Summary:</h3>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
              <p className="text-gray-700 font-medium">Plan:</p>
              <p className="text-black font-bold">{plan?.name}</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
              <p className="text-gray-700 font-medium">Billing:</p>
              <p className="text-black font-bold">{interval === 'month' ? 'Monthly' : 'Yearly'}</p>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-700 font-medium">Price:</p>
              <p className="text-black font-bold">
                {interval === 'month' ? plan?.monthlyPrice : plan?.yearlyPrice} {plan?.currency}/{interval}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <button
            onClick={() => router.push('/')}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 mr-4"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => router.push('/chat')}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            Try AD PLUS Assistant
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@adplus.ai" className="text-black hover:underline">
              support@adplus.ai
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
