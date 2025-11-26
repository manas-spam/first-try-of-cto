'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccessibilityStore } from '@/store/accessibilityStore'

export interface TextToSpeechState {
  isSpeaking: boolean
  isPaused: boolean
  isSupported: boolean
  voices: SpeechSynthesisVoice[]
}

export function useTextToSpeech() {
  const { textToSpeechEnabled, textToSpeechRate, textToSpeechVoice } = useAccessibilityStore()
  const [state, setState] = useState<TextToSpeechState>({
    isSpeaking: false,
    isPaused: false,
    isSupported: false,
    voices: [],
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setState((prev) => ({ ...prev, isSupported: true }))

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setState((prev) => ({ ...prev, voices: availableVoices }))
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices

      return () => {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  const speak = useCallback(
    (text: string, options?: SpeechSynthesisUtterance) => {
      if (!state.isSupported || !textToSpeechEnabled) {
        return
      }

      window.speechSynthesis.cancel()

      const utterance = options || new SpeechSynthesisUtterance(text)
      utterance.rate = textToSpeechRate
      
      if (textToSpeechVoice) {
        const voice = state.voices.find((v) => v.name === textToSpeechVoice)
        if (voice) {
          utterance.voice = voice
        }
      }

      utterance.onstart = () => {
        setState((prev) => ({ ...prev, isSpeaking: true, isPaused: false }))
      }

      utterance.onend = () => {
        setState((prev) => ({ ...prev, isSpeaking: false, isPaused: false }))
      }

      utterance.onerror = () => {
        setState((prev) => ({ ...prev, isSpeaking: false, isPaused: false }))
      }

      window.speechSynthesis.speak(utterance)
    },
    [state.isSupported, state.voices, textToSpeechEnabled, textToSpeechRate, textToSpeechVoice]
  )

  const pause = useCallback(() => {
    if (state.isSupported && state.isSpeaking) {
      window.speechSynthesis.pause()
      setState((prev) => ({ ...prev, isPaused: true }))
    }
  }, [state.isSupported, state.isSpeaking])

  const resume = useCallback(() => {
    if (state.isSupported && state.isPaused) {
      window.speechSynthesis.resume()
      setState((prev) => ({ ...prev, isPaused: false }))
    }
  }, [state.isSupported, state.isPaused])

  const stop = useCallback(() => {
    if (state.isSupported) {
      window.speechSynthesis.cancel()
      setState((prev) => ({ ...prev, isSpeaking: false, isPaused: false }))
    }
  }, [state.isSupported])

  return {
    speak,
    pause,
    resume,
    stop,
    ...state,
  }
}
