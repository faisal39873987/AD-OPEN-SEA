'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  StarIcon,
  MapPinIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .order('rating', { ascending: false })

      if (error) throw error
      setProviders(data || [])
    } catch (error) {
      console.error('Error fetching providers:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Service Providers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet our verified professionals ready to help with your service needs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
            <div className="text-3xl font-bold text-blue-600 mb-2">{providers.length}</div>
            <div className="text-gray-600">Total Providers</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {providers.filter(p => p.available).length}
            </div>
            <div className="text-gray-600">Available Now</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {providers.filter(p => p.rating >= 4.5).length}
            </div>
            <div className="text-gray-600">Top Rated (4.5+)</div>
          </div>
        </div>

        {/* Providers Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  href={`/provider/${provider.id}`}
                  className="block bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Provider Header */}
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                        {provider.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {provider.name}
                        </h3>
                        <p className="text-gray-600">{provider.category}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        provider.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {provider.available ? 'Available' : 'Busy'}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-4 h-4 ${
                              i < (provider.rating || 0) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {provider.rating?.toFixed(1) || 'No rating'} ({provider.total_reviews} reviews)
                      </span>
                    </div>

                    {/* Description */}
                    {provider.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {provider.description}
                      </p>
                    )}

                    {/* Location */}
                    {provider.location && (
                      <div className="flex items-center mb-4 text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <span className="text-sm">{provider.location}</span>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        {provider.hourly_rate ? (
                          <span className="text-lg font-bold text-gray-900">
                            AED {provider.hourly_rate}/hour
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Price on request</span>
                        )}
                      </div>
                      <div className="text-blue-600 text-sm font-medium">
                        View Profile →
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && providers.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserGroupIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No providers found
            </h3>
            <p className="text-gray-600">
              Check back later for new service providers.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
