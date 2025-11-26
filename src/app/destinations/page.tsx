'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useGeolocation } from '@/hooks/useGeolocation'
import { useState } from 'react'

const sampleDestinations = [
  {
    id: 1,
    name: 'Northern Lights, Iceland',
    description: 'Experience the magical aurora borealis',
    coordinates: { lat: 64.9631, lng: -19.0208 },
  },
  {
    id: 2,
    name: 'Great Barrier Reef, Australia',
    description: 'Dive into the world\'s largest coral reef system',
    coordinates: { lat: -18.2871, lng: 147.6992 },
  },
  {
    id: 3,
    name: 'Mount Fuji, Japan',
    description: 'Climb the iconic sacred mountain',
    coordinates: { lat: 35.3606, lng: 138.7274 },
  },
]

export default function DestinationsPage() {
  const userSettings = useAppStore((state) => state.userSettings)
  const { coordinates, loading, requestLocation } = useGeolocation()
  const [showLocation, setShowLocation] = useState(false)

  const handleShowLocation = () => {
    setShowLocation(true)
    requestLocation()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: userSettings.reducedMotion ? 0 : 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-sensory-sky-600 dark:text-sensory-sky-400">
          Destinations
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Discover breathtaking places around the world
        </p>

        <div className="mb-8 p-4 glass-morphism rounded-lg">
          <h2 className="text-xl font-semibold mb-3">Your Location</h2>
          {showLocation ? (
            loading ? (
              <p className="text-gray-600 dark:text-gray-400">
                Getting your location...
              </p>
            ) : coordinates ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Latitude: {coordinates.latitude.toFixed(4)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Longitude: {coordinates.longitude.toFixed(4)}
                </p>
                <p className="text-xs text-gray-500">
                  Accuracy: ±{coordinates.accuracy.toFixed(0)}m
                </p>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Location unavailable
              </p>
            )
          ) : (
            <button
              onClick={handleShowLocation}
              className="px-4 py-2 bg-sensory-sky-500 text-white rounded-md hover:bg-sensory-sky-600 transition-colors"
            >
              Show My Location
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleDestinations.map((destination, index) => (
            <motion.div
              key={destination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: userSettings.reducedMotion ? 0 : 0.5,
                delay: userSettings.reducedMotion ? 0 : index * 0.1,
              }}
              className="p-6 glass-morphism rounded-lg hover:scale-105 transition-transform duration-200"
            >
              <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {destination.description}
              </p>
              <div className="text-xs text-gray-500">
                <p>Lat: {destination.coordinates.lat}</p>
                <p>Lng: {destination.coordinates.lng}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
