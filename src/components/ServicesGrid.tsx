'use client'

import { motion } from 'framer-motion'
import { 
  HomeIcon,
  WrenchIcon,
  TruckIcon,
  BriefcaseIcon,
  PaintBrushIcon,
  HeartIcon,
  SparklesIcon,
  ArrowRightIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ServicesGrid() {
  const services = [
    {
      icon: HomeIcon,
      title: 'Home Cleaning',
      description: 'Professional deep cleaning, regular maintenance, and eco-friendly solutions for your home.',
      providers: 156,
      avgPrice: '45-80',
      color: 'blue',
      image: '🏠'
    },
    {
      icon: WrenchIcon,
      title: 'Maintenance & Repair',
      description: 'Plumbing, electrical, AC repair, appliance fixes, and general handyman services.',
      providers: 142,
      avgPrice: '60-120',
      color: 'green',
      image: '🔧'
    },
    {
      icon: GlobeAltIcon,
      title: 'Yacht Rental',
      description: 'Premium yacht rental services for events, parties, and private cruises in Abu Dhabi.',
      providers: 89,
      avgPrice: '25-150',
      color: 'cyan',
      image: '⛵' // Yacht emoji
    },
    {
      icon: TruckIcon,
      title: 'Transportation',
      description: 'Reliable taxi services, moving assistance, delivery, and logistics solutions.',
      providers: 203,
      avgPrice: '30-100',
      color: 'yellow',
      image: '🚗'
    },
    {
      icon: BriefcaseIcon,
      title: 'Business Services',
      description: 'Consulting, marketing, accounting, legal advice, and administrative support.',
      providers: 98,
      avgPrice: '80-200',
      color: 'indigo',
      image: '💼'
    },
    {
      icon: PaintBrushIcon,
      title: 'Creative & Design',
      description: 'Graphic design, photography, videography, interior design, and artistic services.',
      providers: 67,
      avgPrice: '50-180',
      color: 'purple',
      image: '🎨'
    },
    {
      icon: HeartIcon,
      title: 'Health & Wellness',
      description: 'Personal training, massage therapy, nutrition consulting, and wellness coaching.',
      providers: 124,
      avgPrice: '70-150',
      color: 'red',
      image: '💆‍♀️'
    },
    {
      icon: SparklesIcon,
      title: 'Beauty & Personal Care',
      description: 'Hair styling, makeup, skincare, nail care, and personal grooming services.',
      providers: 156,
      avgPrice: '40-120',
      color: 'emerald',
      image: '💄'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700',
      cyan: 'from-cyan-500 to-cyan-600 group-hover:from-cyan-600 group-hover:to-cyan-700',
      green: 'from-green-500 to-green-600 group-hover:from-green-600 group-hover:to-green-700',
      pink: 'from-pink-500 to-pink-600 group-hover:from-pink-600 group-hover:to-pink-700',
      yellow: 'from-yellow-500 to-yellow-600 group-hover:from-yellow-600 group-hover:to-yellow-700',
      indigo: 'from-indigo-500 to-indigo-600 group-hover:from-indigo-600 group-hover:to-indigo-700',
      purple: 'from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700',
      red: 'from-red-500 to-red-600 group-hover:from-red-600 group-hover:to-red-700',
      emerald: 'from-emerald-500 to-emerald-600 group-hover:from-emerald-600 group-hover:to-emerald-700'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Popular Services in 
            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Abu Dhabi
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Discover the most requested services with verified professionals ready to help you today
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <Link href="/services" className="block">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-transparent group-hover:scale-105 relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(service.color)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Service Icon & Emoji */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(service.color)} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {service.image}
                      </div>
                    </div>

                    {/* Service Info */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Available Providers</span>
                        <span className="font-semibold text-gray-900">{service.providers}+</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Price Range</span>
                        <span className="font-semibold text-gray-900">AED {service.avgPrice}/hr</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-6 flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                      <span>Browse Providers</span>
                      <ArrowRightIcon className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link 
            href="/services"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Services
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
