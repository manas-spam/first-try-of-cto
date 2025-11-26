/**
 * Atlas Data Utilities
 * Functions for fetching, filtering, and processing atlas data
 */

import type {
  State,
  District,
  Destination,
  GeoPoint,
  DataQueryFilter,
  PaginatedResponse,
} from './types'
import { atlasData } from './atlas'

/**
 * Calculate distance between two geographic points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRad(point2[1] - point1[1])
  const dLng = toRad(point2[0] - point1[0])
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1[1])) *
      Math.cos(toRad(point2[1])) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Get all states with optional filter
 */
export function getAllStates(filter?: { type?: 'state' | 'union-territory' }): State[] {
  return Object.values(atlasData.states).filter(
    (state) => !filter?.type || state.type === filter.type
  )
}

/**
 * Get state by ID
 */
export function getStateById(stateId: string): State | null {
  return atlasData.states[stateId] || null
}

/**
 * Get state by name (case-insensitive)
 */
export function getStateByName(name: string): State | null {
  const state = Object.values(atlasData.states).find(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  )
  return state || null
}

/**
 * Get all districts
 */
export function getAllDistricts(): District[] {
  return Object.values(atlasData.districts)
}

/**
 * Get districts by state ID
 */
export function getDistrictsByStateId(stateId: string): District[] {
  const state = getStateById(stateId)
  if (!state) return []
  return state.districtIds.map((id) => atlasData.districts[id]).filter(Boolean)
}

/**
 * Get district by ID
 */
export function getDistrictById(districtId: string): District | null {
  return atlasData.districts[districtId] || null
}

/**
 * Get district by name (case-insensitive)
 */
export function getDistrictByName(name: string): District | null {
  const district = Object.values(atlasData.districts).find(
    (d) => d.name.toLowerCase() === name.toLowerCase()
  )
  return district || null
}

/**
 * Get all destinations
 */
export function getAllDestinations(): Destination[] {
  return Object.values(atlasData.destinations)
}

/**
 * Get destination by ID
 */
export function getDestinationById(destinationId: string): Destination | null {
  return atlasData.destinations[destinationId] || null
}

/**
 * Get destinations by district ID
 */
export function getDestinationsByDistrictId(districtId: string): Destination[] {
  const district = getDistrictById(districtId)
  if (!district) return []
  return district.destinationIds
    .map((id) => atlasData.destinations[id])
    .filter(Boolean)
}

/**
 * Get destinations by state ID
 */
export function getDestinationsByStateId(stateId: string): Destination[] {
  const districts = getDistrictsByStateId(stateId)
  const destinationIds = new Set<string>()
  districts.forEach((district) => {
    district.destinationIds.forEach((id) => destinationIds.add(id))
  })
  return Array.from(destinationIds).map((id) => atlasData.destinations[id])
}

/**
 * Get destinations within a radius of coordinates
 */
export function getDestinationsNearby(
  center: GeoPoint,
  radiusKm: number
): Destination[] {
  return getAllDestinations().filter((destination) => {
    const distance = calculateDistance(center, destination.coordinates)
    return distance <= radiusKm
  })
}

/**
 * Get destinations by category
 */
export function getDestinationsByCategory(category: string): Destination[] {
  return getAllDestinations().filter((destination) =>
    destination.categories.includes(category as any)
  )
}

/**
 * Search destinations by name or description (case-insensitive)
 */
export function searchDestinations(query: string): Destination[] {
  const lowerQuery = query.toLowerCase()
  return getAllDestinations().filter(
    (destination) =>
      destination.name.toLowerCase().includes(lowerQuery) ||
      destination.sensoryDescription.visual.toLowerCase().includes(lowerQuery) ||
      destination.cultural.historicalAnecdote.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Apply complex filters to destinations with pagination
 */
export function filterDestinations(
  filter: DataQueryFilter,
  page: number = 1,
  pageSize: number = 10
): PaginatedResponse<Destination> {
  let results = getAllDestinations()

  // Filter by state
  if (filter.stateId) {
    results = results.filter((d) => d.stateId === filter.stateId)
  }

  // Filter by district
  if (filter.districtId) {
    results = results.filter((d) => d.districtId === filter.districtId)
  }

  // Filter by categories
  if (filter.categories && filter.categories.length > 0) {
    results = results.filter((d) =>
      filter.categories!.some((cat) => d.categories.includes(cat))
    )
  }

  // Filter by search query
  if (filter.searchQuery) {
    results = searchDestinations(filter.searchQuery)
  }

  // Filter by geographic proximity
  if (filter.coordinates) {
    results = results.filter((d) => {
      const distance = calculateDistance(filter.coordinates!.center, d.coordinates)
      return distance <= filter.coordinates!.radiusKm
    })
  }

  // Filter by weather season
  if (filter.weatherSeason) {
    results = results.filter((d) =>
      d.weatherVariants.some((w) => w.season === filter.weatherSeason)
    )
  }

  // Apply pagination
  const total = results.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const data = results.slice(startIndex, endIndex)

  return {
    data,
    total,
    page,
    pageSize,
    hasMore: endIndex < total,
  }
}

/**
 * Get related destinations (same category or nearby)
 */
export function getRelatedDestinations(
  destinationId: string,
  limit: number = 5
): Destination[] {
  const destination = getDestinationById(destinationId)
  if (!destination) return []

  const related = getAllDestinations()
    .filter((d) => d.id !== destinationId)
    .map((d) => {
      let score = 0

      // Same district - highest score
      if (d.districtId === destination.districtId) score += 10

      // Same state
      if (d.stateId === destination.stateId) score += 5

      // Shared categories
      const sharedCategories = d.categories.filter((cat) =>
        destination.categories.includes(cat)
      ).length
      score += sharedCategories * 3

      // Geographic proximity
      const distance = calculateDistance(destination.coordinates, d.coordinates)
      if (distance < 50) score += 2
      if (distance < 200) score += 1

      return { destination: d, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.destination)

  return related
}

/**
 * Sort destinations by distance from a point
 */
export function sortDestinationsByDistance(
  destinations: Destination[],
  center: GeoPoint
): Destination[] {
  return [...destinations].sort((a, b) => {
    const distanceA = calculateDistance(center, a.coordinates)
    const distanceB = calculateDistance(center, b.coordinates)
    return distanceA - distanceB
  })
}

/**
 * Get all unique categories across destinations
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>()
  getAllDestinations().forEach((destination) => {
    destination.categories.forEach((cat) => categories.add(cat))
  })
  return Array.from(categories).sort()
}

/**
 * Get statistics about the atlas data
 */
export function getAtlasStatistics() {
  const states = Object.values(atlasData.states)
  const districts = Object.values(atlasData.districts)
  const destinations = Object.values(atlasData.destinations)

  const statesByType = {
    states: states.filter((s) => s.type === 'state').length,
    unionTerritories: states.filter((s) => s.type === 'union-territory').length,
  }

  const totalPopulation = states.reduce((sum, s) => sum + (s.population || 0), 0)
  const totalArea = states.reduce((sum, s) => sum + (s.area || 0), 0)

  return {
    totalStates: states.length,
    ...statesByType,
    totalDistricts: districts.length,
    totalDestinations: destinations.length,
    totalPopulation,
    totalArea,
    categories: getAllCategories(),
    version: atlasData.version,
    lastUpdated: atlasData.lastUpdated,
  }
}

/**
 * Progressive data loading - load states first, then districts, then destinations
 */
export async function progressiveLoadAtlasData(
  onProgress?: (progress: { stage: string; loaded: number; total: number }) => void
) {
  const stages = [
    { name: 'states', data: getAllStates() },
    { name: 'districts', data: getAllDistricts() },
    { name: 'destinations', data: getAllDestinations() },
  ]

  let loadedCount = 0
  const totalCount = stages.reduce((sum, stage) => sum + stage.data.length, 0)

  const result = {
    states: stages[0].data,
    districts: stages[1].data,
    destinations: stages[2].data,
  }

  // Simulate progressive loading with callbacks
  for (const stage of stages) {
    loadedCount += stage.data.length
    if (onProgress) {
      onProgress({
        stage: stage.name,
        loaded: loadedCount,
        total: totalCount,
      })
    }
  }

  return result
}

/**
 * Get export data for a specific state (useful for detailed views)
 */
export function getStateDetailedData(stateId: string) {
  const state = getStateById(stateId)
  if (!state) return null

  const districts = getDistrictsByStateId(stateId)
  const destinations = getDestinationsByStateId(stateId)

  return {
    state,
    districts,
    destinations,
    summary: {
      totalDistricts: districts.length,
      totalDestinations: destinations.length,
      population: state.population,
      area: state.area,
    },
  }
}

/**
 * Validate if a destination is complete (all required fields present)
 */
export function validateDestination(destination: Destination): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!destination.id) errors.push('Missing id')
  if (!destination.name) errors.push('Missing name')
  if (!destination.coordinates || destination.coordinates.length !== 2)
    errors.push('Invalid coordinates')
  if (!destination.districtId) errors.push('Missing districtId')
  if (!destination.stateId) errors.push('Missing stateId')
  if (!destination.sensoryDescription) errors.push('Missing sensoryDescription')
  if (!destination.cultural) errors.push('Missing cultural context')
  if (!destination.categories || destination.categories.length === 0)
    errors.push('Missing categories')

  return {
    isValid: errors.length === 0,
    errors,
  }
}
