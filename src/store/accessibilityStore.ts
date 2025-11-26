import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  description: string
  action: string
}

interface AccessibilityState {
  screenReaderMode: boolean
  keyboardShortcutsEnabled: boolean
  focusModeEnabled: boolean
  textToSpeechEnabled: boolean
  textToSpeechRate: number
  textToSpeechVoice: string | null
  colorDesaturation: number
  breathingExerciseShown: boolean
  breathingExerciseDuration: number
  showShortcutsHelp: boolean
  
  setScreenReaderMode: (enabled: boolean) => void
  setKeyboardShortcutsEnabled: (enabled: boolean) => void
  setFocusModeEnabled: (enabled: boolean) => void
  setTextToSpeechEnabled: (enabled: boolean) => void
  setTextToSpeechRate: (rate: number) => void
  setTextToSpeechVoice: (voice: string | null) => void
  setColorDesaturation: (value: number) => void
  setBreathingExerciseShown: (shown: boolean) => void
  setBreathingExerciseDuration: (duration: number) => void
  toggleShortcutsHelp: () => void
  
  resetAccessibility: () => void
}

const defaultState = {
  screenReaderMode: false,
  keyboardShortcutsEnabled: true,
  focusModeEnabled: false,
  textToSpeechEnabled: false,
  textToSpeechRate: 1.0,
  textToSpeechVoice: null,
  colorDesaturation: 0,
  breathingExerciseShown: false,
  breathingExerciseDuration: 120,
  showShortcutsHelp: false,
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...defaultState,

      setScreenReaderMode: (enabled) =>
        set({ screenReaderMode: enabled }),

      setKeyboardShortcutsEnabled: (enabled) =>
        set({ keyboardShortcutsEnabled: enabled }),

      setFocusModeEnabled: (enabled) =>
        set({ 
          focusModeEnabled: enabled,
          colorDesaturation: enabled ? 50 : 0,
        }),

      setTextToSpeechEnabled: (enabled) =>
        set({ textToSpeechEnabled: enabled }),

      setTextToSpeechRate: (rate) =>
        set({ textToSpeechRate: Math.max(0.5, Math.min(2.0, rate)) }),

      setTextToSpeechVoice: (voice) =>
        set({ textToSpeechVoice: voice }),

      setColorDesaturation: (value) =>
        set({ colorDesaturation: Math.max(0, Math.min(100, value)) }),

      setBreathingExerciseShown: (shown) =>
        set({ breathingExerciseShown: shown }),

      setBreathingExerciseDuration: (duration) =>
        set({ breathingExerciseDuration: Math.max(30, Math.min(600, duration)) }),

      toggleShortcutsHelp: () =>
        set((state) => ({ showShortcutsHelp: !state.showShortcutsHelp })),

      resetAccessibility: () =>
        set(defaultState),
    }),
    {
      name: 'accessibility-storage',
      partialize: (state) => ({
        screenReaderMode: state.screenReaderMode,
        keyboardShortcutsEnabled: state.keyboardShortcutsEnabled,
        focusModeEnabled: state.focusModeEnabled,
        textToSpeechEnabled: state.textToSpeechEnabled,
        textToSpeechRate: state.textToSpeechRate,
        textToSpeechVoice: state.textToSpeechVoice,
        colorDesaturation: state.colorDesaturation,
        breathingExerciseDuration: state.breathingExerciseDuration,
      }),
    }
  )
)

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'h', description: 'Go to Home', action: 'navigate-home' },
  { key: 'd', description: 'Go to Destinations', action: 'navigate-destinations' },
  { key: 'm', description: 'Go to Memories', action: 'navigate-memories' },
  { key: 'a', description: 'Go to Atlas', action: 'navigate-atlas' },
  { key: 's', description: 'Go to Settings', action: 'navigate-settings' },
  { key: 'k', ctrlKey: true, description: 'Show keyboard shortcuts', action: 'show-shortcuts' },
  { key: 'f', ctrlKey: true, description: 'Toggle focus mode', action: 'toggle-focus-mode' },
  { key: 'b', ctrlKey: true, description: 'Start breathing exercise', action: 'start-breathing' },
  { key: 't', ctrlKey: true, description: 'Toggle text-to-speech', action: 'toggle-tts' },
  { key: 'Escape', description: 'Close modal/overlay', action: 'close-modal' },
  { key: '?', shiftKey: true, description: 'Show help', action: 'show-help' },
]
