'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, StarIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'

interface Provider {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  rating: number
  reviews: number
  location: string
  locationAr: string
  phone: string
  image: string
  price: string
  priceAr: string
  availability: boolean
}

export default function ServicePage() {
  const params = useParams()
  const serviceId = params?.service as string
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  const serviceNames: Record<string, { en: string; ar: string }> = {
    'personal-trainer': { en: 'Personal Trainer', ar: 'مدرب شخصي' },
    'home-cleaning': { en: 'Home Cleaning', ar: 'تنظيف منازل' },
    'beauty-clinic': { en: 'Beauty Clinic', ar: 'عيادة تجميل' },
    'transportation': { en: 'Transportation', ar: 'النقل والمواصلات' },
    'property-rental': { en: 'Property Rental', ar: 'تأجير العقارات' },
    'pet-care': { en: 'Pet Care', ar: 'رعاية الحيوانات' },
    'baby-world': { en: 'Baby World', ar: 'عالم الأطفال' }
  }

  useEffect(() => {
    // Simulating data loading from Supabase
    const mockProviders: Provider[] = [
      {
        id: '1',
        name: 'Ahmed Fitness',
        nameAr: 'أحمد للياقة البدنية',
        description: 'Professional personal trainer with 5 years experience',
        descriptionAr: 'مدرب شخصي محترف مع خبرة 5 سنوات',
        rating: 4.8,
        reviews: 24,
        location: 'Al Khalidiya, Abu Dhabi',
        locationAr: 'الخالدية، أبوظبي',
        phone: '+971 50 123 4567',
        image: '/images/trainer-1.jpg',
        price: '200 AED/session',
        priceAr: '200 درهم/جلسة',
        availability: true
      },
      {
        id: '2',
        name: 'Fitness Pro Center',
        nameAr: 'مركز فتنس برو',
        description: 'Complete fitness solutions and personal training',
        descriptionAr: 'حلول لياقة بدنية شاملة وتدريب شخصي',
        rating: 4.9,
        reviews: 18,
        location: 'Marina Mall, Abu Dhabi',
        locationAr: 'مارينا مول، أبوظبي',
        phone: '+971 50 234 5678',
        image: '/images/trainer-2.jpg',
        price: '250 AED/session',
        priceAr: '250 درهم/جلسة',
        availability: true
      }
    ]

    setTimeout(() => {
      setProviders(mockProviders)
      setLoading(false)
    }, 1000)
  }, [serviceId])

  const serviceName = serviceNames[serviceId] || { en: 'Service', ar: 'خدمة' }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service providers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-black">
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {serviceName.en}
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {providers.length} providers available
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {provider.description}
                    </p>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          {provider.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({provider.reviews} reviews)
                      </span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    provider.availability 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {provider.availability ? 'Available' : 'Unavailable'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4 ml-2" />
                    {provider.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="w-4 h-4 ml-2" />
                    {provider.phone}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    {provider.price}
                  </span>
                  <button 
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    disabled={!provider.availability}
                  >
                    {provider.availability ? 'Book Now' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {providers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-4m-4 0H8m8 0v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No service providers available currently
            </h3>
            <p className="text-gray-600">
              Please try again later or contact us for assistance.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
