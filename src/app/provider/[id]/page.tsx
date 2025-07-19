'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { supabase } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ProviderProfilePage({ params }: PageProps) {
  const [provider, setProvider] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [providerId, setProviderId] = useState<string>('')

  useEffect(() => {
    async function getParams() {
      const { id } = await params
      setProviderId(id)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (providerId) {
      fetchProviderData()
    }
  }, [providerId])

  const fetchProviderData = async () => {
    try {
      // Fetch provider details
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', providerId)
        .single()

      if (providerError) throw providerError

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          *,
          bookings!inner(service_type)
        `)
        .eq('service_provider_id', providerId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (reviewsError) throw reviewsError

      setProvider(providerData)
      setReviews(reviewsData || [])
    } catch (error) {
      console.error('Error fetching provider data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !serviceType) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`)
      
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: 'demo-user-id', // In a real app, get from auth
          service_provider_id: providerId,
          service_type: serviceType,
          scheduled_at: scheduledAt.toISOString(),
          total_amount: provider.hourly_rate || 0,
          special_instructions: specialInstructions
        })

      if (error) throw error

      alert('Booking request sent successfully!')
      // Reset form
      setSelectedDate('')
      setSelectedTime('')
      setServiceType('')
      setSpecialInstructions('')
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Provider Not Found</h1>
          <p className="text-gray-600">The service provider you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Provider Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-6">
                    {provider.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <h1 className="text-3xl font-bold text-gray-900 mr-3">
                        {provider.name}
                      </h1>
                      {provider.rating >= 4.5 && (
                        <CheckBadgeIcon className="w-8 h-8 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xl text-gray-600 mb-2">{provider.category}</p>
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-5 h-5 ${
                              i < (provider.rating || 0) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg text-gray-600">
                        {provider.rating?.toFixed(1) || 'No rating'} ({provider.total_reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                  provider.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {provider.available ? 'Available' : 'Busy'}
                </span>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  <span>{provider.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  <span>{provider.email}</span>
                </div>
                {provider.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span>{provider.location}</span>
                  </div>
                )}
                {provider.hourly_rate && (
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-gray-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      AED {provider.hourly_rate}/hour
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {provider.description && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-600 leading-relaxed">{provider.description}</p>
                </div>
              )}
            </motion.div>

            {/* Skills */}
            {provider.skills && provider.skills.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border p-8"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-3">
                  {provider.skills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border p-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Reviews</h3>
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            U
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">User</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-600">{review.comment}</p>
                      )}
                      <p className="text-sm text-blue-600 mt-2">
                        Service: {review.bookings?.service_type || 'General'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No reviews yet</p>
              )}
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border p-6 sticky top-8"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Book This Service</h3>
              
              <div className="space-y-4">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                  >
                    <option value="">Select a service</option>
                    <option value="Regular Service">Regular Service</option>
                    <option value="One-time Service">One-time Service</option>
                    <option value="Emergency Service">Emergency Service</option>
                    <option value="Consultation">Consultation</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                  </select>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Any specific requirements or details..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>

                {/* Price Summary */}
                {provider.hourly_rate && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="text-lg font-semibold text-gray-900">
                        AED {provider.hourly_rate}
                      </span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={handleBooking}
                  disabled={!provider.available}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                    provider.available
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {provider.available ? 'Book Now' : 'Currently Unavailable'}
                </button>

                <div className="flex items-center justify-center space-x-4 pt-4">
                  <button className="flex items-center text-blue-600 hover:text-blue-700">
                    <PhoneIcon className="w-4 h-4 mr-1" />
                    Call
                  </button>
                  <button className="flex items-center text-blue-600 hover:text-blue-700">
                    <EnvelopeIcon className="w-4 h-4 mr-1" />
                    Message
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
