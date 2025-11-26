'use client'

import { useEffect, useState, useCallback } from 'react'
import { calculateBearing, getCardinalDirection } from '@/lib/geospatial'
import type { GeoPoint } from '@/data/types'

export interface CompassData {
  bearing: number // 0-360 degrees
  distance: number // kilometers
  direction: string // Cardinal direction (N, NE, etc)
  isCalculated: boolean
}

/**
 * Hook for calculating bearing and distance to a destination
 * from user's current location
 */
export function useCompass(destinationCoordinates: GeoPoint, userLocation?: [number, number] | null) {
  const [compassData, setCompassData] = useState<CompassData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculate = useCallback((userCoords: [number, number]) => {
    setLoading(true)
    setError(null)

    try {
      const bearing = calculateBearing(userCoords, destinationCoordinates)
      const direction = getCardinalDirection(bearing)

      // Calculate distance (using haversine)
      const R = 6371 // Earth's radius in km
      const dLat = toRad(destinationCoordinates[1] - userCoords[1])
      const dLng = toRad(destinationCoordinates[0] - userCoords[0])
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(userCoords[1])) *
          Math.cos(toRad(destinationCoordinates[1])) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const distance = R * c

      setCompassData({
        bearing,
        distance,
        direction,
        isCalculated: true,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate compass data')
      setCompassData(null)
    } finally {
      setLoading(false)
    }
  }, [destinationCoordinates])

  useEffect(() => {
    if (userLocation) {
      calculate(userLocation)
    }
  }, [userLocation, calculate])

  return { compassData, loading, error, calculate }
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180
}
