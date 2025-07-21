export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  searchLimit: number | null // null means unlimited
  contactInfoAccess: boolean
  chatSupport: 'limited' | 'priority' | 'premium'
  stripeProductId?: string
  stripePriceId?: string
  popular?: boolean
}

export interface UserSubscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  searchesUsed: number
  createdAt: Date
  updatedAt: Date
}

export interface SearchUsage {
  id: string
  userId: string
  query: string
  resultsCount: number
  timestamp: Date
  planAtTime: string
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    currency: 'AED',
    interval: 'month',
    features: [
      'View limited search results (1 result only)',
      'Hidden contact info (only names and basic details)',
      'Limited GPT-4 chat',
      'Basic service browsing'
    ],
    searchLimit: 1,
    contactInfoAccess: false,
    chatSupport: 'limited'
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    price: 49,
    currency: 'AED',
    interval: 'month',
    features: [
      'View full details (up to 20 results/month)',
      'Full access to contact info (name, phone, email)',
      'Priority Email support',
      'Full GPT-4 chat access',
      'Advanced search filters'
    ],
    searchLimit: 20,
    contactInfoAccess: true,
    chatSupport: 'priority',
    popular: true,
    stripeProductId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRODUCT_ID,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STANDARD_PRICE_ID
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 99,
    currency: 'AED',
    interval: 'month',
    features: [
      'Unlimited search results',
      'Detailed contact info (phone, WhatsApp, email)',
      'Premium live chat & phone support',
      'Detailed analytics reports',
      'Unlimited GPT-4 chat access',
      'Priority listing for your services',
      'Advanced business insights'
    ],
    searchLimit: null, // unlimited
    contactInfoAccess: true,
    chatSupport: 'premium'
  }
]
