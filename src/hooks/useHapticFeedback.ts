import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

const hapticPatterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 50,
  success: [10, 50, 10],
  warning: [20, 100, 20],
  error: [50, 100, 50, 100, 50],
}

export function useHapticFeedback() {
  const [isSupported, setIsSupported] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const userSettings = useAppStore((state) => state.userSettings)

  useEffect(() => {
    const checkSupport = () => {
      const supported = 'vibrate' in navigator
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
      setIsSupported(supported)
      setIsMobile(mobile)
    }

    checkSupport()
  }, [])

  const triggerHaptic = (pattern: HapticPattern = 'light') => {
    if (!isSupported || !userSettings.hapticFeedback) {
      return
    }

    try {
      const vibrationPattern = hapticPatterns[pattern]
      
      if (Array.isArray(vibrationPattern)) {
        navigator.vibrate(vibrationPattern)
      } else {
        navigator.vibrate(vibrationPattern)
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
    }
  }

  return {
    triggerHaptic,
    isSupported,
    isMobile,
    isEnabled: userSettings.hapticFeedback,
  }
}
