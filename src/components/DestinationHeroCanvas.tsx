'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useWeather, useSeasonalWeather } from '@/hooks/useWeather'
import { useMoonTint } from '@/hooks/useLunarPhase'
import { getWeatherOverlay, formatWeatherDisplay } from '@/lib/weather'
import type { GeoPoint, Destination } from '@/data/types'

interface DestinationHeroCanvasProps {
  destination: Destination
}

export default function DestinationHeroCanvas({
  destination,
}: DestinationHeroCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isNightMode, setIsNightMode] = useState(false)
  const [timeLapseActive, setTimeLapseActive] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState<'summer' | 'monsoon' | 'winter'>('summer')
  
  const userSettings = useAppStore((state) => state.userSettings)
  const { weather, loading: weatherLoading } = useWeather(destination.coordinates, selectedSeason)
  const { seasonalWeather } = useSeasonalWeather(selectedSeason)
  const { tint: moonTint } = useMoonTint(undefined, isNightMode)

  // Determine current weather condition for overlay
  const weatherOverlay = weather ? getWeatherOverlay(weather.condition) : null
  
  // Handle time-lapse animation
  useEffect(() => {
    if (!timeLapseActive) return

    const interval = setInterval(() => {
      setIsNightMode(prev => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [timeLapseActive])

  const backgroundStyle = {
    backgroundImage: `linear-gradient(135deg, var(--from-color), var(--to-color))`,
    '--from-color': isNightMode ? '#1a1a3e' : '#87ceeb',
    '--to-color': isNightMode ? '#2d1b4e' : '#ffcc99',
  } as React.CSSProperties

  return (
    <div className="space-y-4">
      {/* Hero Canvas */}
      <motion.div
        ref={canvasRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: userSettings.reducedMotion ? 0 : 0.8 }}
        className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl"
      >
        {/* Base Background */}
        <div
          className="absolute inset-0"
          style={backgroundStyle}
        />

        {/* Weather Overlay */}
        {weatherOverlay && !userSettings.ecoMode && (
          <motion.div
            animate={{
              opacity: weatherOverlay.opacity,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'mirror',
            }}
            className="absolute inset-0"
            style={{
              backgroundColor: weatherOverlay.assetId,
              mixBlendMode: weatherOverlay.blendMode as any,
              opacity: weatherOverlay.opacity,
            }}
          />
        )}

        {/* Moon Tint Overlay (Night Mode) */}
        {isNightMode && moonTint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: moonTint.opacity }}
            transition={{ duration: userSettings.reducedMotion ? 0 : 1 }}
            className="absolute inset-0"
            style={{
              backgroundColor: moonTint.color,
            }}
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: userSettings.reducedMotion ? 0 : 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">
              {destination.name}
            </h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
             {destination.sensoryDescription.visual.split('.')[0]}.
            </p>
          </motion.div>

          {/* Loading Shimmer Placeholder */}
          {weatherLoading && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-4 left-4 h-8 w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded"
            />
          )}
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {/* Night Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNightMode(!isNightMode)}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isNightMode
                ? 'bg-sensory-twilight-600/80 text-sensory-twilight-100'
                : 'bg-white/20 text-white'
            }`}
            title={isNightMode ? 'Switch to day mode' : 'Switch to night mode'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {isNightMode ? (
                <path d="M12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6zm0-10c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zM12 5V3m0 18v-2M5.64 5.64L4.22 4.22M19.78 19.78l-1.41-1.41M5 12H3m18 0h-2m-13.36-1.64L4.22 19.78M19.78 4.22l-1.41 1.41" />
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              )}
            </svg>
          </motion.button>

          {/* Time-Lapse Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeLapseActive(!timeLapseActive)}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              timeLapseActive
                ? 'bg-sensory-fire-600/80 text-sensory-fire-100'
                : 'bg-white/20 text-white'
            }`}
            title={timeLapseActive ? 'Stop time-lapse' : 'Start time-lapse'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Controls Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: userSettings.reducedMotion ? 0 : 0.5 }}
        className="p-4 rounded-lg bg-gradient-to-br from-sensory-twilight-900/30 to-sensory-sky-900/20 border border-sensory-sky-500/30 backdrop-blur-sm space-y-3"
      >
        {/* Season Selector */}
        <div>
          <label className="text-xs font-semibold text-sensory-sky-300 block mb-2">
            Season
          </label>
          <div className="flex gap-2">
            {(['summer', 'monsoon', 'winter'] as const).map((season) => (
              <motion.button
                key={season}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSeason(season)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedSeason === season
                    ? 'bg-sensory-fire-500 text-white'
                    : 'bg-sensory-sky-500/20 text-sensory-sky-300 hover:bg-sensory-sky-500/30'
                }`}
              >
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Weather Info */}
        {seasonalWeather && (
          <div className="p-3 rounded bg-sensory-sky-500/10 border border-sensory-sky-400/20">
            <p className="text-xs text-sensory-sky-300 mb-1">
              <span className="font-semibold">{seasonalWeather.season.toUpperCase()}</span>
            </p>
            <p className="text-sm text-sensory-sky-200">{seasonalWeather.description}</p>
            <p className="text-xs text-sensory-sky-400 mt-1">
              {formatWeatherDisplay(seasonalWeather)}
            </p>
          </div>
        )}

        {/* Status Info */}
        <div className="flex items-center justify-between text-xs text-sensory-sky-300">
          <div className="flex gap-3">
            <span>{isNightMode ? '🌙 Night Mode' : '☀️ Day Mode'}</span>
            {timeLapseActive && <span className="animate-pulse">⏱️ Time-Lapse</span>}
          </div>
          {userSettings.ecoMode && <span>♻️ Eco Mode</span>}
        </div>
      </motion.div>
    </div>
  )
}
