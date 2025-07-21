'use client';

import React, { useState } from 'react';
import { X, Mail, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register' | 'reset';
  onModeChange: (mode: 'login' | 'register' | 'reset') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Login successful!');
        onClose();
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Registration successful! Please check your email for verification.');
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage('Password reset email sent! Please check your inbox.');
      }
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage(error.message || 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-900 rounded-lg max-w-md w-full p-6 border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {mode === 'login' && 'Sign In'}
                {mode === 'register' && 'Sign Up'}
                {mode === 'reset' && 'Reset Password'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  <Mail size={20} className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>

              {/* Password */}
              {mode !== 'reset' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                  loading
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Loading...' : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Sign Up'}
                    {mode === 'reset' && 'Send Reset Email'}
                  </>
                )}
              </button>

              {/* Google Sign In */}
              {mode !== 'reset' && (
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2 px-4 border border-gray-700 rounded-md text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  Continue with Google
                </button>
              )}

              {/* Message */}
              {message && (
                <div className={`text-sm p-3 rounded-md ${
                  message.includes('error') || message.includes('Error')
                    ? 'bg-red-900 text-red-200'
                    : 'bg-green-900 text-green-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Mode Switch */}
              <div className="text-center text-sm text-gray-400">
                {mode === 'login' && (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onModeChange('register')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Sign up
                    </button>
                    <br />
                    <button
                      type="button"
                      onClick={() => onModeChange('reset')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Forgot password?
                    </button>
                  </>
                )}
                {mode === 'register' && (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => onModeChange('login')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Sign in
                    </button>
                  </>
                )}
                {mode === 'reset' && (
                  <>
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={() => onModeChange('login')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
