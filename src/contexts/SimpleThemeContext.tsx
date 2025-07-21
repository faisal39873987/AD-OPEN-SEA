'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ThemeType = 'light' | 'dark'

interface ThemeContextProps {
  theme: ThemeType
  toggleTheme: () => void
}

// Create the context with a default value
const ThemeContext = createContext<ThemeContextProps>({
  theme: 'dark',
  toggleTheme: () => {}
})

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize with a default but don't show until we've checked localStorage
  const [theme, setTheme] = useState<ThemeType>('dark')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage after component mounts
  useEffect(() => {
    // Check localStorage first
    const storedTheme = localStorage.getItem('theme') as ThemeType
    
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
    } else {
      // Fall back to system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
    
    setMounted(true)
  }, [])

  // Update the document whenever theme changes
  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  // Don't render children until we've determined the theme to avoid flicker
  if (!mounted) {
    return <div className="invisible" />
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
