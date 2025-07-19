'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SubscriptionPage from '@/components/subscription/SubscriptionPage'
import { SubscriptionService } from '@/lib/services/subscriptionService'
import { StripeService } from '@/lib/services/stripeService'
import { supabase } from '@/lib/supabase'

export default function PricingPageRoute() {
  const router = useRouter()
  const [currentPlanId, setCurrentPlanId] = useState<string>('free')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null)

  useEffect(() => {
    loadUserAndSubscription()
  }, [])

  const loadUserAndSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const subscription = await SubscriptionService.getCurrentSubscription(user.id)
        setCurrentPlanId(subscription?.planId || 'free')
      }
    } catch (error) {
      console.error('Error loading user subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPlan = async (planId: string, interval: 'month' | 'year') => {
    try {
      // If selecting free plan, just update locally (no payment needed)
      if (planId === 'free') {
        if (user) {
          await SubscriptionService.cancelSubscription(user.id)
          setCurrentPlanId('free')
        }
        return
      }

      // For paid plans, redirect to Stripe checkout
      if (!user) {
        // Redirect to login first
        router.push(`/auth/login?redirect=/pricing&plan=${planId}&interval=${interval}`)
        return
      }

      // Create or get Stripe customer
      const customer = await StripeService.createOrGetCustomer(
        user.email || '',
        user.user_metadata?.full_name || user.email
      )

      // Get price ID based on plan and interval
      let stripePriceId
      if (planId === 'plus') {
        stripePriceId = interval === 'month' 
          ? process.env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_PRICE_ID 
          : process.env.NEXT_PUBLIC_STRIPE_PLUS_YEARLY_PRICE_ID
      } else if (planId === 'team') {
        stripePriceId = interval === 'month' 
          ? process.env.NEXT_PUBLIC_STRIPE_TEAM_MONTHLY_PRICE_ID 
          : process.env.NEXT_PUBLIC_STRIPE_TEAM_YEARLY_PRICE_ID
      } else {
        throw new Error('Invalid plan selected')
      }

      if (!stripePriceId) {
        throw new Error('Price ID not configured for selected plan')
      }

      // Create checkout session
      const session = await StripeService.createCheckoutSession(
        stripePriceId,
        customer.id,
        `${window.location.origin}/pricing/success?plan=${planId}&interval=${interval}`,
        `${window.location.origin}/pricing?canceled=true`,
        user.id
      )

      // Redirect to Stripe checkout
      if (session.url) {
        window.location.href = session.url
      }
    } catch (error) {
      console.error('Error selecting plan:', error)
      alert('There was an error processing your request. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pricing information...</p>
        </div>
      </div>
    )
  }

  return (
    <SubscriptionPage 
      onSelectPlan={handleSelectPlan}
      currentPlanId={currentPlanId}
    />
  )
}
