'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [profileData, setProfileData] = useState({
    name: 'Ahmed Al Rashid',
    email: 'ahmed@example.com',
    phone: '+971 50 123 4567',
    location: 'Abu Dhabi, UAE',
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    }
  })

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Profile updated successfully!')
  }

  const handleNotificationChange = (type: string) => {
    setProfileData({
      ...profileData,
      notifications: {
        ...profileData.notifications,
        [type]: !profileData.notifications[type as keyof typeof profileData.notifications]
      }
    })
  }

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'profile', label: 'Profile', icon: '�' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'help', label: 'Help & Support', icon: '❓' }
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 py-4 px-4">
        <div className="max-w-5xl mx-auto flex items-center">
          <Link href="/chat" className="text-gray-400 hover:text-white mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-medium">Settings</h1>
        </div>
      </header>

      {/* Settings Content */}
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[#3a3a3a] text-white'
                          : 'text-gray-300 hover:bg-[#3a3a3a]'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium text-sm">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              <div className="bg-[#2a2a2a] rounded-lg border border-gray-800 p-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                  <div>
                    <h2 className="text-xl font-medium text-gray-200 mb-6">General Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Theme
                        </label>
                        <select className="w-full px-3 py-2 bg-[#3a3a3a] border border-gray-700 rounded-md text-sm text-gray-200 focus:ring-1 focus:ring-gray-500">
                          <option value="dark">Dark (Default)</option>
                          <option value="light">Light</option>
                          <option value="system">System</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-400">
                          Choose your preferred theme appearance
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Language
                        </label>
                        <select 
                          value={profileData.language}
                          onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                          className="w-full px-3 py-2 bg-[#3a3a3a] border border-gray-700 rounded-md text-sm text-gray-200 focus:ring-1 focus:ring-gray-500"
                        >
                          <option value="en">English</option>
                          <option value="ar">العربية</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-xl font-medium text-gray-200 mb-6">Profile Information</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Language
                        </label>
                        <select
                          value={profileData.language}
                          onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                          <option value="en">English</option>
                          <option value="ar">العربية</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                      >
                        Update Profile
                      </button>
                    </form>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6">Notification Preferences</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4 border-b">
                        <div>
                          <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-600">Receive updates about your bookings via email</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('email')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.notifications.email ? 'bg-black' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.notifications.email ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b">
                        <div>
                          <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                          <p className="text-sm text-gray-600">Get text messages for important updates</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('sms')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.notifications.sms ? 'bg-black' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-4 border-b">
                        <div>
                          <h3 className="font-semibold text-gray-900">Push Notifications</h3>
                          <p className="text-sm text-gray-600">Receive notifications in your browser</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('push')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.notifications.push ? 'bg-black' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.notifications.push ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">Marketing Communications</h3>
                          <p className="text-sm text-gray-600">Receive promotional offers and news</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('marketing')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            profileData.notifications.marketing ? 'bg-black' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6">App Preferences</h2>
                    <div className="space-y-6">
                      <div className="border-b pb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Theme Settings</h3>
                        <div className="grid grid-cols-3 gap-4">
                          <button className="p-4 border-2 border-black rounded-lg bg-white text-center">
                            <div className="w-8 h-8 bg-white border border-gray-300 rounded mx-auto mb-2"></div>
                            <span className="text-sm font-medium">Light</span>
                          </button>
                          <button className="p-4 border border-gray-300 rounded-lg text-center">
                            <div className="w-8 h-8 bg-gray-800 rounded mx-auto mb-2"></div>
                            <span className="text-sm">Dark</span>
                          </button>
                          <button className="p-4 border border-gray-300 rounded-lg text-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-white to-gray-800 rounded mx-auto mb-2"></div>
                            <span className="text-sm">Auto</span>
                          </button>
                        </div>
                      </div>

                      <div className="border-b pb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Service Preferences</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" defaultChecked />
                            <span>Show only verified providers</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" />
                            <span>Enable location-based recommendations</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-3" defaultChecked />
                            <span>Auto-save favorite providers</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6">Security Settings</h2>
                    <div className="space-y-6">
                      <div className="border-b pb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Password</h3>
                        <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                          Change Password
                        </button>
                      </div>

                      <div className="border-b pb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                        <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                          Enable 2FA
                        </button>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Login History</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center py-2">
                            <span>Today, 2:30 PM - Abu Dhabi, UAE</span>
                            <span className="text-green-600">Current session</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span>Yesterday, 9:15 AM - Abu Dhabi, UAE</span>
                            <span className="text-gray-500">Mobile app</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6">Billing & Payments</h2>
                    <div className="space-y-6">
                      <div className="border-b pb-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Payment Methods</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
                                💳
                              </div>
                              <div>
                                <p className="font-medium">•••• •••• •••• 1234</p>
                                <p className="text-sm text-gray-600">Expires 12/26</p>
                              </div>
                            </div>
                            <button className="text-red-600 hover:text-red-800">Remove</button>
                          </div>
                        </div>
                        <button className="mt-4 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                          Add Payment Method
                        </button>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Billing History</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-3 border-b">
                            <div>
                              <p className="font-medium">Home Cleaning Service</p>
                              <p className="text-sm text-gray-600">Dec 15, 2024</p>
                            </div>
                            <span className="font-semibold">AED 150</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b">
                            <div>
                              <p className="font-medium">Personal Training Session</p>
                              <p className="text-sm text-gray-600">Dec 10, 2024</p>
                            </div>
                            <span className="font-semibold">AED 200</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Tab */}
                {activeTab === 'help' && (
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-6">Help & Support</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button 
                          onClick={() => router.push('/contact')}
                          className="p-6 border rounded-xl text-left hover:shadow-lg transition-shadow"
                        >
                          <div className="text-2xl mb-3">📞</div>
                          <h3 className="font-semibold mb-2">Contact Support</h3>
                          <p className="text-sm text-gray-600">Get help from our support team</p>
                        </button>
                        
                        <button className="p-6 border rounded-xl text-left hover:shadow-lg transition-shadow">
                          <div className="text-2xl mb-3">📚</div>
                          <h3 className="font-semibold mb-2">Help Center</h3>
                          <p className="text-sm text-gray-600">Browse frequently asked questions</p>
                        </button>
                        
                        <button 
                          onClick={() => router.push('/')}
                          className="p-6 border rounded-xl text-left hover:shadow-lg transition-shadow"
                        >
                          <div className="text-2xl mb-3">🤖</div>
                          <h3 className="font-semibold mb-2">AI Assistant</h3>
                          <p className="text-sm text-gray-600">Chat with our AI for instant help</p>
                        </button>
                        
                        <button className="p-6 border rounded-xl text-left hover:shadow-lg transition-shadow">
                          <div className="text-2xl mb-3">🎓</div>
                          <h3 className="font-semibold mb-2">Tutorials</h3>
                          <p className="text-sm text-gray-600">Learn how to use our platform</p>
                        </button>
                      </div>

                      <div className="border-t pt-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Account Actions</h3>
                        <div className="space-y-3">
                          <button className="text-blue-600 hover:text-blue-800 transition-colors">
                            Download my data
                          </button>
                          <br />
                          <button className="text-red-600 hover:text-red-800 transition-colors">
                            Delete my account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
