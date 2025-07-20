'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  KeyIcon,
  UserPlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const { mounted } = useTheme()

  // Real authentication state from Supabase
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    
    getUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setProfileMenuOpen(false)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const navigation = [
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]
  
  // GPT Assistant URL - no direct OpenAI integration
  const gptAssistantUrl = 'https://chat.openai.com/g/g-tivLXVzze-abu-dhabi-open-sea-guide'

  // Profile dropdown menu items
  const profileMenu = user 
    ? [
        { name: 'My Profile', href: '/profile', icon: UserCircleIcon },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
        { name: 'Upgrade Plan', href: '/pricing', icon: SparklesIcon },
        { name: 'Sign Out', href: '/logout', icon: ArrowRightOnRectangleIcon },
      ]
    : [
        { name: 'Sign In', href: '/login', icon: UserCircleIcon },
        { name: 'Sign Up', href: '/register', icon: UserPlusIcon },
        { name: 'Reset Password', href: '/reset-password', icon: KeyIcon },
      ];

  // Close profile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu') && !target.closest('.profile-button')) {
        setProfileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <header 
      className="border-b sticky top-0 z-50"
      style={{
        backgroundColor: 'white',
        borderColor: '#e5e7eb'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Logo and Title */}
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <Link href="/home" className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-md">
              <div className="w-10 h-10 flex items-center justify-center relative">
                <Image 
                  src="/logos/logo-light.png"
                  alt="AD Pulse Logo" 
                  width={40}
                  height={40}
                  priority
                  className="object-contain"
                />
              </div>
              <h1 
                className="text-xl font-bold text-black"
              >
                AD Pulse
              </h1>
            </Link>

            {/* Theme Toggle Button */}
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors duration-300 ${
                  pathname === item.href
                    ? 'font-bold border-b-2 border-black text-black'
                    : 'text-gray-700 hover:opacity-80'
                } focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded px-2 py-1`}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side: Profile Menu */}
          <div className="flex items-center">
            {/* Ask GPT Button - external link only, no direct OpenAI integration */}
            <a
              href={gptAssistantUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ask GPT Assistant for help"
              className="mr-4 px-4 py-2 border border-black text-black rounded hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              <SparklesIcon className="w-5 h-5 inline-block mr-1" aria-hidden="true" />
              Ask GPT
            </a>
            
            <div className="relative profile-button">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
                aria-label={`${user ? 'My Account' : 'Sign In'} menu`}
                className="p-2 rounded-full hover:bg-gray-100 flex items-center space-x-1 text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              >
                <UserCircleIcon className="w-6 h-6" aria-hidden="true" />
                <span className="hidden sm:inline-block text-sm font-medium">
                  {user ? 'My Account' : 'Sign In'}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 profile-menu border border-gray-200"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                >
                  {profileMenu.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-black focus:outline-none focus:bg-gray-100"
                      role="menuitem"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        if (item.name === 'Sign Out') handleLogout()
                      }}
                    >
                      <item.icon className="w-5 h-5 mr-3" aria-hidden="true" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md transition-colors text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden py-4 border-t border-black"
            id="mobile-menu"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`transition-colors ${
                    pathname === item.href
                      ? 'text-black font-bold'
                      : 'text-gray-600 hover:text-black'
                  } focus:outline-none focus:bg-gray-100 px-3 py-1 rounded`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}

              {/* Add profile menu items to mobile nav */}
              <div className="pt-3 mt-3 border-t border-gray-200">
                <p className="px-3 text-xs uppercase text-gray-500 font-semibold mb-2">
                  {user ? 'Account' : 'Authentication'}
                </p>
                {profileMenu.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center py-2 px-3 text-gray-600 hover:text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5 mr-3" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
                
                {/* Ask GPT link in mobile menu */}
                <a
                  href={gptAssistantUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Ask GPT Assistant for help"
                  className="flex items-center py-2 px-3 text-gray-600 hover:text-black border-t border-gray-200 mt-2 pt-2 focus:outline-none focus:bg-gray-100 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <SparklesIcon className="w-5 h-5 mr-3" aria-hidden="true" />
                  Ask GPT
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
