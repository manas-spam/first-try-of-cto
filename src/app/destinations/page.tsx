'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { useDestinations } from '@/hooks/useAtlas'
import { useState } from 'react'

export default function DestinationsPage() {
  const userSettings = useAppStore((state) => state.userSettings)
  const { destinations, loading } = useDestinations()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filtered = selectedCategory
    ? destinations.filter((d) => d.categories.includes(selectedCategory as any))
    : destinations

  const categories = Array.from(
    new Set(destinations.flatMap((d) => d.categories))
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: userSettings.reducedMotion ? 0 : 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2 text-sensory-sky-200">
          Explore Destinations
        </h1>
        <p className="text-sensory-sky-300 mb-8">
          Discover immersive experiences across India
        </p>
      </motion.div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 flex-wrap"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              selectedCategory === null
                ? 'bg-sensory-fire-500 text-white'
                : 'bg-sensory-sky-500/20 text-sensory-sky-300 hover:bg-sensory-sky-500/30'
            }`}
          >
            All
          </motion.button>

          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${
                selectedCategory === category
                  ? 'bg-sensory-fire-500 text-white'
                  : 'bg-sensory-sky-500/20 text-sensory-sky-300 hover:bg-sensory-sky-500/30'
              }`}
            >
              {category.replace('-', ' ')}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Destinations Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin w-8 h-8 border-3 border-sensory-sky-400 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: userSettings.reducedMotion ? 0 : 0.5,
                delay: userSettings.reducedMotion ? 0 : index * 0.1,
              }}
              whileHover={{ scale: userSettings.reducedMotion ? 1 : 1.02 }}
            >
              <Link href={`/destination/${destination.id}`}>
                <div className="h-full p-6 rounded-lg bg-gradient-to-br from-sensory-twilight-900/40 to-sensory-sky-900/20 border border-sensory-sky-500/30 hover:border-sensory-fire-500/50 transition-all cursor-pointer">
                  <div className="mb-3">
                    <span className="text-3xl">{destination.type === 'landmark' ? '🏛️' : '🌍'}</span>
                  </div>

                  <h3 className="text-xl font-semibold text-sensory-sky-100 mb-2">
                    {destination.name}
                  </h3>

                  <p className="text-sensory-sky-300 text-sm mb-4 line-clamp-2">
                    {destination.sensoryDescription.visual}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {destination.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded text-xs bg-sensory-fire-500/20 text-sensory-fire-300 border border-sensory-fire-400/30"
                      >
                        {cat.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-sensory-sky-300"
        >
          <p className="text-lg">No destinations found in this category</p>
        </motion.div>
      )}
    </div>
  )
}
