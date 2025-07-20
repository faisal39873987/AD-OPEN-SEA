'use client'

import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon,
  ClockIcon,
  StarIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

export default function FeaturesSection() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Verified Professionals',
      description: 'All service providers undergo thorough background checks, skill verification, and identity confirmation for your safety and peace of mind.',
      color: 'blue',
      stats: '100% Verified'
    },
    {
      icon: ClockIcon,
      title: 'Quick Booking',
      description: 'Book services instantly with our smart matching system. Get confirmed appointments within minutes, not hours.',
      color: 'green',
      stats: 'Under 5 mins'
    },
    {
      icon: StarIcon,
      title: 'Quality Guarantee',
      description: 'Our rating system ensures quality service delivery. If you&apos;re not satisfied, we&apos;ll make it right with our satisfaction guarantee.',
      color: 'yellow',
      stats: '4.9/5 Rating'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Transparent Pricing',
      description: 'No hidden fees, no surprises. See exact pricing upfront with our transparent cost breakdown before booking.',
      color: 'purple',
      stats: 'Fixed Rates'
    },
    {
      icon: PhoneIcon,
      title: '24/7 Customer Support',
      description: 'Round-the-clock customer support in Arabic and English. We&apos;re here to help whenever you need assistance.',
      color: 'red',
      stats: '24/7 Available'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Real-time Communication',
      description: 'Direct chat with service providers, real-time updates, and live tracking for complete transparency.',
      color: 'indigo',
      stats: 'Instant Chat'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-100',
        icon: 'text-blue-600',
        accent: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-100',
        icon: 'text-green-600',
        accent: 'text-green-600'
      },
      yellow: {
        bg: 'bg-yellow-100',
        icon: 'text-yellow-600',
        accent: 'text-yellow-600'
      },
      purple: {
        bg: 'bg-purple-100',
        icon: 'text-purple-600',
        accent: 'text-purple-600'
      },
      red: {
        bg: 'bg-red-100',
        icon: 'text-red-600',
        accent: 'text-red-600'
      },
      indigo: {
        bg: 'bg-indigo-100',
        icon: 'text-indigo-600',
        accent: 'text-indigo-600'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Why Choose 
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AD Pulse?
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            We&apos;ve built the most trusted platform for connecting customers with service providers across the UAE
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-16 h-16 ${getColorClasses(feature.color).bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${getColorClasses(feature.color).icon}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {feature.title}
                    </h3>
                    <span className={`text-sm font-semibold ${getColorClasses(feature.color).accent} bg-gray-50 px-3 py-1 rounded-full`}>
                      {feature.stats}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white rounded-3xl p-12 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600 font-medium">Verified Providers</div>
              <div className="flex items-center justify-center mt-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-1" />
                <span className="text-sm text-green-600">All Verified</span>
              </div>
            </div>
            
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">15,000+</div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
              <div className="flex items-center justify-center mt-2">
                <HeartIcon className="w-5 h-5 text-red-500 mr-1" />
                <span className="text-sm text-red-600">Satisfied</span>
              </div>
            </div>
            
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">50,000+</div>
              <div className="text-gray-600 font-medium">Jobs Completed</div>
              <div className="flex items-center justify-center mt-2">
                <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">High Quality</span>
              </div>
            </div>
            
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">4.9/5</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
              <div className="flex items-center justify-center mt-2">
                <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">Excellent</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
