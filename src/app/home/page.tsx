'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  SparklesIcon,
  ShieldCheckIcon,
  UsersIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const features = [
    {
      title: "Verified Professionals",
      description: "All service providers are thoroughly vetted and verified for your peace of mind.",
      icon: ShieldCheckIcon
    },
    {
      title: "Trusted Community",
      description: "Join thousands of satisfied customers in Abu Dhabi who trust our platform.",
      icon: UsersIcon
    },
    {
      title: "Quick Response",
      description: "Get connected with service providers within minutes, not hours.",
      icon: ClockIcon
    },
    {
      title: "Quality Guaranteed",
      description: "All services come with our quality guarantee and customer support.",
      icon: StarIcon
    }
  ]

  const services = [
    "Home Cleaning",
    "Maintenance & Repair", 
    "Catering & Events",
    "Transportation",
    "Business Services",
    "Creative & Design",
    "Health & Wellness",
    "Beauty & Personal Care"
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Abu Dhabi
                <span className="block text-gray-300">OpenSea</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Your trusted marketplace for connecting with verified service providers across Abu Dhabi
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                href="/services"
                className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                Find Services
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link 
                href="/chat"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                Try AI Assistant
                <SparklesIcon className="w-5 h-5" />
              </Link>
              <Link 
                href="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                Create Account
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              Why Choose AD Pulse?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re more than just a marketplace - we&apos;re your trusted partner in finding quality services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl border-2 border-gray-200 hover:border-black transition-all group"
              >
                <feature.icon className="w-12 h-12 text-black mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our most requested services in Abu Dhabi
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white p-6 rounded-xl text-center border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all group cursor-pointer"
              >
                <span className="font-medium text-sm md:text-base">
                  {service}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link 
              href="/services"
              className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all inline-flex items-center gap-2"
            >
              View All Services
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and service providers in Abu Dhabi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/services"
                className="bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all"
              >
                Find a Service
              </Link>
              <Link 
                href="/providers"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-black transition-all"
              >
                Become a Provider
              </Link>
              <Link 
                href="/login"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
