'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrapbookStore, DEFAULT_FEELING_TAGS } from '@/store/scrapbookStore'
import { useOfflineStatus } from '@/hooks/useOfflineStatus'
import { cacheMemoryData } from '@/lib/offlineCache'
import { getDestinationById } from '@/data'
import ScrapbookCard from './ScrapbookCard'

interface FilterOptions {
  favorites: boolean
  stateId: string | null
  feeling: string | null
}

export default function MemoryKeeper() {
  const {
    memories,
    memoryOrder,
    reorderMemories,
    getMemoriesByState,
    getMemoriesByTag,
    getFavorites,
  } = useScrapbookStore()
  const { isOffline } = useOfflineStatus()

  const [filter, setFilter] = useState<FilterOptions>({
    favorites: false,
    stateId: null,
    feeling: null,
  })

  useEffect(() => {
    if (Object.keys(memories).length > 0) {
      Object.values(memories).forEach(async (memory) => {
        const destination = getDestinationById(memory.destinationId)
        if (destination) {
          try {
            await cacheMemoryData(memory, destination)
          } catch (error) {
            console.error('Failed to cache memory:', error)
          }
        }
      })
    }
  }, [memories])

  const getFilteredMemories = () => {
    let filtered = Object.values(memories)

    if (filter.favorites) {
      filtered = getFavorites()
    } else if (filter.stateId) {
      filtered = getMemoriesByState(filter.stateId)
    } else if (filter.feeling) {
      filtered = getMemoriesByTag(filter.feeling)
    } else {
      filtered = memoryOrder.map((id) => memories[id]).filter(Boolean)
    }

    return filtered
  }

  const filteredMemories = getFilteredMemories()

  const handleDrop = (draggedId: string, droppedOnId: string) => {
    const newOrder = [...memoryOrder]
    const draggedIndex = newOrder.indexOf(draggedId)
    const droppedIndex = newOrder.indexOf(droppedOnId)

    if (draggedIndex === -1 || droppedIndex === -1) return

    newOrder.splice(draggedIndex, 1)
    newOrder.splice(droppedIndex, 0, draggedId)

    reorderMemories(newOrder)
  }

  const uniqueStates = Array.from(
    new Set(Object.values(memories).map((m) => m.stateId))
  )

  return (
    <div className="space-y-6">
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200"
          role="alert"
        >
          <p className="font-medium flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            You're offline - viewing cached memories
          </p>
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Memory Keeper
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredMemories.length} {filteredMemories.length === 1 ? 'memory' : 'memories'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter({ ...filter, favorites: !filter.favorites, stateId: null, feeling: null })}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter.favorites
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            ⭐ Favorites
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1 space-y-4">
          <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Filter by Feeling
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setFilter({ ...filter, feeling: null, favorites: false })}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filter.feeling === null && !filter.favorites
                    ? 'bg-sensory-sky-100 dark:bg-sensory-sky-900 text-sensory-sky-900 dark:text-sensory-sky-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                All Feelings
              </button>
              {DEFAULT_FEELING_TAGS.map((tag) => {
                const count = Object.values(memories).filter((m) =>
                  m.feelings.some((f) => f.id === tag.id)
                ).length

                return (
                  <button
                    key={tag.id}
                    onClick={() => setFilter({ ...filter, feeling: tag.id, favorites: false, stateId: null })}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      filter.feeling === tag.id
                        ? 'bg-sensory-sky-100 dark:bg-sensory-sky-900 text-sensory-sky-900 dark:text-sensory-sky-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tag.emoji}</span>
                    {tag.label}
                    {count > 0 && (
                      <span className="float-right text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {uniqueStates.length > 0 && (
            <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Filter by State
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFilter({ ...filter, stateId: null, favorites: false })}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filter.stateId === null && !filter.favorites
                      ? 'bg-sensory-earth-100 dark:bg-sensory-earth-900 text-sensory-earth-900 dark:text-sensory-earth-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  All States
                </button>
                {uniqueStates.map((stateId) => {
                  const stateMemories = getMemoriesByState(stateId)
                  return (
                    <button
                      key={stateId}
                      onClick={() => setFilter({ ...filter, stateId, favorites: false, feeling: null })}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        filter.stateId === stateId
                          ? 'bg-sensory-earth-100 dark:bg-sensory-earth-900 text-sensory-earth-900 dark:text-sensory-earth-100'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {stateId}
                      <span className="float-right text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                        {stateMemories.length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-3">
          {filteredMemories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No memories yet
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start exploring destinations and save your favorites to create memories
              </p>
              <a
                href="/destinations"
                className="inline-block px-6 py-3 text-white font-medium bg-sensory-sky-600 rounded-md hover:bg-sensory-sky-700 transition-colors"
              >
                Explore Destinations
              </a>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredMemories.map((memory, index) => (
                  <ScrapbookCard
                    key={memory.id}
                    memory={memory}
                    index={index}
                    onDrop={handleDrop}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
