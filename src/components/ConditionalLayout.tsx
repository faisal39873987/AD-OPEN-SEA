'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Only the main AI chat page doesn't have navigation
  const isMainChatPage = pathname === '/'
  
  // List of authentication-related paths that should have the navigation
  const authPaths = [
    '/login',
    '/register',
    '/reset-password',
    '/verify-email',
    '/resend-verification',
    '/profile'
  ]
  
  // Check if current path starts with any auth path
  const isAuthPath = authPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )

  if (isMainChatPage) {
    return <>{children}</>
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}
