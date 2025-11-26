'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAccessibilityStore, KEYBOARD_SHORTCUTS } from '@/store/accessibilityStore'
import { useAppStore } from '@/store/useAppStore'

export default function KeyboardShortcutsHelp() {
  const { showShortcutsHelp, toggleShortcutsHelp } = useAccessibilityStore()
  const { userSettings } = useAppStore()

  const formatKeyCombo = (shortcut: typeof KEYBOARD_SHORTCUTS[0]) => {
    const keys = []
    if (shortcut.ctrlKey) keys.push('Ctrl')
    if (shortcut.altKey) keys.push('Alt')
    if (shortcut.shiftKey) keys.push('Shift')
    keys.push(shortcut.key.toUpperCase())
    return keys.join(' + ')
  }

  return (
    <AnimatePresence>
      {showShortcutsHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={toggleShortcutsHelp}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: userSettings.reducedMotion ? 0 : 0.3 }}
            className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Keyboard Shortcuts
              </h2>
              <button
                onClick={toggleShortcutsHelp}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close shortcuts help"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid gap-3">
                {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: userSettings.reducedMotion ? 0 : index * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-1 text-sm font-mono bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                      {formatKeyCombo(shortcut)}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-sensory-sky-50 dark:bg-sensory-sky-900/20 border border-sensory-sky-200 dark:border-sensory-sky-800">
                <h3 className="font-semibold text-sensory-sky-900 dark:text-sensory-sky-300 mb-2">
                  Additional Shortcuts
                </h3>
                <ul className="text-sm text-sensory-sky-800 dark:text-sensory-sky-400 space-y-1">
                  <li>• Press <kbd className="px-2 py-0.5 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">1-9</kbd> to toggle atmospheric layers</li>
                  <li>• Use <kbd className="px-2 py-0.5 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">Tab</kbd> for keyboard navigation</li>
                  <li>• Press <kbd className="px-2 py-0.5 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">Enter</kbd> to activate focused elements</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
