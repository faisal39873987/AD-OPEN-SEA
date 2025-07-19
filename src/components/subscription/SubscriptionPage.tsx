'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'

export interface PricingPlan {
  id: string
  name: string
  monthlyPrice: number
  yearlyPrice: number
  currency: string
  features: string[]
  mostPopular?: boolean
  stripeMonthlyPriceId?: string
  stripeYearlyPriceId?: string
}

interface SubscriptionPageProps {
  onSelectPlan: (planId: string, interval: 'month' | 'year') => void
  currentPlanId?: string
  className?: string
}

// Define the subscription plans
const SUBSCRIPTION_PLANS: PricingPlan[] = [
  {
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
  {
    id: 'plus',
    name: 'Plus',
    monthlyPrice: 49,
    yearlyPrice: 499,
    currency: 'AED',
    mostPopular: true,
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID,
    stripeYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID,
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
  {
    id: 'team',
    name: 'Team',
    monthlyPrice: 99,
    yearlyPrice: 999,
    currency: 'AED',
    stripeMonthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID,
    stripeYearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID,
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
]

export default function SubscriptionPage({ onSelectPlan, currentPlanId = 'free', className = '' }: SubscriptionPageProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')

  const handleSelectPlan = async (plan: PricingPlan) => {
    // Don't do anything if we're already loading or if the user is selecting their current plan
    if (isLoading || plan.id === currentPlanId) return
    
    setIsLoading(plan.id)
    try {
      await onSelectPlan(plan.id, billingInterval)
    } finally {
      setIsLoading(null)
    }
  }

  const getPrice = (plan: PricingPlan) => {
    return billingInterval === 'month' ? plan.monthlyPrice : plan.yearlyPrice
  }

  const getSavingsPercentage = (monthlyPrice: number, yearlyPrice: number) => {
    if (monthlyPrice === 0) return 0
    const monthlyCostPerYear = monthlyPrice * 12
    const savings = monthlyCostPerYear - yearlyPrice
    return Math.round((savings / monthlyCostPerYear) * 100)
  }

  return (
    <div className={`min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-black mb-6">
            AD PLUS Assistant Subscription
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose the plan that's right for you. Upgrade or downgrade at any time.
          </p>
        </motion.div>

        {/* Billing toggle */}
        <div className="mt-10 flex justify-center">
          <div className="relative bg-white p-1 rounded-full flex border border-gray-200">
            <button
              onClick={() => setBillingInterval('month')}
              className={`relative w-32 py-2 text-sm font-medium rounded-full transition-colors ${
                billingInterval === 'month' ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`relative w-32 py-2 text-sm font-medium rounded-full transition-colors ${
                billingInterval === 'year' ? 'bg-black text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Yearly
              {billingInterval === 'year' && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                  Save up to 15%
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SUBSCRIPTION_PLANS.map((plan, index) => {
            const isCurrent = currentPlanId === plan.id
            const isPopular = plan.mostPopular
            const price = getPrice(plan)
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-xl border-2 overflow-hidden ${
                  isCurrent ? 'border-black' : 'border-gray-200'
                } ${isPopular ? 'shadow-lg' : 'shadow-sm'}`}
              >
                {/* Popular tag */}
                {isPopular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-black text-white text-xs font-semibold px-3 py-1">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-2xl font-bold text-black">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-extrabold text-black">{price}</span>
                    <span className="ml-1 text-xl text-gray-500">{plan.currency}</span>
                    <span className="ml-2 text-base text-gray-500">/{billingInterval}</span>
                  </div>
                  
                  {/* Show savings for yearly plans */}
                  {billingInterval === 'year' && plan.yearlyPrice > 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                      Save {getSavingsPercentage(plan.monthlyPrice, plan.yearlyPrice)}% compared to monthly
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="p-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-black flex-shrink-0 mr-3" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isLoading === plan.id || isCurrent}
                    className={`w-full py-3 px-4 rounded-md text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                      isCurrent 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200' 
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {isLoading === plan.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : isCurrent ? (
                      'Your current plan'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center text-black mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-black mb-2">Can I change plans later?</h3>
            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-black mb-2">How does billing work?</h3>
            <p className="text-gray-600">You'll be billed at the start of each billing cycle (monthly or yearly). We accept all major credit cards and process payments securely through Stripe.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-black mb-2">Is there a refund policy?</h3>
            <p className="text-gray-600">Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team for a full refund.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
