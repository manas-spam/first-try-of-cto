'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { State, District } from '@/data/types'

interface DestinationBreadcrumbProps {
  state: State | null
  district: District | null
  destinationName: string
  onNavigateBack?: () => void
}

export default function DestinationBreadcrumb({
  state,
  district,
  destinationName,
  onNavigateBack,
}: DestinationBreadcrumbProps) {
  const router = useRouter()
  const userSettings = useAppStore((state) => state.userSettings)
  const [showClosureAnimation, setShowClosureAnimation] = useState(false)

  const handleNavigateBack = async () => {
    setShowClosureAnimation(true)
    
    // Give animation time to play before navigation
    if (!userSettings.reducedMotion) {
      await new Promise(resolve => setTimeout(resolve, 600))
    }

    if (onNavigateBack) {
      onNavigateBack()
    } else {
      router.back()
    }
  }

  const breadcrumbItems = [
    { label: 'Destinations', href: '/destinations', icon: '🗺️' },
    ...(state ? [{ label: state.name, href: `/atlas?state=${state.id}`, icon: '🏛️' }] : []),
    ...(district ? [{ label: district.name, href: `/atlas?district=${district.id}`, icon: '📍' }] : []),
    { label: destinationName, href: null, icon: '⭐' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: userSettings.reducedMotion ? 0 : 0.4 }}
      className="space-y-4"
    >
      {/* Breadcrumb Trail */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-2 px-1" aria-label="Breadcrumb">
        {breadcrumbItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            {index > 0 && (
              <div className="text-sensory-sky-400 opacity-50 text-sm">/</div>
            )}

            {item.href ? (
              <Link
                href={item.href}
                className="group flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-sensory-sky-300 hover:text-sensory-sky-100 hover:bg-sensory-sky-500/20 transition-all"
              >
                <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-sensory-fire-400 bg-sensory-fire-500/10 border border-sensory-fire-400/30">
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </div>
            )}
          </motion.div>
        ))}
      </nav>

      {/* Back Button with Closure Animation */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNavigateBack}
        className="relative w-full px-4 py-2 rounded-lg bg-gradient-to-r from-sensory-sky-500/20 to-sensory-earth-500/20 hover:from-sensory-sky-500/30 hover:to-sensory-earth-500/30 border border-sensory-sky-400/30 text-sensory-sky-300 hover:text-sensory-sky-100 font-medium text-sm transition-all overflow-hidden"
      >
        {/* Emotional Closure Animation */}
        {showClosureAnimation && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-gradient-to-r from-sensory-sky-500 to-sensory-earth-500 rounded-lg"
            />
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-2xl">✨</div>
            </motion.div>
          </>
        )}

        <span className="relative flex items-center gap-2 justify-center">
          <motion.span
            animate={showClosureAnimation ? { y: -20, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            ← Back to {district?.name || 'Destinations'}
          </motion.span>
        </span>
      </motion.button>
    </motion.div>
  )
}
