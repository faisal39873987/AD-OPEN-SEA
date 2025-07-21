import { supabase } from '@/lib/supabase'
import { SUBSCRIPTION_PLANS, SubscriptionPlan, UserSubscription } from '@/lib/types/subscription'

export class SubscriptionService {
  
  /**
   * Get user's current active subscription
   */
  static async getCurrentSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('current_period_end', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return data ? {
        id: data.id,
        userId: data.user_id,
        planId: data.plan_id,
        status: data.status,
        currentPeriodStart: new Date(data.current_period_start),
        currentPeriodEnd: new Date(data.current_period_end),
        stripeSubscriptionId: data.stripe_subscription_id,
        stripeCustomerId: data.stripe_customer_id,
        searchesUsed: data.searches_used,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } : null
    } catch (error) {
      console.error('Error fetching current subscription:', error)
      return null
    }
  }

  /**
   * Get subscription plan details
   */
  static getPlan(planId: string): SubscriptionPlan | null {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === planId) || null
  }

  /**
   * Check if user can access contact information
   */
  static async canAccessContactInfo(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('can_access_contact_info', { user_uuid: userId })

      if (error) throw error
      return data || false
    } catch (error) {
      console.error('Error checking contact info access:', error)
      return false
    }
  }

  /**
   * Check if user can perform a search
   */
  static async canPerformSearch(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('can_perform_search', { user_uuid: userId })

      if (error) throw error
      return data || false
    } catch (error) {
      console.error('Error checking search capability:', error)
      return false
    }
  }

  /**
   * Get user's search usage for current period
   */
  static async getSearchUsage(userId: string): Promise<{ used: number; limit: number | null }> {
    try {
      const subscription = await this.getCurrentSubscription(userId)
      
      if (!subscription) {
        // Free user - check daily usage
        const { data, error } = await supabase
          .from('search_usage')
          .select('*')
          .eq('user_id', userId)
          .gte('timestamp', new Date().toISOString().split('T')[0])
        
        if (error) throw error
        return { used: data?.length || 0, limit: 1 }
      }

      const plan = this.getPlan(subscription.planId)
      return {
        used: subscription.searchesUsed,
        limit: plan?.searchLimit || null
      }
    } catch (error) {
      console.error('Error getting search usage:', error)
      return { used: 0, limit: 1 }
    }
  }

  /**
   * Record a search action
   */
  static async recordSearch(userId: string, query: string, resultsCount: number): Promise<void> {
    try {
      const subscription = await this.getCurrentSubscription(userId)
      const planId = subscription?.planId || 'free'

      // Record in search_usage table
      await supabase
        .from('search_usage')
        .insert({
          user_id: userId,
          query,
          results_count: resultsCount,
          plan_at_time: planId
        })

      // Update subscription searches_used counter if not free plan
      if (subscription && planId !== 'free') {
        await supabase
          .from('user_subscriptions')
          .update({ 
            searches_used: subscription.searchesUsed + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id)
      }
    } catch (error) {
      console.error('Error recording search:', error)
    }
  }

  /**
   * Record provider access
   */
  static async recordProviderAccess(
    userId: string, 
    providerId: string, 
    accessType: 'view' | 'contact' | 'details'
  ): Promise<void> {
    try {
      const subscription = await this.getCurrentSubscription(userId)
      const planId = subscription?.planId || 'free'

      await supabase
        .from('provider_access_logs')
        .insert({
          user_id: userId,
          provider_id: providerId,
          access_type: accessType,
          plan_at_time: planId
        })
    } catch (error) {
      console.error('Error recording provider access:', error)
    }
  }

  /**
   * Create or update user subscription
   */
  static async createSubscription(
    userId: string,
    planId: string,
    stripeSubscriptionId?: string,
    stripeCustomerId?: string
  ): Promise<UserSubscription | null> {
    try {
      const now = new Date()
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          stripe_subscription_id: stripeSubscriptionId,
          stripe_customer_id: stripeCustomerId,
          searches_used: 0
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        userId: data.user_id,
        planId: data.plan_id,
        status: data.status,
        currentPeriodStart: new Date(data.current_period_start),
        currentPeriodEnd: new Date(data.current_period_end),
        stripeSubscriptionId: data.stripe_subscription_id,
        stripeCustomerId: data.stripe_customer_id,
        searchesUsed: data.searches_used,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
      return null
    }
  }

  /**
   * Cancel user subscription
   */
  static async cancelSubscription(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'active')

      return !error
    } catch (error) {
      console.error('Error canceling subscription:', error)
      return false
    }
  }

  /**
   * Get user's subscription status for display
   */
  static async getSubscriptionStatus(userId: string): Promise<{
    plan: SubscriptionPlan
    subscription: UserSubscription | null
    canSearch: boolean
    canAccessContacts: boolean
    searchUsage: { used: number; limit: number | null }
  }> {
    const subscription = await this.getCurrentSubscription(userId)
    const planId = subscription?.planId || 'free'
    const plan = this.getPlan(planId) || SUBSCRIPTION_PLANS[0]
    
    const [canSearch, canAccessContacts, searchUsage] = await Promise.all([
      this.canPerformSearch(userId),
      this.canAccessContactInfo(userId),
      this.getSearchUsage(userId)
    ])

    return {
      plan,
      subscription,
      canSearch,
      canAccessContacts,
      searchUsage
    }
  }
}
