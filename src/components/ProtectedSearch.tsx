'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, LockClosedIcon, CreditCardIcon } from '@heroicons/react/24/outline'
import { useSubscription } from '@/hooks/useSubscription'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface SearchResult {
  id: string
  name: string
  service_type: string
  description: string
  location: string
  rating: number
  price: number
  contact_info?: {
    phone?: string
    email?: string
    whatsapp?: string
  }
}

export default function ProtectedSearch() {
  const {
    plan,
    canSearch,
    canAccessContacts,
    searchUsage,
    loading: subscriptionLoading,
    recordSearch,
    recordProviderAccess,
    user
  } = useSubscription()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!query.trim()) return
    
    // Check if user can search
    if (!canSearch) {
      setShowUpgrade(true)
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      // Search service providers
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,service_type.ilike.%${query}%`)
        .limit(plan.searchLimit || 100)

      if (error) throw error

      setResults(data || [])

      // Record the search
      if (user) {
        await recordSearch(query, data?.length || 0)
      }

    } catch (error) {
      console.error('Search error:', error)
      alert('There was an error performing the search. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleContactAccess = async (providerId: string, accessType: 'view' | 'contact' | 'details') => {
    if (user) {
      await recordProviderAccess(providerId, accessType)
    }
  }

  const renderContactInfo = (result: SearchResult) => {
    if (!canAccessContacts) {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-500">
            <LockClosedIcon className="w-5 h-5" />
            <span className="text-sm">Contact information hidden</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Upgrade to {plan.id === 'free' ? 'Standard' : 'Pro'} plan to view contact details
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm mt-2"
          >
            <CreditCardIcon className="w-4 h-4" />
            <span>Upgrade Now</span>
          </Link>
        </div>
      )
    }

    const contact = result.contact_info || {}
    
    return (
      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-800 mb-2">Contact Information:</h4>
        <div className="space-y-1 text-sm text-green-700">
          {contact.phone && (
            <div>📞 <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a></div>
          )}
          {contact.email && (
            <div>📧 <a href={`mailto:${contact.email}`} className="hover:underline">{contact.email}</a></div>
          )}
          {contact.whatsapp && (
            <div>💬 <a href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`} className="hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp</a></div>
          )}
        </div>
      </div>
    )
  }

  const limitedResults = plan.searchLimit && plan.searchLimit < results.length 
    ? results.slice(0, plan.searchLimit)
    : results

  if (subscriptionLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Services in Abu Dhabi
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover trusted service providers across Abu Dhabi
          </p>

          {/* Subscription Status */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-600">
                  {searchUsage.limit === null 
                    ? 'Unlimited searches'
                    : `${searchUsage.used}/${searchUsage.limit} searches used`
                  }
                </p>
              </div>
              {plan.id === 'free' && (
                <Link
                  href="/pricing"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </motion.div>

        {/* Search Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for services, locations, or keywords..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <button
              type="submit"
              disabled={isSearching || !canSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {!canSearch && (
            <p className="text-red-600 text-sm mt-2 text-center">
              You&apos;ve reached your search limit. <Link href="/pricing" className="underline">Upgrade your plan</Link> to continue searching.
            </p>
          )}
        </motion.form>

        {/* Search Limit Warning */}
        {showUpgrade && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center"
          >
            <h3 className="font-semibold text-yellow-800 mb-2">Search Limit Reached</h3>
            <p className="text-yellow-700 mb-4">
              You&apos;ve used all your searches for this period. Upgrade to get more searches and unlock contact information.
            </p>
            <Link
              href="/pricing"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Pricing Plans
            </Link>
          </motion.div>
        )}

        {/* Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {limitedResults.length > 0 ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Search Results ({limitedResults.length})
                  </h2>
                  {plan.searchLimit && results.length > plan.searchLimit && (
                    <p className="text-sm text-gray-600">
                      Showing {plan.searchLimit} of {results.length} results
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {limitedResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                      onMouseEnter={() => handleContactAccess(result.id, 'view')}
                    >
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {result.name}
                      </h3>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {result.service_type?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-3 line-clamp-3">
                        {result.description}
                      </p>

                      <div className="text-sm text-gray-600 mb-3">
                        📍 {result.location}
                      </div>

                      {result.price > 0 && (
                        <div className="text-sm text-green-600 font-medium mb-3">
                          💰 {result.price} AED/hour
                        </div>
                      )}

                      {result.rating > 0 && (
                        <div className="text-sm text-yellow-600 mb-3">
                          ⭐ {result.rating}/5
                        </div>
                      )}

                      {renderContactInfo(result)}
                    </motion.div>
                  ))}
                </div>

                {plan.searchLimit && results.length > plan.searchLimit && (
                  <div className="text-center mt-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        {results.length - plan.searchLimit} more results available
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Upgrade to see all search results and access contact information
                      </p>
                      <Link
                        href="/pricing"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Upgrade Now
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or browse our service categories
                </p>
              </div>
            )}
          </motion.div>
        )}

        {!hasSearched && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to find services?</h3>
            <p className="text-gray-600">
              Enter your search terms above to discover amazing service providers in Abu Dhabi
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
