/**
 * DestinationCompass Integration Tests
 * Tests for bearing and distance calculations
 */

import { calculateHaversineDistance, calculateBearing, formatDistance, formatBearing } from '@/lib/geospatial'

describe('DestinationCompass Integration', () => {
  describe('Compass Calculations', () => {
    it('should calculate bearing and distance to Delhi from Jaipur', () => {
      const jaipur: [number, number] = [75.8245, 26.9124]
      const delhi: [number, number] = [77.2025, 28.7041]

      const distance = calculateHaversineDistance(jaipur, delhi)
      const bearing = calculateBearing(jaipur, delhi)

      expect(distance).toBeGreaterThan(200)
      expect(distance).toBeLessThan(250)
      expect(bearing).toBeGreaterThanOrEqual(0)
      expect(bearing).toBeLessThan(360)
    })

    it('should format compass readings correctly', () => {
      const distance = 25.3
      const bearing = 45

      const formattedDistance = formatDistance(distance)
      const formattedBearing = formatBearing(bearing)

      expect(formattedDistance).toContain('km')
      expect(formattedBearing).toContain('°')
    })

    it('should calculate bearing between multiple destinations', () => {
      const destinations = [
        { name: 'Jaipur', coords: [75.8245, 26.9124] as [number, number] },
        { name: 'Agra', coords: [78.0081, 27.1767] as [number, number] },
        { name: 'Delhi', coords: [77.2025, 28.7041] as [number, number] },
      ]

      destinations.forEach((dest, idx) => {
        if (idx < destinations.length - 1) {
          const nextDest = destinations[idx + 1]
          const bearing = calculateBearing(dest.coords, nextDest.coords)
          expect(bearing).toBeGreaterThanOrEqual(0)
          expect(bearing).toBeLessThan(360)
        }
      })
    })

    it('should handle northward bearing calculation', () => {
      const point1: [number, number] = [77.2025, 28.7041] // Delhi
      const point2: [number, number] = [77.2025, 29.7041] // North of Delhi

      const bearing = calculateBearing(point1, point2)

      // Should be close to 0° (north)
      expect(bearing).toBeLessThan(10)
    })

    it('should handle southward bearing calculation', () => {
      const point1: [number, number] = [77.2025, 29.7041]
      const point2: [number, number] = [77.2025, 28.7041] // South

      const bearing = calculateBearing(point1, point2)

      // Should be close to 180° (south)
      expect(bearing).toBeGreaterThan(170)
      expect(bearing).toBeLessThan(190)
    })

    it('should handle eastward bearing calculation', () => {
      const point1: [number, number] = [77.2025, 28.7041]
      const point2: [number, number] = [78.2025, 28.7041] // East

      const bearing = calculateBearing(point1, point2)

      // Should be close to 90° (east)
      expect(bearing).toBeGreaterThan(80)
      expect(bearing).toBeLessThan(100)
    })

    it('should handle westward bearing calculation', () => {
      const point1: [number, number] = [78.2025, 28.7041]
      const point2: [number, number] = [77.2025, 28.7041] // West

      const bearing = calculateBearing(point1, point2)

      // Should be close to 270° (west)
      expect(bearing).toBeGreaterThan(260)
      expect(bearing).toBeLessThan(280)
    })
  })

  describe('Distance Formatting', () => {
    it('should format short distances in meters', () => {
      expect(formatDistance(0.5)).toBe('500m')
      expect(formatDistance(0.1)).toBe('100m')
      expect(formatDistance(0.999)).toBe('999m')
    })

    it('should format long distances in kilometers', () => {
      expect(formatDistance(1)).toBe('1.0km')
      expect(formatDistance(10.5)).toBe('10.5km')
      expect(formatDistance(100)).toBe('100.0km')
    })
  })

  describe('Bearing Formatting', () => {
    it('should format bearings with degree symbol', () => {
      expect(formatBearing(45)).toBe('45°')
      expect(formatBearing(90)).toBe('90°')
      expect(formatBearing(180)).toBe('180°')
      expect(formatBearing(270)).toBe('270°')
    })

    it('should format bearings with decimals', () => {
      expect(formatBearing(45.5)).toContain('°')
      expect(formatBearing(123.7)).toContain('°')
    })
  })
})
