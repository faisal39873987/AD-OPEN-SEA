'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyIcon, UserIcon, DevicePhoneMobileIcon, BellIcon, ShieldCheckIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name: 'Mohammed Al Hashemi',
    email: 'mohammed@example.com',
    phone: '+971 50 123 4567',
    bio: 'Professional software developer based in Abu Dhabi',
    location: 'Abu Dhabi, UAE'
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    marketing: false
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Notification preferences updated successfully');
    } catch (err) {
      setError('Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1">
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={profileForm.location}
                  onChange={handleProfileChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Brief description for your profile.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save changes'}
                {!loading && <ArrowRightIcon className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </form>
        );
      
      case 'password':
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current password
              </label>
              <div className="mt-1">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New password
              </label>
              <div className="mt-1">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm new password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Updating...' : 'Update password'}
                {!loading && <ArrowRightIcon className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </form>
        );
      
      case 'notifications':
        return (
          <form onSubmit={handleNotificationSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="email"
                    name="email"
                    type="checkbox"
                    checked={notifications.email}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email" className="font-medium text-gray-700">
                    Email notifications
                  </label>
                  <p className="text-gray-500 text-xs mt-1">
                    Receive notifications via email for account updates, new messages, and service alerts.
                  </p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="sms"
                    name="sms"
                    type="checkbox"
                    checked={notifications.sms}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="sms" className="font-medium text-gray-700">
                    SMS notifications
                  </label>
                  <p className="text-gray-500 text-xs mt-1">
                    Receive text message alerts for urgent updates and security notifications.
                  </p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="push"
                    name="push"
                    type="checkbox"
                    checked={notifications.push}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="push" className="font-medium text-gray-700">
                    Push notifications
                  </label>
                  <p className="text-gray-500 text-xs mt-1">
                    Get real-time updates directly to your device.
                  </p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="marketing"
                    name="marketing"
                    type="checkbox"
                    checked={notifications.marketing}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketing" className="font-medium text-gray-700">
                    Marketing emails
                  </label>
                  <p className="text-gray-500 text-xs mt-1">
                    Receive emails about new features, promotions, and updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save preferences'}
                {!loading && <ArrowRightIcon className="ml-2 w-4 h-4" />}
              </button>
            </div>
          </form>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:grid md:grid-cols-4 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:col-span-1"
          >
            <div className="px-0 sm:px-0">
              <div className="flex items-center mb-6">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden">
                  <Image 
                    src="/images/profile-avatar.jpg" 
                    alt="Profile" 
                    width={80} 
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-900">Mohammed Al Hashemi</h2>
                  <p className="text-sm text-gray-500">Free Plan</p>
                </div>
              </div>
              
              <h3 className="text-base font-medium text-gray-900 mb-3">Account Settings</h3>
              
              <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <ul>
                  <li className={`border-b border-gray-200 ${activeTab === 'profile' ? 'bg-gray-50' : ''}`}>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="w-full px-4 py-3 flex items-center text-sm text-left focus:outline-none"
                    >
                      <UserIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span className={`${activeTab === 'profile' ? 'font-medium text-black' : 'text-gray-600'}`}>Profile Information</span>
                    </button>
                  </li>
                  <li className={`border-b border-gray-200 ${activeTab === 'password' ? 'bg-gray-50' : ''}`}>
                    <button
                      onClick={() => setActiveTab('password')}
                      className="w-full px-4 py-3 flex items-center text-sm text-left focus:outline-none"
                    >
                      <KeyIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span className={`${activeTab === 'password' ? 'font-medium text-black' : 'text-gray-600'}`}>Password</span>
                    </button>
                  </li>
                  <li className={activeTab === 'notifications' ? 'bg-gray-50' : ''}>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className="w-full px-4 py-3 flex items-center text-sm text-left focus:outline-none"
                    >
                      <BellIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                      <span className={`${activeTab === 'notifications' ? 'font-medium text-black' : 'text-gray-600'}`}>Notifications</span>
                    </button>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <Link
                  href="/payment"
                  className="inline-flex items-center px-4 py-2 w-full justify-center border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                >
                  Upgrade to Premium
                </Link>
              </div>
              
              <div className="mt-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Need help?</h3>
                <p className="text-xs text-gray-500 mb-3">
                  Contact our support team for assistance with your account.
                </p>
                <Link
                  href="/contact"
                  className="text-xs font-medium text-black hover:text-gray-600"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-8 md:mt-0 md:col-span-3"
          >
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                {renderTabContent()}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
