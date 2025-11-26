'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'

export default function SensoryLayerToggle() {
  const userSettings = useAppStore((state) => state.userSettings)
  const updateUserSettings = useAppStore((state) => state.updateUserSettings)

  const sensoryLayers = [
    {
      key: 'audioEnabled' as const,
      label: 'Audio',
      icon: '🔊',
      description: 'Ambient sounds and narratives',
    },
    {
      key: 'hapticFeedback' as const,
      label: 'Haptics',
      icon: '📳',
      description: 'Touch feedback',
    },
    {
      key: 'ecoMode' as const,
      label: 'Eco Mode',
      icon: '♻️',
      description: 'Reduce animations & effects',
    },
  ]

  const toggleLayer = (key: 'audioEnabled' | 'hapticFeedback' | 'ecoMode') => {
    updateUserSettings({
      [key]: !userSettings[key],
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      <h3 className="text-sm font-semibold text-sensory-sky-300 px-1">Sensory Layers</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {sensoryLayers.map((layer) => (
          <motion.button
            key={layer.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleLayer(layer.key)}
            className={`relative p-3 rounded-lg border-2 transition-all overflow-hidden group ${
              userSettings[layer.key]
                ? 'bg-gradient-to-br from-sensory-fire-600/30 to-sensory-fire-500/20 border-sensory-fire-500 text-sensory-fire-300'
                : 'bg-sensory-twilight-900/40 border-sensory-sky-400/30 text-sensory-sky-400 hover:border-sensory-sky-500'
            }`}
            aria-pressed={userSettings[layer.key]}
            title={layer.description}
          >
            {/* Activation Pulse */}
            {userSettings[layer.key] && (
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-sensory-fire-400/20 rounded-lg"
              />
            )}

            {/* Content */}
            <div className="relative flex items-center gap-2 justify-between">
              <span className="text-xl">{layer.icon}</span>
              <div className="text-left flex-1">
                <p className="text-xs font-semibold">{layer.label}</p>
                <p className="text-xs opacity-70 leading-tight">
                  {userSettings[layer.key] ? 'On' : 'Off'}
                </p>
              </div>

              {/* Toggle Indicator */}
              <motion.div
                animate={{
                  backgroundColor: userSettings[layer.key]
                    ? 'rgb(239, 68, 68)'
                    : 'rgb(107, 114, 128)',
                  x: userSettings[layer.key] ? 16 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="w-6 h-3 rounded-full flex-shrink-0"
              />
            </div>

            {/* Hover Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileHover={{ opacity: 1, y: -5 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-sensory-twilight-950/90 rounded text-xs text-sensory-sky-200 whitespace-nowrap pointer-events-none z-10"
            >
              {layer.description}
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Info */}
      <p className="text-xs text-sensory-sky-400/70 px-1 italic">
        Customize your immersive experience with sensory layer controls
      </p>
    </motion.div>
  )
}
