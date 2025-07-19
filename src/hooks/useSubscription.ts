'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SubscriptionService } from '@/lib/services/subscriptionService'
import { SubscriptionPlan, UserSubscription } from '@/lib/types/subscription'

interface SubscriptionStatus {
  plan: SubscriptionPlan
  subscription: UserSubscription | null
  canSearch: boolean
  canAccessContacts: boolean
  searchUsage: { used: number; limit: number | null }
  loading: boolean
  error: string | null
}

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>({
    plan: SubscriptionService.getPlan('free')!,
    subscription: null,
    canSearch: true,
    canAccessContacts: false,
    searchUsage: { used: 0, limit: 1 },
    loading: true,
    error: null
  })

  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)

  useEffect(() => {
    // Get initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        loadSubscriptionStatus(user.id)
      } else {
        setStatus(prev => ({ ...prev, loading: false }))
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        loadSubscriptionStatus(session.user.id)
      } else {
        // Reset to free plan when logged out
        setStatus({
          plan: SubscriptionService.getPlan('free')!,
          subscription: null,
          canSearch: true,
          canAccessContacts: false,
          searchUsage: { used: 0, limit: 1 },
          loading: false,
          error: null
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadSubscriptionStatus = async (userId: string) => {
    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }))
      
      const subscriptionStatus = await SubscriptionService.getSubscriptionStatus(userId)
      
      setStatus({
        ...subscriptionStatus,
        loading: false,
        error: null
      })
    } catch (error) {
      console.error('Error loading subscription status:', error)
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load subscription status'
      }))
    }
  }

  const recordSearch = async (query: string, resultsCount: number) => {
    if (!user) return false

    try {
      await SubscriptionService.recordSearch(user.id, query, resultsCount)
      // Reload status to update usage
      await loadSubscriptionStatus(user.id)
      return true
    } catch (error) {
      console.error('Error recording search:', error)
      return false
    }
  }

  const recordProviderAccess = async (providerId: string, accessType: 'view' | 'contact' | 'details') => {
    if (!user) return

    try {
      await SubscriptionService.recordProviderAccess(user.id, providerId, accessType)
    } catch (error) {
      console.error('Error recording provider access:', error)
    }
  }

  const refreshStatus = async () => {
    if (user) {
      await loadSubscriptionStatus(user.id)
    }
  }

  return {
    ...status,
    user,
    recordSearch,
    recordProviderAccess,
    refreshStatus
  }
}
