'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  UsersIcon, 
  CreditCardIcon, 
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline'

interface AdminStats {
  totalUsers: number
  totalProviders: number
  totalSearches: number
  activeSubscriptions: number
  revenue: number
  recentActivity: { query: string; results_count: number; plan_at_time: string; timestamp: string }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProviders: 0,
    totalSearches: 0,
    activeSubscriptions: 0,
    revenue: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminStats()
  }, [])

  const loadAdminStats = async () => {
    try {
      // Get total service providers
      const { count: providerCount } = await supabase
        .from('service_providers')
        .select('*', { count: 'exact', head: true })

      // Get total searches
      const { count: searchCount } = await supabase
        .from('search_usage')
        .select('*', { count: 'exact', head: true })

      // Get active subscriptions
      const { count: subscriptionCount } = await supabase
        .from('user_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      // Get recent search activity
      const { data: recentActivity } = await supabase
        .from('search_usage')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10)

      setStats({
        totalUsers: 0, // Would need auth.users access
        totalProviders: providerCount || 0,
        totalSearches: searchCount || 0,
        activeSubscriptions: subscriptionCount || 0,
        revenue: (subscriptionCount || 0) * 49, // Simplified calculation
        recentActivity: recentActivity || []
      })
    } catch (error) {
      console.error('Error loading admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Service Providers',
      value: stats.totalProviders,
      icon: BuildingOfficeIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Searches',
      value: stats.totalSearches,
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: CreditCardIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Monthly Revenue',
      value: `${stats.revenue} AED`,
      icon: UsersIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Abu Dhabi OpenSea Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your platform performance and user activity
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    {stat.name}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Search Activity
            </h2>
          </div>
          <div className="p-6">
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">
                        &quot;{activity.query}&quot;
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.results_count} results • {activity.plan_at_time} plan
                      </p>
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No recent activity found
              </p>
            )}
          </div>
        </motion.div>

        {/* Business Model Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Business Model Status ✅
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">
                🏢 FREE Data Entry (Service Providers)
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ Service providers can add listings for FREE</li>
                <li>✅ No payment required for data entry</li>
                <li>✅ All contact information included</li>
                <li>✅ Automatic search visibility</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-700 mb-2">
                👥 PAID Data Extraction (Customers)
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ Free Plan: 1 result, hidden contacts</li>
                <li>✅ Standard Plan: 20 results, full contacts (49 AED)</li>
                <li>✅ Pro Plan: Unlimited results, premium support (99 AED)</li>
                <li>✅ Stripe integration with sandbox testing</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
