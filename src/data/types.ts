/**
 * Atlas Data Schema Types
 * Defines the structure for Indian states, union territories, districts, and destinations
 * with rich sensory, historical, and geospatial information
 */

/**
 * Geospatial coordinate point [longitude, latitude]
 * Following GeoJSON convention
 */
export type GeoPoint = [number, number]

/**
 * Polygon coordinates for district boundaries
 * Array of coordinate rings (first is outer boundary, rest are holes)
 */
export type GeoPolygon = GeoPoint[][]

/**
 * Audio clip metadata for sensory experience
 */
export interface AudioClip {
  id: string
  title: string
  description: string
  url: string
  speaker: string
  language: 'en' | 'hi' | 'ta' | 'te' | 'ka' | 'ml' | 'mr' | 'gu' | 'pa' | 'bn' | 'or' | 'as'
  duration: number // in seconds
  category: 'narration' | 'ambient-sound' | 'music' | 'interview'
}

/**
 * Weather variant with seasonal asset references
 */
export interface WeatherVariant {
  season: 'summer' | 'monsoon' | 'winter'
  assetId: string // Reference to texture/image assets
  temperatureRange: [number, number] // [min, max] in Celsius
  humidity: number // 0-100
  description: string
}

/**
 * Category tags for content classification
 */
export type ContentCategory = 'mainstream' | 'hidden-gem' | 'culinary' | 'living-heritage' | 'adventure' | 'spiritual' | 'urban'

/**
 * Cultural pulse configuration for visual/audio effects
 */
export interface CulturalPulse {
  pattern: 'rhythmic' | 'organic' | 'geometric' | 'fluid'
  color: string // Hex color code
  tempo: number // BPM
  intensity: number // 0-100
  description: string
}

/**
 * Historical and cultural information
 */
export interface CulturalContext {
  historicalAnecdote: string
  proverb: string
  culturalSignificance: string
  festivals: string[]
}

/**
 * Destination point of interest with comprehensive metadata
 */
export interface Destination {
  id: string
  name: string
  type: 'landmark' | 'city' | 'heritage-site' | 'natural-wonder' | 'cultural-space'
  coordinates: GeoPoint // [longitude, latitude]
  districtId: string
  stateId: string
  
  // Sensory and descriptive information
  sensoryDescription: {
    visual: string
    auditory: string
    olfactory: string
    gustatory?: string
    tactile: string
  }
  
  // Cultural information
  cultural: CulturalContext
  
  // Audio and media
  audioClips: AudioClip[]
  
  // Weather variants
  weatherVariants: WeatherVariant[]
  
  // Categorization
  categories: ContentCategory[]
  
  // Cultural pulse for immersive effects
  culturalPulse: CulturalPulse
  
  // Additional metadata
  elevation?: number // in meters
  population?: number
  bestVisitedDuring?: string // seasons/months
  accessibilityNotes?: string
  estimatedVisitDuration?: string // e.g., "2-3 hours"
}

/**
 * District administrative division with multiple destinations
 */
export interface District {
  id: string
  name: string
  stateId: string
  
  // Geospatial data
  centroid: GeoPoint // [longitude, latitude]
  boundary?: GeoPolygon // Complete boundary polygon
  markers?: GeoPoint[] // Key location markers
  
  // Population and area
  population?: number
  area?: number // in square kilometers
  
  // District-level sensory and cultural context
  sensoryDescription: string
  cultural: CulturalContext
  
  // Category tags
  categories: ContentCategory[]
  
  // Destinations in this district
  destinationIds: string[]
  
  // Cultural pulse
  culturalPulse: CulturalPulse
}

/**
 * State/Union Territory with districts and statewide information
 */
export interface State {
  id: string
  name: string
  code: string // 2-letter state code (e.g., 'UT' for Uttar Pradesh)
  type: 'state' | 'union-territory'
  
  // Geospatial data
  centroid: GeoPoint // [longitude, latitude]
  boundary?: GeoPolygon // Complete boundary polygon
  
  // Population and area
  population?: number
  area?: number // in square kilometers
  
  // State-level sensory and cultural context
  sensoryDescription: string
  cultural: CulturalContext
  
  // Language
  primaryLanguages: string[]
  
  // Category tags
  categories: ContentCategory[]
  
  // Districts in this state
  districtIds: string[]
  
  // Cultural pulse
  culturalPulse: CulturalPulse
  
  // Capital city
  capital?: string
}

/**
 * Complete atlas data structure
 */
export interface AtlasData {
  version: string
  lastUpdated: string
  states: Record<string, State>
  districts: Record<string, District>
  destinations: Record<string, Destination>
}

/**
 * Query filter options for fetching data
 */
export interface DataQueryFilter {
  stateId?: string
  districtId?: string
  categories?: ContentCategory[]
  searchQuery?: string
  coordinates?: {
    center: GeoPoint
    radiusKm: number
  }
  weatherSeason?: 'summer' | 'monsoon' | 'winter'
}

/**
 * Response format for paginated data
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
