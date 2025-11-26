import { useEffect, useState } from 'react'
import { audioManager } from '@/lib/audio'
import { useAppStore } from '@/store/useAppStore'

export function useAudio() {
  const [initialized, setInitialized] = useState(false)
  const audioEnabled = useAppStore((state) => state.userSettings.audioEnabled)

  useEffect(() => {
    if (audioEnabled && !initialized) {
      audioManager.initialize().then(() => {
        setInitialized(true)
      })
    }

    return () => {
      if (initialized) {
        audioManager.dispose()
        setInitialized(false)
      }
    }
  }, [audioEnabled, initialized])

  const playSound = (type: 'success' | 'error' | 'navigation') => {
    if (!audioEnabled || !initialized) return

    switch (type) {
      case 'success':
        audioManager.playSuccessSound()
        break
      case 'error':
        audioManager.playErrorSound()
        break
      case 'navigation':
        audioManager.playNavigationSound()
        break
    }
  }

  return {
    initialized,
    playSound,
    isEnabled: audioEnabled,
  }
}
