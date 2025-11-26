'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import type { Destination } from '@/data/types'

interface DestinationInfoPanelProps {
  destination: Destination
}

type TabType = 'story' | 'history' | 'practical'

export default function DestinationInfoPanel({
  destination,
}: DestinationInfoPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('story')
  const userSettings = useAppStore((state) => state.userSettings)

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'story', label: 'Story', icon: '📖' },
    { id: 'history', label: 'History', icon: '🏛️' },
    { id: 'practical', label: 'Practical', icon: '🗺️' },
  ]

  const tabContent: Record<TabType, React.ReactNode> = {
    story: (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sensory-sky-200 mb-2">Visual Poetry</h3>
          <p className="text-sensory-sky-300 text-sm leading-relaxed">
            {destination.sensoryDescription.visual}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sensory-sky-200 mb-2">Auditory Essence</h3>
          <p className="text-sensory-sky-300 text-sm leading-relaxed">
            {destination.sensoryDescription.auditory}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-sensory-sky-200 mb-2">Sensory Journey</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-2 rounded bg-sensory-earth-500/10 border border-sensory-earth-400/20"
            >
              <p className="text-xs text-sensory-earth-400 font-medium mb-1">Olfactory</p>
              <p className="text-xs text-sensory-earth-300">{destination.sensoryDescription.olfactory}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-2 rounded bg-sensory-fire-500/10 border border-sensory-fire-400/20"
            >
              <p className="text-xs text-sensory-fire-400 font-medium mb-1">Tactile</p>
              <p className="text-xs text-sensory-fire-300">{destination.sensoryDescription.tactile}</p>
            </motion.div>

            {destination.sensoryDescription.gustatory && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-2 rounded bg-sensory-twilight-500/10 border border-sensory-twilight-400/20 col-span-2"
              >
                <p className="text-xs text-sensory-twilight-400 font-medium mb-1">Gustatory</p>
                <p className="text-xs text-sensory-twilight-300">{destination.sensoryDescription.gustatory}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    ),

    history: (
      <div className="space-y-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-3 rounded-lg bg-sensory-sky-500/10 border border-sensory-sky-400/20"
        >
          <h3 className="font-semibold text-sensory-sky-300 mb-2 flex items-start gap-2">
            <span className="text-lg">📜</span>
            Historical Anecdote
          </h3>
          <p className="text-sensory-sky-300 text-sm leading-relaxed italic">
            &quot;{destination.cultural.historicalAnecdote}&quot;
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-3 rounded-lg bg-sensory-earth-500/10 border border-sensory-earth-400/20"
        >
          <h3 className="font-semibold text-sensory-earth-300 mb-2 flex items-start gap-2">
            <span className="text-lg">🍃</span>
            Proverb
          </h3>
          <p className="text-sensory-earth-300 text-sm leading-relaxed italic">
            &quot;{destination.cultural.proverb}&quot;
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-3 rounded-lg bg-sensory-fire-500/10 border border-sensory-fire-400/20"
        >
          <h3 className="font-semibold text-sensory-fire-300 mb-2 flex items-start gap-2">
            <span className="text-lg">🎭</span>
            Cultural Significance
          </h3>
          <p className="text-sensory-fire-300 text-sm leading-relaxed">
            {destination.cultural.culturalSignificance}
          </p>
        </motion.div>

        {destination.cultural.festivals.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-3 rounded-lg bg-sensory-twilight-500/10 border border-sensory-twilight-400/20"
          >
            <h3 className="font-semibold text-sensory-twilight-300 mb-2 flex items-start gap-2">
              <span className="text-lg">🎉</span>
              Festivals & Celebrations
            </h3>
            <div className="flex flex-wrap gap-2">
              {destination.cultural.festivals.map((festival) => (
                <span
                  key={festival}
                  className="px-2 py-1 rounded text-xs bg-sensory-twilight-600/50 text-sensory-twilight-200 border border-sensory-twilight-400/30"
                >
                  {festival}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    ),

    practical: (
      <div className="space-y-3">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="grid grid-cols-2 gap-3"
        >
          {destination.type && (
            <div className="p-3 rounded-lg bg-sensory-sky-500/10 border border-sensory-sky-400/20">
              <p className="text-xs text-sensory-sky-400 font-medium">Type</p>
              <p className="text-sm text-sensory-sky-200 capitalize">{destination.type.replace('-', ' ')}</p>
            </div>
          )}

          {destination.elevation && (
            <div className="p-3 rounded-lg bg-sensory-earth-500/10 border border-sensory-earth-400/20">
              <p className="text-xs text-sensory-earth-400 font-medium">Elevation</p>
              <p className="text-sm text-sensory-earth-200">{destination.elevation}m</p>
            </div>
          )}

          {destination.population && (
            <div className="p-3 rounded-lg bg-sensory-fire-500/10 border border-sensory-fire-400/20">
              <p className="text-xs text-sensory-fire-400 font-medium">Population</p>
              <p className="text-sm text-sensory-fire-200">
                {destination.population.toLocaleString()}
              </p>
            </div>
          )}

          {destination.bestVisitedDuring && (
            <div className="p-3 rounded-lg bg-sensory-twilight-500/10 border border-sensory-twilight-400/20">
              <p className="text-xs text-sensory-twilight-400 font-medium">Best Visited</p>
              <p className="text-sm text-sensory-twilight-200">{destination.bestVisitedDuring}</p>
            </div>
          )}
        </motion.div>

        {destination.estimatedVisitDuration && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-3 rounded-lg bg-sensory-sky-500/10 border border-sensory-sky-400/20"
          >
            <p className="text-xs text-sensory-sky-400 font-medium mb-1">Estimated Visit Duration</p>
            <p className="text-sm text-sensory-sky-200">{destination.estimatedVisitDuration}</p>
          </motion.div>
        )}

        {destination.accessibilityNotes && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-3 rounded-lg bg-sensory-earth-500/10 border border-sensory-earth-400/20"
          >
            <p className="text-xs text-sensory-earth-400 font-medium mb-1">Accessibility</p>
            <p className="text-sm text-sensory-earth-200">{destination.accessibilityNotes}</p>
          </motion.div>
        )}

        {destination.categories.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-3 rounded-lg bg-sensory-fire-500/10 border border-sensory-fire-400/20"
          >
            <p className="text-xs text-sensory-fire-400 font-medium mb-2">Categories</p>
            <div className="flex flex-wrap gap-2">
              {destination.categories.map((category) => (
                <span
                  key={category}
                  className="px-2 py-1 rounded text-xs bg-sensory-fire-600/50 text-sensory-fire-200 border border-sensory-fire-400/30"
                >
                  {category.replace('-', ' ')}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    ),
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: userSettings.reducedMotion ? 0 : 0.6 }}
      className="rounded-lg bg-gradient-to-br from-sensory-twilight-900/30 to-sensory-sky-900/20 border border-sensory-sky-500/30 backdrop-blur-sm overflow-hidden"
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-sensory-sky-500/20">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-sensory-fire-500/20 text-sensory-fire-300 border-b-2 border-sensory-fire-500'
                : 'text-sensory-sky-400 hover:text-sensory-sky-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: userSettings.reducedMotion ? 0 : 0.3 }}
        className="p-4"
      >
        {tabContent[activeTab]}
      </motion.div>
    </motion.div>
  )
}
