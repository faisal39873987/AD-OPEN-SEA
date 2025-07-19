'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StripePayment from '@/components/StripePayment'

export default function BookingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // In a real application, this would be populated from route parameters or query state
  const providerInfo = {
    id: 'sample-provider-id', 
    name: 'Provider Name',
    category: 'Sample Service',
    hourlyRate: 150
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Book a Service</h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Provider Information</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="mb-2"><span className="font-medium">Name:</span> {providerInfo.name}</p>
              <p className="mb-2"><span className="font-medium">Service:</span> {providerInfo.category}</p>
              <p><span className="font-medium">Rate:</span> AED {providerInfo.hourlyRate}/hour</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            <StripePayment
              amount={providerInfo.hourlyRate}
              description={`${providerInfo.category} service by ${providerInfo.name}`}
              metadata={{
                providerId: providerInfo.id,
                providerName: providerInfo.name,
                service: providerInfo.category
              }}
              onClose={() => router.push('/services')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
