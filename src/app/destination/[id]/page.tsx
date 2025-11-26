'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDestination, useStates, useDistricts } from '@/hooks/useAtlas'
import { useAppStore } from '@/store/useAppStore'
import DestinationHeroCanvas from '@/components/DestinationHeroCanvas'
import DestinationCompass from '@/components/DestinationCompass'
import DestinationAudioPlayer from '@/components/DestinationAudioPlayer'
import DestinationInfoPanel from '@/components/DestinationInfoPanel'
import DestinationBreadcrumb from '@/components/DestinationBreadcrumb'
import SensoryLayerToggle from '@/components/SensoryLayerToggle'
import AddToScrapbookButton from '@/components/AddToScrapbookButton'
import type { State, District } from '@/data/types'

export default function DestinationPage() {
  const params = useParams()
  const destinationId = params.id as string
  
  const { destination, loading: destLoading } = useDestination(destinationId)
  const { states } = useStates()
  const { districts, getById: getDistrictById } = useDistricts()
  
  const userSettings = useAppStore((state) => state.userSettings)
  
  const [state, setState] = useState<State | null>(null)
  const [district, setDistrict] = useState<District | null>(null)

  useEffect(() => {
    if (destination) {
      const foundState = states.find((s) => s.id === destination.stateId)
      setState(foundState || null)

      const foundDistrict = getDistrictById(destination.districtId)
      setDistrict(foundDistrict)
    }
  }, [destination, states, getDistrictById])

  if (destLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-3 border-sensory-sky-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-sensory-sky-200 mb-4">Destination not found</h1>
        <p className="text-sensory-sky-300">The destination you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-sensory-twilight-950 to-sensory-twilight-950/80 backdrop-blur-md border-b border-sensory-sky-500/20 px-4 py-4">
        <div className="container mx-auto">
          <DestinationBreadcrumb
            state={state}
            district={district}
            destinationName={destination.name}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 space-y-8">
        {/* Hero Canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: userSettings.reducedMotion ? 0 : 0.6 }}
        >
          <DestinationHeroCanvas destination={destination} />
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Information Panel */}
            <DestinationInfoPanel destination={destination} />

            {/* Audio Stories */}
            {destination.audioClips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: userSettings.reducedMotion ? 0 : 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-bold text-sensory-sky-200">Audio Stories</h2>
                <div className="space-y-4">
                  {destination.audioClips.map((clip) => (
                    <DestinationAudioPlayer key={clip.id} audioClip={clip} />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar (Right) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Journey Compass */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: userSettings.reducedMotion ? 0 : 0.6, delay: 0.2 }}
            >
              <h2 className="text-lg font-bold text-sensory-sky-200 mb-4">Journey Compass</h2>
              <DestinationCompass
                destinationCoordinates={destination.coordinates}
                destinationName={destination.name}
              />
            </motion.div>

            {/* Sensory Layer Controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: userSettings.reducedMotion ? 0 : 0.6, delay: 0.3 }}
              className="p-4 rounded-lg bg-gradient-to-br from-sensory-twilight-900/30 to-sensory-sky-900/20 border border-sensory-sky-500/30 backdrop-blur-sm"
            >
              <SensoryLayerToggle />
            </motion.div>

            {/* Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: userSettings.reducedMotion ? 0 : 0.6, delay: 0.4 }}
              className="p-4 rounded-lg bg-gradient-to-br from-sensory-earth-900/30 to-sensory-twilight-900/20 border border-sensory-earth-500/30 space-y-3"
            >
              <h3 className="font-semibold text-sensory-earth-300">Quick Facts</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-sensory-earth-400 font-medium">Location</p>
                  <p className="text-sensory-earth-200">
                    {destination.coordinates[1].toFixed(2)}°, {destination.coordinates[0].toFixed(2)}°
                  </p>
                </div>
                <div>
                  <p className="text-xs text-sensory-earth-400 font-medium">Type</p>
                  <p className="text-sensory-earth-200 capitalize">{destination.type.replace('-', ' ')}</p>
                </div>
                {state && (
                  <div>
                    <p className="text-xs text-sensory-earth-400 font-medium">State</p>
                    <p className="text-sensory-earth-200">{state.name}</p>
                  </div>
                )}
                {district && (
                  <div>
                    <p className="text-xs text-sensory-earth-400 font-medium">District</p>
                    <p className="text-sensory-earth-200">{district.name}</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: userSettings.reducedMotion ? 0 : 0.6, delay: 0.5 }}
              className="p-4 rounded-lg bg-white/10 border border-white/20 backdrop-blur"
            >
              <h3 className="font-semibold text-white mb-3">Memory Keeper</h3>
              <AddToScrapbookButton destination={destination} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
