'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAccessibilityStore } from '@/store/accessibilityStore'
import { useAppStore } from '@/store/useAppStore'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import BreathingOverlay from '@/components/BreathingOverlay'
import KeyboardShortcutsHelp from '@/components/KeyboardShortcutsHelp'

export default function AccessibilitySuite() {
  const pathname = usePathname()
  const { userSettings } = useAppStore()
  const {
    screenReaderMode,
    focusModeEnabled,
    colorDesaturation,
    setBreathingExerciseShown,
  } = useAccessibilityStore()
  const [announcement, setAnnouncement] = useState('Welcome to Immersive Experience')

  useKeyboardShortcuts({
    onStartBreathing: () => setBreathingExerciseShown(true),
  })

  useEffect(() => {
    setAnnouncement(`Navigated to ${pathname}`)
  }, [pathname])

  useEffect(() => {
    const body = document.body
    body.dataset.screenReader = screenReaderMode ? 'on' : 'off'
    body.dataset.focusMode = focusModeEnabled ? 'on' : 'off'
    body.dataset.eco = userSettings.ecoMode ? 'on' : 'off'
    body.style.setProperty('--focus-desaturation', `${colorDesaturation}%`)
  }, [screenReaderMode, focusModeEnabled, colorDesaturation, userSettings.ecoMode])

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {screenReaderMode ? announcement : 'Screen reader mode disabled'}
      </div>
      <BreathingOverlay />
      <KeyboardShortcutsHelp />
    </>
  )
}
