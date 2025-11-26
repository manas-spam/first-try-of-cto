'use client'

import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { useHapticFeedback } from '@/hooks/useHapticFeedback'
import AccessibilityPanel from '@/components/AccessibilityPanel'

export default function SettingsPage() {
  const { userSettings, updateUserSettings, atmosphericLayers, toggleAtmosphericLayer } = useAppStore()
  const { triggerHaptic, isSupported: hapticSupported } = useHapticFeedback()

  const handleToggle = (setting: string, value: boolean) => {
    updateUserSettings({ [setting]: value })
    if (value) {
      triggerHaptic('success')
    }
  }

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    updateUserSettings({ theme })
    triggerHaptic('light')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: userSettings.reducedMotion ? 0 : 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4 text-sensory-fire-600 dark:text-sensory-fire-400">
          Settings & Accessibility
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Customize your experience and accessibility preferences
        </p>

        <div className="space-y-6">
          <AccessibilityPanel />

          <section className="p-6 glass-morphism rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Reduced Motion</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Minimize animations and transitions
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.reducedMotion}
                    onChange={(e) => handleToggle('reducedMotion', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sensory-sky-300 dark:peer-focus:ring-sensory-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sensory-sky-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">High Contrast</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Increase visual contrast for better readability
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.highContrast}
                    onChange={(e) => handleToggle('highContrast', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sensory-sky-300 dark:peer-focus:ring-sensory-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sensory-sky-600"></div>
                </label>
              </div>
            </div>
          </section>

          <section className="p-6 glass-morphism rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Sensory Experience</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Haptic Feedback</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable vibration feedback on interactions
                    {!hapticSupported && ' (Not supported on this device)'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.hapticFeedback}
                    onChange={(e) => handleToggle('hapticFeedback', e.target.checked)}
                    disabled={!hapticSupported}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sensory-sky-300 dark:peer-focus:ring-sensory-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sensory-sky-600 peer-disabled:opacity-50"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Audio Enabled</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable ambient sounds and audio feedback
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.audioEnabled}
                    onChange={(e) => handleToggle('audioEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sensory-sky-300 dark:peer-focus:ring-sensory-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sensory-sky-600"></div>
                </label>
              </div>
            </div>
          </section>

          <section className="p-6 glass-morphism rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Performance</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Eco Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reduce visual effects for lower energy consumption
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userSettings.ecoMode}
                    onChange={(e) => handleToggle('ecoMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sensory-earth-300 dark:peer-focus:ring-sensory-earth-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sensory-earth-600"></div>
                </label>
              </div>
            </div>
          </section>

          <section className="p-6 glass-morphism rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Theme</h2>
            
            <div className="flex gap-3">
              {(['light', 'dark', 'auto'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={`px-6 py-3 rounded-md transition-colors capitalize ${
                    userSettings.theme === theme
                      ? 'bg-sensory-sky-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </section>

          <section className="p-6 glass-morphism rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Atmospheric Layers</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {atmosphericLayers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => {
                    toggleAtmosphericLayer(layer.id)
                    triggerHaptic('light')
                  }}
                  className={`px-4 py-3 rounded-md transition-colors capitalize ${
                    layer.visible
                      ? 'bg-sensory-earth-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {layer.type}
                </button>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
