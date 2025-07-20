'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function PhoneLoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 9) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate OTP send - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // OTP sent successfully
      setStep('otp');
      
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a valid OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate OTP verification - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // OTP verified successfully
      window.location.href = '/home'; // Redirect to home page
      
    } catch (err) {
      setError('Invalid OTP. Please try again.');
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
          {step === 'phone' ? 'Sign in with phone' : 'Verify your phone'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {step === 'phone' 
            ? 'Enter your phone number to receive a verification code' 
            : `We've sent a verification code to ${phone}`}
        </p>
      </motion.div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-700">
          {step === 'phone' ? (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6" 
              onSubmit={handlePhoneSubmit}
            >
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <label htmlFor="country" className="sr-only">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      className="h-full py-0 pl-3 pr-7 border-transparent bg-transparent text-gray-500 focus:outline-none focus:ring-black focus:border-black dark:focus:ring-white dark:focus:border-white sm:text-sm rounded-md"
                    >
                      <option>+971</option>
                    </select>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-20 appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black dark:bg-gray-700 dark:text-white dark:focus:ring-white dark:focus:border-white sm:text-sm"
                    placeholder="50 123 4567"
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
                  {loading ? 'Sending code...' : 'Send verification code'}
                  {!loading && <ArrowRightIcon className="ml-2 w-4 h-4" />}
                </button>
              </div>

              <div className="mt-6 text-center">
                <Link 
                  href="/login" 
                  className="inline-flex items-center text-sm font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <EnvelopeIcon className="w-4 h-4 mr-1" />
                  Sign in with email instead
                </Link>
              </div>
            </motion.form>
          ) : (
            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6" 
              onSubmit={handleOtpSubmit}
            >
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="otp-0" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Verification code
                </label>
                <div className="mt-1 flex justify-between items-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={otp[index]}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center appearance-none border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black dark:bg-gray-700 dark:text-white dark:focus:ring-white dark:focus:border-white text-lg"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Change phone number
                </button>
                <button
                  type="button"
                  onClick={handlePhoneSubmit}
                  className="font-medium text-black dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Resend code
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Verifying...' : 'Verify and sign in'}
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
