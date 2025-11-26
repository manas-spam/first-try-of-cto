'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccessibilityStore } from '@/store/accessibilityStore'
import { useAppStore } from '@/store/useAppStore'
import { useAudio } from '@/hooks/useAudio'

interface BreathingPhase {
  name: string
  duration: number
  instruction: string
}

const BREATHING_PATTERN: BreathingPhase[] = [
  { name: 'inhale', duration: 4, instruction: 'Breathe in slowly...' },
  { name: 'hold', duration: 4, instruction: 'Hold your breath...' },
  { name: 'exhale', duration: 6, instruction: 'Breathe out gently...' },
  { name: 'rest', duration: 2, instruction: 'Rest...' },
]

export default function BreathingOverlay() {
  const { breathingExerciseShown, setBreathingExerciseShown, breathingExerciseDuration } = useAccessibilityStore()
  const { userSettings } = useAppStore()
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(breathingExerciseDuration)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  const { playSound } = useAudio()

  useEffect(() => {
    if (!breathingExerciseShown) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current)
      return
    }

    setTimeRemaining(breathingExerciseDuration)
    setCurrentPhase(0)
    setPhaseProgress(0)

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setBreathingExerciseShown(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const cyclePhases = () => {
      const phase = BREATHING_PATTERN[currentPhase]
      let elapsed = 0
      
      if (userSettings.audioEnabled) {
        playSound('breathing-phase')
      }

      phaseTimerRef.current = setInterval(() => {
        elapsed += 0.1
        setPhaseProgress((elapsed / phase.duration) * 100)

        if (elapsed >= phase.duration) {
          setCurrentPhase((prev) => (prev + 1) % BREATHING_PATTERN.length)
          setPhaseProgress(0)
          if (phaseTimerRef.current) clearInterval(phaseTimerRef.current)
          cyclePhases()
        }
      }, 100)
    }

    cyclePhases()

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (phaseTimerRef.current) clearInterval(phaseTimerRef.current)
    }
  }, [breathingExerciseShown, currentPhase, breathingExerciseDuration, setBreathingExerciseShown, userSettings.audioEnabled, playSound])

  const phase = BREATHING_PATTERN[currentPhase]
  const circleScale = phase.name === 'inhale' ? 1.5 : phase.name === 'exhale' ? 0.8 : 1

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {breathingExerciseShown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setBreathingExerciseShown(false)}
        >
          <div
            className="relative p-12 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setBreathingExerciseShown(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Close breathing exercise"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 mb-8">
                <motion.div
                  animate={{
                    scale: circleScale,
                  }}
                  transition={{
                    duration: phase.duration,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-sensory-sky-400/40 to-sensory-twilight-500/40 blur-2xl"
                />

                <motion.div
                  animate={{
                    scale: circleScale,
                  }}
                  transition={{
                    duration: phase.duration,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-8 rounded-full border-4 border-white/50 flex items-center justify-center bg-gradient-to-br from-sensory-sky-500/20 to-sensory-twilight-600/20"
                >
                  <div className="text-center">
                    <motion.p
                      key={phase.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-semibold text-white capitalize"
                    >
                      {phase.name}
                    </motion.p>
                    <motion.p
                      key={`${phase.name}-instruction`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.8 }}
                      className="text-sm text-white mt-2"
                    >
                      {phase.instruction}
                    </motion.p>
                  </div>
                </motion.div>

                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    opacity="0.2"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - phaseProgress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-100"
                  />
                </svg>
              </div>

              <div className="text-center space-y-4">
                <div className="text-4xl font-light text-white/90">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-white/60 text-sm">
                  Time remaining
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
