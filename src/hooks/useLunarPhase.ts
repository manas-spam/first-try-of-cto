'use client'

import { useEffect, useState } from 'react'
import { getLunarPhaseInfo, getMoonVisibilityInfo, getNightTintColor, type LunarPhaseInfo } from '@/lib/astronomy'

/**
 * Hook for lunar phase information
 */
export function useLunarPhase(date?: Date) {
  const [lunarInfo, setLunarInfo] = useState<LunarPhaseInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    try {
      const info = getLunarPhaseInfo(date || new Date())
      setLunarInfo(info)
    } catch (err) {
      console.warn('Failed to calculate lunar phase:', err)
    } finally {
      setLoading(false)
    }
  }, [date])

  return { lunarInfo, loading }
}

/**
 * Hook for moon visibility and tinting
 */
export function useMoonTint(date?: Date, isNightMode: boolean = true) {
  const [tint, setTint] = useState<{ color: string; opacity: number } | null>(null)
  const [visibility, setVisibility] = useState<any>(null)

  useEffect(() => {
    if (!isNightMode) {
      setTint(null)
      setVisibility(null)
      return
    }

    try {
      const moonTint = getNightTintColor(date || new Date())
      const moonVisibility = getMoonVisibilityInfo(date || new Date())
      
      setTint(moonTint)
      setVisibility(moonVisibility)
    } catch (err) {
      console.warn('Failed to calculate moon tint:', err)
    }
  }, [date, isNightMode])

  return { tint, visibility }
}
