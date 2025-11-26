'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'

export default function Home() {
  const { triggerHaptic } = useHapticFeedback()
  const userSettings = useAppStore((state) => state.userSettings)

  const handleCardClick = () => {
    triggerHaptic('light')
  }

  const cards = [
    {
      title: 'Atlas',
      description: 'Explore the immersive globe and terrain',
      href: '/atlas',
      color: 'sensory-earth',
    },
    {
      title: 'Destinations',
      description: 'Discover places around the world',
      href: '/destinations',
      color: 'sensory-sky',
    },
    {
      title: 'Memories',
      description: 'Your saved experiences and journeys',
      href: '/memories',
      color: 'sensory-twilight',
    },
    {
      title: 'Settings',
      description: 'Accessibility and preferences',
      href: '/settings',
      color: 'sensory-fire',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: userSettings.reducedMotion ? 0 : 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-sensory-sky-500 via-sensory-earth-500 to-sensory-twilight-500 bg-clip-text text-transparent">
          Immersive Experience
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Explore the world through a sensory journey
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: userSettings.reducedMotion ? 0 : 0.5,
              delay: userSettings.reducedMotion ? 0 : index * 0.1,
            }}
          >
            <Link
              href={card.href}
              onClick={handleCardClick}
              className="block p-6 rounded-lg glass-morphism hover:scale-105 transition-transform duration-200"
            >
              <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {card.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {userSettings.ecoMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 p-4 bg-sensory-earth-100 dark:bg-sensory-earth-900 rounded-lg text-center"
        >
          <p className="text-sm text-sensory-earth-800 dark:text-sensory-earth-200">
            🌿 Eco Mode is enabled - Visual effects are optimized for lower energy consumption
          </p>
        </motion.div>
      )}
    </div>
  )
}
