'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useStates } from '@/hooks/useAtlas'
import Preloader from './Preloader'
import GlobeToIndiaTransition from './GlobeToIndiaTransition'
import InteractiveIndiaMap from './InteractiveIndiaMap'
import { State } from '@/data/types'

type NavigationPhase = 'preloader' | 'globe-to-india' | 'india-map' | 'complete'

interface CinematicNavigationProps {
  onComplete: (selectedState?: State) => void
  autoStart?: boolean
}

export default function CinematicNavigation({ 
  onComplete, 
  autoStart = true 
}: CinematicNavigationProps) {
  const [phase, setPhase] = useState<NavigationPhase>(autoStart ? 'preloader' : 'complete')
  const [selectedState, setSelectedState] = useState<State | null>(null)
  const { userSettings, setCinematicNavigationActive } = useAppStore()
  const { states } = useStates()

  const handlePreloaderComplete = useCallback(() => {
    if (userSettings.reducedMotion) {
      // Skip transition for reduced motion
      setPhase('india-map')
    } else {
      setPhase('globe-to-india')
    }
  }, [userSettings.reducedMotion])

  const handleTransitionComplete = useCallback(() => {
    setPhase('india-map')
  }, [])

  const handleStateSelect = useCallback((state: State) => {
    setSelectedState(state)
    
    // Add a small delay to show the selection before completing
    setTimeout(() => {
      setPhase('complete')
      onComplete(state)
    }, 500)
  }, [onComplete])

  const handleSkip = useCallback(() => {
    setPhase('complete')
    onComplete()
  }, [onComplete])

  const handleRestart = useCallback(() => {
    setPhase('preloader')
    setSelectedState(null)
  }, [])

  // Update store when cinematic navigation state changes
  useEffect(() => {
    setCinematicNavigationActive(phase !== 'complete')
  }, [phase, setCinematicNavigationActive])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          if (phase !== 'complete') {
            handleSkip()
          }
          break
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            handleRestart()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, handleSkip, handleRestart])

  // Skip button for accessibility
  const SkipButton = () => (
    <motion.button
      onClick={handleSkip}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-black/50 text-white rounded-lg backdrop-blur-sm hover:bg-black/70 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      aria-label="Skip cinematic introduction"
    >
      Skip Intro
    </motion.button>
  )

  return (
    <AnimatePresence mode="wait">
      {phase === 'preloader' && (
        <motion.div
          key="preloader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Preloader onComplete={handlePreloaderComplete} />
          <SkipButton />
        </motion.div>
      )}

      {phase === 'globe-to-india' && (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlobeToIndiaTransition
            isActive={true}
            onComplete={handleTransitionComplete}
          />
          <SkipButton />
        </motion.div>
      )}

      {phase === 'india-map' && (
        <motion.div
          key="india-map"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-30 bg-white"
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <motion.header
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 shadow-lg"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Explore India</h1>
                <p className="text-amber-100">
                  Discover the diverse states and territories of the Indian subcontinent
                </p>
              </div>
            </motion.header>

            {/* Map Container */}
            <motion.div
              className="flex-1 p-6 overflow-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="max-w-7xl mx-auto h-full">
                <InteractiveIndiaMap onStateSelect={handleStateSelect} />
              </div>
            </motion.div>

            {/* Footer */}
            <motion.footer
              className="bg-gray-100 p-4 border-t"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 20 }}
            >
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {states.length} states and union territories • Click any state to explore
                </div>
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-sm"
                >
                  Continue to Atlas
                </button>
              </div>
            </motion.footer>
          </div>

          <SkipButton />
        </motion.div>
      )}

      {phase === 'complete' && selectedState && (
        <motion.div
          key="selection-complete"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedState.name} Selected
            </h2>
            <p className="text-gray-600 mb-6">
              Exploring {selectedState.districtIds?.length || 0} districts and countless destinations
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => onComplete(selectedState)}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-700 transition-colors"
              >
                Continue Exploring
              </button>
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}