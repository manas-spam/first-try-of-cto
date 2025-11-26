'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import MemoryKeeper from '@/components/MemoryKeeper'

export default function MemoriesPage() {
  const userSettings = useAppStore((state) => state.userSettings)

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: userSettings.reducedMotion ? 0 : 0.5 }}
        role="main"
        aria-label="Memories page"
      >
        <MemoryKeeper />
      </motion.div>
    </div>
  )
}
