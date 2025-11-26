'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'

export default function MemoriesPage() {
  const userSettings = useAppStore((state) => state.userSettings)

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: userSettings.reducedMotion ? 0 : 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-sensory-twilight-600 dark:text-sensory-twilight-400">
          Memories
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Your saved experiences and journeys through the immersive world
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: userSettings.reducedMotion ? 0 : 0.5, delay: 0.1 }}
            className="p-6 glass-morphism rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Recent Journeys</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Your journey history will appear here once you start exploring destinations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: userSettings.reducedMotion ? 0 : 0.5, delay: 0.2 }}
            className="p-6 glass-morphism rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Save your favorite destinations to easily access them later
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: userSettings.reducedMotion ? 0 : 0.5, delay: 0.3 }}
            className="p-6 glass-morphism rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Photos & Notes</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Capture moments and add personal notes to your experiences
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: userSettings.reducedMotion ? 0 : 0.5, delay: 0.4 }}
            className="p-6 glass-morphism rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track your exploration milestones and unlock new achievements
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
