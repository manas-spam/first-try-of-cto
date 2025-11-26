'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAccessibilityStore, KEYBOARD_SHORTCUTS } from '@/store/accessibilityStore'
import { useAppStore } from '@/store/useAppStore'

interface ShortcutHandlers {
  onShowHelp?: () => void
  onStartBreathing?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers = {}) {
  const router = useRouter()
  const { toggleAtmosphericLayer } = useAppStore()
  const {
    keyboardShortcutsEnabled,
    setFocusModeEnabled,
    focusModeEnabled,
    toggleShortcutsHelp,
    setTextToSpeechEnabled,
    textToSpeechEnabled,
  } = useAccessibilityStore()

  useEffect(() => {
    if (!keyboardShortcutsEnabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement as HTMLElement | null
      const isInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA' || activeElement?.isContentEditable
      if (isInput) return

      const shortcut = KEYBOARD_SHORTCUTS.find((s) => {
        if (s.key === '?' && event.key === '/' && !event.shiftKey) {
          return false
        }
        const matchesKey = event.key === s.key || (s.key === '?' && event.key === '/')
        return (
          matchesKey &&
          (!!s.ctrlKey === event.ctrlKey) &&
          (!!s.altKey === event.altKey) &&
          (!!s.shiftKey === event.shiftKey)
        )
      })

      if (!shortcut) {
        // Numeric shortcuts control atmospheric layers (1-9)
        if (event.key >= '1' && event.key <= '9') {
          event.preventDefault()
          const layerIndex = parseInt(event.key, 10) - 1
          toggleAtmosphericLayerByIndex(layerIndex)
        }
        return
      }

      event.preventDefault()

      switch (shortcut.action) {
        case 'navigate-home':
          router.push('/')
          break
        case 'navigate-destinations':
          router.push('/destinations')
          break
        case 'navigate-memories':
          router.push('/memories')
          break
        case 'navigate-atlas':
          router.push('/atlas')
          break
        case 'navigate-settings':
          router.push('/settings')
          break
        case 'show-shortcuts':
        case 'show-help':
          toggleShortcutsHelp()
          handlers.onShowHelp?.()
          break
        case 'toggle-focus-mode':
          setFocusModeEnabled(!focusModeEnabled)
          break
        case 'start-breathing':
          handlers.onStartBreathing?.()
          break
        case 'toggle-tts':
          setTextToSpeechEnabled(!textToSpeechEnabled)
          break
        default:
          break
      }
    }

    const toggleAtmosphericLayerByIndex = (index: number) => {
      const layers = useAppStore.getState().atmosphericLayers
      if (layers[index]) {
        useAppStore.getState().toggleAtmosphericLayer(layers[index].id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    router,
    keyboardShortcutsEnabled,
    focusModeEnabled,
    setFocusModeEnabled,
    toggleShortcutsHelp,
    handlers,
    setTextToSpeechEnabled,
    textToSpeechEnabled,
  ])
}
