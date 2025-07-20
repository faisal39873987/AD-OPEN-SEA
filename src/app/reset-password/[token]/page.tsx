'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

function NewPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password strength indicators
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  const passwordStrength = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar
  ].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Invalid or expired password reset link');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (passwordStrength < 3) {
      setError('Please use a stronger password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate password reset - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Password reset successful
      setSuccess(true);
      
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
            <div className="text-center">
              <h3 className="text-lg font-medium text-black">Invalid Reset Link</h3>
              <p className="mt-2 text-sm text-gray-600">
                This password reset link is invalid or has expired.
              </p>
              <div className="mt-6">
                <Link
                  href="/reset-password"
                  className="text-sm font-medium text-black hover:text-gray-700"
                >
                  Request a new password reset link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          {success ? 'Password Reset Complete' : 'Create New Password'}
        </h2>
        {!success && (
          <p className="mt-2 text-center text-sm text-gray-600">
            Please create a secure password for your account
          </p>
        )}
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-black">Password reset successful</h3>
              <p className="mt-2 text-sm text-gray-600">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <div className="mt-6">
                <Link
                  href="/login"
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                >
                  Sign in
                  <ArrowRightIcon className="ml-2 w-4 h-4" />
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
                <div className="bg-white border-l-4 border-black p-4 mb-4">
                  <p className="text-sm text-black">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black">
                  New password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black bg-white text-black sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {/* Password strength meter */}
                {password && (
                  <div className="mt-2">
                    <div className="h-1 w-full bg-gray-200 rounded overflow-hidden">
                      <div 
                        className="h-1 bg-black rounded transition-all duration-300 ease-in-out" 
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-500 space-y-1">
                      <div className={`flex items-center ${hasMinLength ? 'text-black' : ''}`}>
                        <span className="mr-1">{hasMinLength ? '✓' : '○'}</span> At least 8 characters
                      </div>
                      <div className={`flex items-center ${hasUppercase ? 'text-black' : ''}`}>
                        <span className="mr-1">{hasUppercase ? '✓' : '○'}</span> At least one uppercase letter
                      </div>
                      <div className={`flex items-center ${hasLowercase ? 'text-black' : ''}`}>
                        <span className="mr-1">{hasLowercase ? '✓' : '○'}</span> At least one lowercase letter
                      </div>
                      <div className={`flex items-center ${hasNumber ? 'text-black' : ''}`}>
                        <span className="mr-1">{hasNumber ? '✓' : '○'}</span> At least one number
                      </div>
                      <div className={`flex items-center ${hasSpecialChar ? 'text-black' : ''}`}>
                        <span className="mr-1">{hasSpecialChar ? '✓' : '○'}</span> At least one special character
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
                  Confirm new password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black bg-white text-black sm:text-sm"
                    placeholder="••••••••"
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
                  {loading ? 'Resetting password...' : 'Reset password'}
                  {!loading && <ArrowRightIcon className="ml-2 w-4 h-4" />}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center py-6">
          <svg className="animate-spin h-8 w-8 text-black mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-black">Loading...</h3>
        </div>
      </div>
    </div>
  );
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewPasswordContent />
    </Suspense>
  );
}
