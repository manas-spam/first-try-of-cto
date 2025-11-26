'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAppStore } from '@/store/useAppStore'
import { useScrapbookStore, type ScrapbookMemory } from '@/store/scrapbookStore'
import { generatePostcard, generatePostcardImage, sharePostcard } from '@/lib/postcard'
import { useAccessibilityStore } from '@/store/accessibilityStore'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'

interface ScrapbookCardProps {
  memory: ScrapbookMemory
  index: number
  onDrop?: (draggedId: string, droppedId: string) => void
}

export default function ScrapbookCard({
  memory,
  index,
  onDrop,
}: ScrapbookCardProps) {
  const { userSettings } = useAppStore()
  const { updateMemory, toggleFavorite, removeMemory } = useScrapbookStore()
  const { textToSpeechEnabled } = useAccessibilityStore()
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech()
  const [isEditing, setIsEditing] = useState(false)
  const [notes, setNotes] = useState(memory.notes)
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [shareStatus, setShareStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', memory.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const draggedId = e.dataTransfer.getData('text/plain')
    if (draggedId !== memory.id) {
      onDrop?.(draggedId, memory.id)
    }
  }

  const handleSaveNotes = () => {
    updateMemory(memory.id, { notes })
    setIsEditing(false)
  }

  const handleGeneratePostcard = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    try {
      const result = await generatePostcard({
        element: cardRef.current,
        fileName: `memory-${memory.destinationName.replace(/\s+/g, '-').toLowerCase()}`,
        format: 'pdf',
      })

      if (!result.success) {
        console.error('Failed to generate postcard:', result.error)
      }
    } catch (error) {
      console.error('Error generating postcard:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    if (!cardRef.current) return

    setIsSharing(true)
    setShareStatus('idle')

    try {
      const dataUrl = await generatePostcardImage(cardRef.current, 0.95)
      if (!dataUrl) {
        setShareStatus('error')
        return
      }

      const shared = await sharePostcard(dataUrl, `Memory of ${memory.destinationName}`)
      setShareStatus(shared ? 'success' : 'error')
    } catch (error) {
      console.error('Error sharing postcard:', error)
      setShareStatus('error')
    } finally {
      setIsSharing(false)
      setTimeout(() => setShareStatus('idle'), 3000)
    }
  }

  const handleReadAloud = () => {
    if (!textToSpeechEnabled || !ttsSupported) return

    if (isSpeaking) {
      stop()
    } else {
      const text = `Memory of ${memory.destinationName}. Visited on ${formatDate(memory.visitDate)}. ${memory.notes || 'No notes.'} Feelings: ${memory.feelings.map(f => f.label).join(', ')}.`
      speak(text)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: userSettings.reducedMotion ? 0 : 0.3,
        delay: userSettings.reducedMotion ? 0 : index * 0.05,
      }}
    >
      <div
        ref={cardRef}
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow cursor-move border-2 border-gray-200 dark:border-gray-700"
        data-memory-id={memory.id}
      >
        <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => toggleFavorite(memory.id)}
          className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={memory.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className={`w-5 h-5 ${memory.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'fill-none text-gray-400'}`}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </button>

        <button
          onClick={() => removeMemory(memory.id)}
          className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
          aria-label="Delete memory"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <Link href={`/destination/${memory.destinationId}`}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 pr-16">
          {memory.destinationName}
        </h3>
      </Link>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Visited: {formatDate(memory.visitDate)}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {memory.feelings.map((feeling) => (
          <span
            key={feeling.id}
            className="px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: feeling.color }}
          >
            {feeling.emoji} {feeling.label}
          </span>
        ))}
        {memory.customTags.map((tag, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
            rows={4}
            placeholder="Add your notes..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveNotes}
              className="px-4 py-2 text-sm font-medium text-white bg-sensory-sky-600 rounded-md hover:bg-sensory-sky-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setNotes(memory.notes)
                setIsEditing(false)
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {memory.notes && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
              {memory.notes}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 text-xs font-medium text-sensory-sky-700 dark:text-sensory-sky-300 bg-sensory-sky-50 dark:bg-sensory-sky-900/20 rounded-md hover:bg-sensory-sky-100 dark:hover:bg-sensory-sky-900/30 transition-colors"
            >
              {memory.notes ? 'Edit Notes' : 'Add Notes'}
            </button>
            <button
              onClick={handleGeneratePostcard}
              disabled={isGenerating}
              className="px-3 py-1.5 text-xs font-medium text-sensory-fire-700 dark:text-sensory-fire-300 bg-sensory-fire-50 dark:bg-sensory-fire-900/20 rounded-md hover:bg-sensory-fire-100 dark:hover:bg-sensory-fire-900/30 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Export Postcard'}
            </button>
            <button
              onClick={handleShare}
              disabled={isSharing}
              className="px-3 py-1.5 text-xs font-medium text-sensory-earth-700 dark:text-sensory-earth-300 bg-sensory-earth-50 dark:bg-sensory-earth-900/20 rounded-md hover:bg-sensory-earth-100 dark:hover:bg-sensory-earth-900/30 transition-colors disabled:opacity-50"
            >
              {isSharing ? 'Sharing...' : 'Share Memory'}
            </button>
            {textToSpeechEnabled && ttsSupported && (
              <button
                onClick={handleReadAloud}
                className="px-3 py-1.5 text-xs font-medium text-sensory-twilight-700 dark:text-sensory-twilight-200 bg-sensory-twilight-50 dark:bg-sensory-twilight-900/20 rounded-md hover:bg-sensory-twilight-100 dark:hover:bg-sensory-twilight-900/40 transition-colors"
              >
                {isSpeaking ? 'Stop Audio' : 'Listen'}
              </button>
            )}
          </div>
          {shareStatus !== 'idle' && (
            <p
              className={`mt-2 text-xs ${
                shareStatus === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {shareStatus === 'success' ? 'Shared successfully!' : 'Sharing failed.'}
            </p>
          )}
        </>
      )}
      </div>
    </motion.div>
  )
}
