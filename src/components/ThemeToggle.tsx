'use client'

import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, effectiveTheme, setTheme, mounted } = useTheme()

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 
                     bg-white dark:bg-gray-800 animate-pulse" />
    )
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <SunIcon className="w-5 h-5" />
      case 'dark':
        return <MoonIcon className="w-5 h-5" />
      case 'system':
        return <ComputerDesktopIcon className="w-5 h-5" />
      default:
        return <SunIcon className="w-5 h-5" />
    }
  }

  const getNextTheme = () => {
    switch (theme) {
      case 'light':
        return 'dark'
      case 'dark':
        return 'system'
      case 'system':
        return 'light'
      default:
        return 'dark'
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Switch to dark mode'
      case 'dark':
        return 'Switch to system preference'
      case 'system':
        return 'Switch to light mode'
      default:
        return 'Toggle theme'
    }
  }

  return (
    <motion.button
      onClick={() => setTheme(getNextTheme() as 'light' | 'dark' | 'system')}
      className="relative w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100
                 transition-all duration-300 ease-in-out
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                 dark:focus:ring-offset-gray-900 shadow-sm hover:shadow-md"
      title={getThemeLabel()}
      aria-label={getThemeLabel()}
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        duration: 0.3
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
          transition={{ 
            duration: 0.4, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          {getThemeIcon()}
        </motion.div>
      </AnimatePresence>
      
      {/* Professional theme indicator */}
      <motion.div
        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
          effectiveTheme === 'dark' 
            ? 'bg-blue-500' 
            : 'bg-amber-500'
        }`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
      />
    </motion.button>
  )
}
