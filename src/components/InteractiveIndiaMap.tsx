'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { useAppStore } from '@/store/useAppStore'
import { useAudio } from '@/hooks/useAudio'
import { useStates } from '@/hooks/useAtlas'
import { State } from '@/data/types'
import { indiaStatesFallback } from '@/data/indiaStatesFallback'

interface InteractiveIndiaMapProps {
  onStateSelect: (state: State) => void
}

interface StateData {
  state: State
  hoverColor: string
  animationDelay: number
}

// Simplified India topojson for demonstration
// In production, you would use actual India topojson data
const indiaGeoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json"

const stateColors = {
  default: '#E0E7FF',
  hover: '#6366F1',
  selected: '#4F46E5',
  himalayan: '#10B981', // Green for Himalayan states
  coastal: '#3B82F6', // Blue for coastal states
  desert: '#F59E0B', // Orange for desert states
  central: '#8B5CF6', // Purple for central states
}

const livingTerrainAnimations = {
  // Himalayan elevation pulses
  'Jammu & Kashmir': { type: 'elevation', color: '#10B981', intensity: 0.8 },
  'Himachal Pradesh': { type: 'elevation', color: '#059669', intensity: 0.7 },
  'Uttarakhand': { type: 'elevation', color: '#047857', intensity: 0.6 },
  'Sikkim': { type: 'elevation', color: '#065F46', intensity: 0.9 },
  
  // Kerala water shimmer
  'Kerala': { type: 'water', color: '#3B82F6', intensity: 0.8 },
  
  // Thar sand drift
  'Rajasthan': { type: 'sand', color: '#F59E0B', intensity: 0.7 },
  
  // Other states get default animations
}

export default function InteractiveIndiaMap({ onStateSelect }: InteractiveIndiaMapProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null)
  const { playSound } = useAudio()
  const { userSettings } = useAppStore()
  const { states } = useStates()
  
  const [geoData, setGeoData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [webglSupported, setWebglSupported] = useState(true)

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    setWebglSupported(!!gl)
  }, [])

  // Load geo data
  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const response = await fetch(indiaGeoUrl)
        if (!response.ok) {
          throw new Error('Failed to fetch external geo data')
        }
        const data = await response.json()
        setGeoData(data)
        setIsLoading(false)
      } catch (error) {
        console.warn('Failed to load external India geo data, using fallback:', error)
        // Use fallback data
        setGeoData(indiaStatesFallback)
        setIsLoading(false)
      }
    }

    loadGeoData()
  }, [])

  const stateDataMap = useMemo(() => {
    const map = new Map<string, StateData>()
    
    states.forEach((state, index) => {
      const terrain = livingTerrainAnimations[state.name as keyof typeof livingTerrainAnimations]
      let hoverColor = stateColors.default
      
      if (terrain) {
        hoverColor = terrain.color
      } else if (state.name.includes('Coast') || state.name.includes('Bay') || state.name.includes('Arabian')) {
        hoverColor = stateColors.coastal
      } else if (state.name.includes('Rajasthan') || state.name.includes('Gujarat')) {
        hoverColor = stateColors.desert
      } else {
        hoverColor = stateColors.central
      }

      map.set(state.name, {
        state,
        hoverColor,
        animationDelay: index * 0.1,
      })
    })
    
    return map
  }, [states])

  const handleStateClick = useCallback((stateName: string) => {
    const stateData = stateDataMap.get(stateName)
    if (stateData) {
      setSelectedState(stateName)
      playSound('navigation')
      onStateSelect(stateData.state)
    }
  }, [stateDataMap, onStateSelect, playSound])

  const handleStateHover = useCallback((stateName: string, event: any) => {
    setHoveredState(stateName)
    const stateData = stateDataMap.get(stateName)
    
    if (stateData) {
      const rect = event.target.getBoundingClientRect()
      setTooltip({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        content: `${stateName} (${stateData.state.districtIds?.length || 0} districts)`,
      })
    }
  }, [stateDataMap])

  const handleStateLeave = useCallback(() => {
    setHoveredState(null)
    setTooltip(null)
  }, [])

  const getTerrainAnimation = (stateName: string) => {
    return livingTerrainAnimations[stateName as keyof typeof livingTerrainAnimations]
  }

  const renderLivingTerrainEffect = (stateName: string) => {
    const terrain = getTerrainAnimation(stateName)
    if (!terrain || userSettings.ecoMode) return null

    switch (terrain.type) {
      case 'elevation':
        return (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              boxShadow: `0 0 ${20 + Math.sin(Date.now() * 0.001) * 10}px ${terrain.color}`,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      
      case 'water':
        return (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: `linear-gradient(45deg, transparent, ${terrain.color}40, transparent)`,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )
      
      case 'sand':
        return (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <motion.div
              className="absolute w-full h-full"
              animate={{
                background: `linear-gradient(90deg, transparent, ${terrain.color}20, transparent)`,
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        )
      
      default:
        return null
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedState(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading India map...</p>
        </motion.div>
      </div>
    )
  }

  if (!webglSupported) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold mb-2">Map Unavailable</h3>
          <p className="text-gray-600 mb-4">Your browser doesn't support advanced map rendering.</p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {states.slice(0, 6).map((state) => (
              <button
                key={state.id}
                onClick={() => onStateSelect(state)}
                className="p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <p className="font-medium">{state.name}</p>
                <p className="text-sm text-gray-500">{state.districtIds?.length || 0} districts</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg overflow-hidden">
      {/* Cultural Pulse Overlay */}
      <AnimatePresence>
        {selectedState && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-500/20" />
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at center, transparent, transparent)',
                  'radial-gradient(circle at center, rgba(251, 191, 36, 0.1), transparent)',
                  'radial-gradient(circle at center, transparent, transparent)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Container */}
      <div className="absolute inset-0">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 1000,
            center: [78.9629, 20.5937], // India center
          }}
        >
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const stateName = geo.properties?.ST_NM || geo.properties?.name
                const stateData = stateDataMap.get(stateName)
                const isHovered = hoveredState === stateName
                const isSelected = selectedState === stateName
                const terrain = getTerrainAnimation(stateName)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleStateClick(stateName)}
                    onMouseEnter={(event) => handleStateHover(stateName, event)}
                    onMouseLeave={handleStateLeave}
                    style={{
                      default: {
                        fill: stateData?.hoverColor || stateColors.default,
                        stroke: '#fff',
                        strokeWidth: 1,
                        outline: 'none',
                        transition: 'all 0.3s ease',
                      },
                      hover: {
                        fill: stateColors.hover,
                        stroke: '#fff',
                        strokeWidth: 2,
                        outline: 'none',
                        cursor: 'pointer',
                        filter: 'brightness(1.1)',
                      },
                      pressed: {
                        fill: stateColors.selected,
                        stroke: '#fff',
                        strokeWidth: 2,
                        outline: 'none',
                      },
                    }}
                  >
                    {({ path }) => (
                      <g>
                        <motion.path
                          d={path!}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ 
                            opacity: 1, 
                            scale: isSelected ? 1.05 : (isHovered ? 1.02 : 1),
                          }}
                          transition={{
                            duration: 0.3,
                            delay: stateData?.animationDelay || 0,
                          }}
                        />
                        
                        {/* Living terrain micro-animations */}
                        {terrain && !userSettings.ecoMode && (
                          <motion.path
                            d={path!}
                            fill={terrain.color}
                            fillOpacity={terrain.intensity * 0.3}
                            animate={{
                              fillOpacity: [
                                terrain.intensity * 0.1,
                                terrain.intensity * 0.4,
                                terrain.intensity * 0.1,
                              ],
                            }}
                            transition={{
                              duration: terrain.type === 'elevation' ? 2 : 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                      </g>
                    )}
                  </Geography>
                )
              })
            }
          </Geographies>

          {/* State markers for capitals/major cities */}
          {states.slice(0, 10).map((state) => (
            <Marker
              key={state.id}
              coordinates={[78.9629, 20.5937]} // Simplified - use actual capital coordinates
            >
              <motion.circle
                r={4}
                fill={stateColors.selected}
                stroke="#fff"
                strokeWidth={2}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.5 }}
              />
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="absolute z-30 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {tooltip.content}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Navigation Hint */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500">
        Press ESC to deselect • Click states to explore
      </div>

      {/* Selected State Info */}
      <AnimatePresence>
        {selectedState && (
          <motion.div
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg z-20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <h3 className="font-semibold text-gray-900">{selectedState}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {stateDataMap.get(selectedState)?.state.districtIds?.length || 0} districts
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}