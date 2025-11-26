'use client'

import { motion } from 'framer-motion'
import { useAccessibilityStore } from '@/store/accessibilityStore'
import { useAppStore } from '@/store/useAppStore'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'

export default function AccessibilityPanel() {
  const {
    screenReaderMode,
    setScreenReaderMode,
    keyboardShortcutsEnabled,
    setKeyboardShortcutsEnabled,
    focusModeEnabled,
    setFocusModeEnabled,
    textToSpeechEnabled,
    setTextToSpeechEnabled,
    textToSpeechRate,
    setTextToSpeechRate,
    colorDesaturation,
    setColorDesaturation,
    toggleShortcutsHelp,
    setBreathingExerciseShown,
  } = useAccessibilityStore()

  const { userSettings } = useAppStore()
  const { isSupported: ttsSupported, voices } = useTextToSpeech()

  const handleTestTTS = () => {
    if (textToSpeechEnabled && ttsSupported) {
      const utterance = new SpeechSynthesisUtterance('This is a test of the text to speech feature.')
      utterance.rate = textToSpeechRate
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="space-y-6">
      <section className="p-6 glass-morphism rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Screen Reader & Navigation</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Screen Reader Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enhanced ARIA landmarks and descriptions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={screenReaderMode}
                onChange={(e) => setScreenReaderMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sensory-sky-300 dark:peer-focus:ring-sensory-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sensory-sky-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Keyboard Shortcuts</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enable keyboard navigation shortcuts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={keyboardShortcutsEnabled}
                onChange={(e) => setKeyboardShortcutsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sensory-sky-300 dark:peer-focus:ring-sensory-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sensory-sky-600"></div>
            </label>
          </div>

          <button
            onClick={toggleShortcutsHelp}
            className="w-full px-4 py-2 text-sm font-medium text-sensory-sky-700 dark:text-sensory-sky-300 bg-sensory-sky-50 dark:bg-sensory-sky-900/20 rounded-md hover:bg-sensory-sky-100 dark:hover:bg-sensory-sky-900/30 transition-colors"
          >
            View Keyboard Shortcuts
          </button>
        </div>
      </section>

      <section className="p-6 glass-morphism rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Focus Mode</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Focus Mode</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Reduces visual distractions and applies calming effects
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={focusModeEnabled}
                onChange={(e) => setFocusModeEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sensory-twilight-300 dark:peer-focus:ring-sensory-twilight-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sensory-twilight-600"></div>
            </label>
          </div>

          {focusModeEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Color Desaturation: {colorDesaturation}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={colorDesaturation}
                  onChange={(e) => setColorDesaturation(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <section className="p-6 glass-morphism rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Text-to-Speech</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Enable Text-to-Speech</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Read content aloud
                {!ttsSupported && ' (Not supported on this browser)'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={textToSpeechEnabled}
                onChange={(e) => setTextToSpeechEnabled(e.target.checked)}
                disabled={!ttsSupported}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sensory-sky-300 dark:peer-focus:ring-sensory-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sensory-sky-600 peer-disabled:opacity-50"></div>
            </label>
          </div>

          {textToSpeechEnabled && ttsSupported && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                  Speech Rate: {textToSpeechRate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={textToSpeechRate}
                  onChange={(e) => setTextToSpeechRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>

              <button
                onClick={handleTestTTS}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-sensory-sky-600 rounded-md hover:bg-sensory-sky-700 transition-colors"
              >
                Test Text-to-Speech
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <section className="p-6 glass-morphism rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Anxiety Reduction</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Take a moment to center yourself with guided breathing exercises
          </p>
          
          <button
            onClick={() => setBreathingExerciseShown(true)}
            className="w-full px-4 py-3 text-white font-medium bg-gradient-to-r from-sensory-twilight-500 to-sensory-sky-500 rounded-md hover:from-sensory-twilight-600 hover:to-sensory-sky-600 transition-all shadow-lg"
          >
            Start Breathing Exercise
          </button>
        </div>
      </section>
    </div>
  )
}
