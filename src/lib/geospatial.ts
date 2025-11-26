/**
 * Geospatial Utilities
 * Distance, bearing, and navigation calculations using haversine and other algorithms
 */

import type { GeoPoint } from '@/data/types'

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateHaversineDistance(point1: GeoPoint, point2: GeoPoint): number {
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
 * Calculate bearing from point1 to point2 in degrees (0-360)
 * North = 0°, East = 90°, South = 180°, West = 270°
 */
export function calculateBearing(point1: GeoPoint, point2: GeoPoint): number {
  const dLng = toRad(point2[0] - point1[0])
  const y = Math.sin(dLng) * Math.cos(toRad(point2[1]))
  const x =
    Math.cos(toRad(point1[1])) * Math.sin(toRad(point2[1])) -
    Math.sin(toRad(point1[1])) * Math.cos(toRad(point2[1])) * Math.cos(dLng)
  let bearing = Math.atan2(y, x)
  bearing = toDeg(bearing)
  bearing = (bearing + 360) % 360
  return bearing
}

/**
 * Get cardinal direction from bearing
 */
export function getCardinalDirection(bearing: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(bearing / 22.5) % 16
  return directions[index]
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Convert radians to degrees
 */
function toDeg(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * Format distance for display
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${(distanceKm * 1000).toFixed(0)}m`
  }
  return `${distanceKm.toFixed(1)}km`
}

/**
 * Format bearing for display
 */
export function formatBearing(bearing: number): string {
  return `${bearing.toFixed(0)}°`
}

/**
 * Get relative bearing description
 */
export function getBearingDescription(bearing: number): string {
  const direction = getCardinalDirection(bearing)
  const normalized = (bearing + 360) % 360
  return `${direction} (${normalized.toFixed(0)}°)`
}
