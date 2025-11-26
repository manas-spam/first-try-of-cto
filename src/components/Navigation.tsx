'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import { useEffect } from 'react'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/atlas', label: 'Atlas' },
  { href: '/destinations', label: 'Destinations' },
  { href: '/memories', label: 'Memories' },
  { href: '/settings', label: 'Settings' },
]

export function Navigation() {
  const pathname = usePathname()
  const { triggerHaptic } = useHapticFeedback()
  const { setCurrentRoute, userSettings } = useAppStore()

  useEffect(() => {
    setCurrentRoute(pathname)
  }, [pathname, setCurrentRoute])

  const handleNavClick = () => {
    triggerHaptic('light')
  }

  return (
    <nav className="sticky top-0 z-50 glass-morphism border-b border-gray-200 dark:border-gray-800" aria-label="Primary navigation">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            onClick={handleNavClick}
            className="text-xl font-bold bg-gradient-to-r from-sensory-sky-500 to-sensory-earth-500 bg-clip-text text-transparent"
          >
            Immersive
          </Link>

          <div className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`relative px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'text-sensory-sky-600 dark:text-sensory-sky-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-sensory-sky-500'
                  }`}
                >
                  {item.label}
                  {isActive && !userSettings.reducedMotion && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-sensory-sky-100 dark:bg-sensory-sky-900 rounded-md -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="md:hidden">
            <button
              onClick={handleNavClick}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-sensory-sky-100 dark:bg-sensory-sky-900 text-sensory-sky-600 dark:text-sensory-sky-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
