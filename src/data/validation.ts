/**
 * Atlas Data Validation Helpers
 * Type checking and validation for atlas data structures
 */

import type {
  State,
  District,
  Destination,
  AudioClip,
  WeatherVariant,
  CulturalContext,
  CulturalPulse,
  GeoPoint,
  ContentCategory,
} from './types'

/**
 * Validate a GeoPoint (coordinate pair)
 */
export function validateGeoPoint(point: unknown): point is GeoPoint {
  if (!Array.isArray(point) || point.length !== 2) return false
  const [lng, lat] = point
  return (
    typeof lng === 'number' &&
    typeof lat === 'number' &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  )
}

/**
 * Validate audio clip
 */
export function validateAudioClip(clip: unknown): clip is AudioClip {
  if (typeof clip !== 'object' || clip === null) return false

  const c = clip as any
  const validLanguages = [
    'en',
    'hi',
    'ta',
    'te',
    'ka',
    'ml',
    'mr',
    'gu',
    'pa',
    'bn',
    'or',
    'as',
  ]
  const validCategories = ['narration', 'ambient-sound', 'music', 'interview']

  return (
    typeof c.id === 'string' &&
    c.id.length > 0 &&
    typeof c.title === 'string' &&
    c.title.length > 0 &&
    typeof c.description === 'string' &&
    typeof c.url === 'string' &&
    c.url.length > 0 &&
    typeof c.speaker === 'string' &&
    validLanguages.includes(c.language) &&
    typeof c.duration === 'number' &&
    c.duration > 0 &&
    validCategories.includes(c.category)
  )
}

/**
 * Validate weather variant
 */
export function validateWeatherVariant(
  variant: unknown
): variant is WeatherVariant {
  if (typeof variant !== 'object' || variant === null) return false

  const v = variant as any
  const validSeasons = ['summer', 'monsoon', 'winter']

  return (
    validSeasons.includes(v.season) &&
    typeof v.assetId === 'string' &&
    v.assetId.length > 0 &&
    Array.isArray(v.temperatureRange) &&
    v.temperatureRange.length === 2 &&
    typeof v.temperatureRange[0] === 'number' &&
    typeof v.temperatureRange[1] === 'number' &&
    typeof v.humidity === 'number' &&
    v.humidity >= 0 &&
    v.humidity <= 100 &&
    typeof v.description === 'string'
  )
}

/**
 * Validate cultural context
 */
export function validateCulturalContext(
  context: unknown
): context is CulturalContext {
  if (typeof context !== 'object' || context === null) return false

  const c = context as any
  return (
    typeof c.historicalAnecdote === 'string' &&
    c.historicalAnecdote.length > 0 &&
    typeof c.proverb === 'string' &&
    c.proverb.length > 0 &&
    typeof c.culturalSignificance === 'string' &&
    Array.isArray(c.festivals) &&
    c.festivals.every((f: any) => typeof f === 'string')
  )
}

/**
 * Validate cultural pulse
 */
export function validateCulturalPulse(pulse: unknown): pulse is CulturalPulse {
  if (typeof pulse !== 'object' || pulse === null) return false

  const p = pulse as any
  const validPatterns = ['rhythmic', 'organic', 'geometric', 'fluid']

  return (
    validPatterns.includes(p.pattern) &&
    typeof p.color === 'string' &&
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(p.color) &&
    typeof p.tempo === 'number' &&
    p.tempo > 0 &&
    p.tempo <= 300 &&
    typeof p.intensity === 'number' &&
    p.intensity >= 0 &&
    p.intensity <= 100 &&
    typeof p.description === 'string'
  )
}

/**
 * Validate destination
 */
export function validateDestination(dest: unknown): dest is Destination {
  if (typeof dest !== 'object' || dest === null) return false

  const d = dest as any
  const validTypes = ['landmark', 'city', 'heritage-site', 'natural-wonder', 'cultural-space']
  const validCategories: ContentCategory[] = [
    'mainstream',
    'hidden-gem',
    'culinary',
    'living-heritage',
    'adventure',
    'spiritual',
    'urban',
  ]

  const isValid =
    typeof d.id === 'string' &&
    d.id.length > 0 &&
    typeof d.name === 'string' &&
    d.name.length > 0 &&
    validTypes.includes(d.type) &&
    validateGeoPoint(d.coordinates) &&
    typeof d.districtId === 'string' &&
    d.districtId.length > 0 &&
    typeof d.stateId === 'string' &&
    d.stateId.length > 0 &&
    typeof d.sensoryDescription === 'object' &&
    d.sensoryDescription !== null &&
    typeof d.sensoryDescription.visual === 'string' &&
    typeof d.sensoryDescription.auditory === 'string' &&
    typeof d.sensoryDescription.olfactory === 'string' &&
    typeof d.sensoryDescription.tactile === 'string' &&
    validateCulturalContext(d.cultural) &&
    Array.isArray(d.audioClips) &&
    d.audioClips.every((clip: any) => validateAudioClip(clip)) &&
    Array.isArray(d.weatherVariants) &&
    d.weatherVariants.every((wv: any) => validateWeatherVariant(wv)) &&
    Array.isArray(d.categories) &&
    d.categories.length > 0 &&
    d.categories.every((cat: any) => validCategories.includes(cat)) &&
    validateCulturalPulse(d.culturalPulse)

  return isValid
}

/**
 * Validate district
 */
export function validateDistrict(dist: unknown): dist is District {
  if (typeof dist !== 'object' || dist === null) return false

  const d = dist as any
  const validCategories: ContentCategory[] = [
    'mainstream',
    'hidden-gem',
    'culinary',
    'living-heritage',
    'adventure',
    'spiritual',
    'urban',
  ]

  return (
    typeof d.id === 'string' &&
    d.id.length > 0 &&
    typeof d.name === 'string' &&
    d.name.length > 0 &&
    typeof d.stateId === 'string' &&
    d.stateId.length > 0 &&
    validateGeoPoint(d.centroid) &&
    typeof d.sensoryDescription === 'string' &&
    validateCulturalContext(d.cultural) &&
    Array.isArray(d.categories) &&
    d.categories.every((cat: any) => validCategories.includes(cat)) &&
    Array.isArray(d.destinationIds) &&
    validateCulturalPulse(d.culturalPulse)
  )
}

/**
 * Validate state
 */
export function validateState(state: unknown): state is State {
  if (typeof state !== 'object' || state === null) return false

  const s = state as any
  const validTypes = ['state', 'union-territory']
  const validCategories: ContentCategory[] = [
    'mainstream',
    'hidden-gem',
    'culinary',
    'living-heritage',
    'adventure',
    'spiritual',
    'urban',
  ]

  return (
    typeof s.id === 'string' &&
    s.id.length > 0 &&
    typeof s.name === 'string' &&
    s.name.length > 0 &&
    typeof s.code === 'string' &&
    s.code.length === 2 &&
    validTypes.includes(s.type) &&
    validateGeoPoint(s.centroid) &&
    typeof s.sensoryDescription === 'string' &&
    validateCulturalContext(s.cultural) &&
    Array.isArray(s.primaryLanguages) &&
    s.primaryLanguages.length > 0 &&
    Array.isArray(s.categories) &&
    s.categories.every((cat: any) => validCategories.includes(cat)) &&
    Array.isArray(s.districtIds) &&
    validateCulturalPulse(s.culturalPulse)
  )
}

/**
 * Get validation errors for a destination
 */
export function getDestinationValidationErrors(dest: unknown): string[] {
  const errors: string[] = []

  if (typeof dest !== 'object' || dest === null) {
    errors.push('Destination must be an object')
    return errors
  }

  const d = dest as any

  // ID validation
  if (typeof d.id !== 'string' || d.id.length === 0) {
    errors.push('ID must be a non-empty string')
  }

  // Name validation
  if (typeof d.name !== 'string' || d.name.length === 0) {
    errors.push('Name must be a non-empty string')
  }

  // Type validation
  const validTypes = ['landmark', 'city', 'heritage-site', 'natural-wonder', 'cultural-space']
  if (!validTypes.includes(d.type)) {
    errors.push(`Type must be one of: ${validTypes.join(', ')}`)
  }

  // Coordinates validation
  if (!validateGeoPoint(d.coordinates)) {
    errors.push('Coordinates must be a valid [longitude, latitude] pair')
  }

  // References validation
  if (typeof d.districtId !== 'string' || d.districtId.length === 0) {
    errors.push('District ID must be a non-empty string')
  }

  if (typeof d.stateId !== 'string' || d.stateId.length === 0) {
    errors.push('State ID must be a non-empty string')
  }

  // Sensory description validation
  if (typeof d.sensoryDescription !== 'object' || d.sensoryDescription === null) {
    errors.push('Sensory description must be an object')
  } else {
    const required = ['visual', 'auditory', 'olfactory', 'tactile']
    required.forEach((field) => {
      if (typeof d.sensoryDescription[field] !== 'string') {
        errors.push(`Sensory description.${field} must be a string`)
      }
    })
  }

  // Cultural context validation
  if (!validateCulturalContext(d.cultural)) {
    errors.push('Cultural context is invalid')
  }

  // Audio clips validation
  if (!Array.isArray(d.audioClips)) {
    errors.push('Audio clips must be an array')
  } else if (d.audioClips.length > 0 && !d.audioClips.every((clip: any) => validateAudioClip(clip))) {
    errors.push('One or more audio clips are invalid')
  }

  // Weather variants validation
  if (!Array.isArray(d.weatherVariants)) {
    errors.push('Weather variants must be an array')
  } else if (d.weatherVariants.length > 0 && !d.weatherVariants.every((wv: any) => validateWeatherVariant(wv))) {
    errors.push('One or more weather variants are invalid')
  }

  // Categories validation
  const validCategories: ContentCategory[] = [
    'mainstream',
    'hidden-gem',
    'culinary',
    'living-heritage',
    'adventure',
    'spiritual',
    'urban',
  ]
  if (!Array.isArray(d.categories) || d.categories.length === 0) {
    errors.push('Categories must be a non-empty array')
  } else if (!d.categories.every((cat: any) => validCategories.includes(cat))) {
    errors.push(
      `Categories must only contain: ${validCategories.join(', ')}`
    )
  }

  // Cultural pulse validation
  if (!validateCulturalPulse(d.culturalPulse)) {
    errors.push('Cultural pulse configuration is invalid')
  }

  return errors
}

/**
 * Get validation errors for a district
 */
export function getDistrictValidationErrors(dist: unknown): string[] {
  const errors: string[] = []

  if (typeof dist !== 'object' || dist === null) {
    errors.push('District must be an object')
    return errors
  }

  const d = dist as any

  if (typeof d.id !== 'string' || d.id.length === 0) {
    errors.push('ID must be a non-empty string')
  }

  if (typeof d.name !== 'string' || d.name.length === 0) {
    errors.push('Name must be a non-empty string')
  }

  if (typeof d.stateId !== 'string' || d.stateId.length === 0) {
    errors.push('State ID must be a non-empty string')
  }

  if (!validateGeoPoint(d.centroid)) {
    errors.push('Centroid must be a valid [longitude, latitude] pair')
  }

  if (typeof d.sensoryDescription !== 'string' || d.sensoryDescription.length === 0) {
    errors.push('Sensory description must be a non-empty string')
  }

  if (!validateCulturalContext(d.cultural)) {
    errors.push('Cultural context is invalid')
  }

  if (!validateCulturalPulse(d.culturalPulse)) {
    errors.push('Cultural pulse configuration is invalid')
  }

  return errors
}

/**
 * Get validation errors for a state
 */
export function getStateValidationErrors(state: unknown): string[] {
  const errors: string[] = []

  if (typeof state !== 'object' || state === null) {
    errors.push('State must be an object')
    return errors
  }

  const s = state as any
  const validTypes = ['state', 'union-territory']

  if (typeof s.id !== 'string' || s.id.length === 0) {
    errors.push('ID must be a non-empty string')
  }

  if (typeof s.name !== 'string' || s.name.length === 0) {
    errors.push('Name must be a non-empty string')
  }

  if (typeof s.code !== 'string' || s.code.length !== 2) {
    errors.push('Code must be a 2-character string')
  }

  if (!validTypes.includes(s.type)) {
    errors.push(`Type must be one of: ${validTypes.join(', ')}`)
  }

  if (!validateGeoPoint(s.centroid)) {
    errors.push('Centroid must be a valid [longitude, latitude] pair')
  }

  if (typeof s.sensoryDescription !== 'string' || s.sensoryDescription.length === 0) {
    errors.push('Sensory description must be a non-empty string')
  }

  if (!validateCulturalContext(s.cultural)) {
    errors.push('Cultural context is invalid')
  }

  if (!validateCulturalPulse(s.culturalPulse)) {
    errors.push('Cultural pulse configuration is invalid')
  }

  return errors
}
