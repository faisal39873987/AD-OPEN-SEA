'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/outline'
import { SUBSCRIPTION_PLANS } from '@/lib/types/subscription'

interface PricingPageProps {
  onSelectPlan?: (planId: string) => void
  currentPlanId?: string
  className?: string
}

export default function PricingPage({ onSelectPlan, currentPlanId, className = '' }: PricingPageProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSelectPlan = async (planId: string) => {
    if (isLoading || planId === currentPlanId) return
    
    setIsLoading(planId)
    try {
      if (onSelectPlan) {
        await onSelectPlan(planId)
      }
    } finally {
      setIsLoading(null)
    }
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return '🆓'
      case 'standard':
        return '⭐'
      case 'pro':
        return '💎'
      default:
        return '📋'
    }
  }

  const getPlanGradient = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'from-gray-50 to-gray-100 border-gray-200'
      case 'standard':
        return 'from-gray-50 to-gray-100 border-gray-200'
      case 'pro':
        return 'from-gray-50 to-gray-100 border-gray-200'
      default:
        return 'from-gray-50 to-gray-100 border-gray-200'
    }
  }

  const getPlanButtonStyle = (planId: string, isCurrent: boolean) => {
    if (isCurrent) {
      return 'bg-gray-100 text-gray-500 cursor-not-allowed'
    }
    
    switch (planId) {
      case 'free':
        return 'bg-black hover:bg-gray-800 text-white'
      case 'standard':
        return 'bg-black hover:bg-gray-800 text-white'
      case 'pro':
        return 'bg-black hover:bg-gray-800 text-white'
      default:
        return 'bg-black hover:bg-gray-800 text-white'
    }
  }

  return (
    <div className={`min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto mb-8">
            Get access to Abu Dhabi&apos;s best service providers. 
            <span className="block mt-2 text-lg">
              <strong className="text-black ml-2">Free for service providers</strong> • 
              <strong className="text-black ml-2">Paid for customers</strong>
            </span>
          </p>
        </motion.div>

        {/* Clear separation notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-xl p-6 max-w-4xl mx-auto mb-12"
        >
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl mb-2">🏢</div>
              <h3 className="font-semibold text-green-700">Service Providers</h3>
              <p className="text-sm text-green-600">List your services for FREE</p>
            </div>
            <div className="w-px h-16 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-semibold text-blue-700">Customers</h3>
              <p className="text-sm text-blue-600">Choose a plan to access services</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {SUBSCRIPTION_PLANS.map((plan, index) => {
            const isCurrent = currentPlanId === plan.id
            const isPopular = plan.popular
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <StarIcon className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className={`
                  relative bg-gradient-to-br ${getPlanGradient(plan.id)} 
                  rounded-2xl border-2 p-8 h-full flex flex-col
                  transition-all duration-300 hover:shadow-lg hover:scale-105
                  ${isPopular ? 'shadow-xl scale-105' : 'shadow-sm'}
                  ${isCurrent ? 'ring-2 ring-green-500' : ''}
                `}>
                  {/* Plan header */}
                  <div className="text-center mb-8">
                    <div className="text-4xl mb-4">{getPlanIcon(plan.id)}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-5xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-xl text-gray-600 ml-2">
                        {plan.currency}/{plan.interval}
                      </span>
                    </div>
                    {isCurrent && (
                      <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        <CheckIcon className="w-4 h-4" />
                        <span>Current Plan</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.1) }}
                          className="flex items-start space-x-3"
                        >
                          <CheckIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Search limits info */}
                    <div className="mt-6 p-4 bg-white/50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Search Limits:</h4>
                      <p className="text-sm text-gray-600">
                        {plan.searchLimit === null 
                          ? 'Unlimited searches per month' 
                          : `Up to ${plan.searchLimit} search${plan.searchLimit === 1 ? '' : 'es'} per month`
                        }
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Contact Info: {plan.contactInfoAccess ? '✅ Full access' : '❌ Hidden'}
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isLoading === plan.id || isCurrent}
                    className={`
                      w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
                      ${getPlanButtonStyle(plan.id, isCurrent)}
                      ${isLoading === plan.id ? 'opacity-50 cursor-not-allowed' : ''}
                      ${!isCurrent ? 'hover:shadow-lg transform hover:-translate-y-1' : ''}
                    `}
                  >
                    {isLoading === plan.id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : plan.price === 0 ? (
                      'Start Free'
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gray-50 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center space-x-2">
              <SparklesIcon className="w-6 h-6 text-yellow-500" />
              <span>Why Choose Abu Dhabi OpenSea?</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div>
                <strong className="text-gray-900">🔒 Secure Payments</strong>
                <p>Powered by Stripe with bank-level security</p>
              </div>
              <div>
                <strong className="text-gray-900">🤝 Trusted Providers</strong>
                <p>Verified service providers across Abu Dhabi</p>
              </div>
              <div>
                <strong className="text-gray-900">💬 AI Assistant</strong>
                <p>GPT-4 powered chat to help you find services</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-6">
              💡 Cancel anytime • 30-day money-back guarantee • 24/7 customer support
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
