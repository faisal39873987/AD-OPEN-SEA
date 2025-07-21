'use client'

import { motion } from 'framer-motion'
import { 
  ShieldCheckIcon, 
  StarIcon, 
  UsersIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6"
          >
            About 
            <span className="block text-black dark:text-white">
              AD Pulse
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            We&apos;re the premier service marketplace connecting customers with trusted professionals across Abu Dhabi and the UAE.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                AD Pulse was founded with a simple mission: to make finding and booking quality services as easy as a few clicks. We believe everyone deserves access to reliable, professional services at fair prices.
              </p>
              <p className="text-lg text-gray-600">
                Our platform bridges the gap between service seekers and providers, creating opportunities for local businesses while ensuring customers receive exceptional service every time.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="bg-white border-2 border-black p-6 rounded-2xl text-center">
                <UsersIcon className="w-12 h-12 text-black mx-auto mb-4" />
                <div className="text-2xl font-bold text-black">2,500+</div>
                <div className="text-gray-600">Verified Providers</div>
              </div>
              <div className="bg-black text-white p-6 rounded-2xl text-center">
                <HeartIcon className="w-12 h-12 text-white mx-auto mb-4" />
                <div className="text-2xl font-bold text-white">15,000+</div>
                <div className="text-gray-300">Happy Customers</div>
              </div>
              <div className="bg-white border-2 border-black p-6 rounded-2xl text-center">
                <StarIcon className="w-12 h-12 text-black mx-auto mb-4" />
                <div className="text-2xl font-bold text-black">4.9/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="bg-black text-white p-6 rounded-2xl text-center">
                <ShieldCheckIcon className="w-12 h-12 text-white mx-auto mb-4" />
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-gray-300">Verified</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Trust & Safety",
                description: "Every service provider is thoroughly verified with background checks and skill assessments.",
                icon: ShieldCheckIcon
              },
              {
                title: "Quality Excellence",
                description: "We maintain high standards through our rating system and continuous quality monitoring.",
                icon: StarIcon
              },
              {
                title: "Customer First",
                description: "Your satisfaction is our priority. We&apos;re here 24/7 to ensure you get the best service.",
                icon: HeartIcon
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-8 rounded-2xl border-2 border-black hover:bg-black hover:text-white transition-all group ${
                  index % 2 === 0 ? 'bg-white' : 'bg-black text-white'
                }`}
              >
                <value.icon className={`w-12 h-12 mb-6 ${
                  index % 2 === 0 ? 'text-black group-hover:text-white' : 'text-white'
                }`} />
                <h3 className={`text-xl font-bold mb-4 ${
                  index % 2 === 0 ? 'text-black group-hover:text-white' : 'text-white'
                }`}>
                  {value.title}
                </h3>
                <p className={`${
                  index % 2 === 0 ? 'text-gray-600 group-hover:text-gray-300' : 'text-gray-300'
                }`}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Built for Abu Dhabi, by Abu Dhabi
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              Our team understands the unique needs of Abu Dhabi residents and businesses. We&apos;re committed to supporting the local economy while providing world-class service standards.
            </p>
            
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <SparklesIcon className="w-16 h-16 text-black mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-black mb-4">
                Join Our Growing Community
              </h3>
              <p className="text-gray-600 mb-6">
                Whether you&apos;re looking for services or want to offer your skills, AD Pulse is your gateway to trusted connections.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/services" className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-colors text-center">
                  Find Services
                </a>
                <a href="/providers" className="bg-white text-black border-2 border-black px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors text-center">
                  Become a Provider
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
