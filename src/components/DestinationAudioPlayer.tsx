'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import type { AudioClip } from '@/data/types'

interface DestinationAudioPlayerProps {
  audioClip: AudioClip
  onPlay?: () => void
  onPause?: () => void
}

export default function DestinationAudioPlayer({
  audioClip,
  onPlay,
  onPause,
}: DestinationAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const userSettings = useAppStore((state) => state.userSettings)
  const [audioLoading, setAudioLoading] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const handleCanPlay = () => setAudioLoading(false)
    const handleLoadingStart = () => setAudioLoading(true)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadstart', handleLoadingStart)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadstart', handleLoadingStart)
    }
  }, [])

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      onPause?.()
    } else {
      if (!userSettings.audioEnabled) {
        console.warn('Audio is disabled in settings')
        return
      }
      audioRef.current.play().catch(err => console.error('Playback error:', err))
      setIsPlaying(true)
      onPlay?.()
    }
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioClip.url}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Player Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-gradient-to-br from-sensory-twilight-900/30 to-sensory-sky-900/20 border border-sensory-sky-500/30 backdrop-blur-sm"
      >
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-semibold text-sensory-sky-100 text-sm">{audioClip.category}</h3>
          <h2 className="text-lg font-bold text-sensory-sky-200">{audioClip.title}</h2>
          <p className="text-xs text-sensory-sky-400 mt-1">{audioClip.speaker}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-sensory-sky-300 mb-4">{audioClip.description}</p>

        {/* Player Controls */}
        <div className="space-y-3">
          {/* Play Button and Time */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              disabled={audioLoading || !userSettings.audioEnabled}
              className="relative w-12 h-12 rounded-full bg-gradient-to-br from-sensory-fire-500 to-sensory-fire-600 hover:from-sensory-fire-600 hover:to-sensory-fire-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all"
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {audioLoading ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              ) : isPlaying ? (
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </motion.button>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-medium text-sensory-sky-300">
                  {formatTime(currentTime)}
                </div>
                <div className="text-xs font-medium text-sensory-sky-400">
                  {formatTime(audioClip.duration)}
                </div>
              </div>

              {/* Progress Slider */}
              <input
                type="range"
                min="0"
                max={audioClip.duration}
                value={currentTime}
                onChange={handleSliderChange}
                className="w-full h-1 bg-sensory-sky-900/50 rounded-full appearance-none cursor-pointer accent-sensory-fire-500"
                aria-label="Audio progress"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTranscript(!showTranscript)}
              className="flex-1 px-3 py-2 text-sm font-medium rounded-lg bg-sensory-sky-500/20 hover:bg-sensory-sky-500/30 text-sensory-sky-300 border border-sensory-sky-400/30 transition-colors"
              aria-label="Toggle transcript"
            >
              {showTranscript ? 'Hide' : 'Show'} Transcript
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Transcript Section */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg bg-sensory-twilight-900/20 border border-sensory-sky-400/20 backdrop-blur-sm">
              <h4 className="text-sm font-semibold text-sensory-sky-200 mb-2">Transcript</h4>
              <div className="text-sm text-sensory-sky-300 leading-relaxed space-y-2 max-h-48 overflow-y-auto">
                {/* Placeholder transcript - in production, fetch from API or data */}
                <p>
                  This is a 15-second audio story capturing the essence of this destination. 
                  In a production environment, this would display the full transcript or caption 
                  of the audio content.
                </p>
                <p className="text-xs text-sensory-sky-400 italic">
                  Language: {audioClip.language.toUpperCase()} • Duration: {audioClip.duration}s
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility Note */}
      {!userSettings.audioEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-lg bg-sensory-earth-900/20 border border-sensory-earth-400/20 text-xs text-sensory-earth-300"
        >
          Audio is currently disabled in your settings. Enable it to listen to the story.
        </motion.div>
      )}
    </div>
  )
}
