'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useScrapbookStore, DEFAULT_FEELING_TAGS, type MemoryTag } from '@/store/scrapbookStore'
import type { Destination } from '@/data/types'

interface AddToScrapbookButtonProps {
  destination: Destination
}

export default function AddToScrapbookButton({ destination }: AddToScrapbookButtonProps) {
  const { userSettings } = useAppStore()
  const { addMemory, hasMemory, getMemoryByDestination, updateMemory, removeMemory } = useScrapbookStore()
  
  const [showModal, setShowModal] = useState(false)
  const [selectedFeelings, setSelectedFeelings] = useState<MemoryTag[]>([])
  const [visitDate, setVisitDate] = useState('')
  const [notes, setNotes] = useState('')
  const [customTags, setCustomTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  const existingMemory = getMemoryByDestination(destination.id)
  const isInScrapbook = hasMemory(destination.id)

  const handleOpenModal = () => {
    if (existingMemory) {
      setSelectedFeelings(existingMemory.feelings)
      setVisitDate(existingMemory.visitDate || '')
      setNotes(existingMemory.notes)
      setCustomTags(existingMemory.customTags)
    }
    setShowModal(true)
  }

  const handleSave = () => {
    if (existingMemory) {
      updateMemory(existingMemory.id, {
        feelings: selectedFeelings,
        visitDate,
        notes,
        customTags,
      })
    } else {
      addMemory({
        destinationId: destination.id,
        destinationName: destination.name,
        stateId: destination.stateId,
        districtId: destination.districtId,
        coordinates: destination.coordinates,
        visitDate,
        notes,
        feelings: selectedFeelings,
        customTags,
        isFavorite: false,
      })
    }
    setShowModal(false)
    resetForm()
  }

  const handleRemove = () => {
    if (existingMemory) {
      removeMemory(existingMemory.id)
      setShowModal(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setSelectedFeelings([])
    setVisitDate('')
    setNotes('')
    setCustomTags([])
    setNewTag('')
  }

  const toggleFeeling = (feeling: MemoryTag) => {
    setSelectedFeelings((prev) => {
      const exists = prev.find((f) => f.id === feeling.id)
      if (exists) {
        return prev.filter((f) => f.id !== feeling.id)
      }
      return [...prev, feeling]
    })
  }

  const addCustomTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags([...customTags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeCustomTag = (tag: string) => {
    setCustomTags(customTags.filter((t) => t !== tag))
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenModal}
        className={`px-6 py-3 rounded-lg font-medium transition-all shadow-md ${
          isInScrapbook
            ? 'bg-sensory-twilight-600 text-white hover:bg-sensory-twilight-700'
            : 'bg-sensory-sky-600 text-white hover:bg-sensory-sky-700'
        }`}
        aria-label={isInScrapbook ? 'Edit memory' : 'Add to scrapbook'}
      >
        {isInScrapbook ? '📖 Edit Memory' : '➕ Add to Scrapbook'}
      </motion.button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: userSettings.reducedMotion ? 0 : 0.3 }}
              className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isInScrapbook ? 'Edit Memory' : 'Add to Scrapbook'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {destination.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {destination.sensoryDescription.visual.split('.')[0]}.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Visit Date (optional)
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    How did it make you feel?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {DEFAULT_FEELING_TAGS.map((feeling) => {
                      const isSelected = selectedFeelings.some((f) => f.id === feeling.id)
                      return (
                        <button
                          key={feeling.id}
                          onClick={() => toggleFeeling(feeling)}
                          className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                            isSelected
                              ? 'text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                          style={isSelected ? { backgroundColor: feeling.color } : {}}
                        >
                          <span className="text-lg mr-2">{feeling.emoji}</span>
                          {feeling.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                      placeholder="Add custom tag..."
                      className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={addCustomTag}
                      className="px-4 py-2 text-sm font-medium text-white bg-sensory-sky-600 rounded-md hover:bg-sensory-sky-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {customTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {customTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => removeCustomTag(tag)}
                            className="hover:text-red-600"
                            aria-label={`Remove ${tag} tag`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write about your experience..."
                    rows={4}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 text-white font-medium bg-sensory-sky-600 rounded-md hover:bg-sensory-sky-700 transition-colors"
                  >
                    {isInScrapbook ? 'Update Memory' : 'Save to Scrapbook'}
                  </button>
                  
                  {isInScrapbook && (
                    <button
                      onClick={handleRemove}
                      className="px-6 py-3 text-white font-medium bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
