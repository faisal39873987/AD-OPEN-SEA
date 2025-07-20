'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate password reset request - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Request successful
      setSent(true);
      
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <img
          className="mx-auto h-12 w-auto"
          src="/logos/logo-light.png"
          alt="AD Pulse"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {!sent && "Enter your email address and we'll send you a link to reset your password"}
        </p>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-700">
          {sent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                <EnvelopeIcon className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white">Reset link sent</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                We've sent a password reset link to {email}. Please check your email inbox.
              </p>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="text-sm font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Return to sign in
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6" 
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black dark:bg-gray-700 dark:text-white dark:focus:ring-white dark:focus:border-white sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                  {!loading && <ArrowRightIcon className="ml-2 w-4 h-4" />}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Back to sign in
                </Link>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
