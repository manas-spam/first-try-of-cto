'use client'

import { motion } from 'framer-motion'
import { useCompass } from '@/hooks/useCompass'
import { useGeolocation } from '@/hooks/useGeolocation'
import { formatDistance, formatBearing } from '@/lib/geospatial'
import type { GeoPoint } from '@/data/types'
import { useAppStore } from '@/store/useAppStore'
import { useEffect, useState } from 'react'

interface DestinationCompassProps {
  destinationCoordinates: GeoPoint
  destinationName: string
}

export default function DestinationCompass({
  destinationCoordinates,
  destinationName,
}: DestinationCompassProps) {
  const { coordinates, requestLocation, loading: geoLoading } = useGeolocation()
  const { compassData, loading: compassLoading } = useCompass(
    destinationCoordinates,
    coordinates ? [coordinates.longitude, coordinates.latitude] : null
  )
  const userSettings = useAppStore((state) => state.userSettings)
  const [showCompass, setShowCompass] = useState(false)

  useEffect(() => {
    // Auto-request location if not already requested
    if (!coordinates && !geoLoading) {
      requestLocation()
    }
  }, [])

  const handleRequestLocation = () => {
    setShowCompass(true)
    requestLocation()
  }

  if (!coordinates && !showCompass) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 rounded-lg bg-gradient-to-br from-sensory-twilight-900/20 to-sensory-sky-900/20 border border-sensory-sky-500/30"
      >
        <button
          onClick={handleRequestLocation}
          className="w-full px-4 py-2 rounded-lg bg-sensory-sky-500 hover:bg-sensory-sky-600 text-white text-sm font-medium transition-colors"
          aria-label="Enable location for compass"
        >
          {geoLoading ? 'Getting location...' : 'Enable Compass'}
        </button>
      </motion.div>
    )
  }

  if (geoLoading || compassLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-6"
      >
        <div className="animate-spin w-6 h-6 border-2 border-sensory-sky-400 border-t-transparent rounded-full" />
      </motion.div>
    )
  }

  if (!compassData) {
    return null
  }

  const rotateVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: compassData.bearing,
      transition: {
        duration: userSettings.reducedMotion ? 0 : 1,
        ease: 'easeOut',
      }
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: userSettings.reducedMotion ? 0 : 0.5 }}
      className="space-y-4"
    >
      {/* Compass Dial */}
      <div className="relative w-full aspect-square max-w-xs mx-auto">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sensory-twilight-800/40 to-sensory-sky-800/20 border-2 border-sensory-sky-500/50 shadow-lg" />

        {/* Cardinal markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          {['N', 'E', 'S', 'W'].map((dir, i) => {
            const offset = ((Math.abs(i - 1)) * 0.5 + 0.5) * 100 + 50
            return (
              <div
                key={dir}
                className="absolute font-bold text-sensory-sky-400 text-lg"
                style={{
                  transform: `translateY(-${offset}%) rotate(${i * 90}deg)`,
                }}
              >
                {dir}
              </div>
            )
          })}
        </div>

        {/* Degree markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 36 }).map((_, i) => (
            <div
              key={i}
              className={`absolute ${i % 9 === 0 ? 'w-1 h-8' : 'w-0.5 h-4'} ${
                i % 9 === 0 ? 'bg-sensory-sky-400' : 'bg-sensory-sky-300/50'
              }`}
              style={{
                top: 0,
                left: '50%',
                transformOrigin: '0 100%',
                transform: `translateX(-50%) rotate(${i * 10}deg)`,
              }}
            />
          ))}
        </div>

        {/* Bearing needle */}
        <motion.div
          className="absolute inset-0"
          variants={rotateVariants}
          initial="initial"
          animate="animate"
        >
          <div className="absolute left-1/2 top-1/4 -ml-0.5 w-1 h-1/4 bg-gradient-to-b from-sensory-fire-500 to-transparent rounded-full" />
          <div className="absolute left-1/2 bottom-1/4 -ml-0.5 w-1 h-1/4 bg-gradient-to-t from-sensory-sky-400 to-transparent rounded-full opacity-50" />
        </motion.div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-sensory-sky-400 shadow-lg" />
        </div>
      </div>

      {/* Info Panel */}
      <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-sensory-twilight-900/40 to-sensory-sky-900/20 border border-sensory-sky-500/30 backdrop-blur-sm">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-sensory-sky-300">Journey to</h3>
          <p className="text-lg font-bold text-sensory-sky-100">{destinationName}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-sensory-sky-500/10 border border-sensory-sky-400/30"
          >
            <div className="text-xs text-sensory-sky-400 font-medium">Bearing</div>
            <div className="text-xl font-bold text-sensory-sky-200">{formatBearing(compassData.bearing)}</div>
            <div className="text-xs text-sensory-sky-300">{compassData.direction}</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-3 rounded-lg bg-sensory-earth-500/10 border border-sensory-earth-400/30"
          >
            <div className="text-xs text-sensory-earth-400 font-medium">Distance</div>
            <div className="text-xl font-bold text-sensory-earth-200">{formatDistance(compassData.distance)}</div>
            <div className="text-xs text-sensory-earth-300">to destination</div>
          </motion.div>
        </div>

        <p className="text-xs text-sensory-sky-300 italic text-center pt-2">
          {compassData.distance < 1
            ? 'You\'re practically there!'
            : compassData.distance < 10
            ? 'Close by in your journey'
            : compassData.distance < 100
            ? 'A significant trek ahead'
            : 'A great distance awaits'}
        </p>
      </div>
    </motion.div>
  )
}
