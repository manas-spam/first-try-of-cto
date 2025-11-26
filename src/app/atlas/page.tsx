'use client'

import { motion } from 'framer-motion'
import { Suspense } from 'react'
import { useAppStore } from '@/store/useAppStore'
import dynamic from 'next/dynamic'

const GlobeViewer = dynamic(() => import('@/components/GlobeViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px]">
      <div className="animate-pulse text-xl">Loading Globe...</div>
    </div>
  ),
})

export default function AtlasPage() {
  const { atmosphericLayers, userSettings } = useAppStore()

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: userSettings.reducedMotion ? 0 : 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-sensory-earth-600 dark:text-sensory-earth-400">
          Interactive Atlas
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Explore the world through an immersive 3D globe experience
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Atmospheric Layers</h2>
          <div className="flex flex-wrap gap-3">
            {atmosphericLayers.map((layer) => (
              <div
                key={layer.id}
                className={`px-4 py-2 rounded-md ${
                  layer.visible
                    ? 'bg-sensory-earth-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {layer.type}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <Suspense fallback={<div className="h-[600px] animate-pulse" />}>
            <GlobeViewer />
          </Suspense>
        </div>
      </motion.div>
    </div>
  )
}
