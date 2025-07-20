'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import StripePayment from '@/components/StripePayment'

interface ServiceProvider {
  id: string
  name: string
  service_category: string
  description?: string
  price?: number
  phone?: string
  whatsapp?: string
  instagram?: string
  location?: string
  available?: boolean
  created_at?: string
}

interface ProviderCardProps {
  provider: ServiceProvider
  index: number
  isFavorite: boolean
  toggleFavorite: (id: string) => void
}

export const ProviderCard = ({ provider, index, isFavorite, toggleFavorite }: ProviderCardProps) => {
  // Optimize component re-renders by not depending on external state directly
  const [isHovered, setIsHovered] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  
  return (
    <motion.div
      key={provider.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }} // Reduced delay for better performance
      className={`bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 ${isHovered ? 'border-gray-700' : ''} transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Provider Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-16 h-16 relative overflow-hidden rounded-full">
            {provider.profile_image ? (
              <Image 
                src={provider.profile_image}
                alt={`${provider.name}'s profile`}
                width={64}
                height={64}
                className="object-cover"
                loading="lazy"
                fetchPriority="low"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3E%3Crect width="18" height="18" x="3" y="3" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="9" cy="9" r="2"%3E%3C/circle%3E%3Cpath d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"%3E%3C/path%3E%3C/svg%3E';
                  // Image failed to load, using placeholder
                }}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {provider.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-200">
                {provider.name}
              </h3>
              {provider.verified && (
                <div 
                  className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                  aria-label="Verified provider"
                  title="Verified provider"
                >
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm">{provider.category}</p>
          </div>
        </div>
        
        <button
          onClick={() => toggleFavorite(provider.id)}
          className="p-2 hover:bg-[#2a2a2a] rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-gray-500"
          aria-label={isFavorite ? `Remove ${provider.name} from favorites` : `Add ${provider.name} to favorites`}
          aria-pressed={isFavorite}
        >
          {isFavorite ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" aria-hidden="true" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-400" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center mb-3">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(provider.rating) 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>
        <span className="ml-2 text-sm font-medium text-gray-300">{provider.rating}</span>
        <span className="ml-1 text-sm text-gray-400">({provider.total_reviews} reviews)</span>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {provider.skills.slice(0, 3).map((skill, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {provider.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full">
              +{provider.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {provider.description}
      </p>

      {/* Location & Response Time */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-400 text-sm">
          <MapPinIcon className="w-4 h-4 mr-2" />
          {provider.location}
        </div>
        <div className="flex items-center text-gray-400 text-sm">
          <ClockIcon className="w-4 h-4 mr-2" />
          Responds in {provider.response_time}
        </div>
      </div>

      {/* Price & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800">
        <div>
          <span className="text-xl font-bold text-gray-200">
            AED {provider.hourly_rate}
          </span>
          <span className="text-gray-400 text-sm">/hour</span>
        </div>
        
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <ChatBubbleLeftIcon className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-[#2a2a2a] rounded-lg transition-colors">
            <PhoneIcon className="w-5 h-5" />
          </button>
          <button 
            className="bg-white text-black px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            onClick={() => setShowPayment(true)}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Availability Badge */}
      <div className="mt-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          provider.available 
            ? 'bg-green-900/30 text-green-400' 
            : 'bg-red-900/30 text-red-400'
        }`}>
          {provider.available ? '● Available' : '● Busy'}
        </span>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-5 rounded-xl border border-gray-800 max-w-md w-full relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
              onClick={() => setShowPayment(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-medium text-gray-200 mb-4">Book {provider.name}</h2>
            <div className="mb-4">
              <p className="text-gray-400 mb-2">Service: {provider.category}</p>
              <p className="text-gray-400 mb-4">Rate: AED {provider.hourly_rate}/hour</p>
              
              <div className="border-t border-gray-800 pt-4 mb-4">
                <div className="flex justify-between mb-2 text-gray-300">
                  <span>1 hour service</span>
                  <span>AED {provider.hourly_rate}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-200">
                  <span>Total</span>
                  <span>AED {provider.hourly_rate}</span>
                </div>
              </div>
            </div>
            
            <StripePayment 
              amount={provider.hourly_rate} 
              description={`${provider.category} service by ${provider.name}`}
              metadata={{
                providerId: provider.id,
                providerName: provider.name,
                service: provider.category
              }}
              onClose={() => setShowPayment(false)}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
