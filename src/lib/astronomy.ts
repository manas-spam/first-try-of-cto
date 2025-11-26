/**
 * Astronomy Utilities
 * Lunar phase calculations and related celestial information
 */

import * as AE from 'astronomy-engine'

export interface LunarPhaseInfo {
  phase: number // 0-1, where 0 is new moon and 0.5 is full moon
  phaseName: string // 'New Moon', 'Waxing Crescent', etc.
  illumination: number // 0-100 percentage
  nextFullMoon: Date
  nextNewMoon: Date
  nextQuarter: 'first' | 'third' | null
}

/**
 * Get lunar phase information for a given date
 */
export function getLunarPhaseInfo(date: Date = new Date()): LunarPhaseInfo {
  // Get phase at the given date
  const phaseAngle = AE.MoonPhase(date)
  
  // Phase angle is 0-360, convert to 0-1
  const phaseNormalized = ((phaseAngle % 360) + 360) % 360
  const phase = phaseNormalized / 360
  
  // Calculate illumination (as percentage)
  const illumination = (1 + Math.cos(toRad(phaseAngle))) / 2 * 100
  
  // Get phase name
  const phaseName = getPhaseName(phase)
  
  // Find next quarter moons
  const nextFullMoon = getNextMoonPhase(date, 0.5) // 0.5 = full moon
  const nextNewMoon = getNextMoonPhase(date, 0) // 0 or 1 = new moon
  const nextFirstQuarter = getNextMoonPhase(date, 0.25) // 0.25 = first quarter
  const nextThirdQuarter = getNextMoonPhase(date, 0.75) // 0.75 = third quarter
  
  // Determine which quarter is next
  let nextQuarter: 'first' | 'third' | null = null
  if (nextFirstQuarter < nextThirdQuarter) {
    nextQuarter = 'first'
  } else if (nextThirdQuarter < nextFirstQuarter) {
    nextQuarter = 'third'
  }
  
  return {
    phase,
    phaseName,
    illumination: Math.round(illumination),
    nextFullMoon,
    nextNewMoon,
    nextQuarter,
  }
}

/**
 * Get human-readable phase name
 */
function getPhaseName(phase: number): string {
  // Phase: 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = third quarter
  if (phase < 0.125) return 'New Moon'
  if (phase < 0.25) return 'Waxing Crescent'
  if (phase < 0.375) return 'Waxing Crescent'
  if (phase < 0.5) return 'Waxing Gibbous'
  if (phase < 0.625) return 'Waxing Gibbous'
  if (phase < 0.75) return 'Waning Gibbous'
  if (phase < 0.875) return 'Waning Crescent'
  return 'Waning Crescent'
}

/**
 * Get next occurrence of a specific moon phase
 */
function getNextMoonPhase(fromDate: Date, targetPhase: number): Date {
  const current = new Date(fromDate)
  const maxIterations = 30 // Check up to 30 days
  
  for (let i = 0; i < maxIterations; i++) {
    const angle = AE.MoonPhase(current)
    const normalizedAngle = ((angle % 360) + 360) % 360
    const currentPhase = normalizedAngle / 360
    
    // Check if we're close to the target phase
    const phaseDistance = Math.min(
      Math.abs(currentPhase - targetPhase),
      Math.abs(currentPhase - (targetPhase + 1))
    )
    
    if (phaseDistance < 0.05) { // Within 5% of target phase
      return current
    }
    
    current.setDate(current.getDate() + 1)
  }
  
  return current
}

/**
 * Get moon visibility info for night mode
 */
export function getMoonVisibilityInfo(date: Date = new Date()): {
  isVisible: boolean // Whether moon is above horizon
  altitude: number // Angle above horizon (-90 to 90)
  azimuth: number // Direction (0-360, 0=N, 90=E, etc)
  illumination: number
} {
  // Simplified: use phase as proxy for visibility
  // In production, calculate actual moon position
  const { illumination } = getLunarPhaseInfo(date)
  
  return {
    isVisible: illumination > 10, // Visible if at least 10% illuminated
    altitude: 0, // Placeholder
    azimuth: 0, // Placeholder
    illumination,
  }
}

/**
 * Get night tint color based on lunar phase
 * Returns RGB color suitable for overlay
 */
export function getNightTintColor(date: Date = new Date()): {
  color: string // CSS color
  opacity: number // 0-1
} {
  const { illumination } = getLunarPhaseInfo(date)
  
  // More illumination = less dark tint
  const opacity = Math.max(0.2, 0.8 - (illumination / 100) * 0.6)
  
  // Lunar light has slight blue-purple tone
  return {
    color: '#2a1a4d', // Deep purple-blue
    opacity,
  }
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Get season-aware lunar appearance
 */
export function getSeasonalLunarAppearance(_date: Date, season: 'summer' | 'monsoon' | 'winter'): {
  tint: string
  glow: number
  description: string
} {
  const { illumination, phaseName } = getLunarPhaseInfo(_date)
  
  const seasonalTints: Record<string, string> = {
    summer: '#ffd700', // Golden glow
    monsoon: '#8b7d9e', // Silver-grey
    winter: '#e6f0ff', // Cool silver-blue
  }
  
  return {
    tint: seasonalTints[season] || '#e6f0ff',
    glow: illumination / 100 * 0.8,
    description: `${phaseName} (${illumination}% illuminated)`,
  }
}
