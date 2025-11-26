import {
  calculateHaversineDistance,
  calculateBearing,
  getCardinalDirection,
  formatDistance,
  formatBearing,
} from '../geospatial'

describe('Geospatial Utilities', () => {
  describe('calculateHaversineDistance', () => {
    it('should calculate distance between two points', () => {
      // Delhi to Jaipur (approx 240 km)
      const delhi: [number, number] = [77.2025, 28.7041]
      const jaipur: [number, number] = [75.8245, 26.9124]
      
      const distance = calculateHaversineDistance(delhi, jaipur)
      
      // Should be approximately 240 km (allow 10% tolerance)
      expect(distance).toBeGreaterThan(215)
      expect(distance).toBeLessThan(265)
    })

    it('should return 0 for same points', () => {
      const point: [number, number] = [77.2025, 28.7041]
      const distance = calculateHaversineDistance(point, point)
      
      expect(distance).toBeLessThan(0.01)
    })

    it('should handle equatorial distances', () => {
      const point1: [number, number] = [0, 0]
      const point2: [number, number] = [1, 0]
      
      const distance = calculateHaversineDistance(point1, point2)
      
      // Approximately 111 km per degree of longitude at equator
      expect(distance).toBeGreaterThan(100)
      expect(distance).toBeLessThan(120)
    })
  })

  describe('calculateBearing', () => {
    it('should calculate bearing from point1 to point2', () => {
      const from: [number, number] = [0, 0]
      const to: [number, number] = [0, 1] // Due north
      
      const bearing = calculateBearing(from, to)
      
      // Should be close to 0° (north)
      expect(Math.abs(bearing) < 10 || Math.abs(bearing - 360) < 10).toBe(true)
    })

    it('should calculate bearing to east', () => {
      const from: [number, number] = [0, 0]
      const to: [number, number] = [1, 0] // Due east
      
      const bearing = calculateBearing(from, to)
      
      // Should be close to 90° (east)
      expect(bearing).toBeGreaterThan(80)
      expect(bearing).toBeLessThan(100)
    })

    it('should return value between 0 and 360', () => {
      const from: [number, number] = [77.2025, 28.7041]
      const to: [number, number] = [75.8245, 26.9124]
      
      const bearing = calculateBearing(from, to)
      
      expect(bearing).toBeGreaterThanOrEqual(0)
      expect(bearing).toBeLessThan(360)
    })
  })

  describe('getCardinalDirection', () => {
    it('should return N for bearing 0', () => {
      const direction = getCardinalDirection(0)
      expect(direction).toBe('N')
    })

    it('should return E for bearing 90', () => {
      const direction = getCardinalDirection(90)
      expect(direction).toBe('E')
    })

    it('should return S for bearing 180', () => {
      const direction = getCardinalDirection(180)
      expect(direction).toBe('S')
    })

    it('should return W for bearing 270', () => {
      const direction = getCardinalDirection(270)
      expect(direction).toBe('W')
    })

    it('should return NE for bearing 45', () => {
      const direction = getCardinalDirection(45)
      expect(direction).toBe('NE')
    })

    it('should handle bearings > 360', () => {
      const direction = getCardinalDirection(450) // Same as 90
      expect(['E', 'ENE']).toContain(direction)
    })
  })

  describe('formatDistance', () => {
    it('should format meters correctly', () => {
      const formatted = formatDistance(0.5)
      expect(formatted).toBe('500m')
    })

    it('should format kilometers correctly', () => {
      const formatted = formatDistance(10.5)
      expect(formatted).toBe('10.5km')
    })

    it('should handle large distances', () => {
      const formatted = formatDistance(1000)
      expect(formatted).toBe('1000.0km')
    })
  })

  describe('formatBearing', () => {
    it('should format bearing with degree symbol', () => {
      const formatted = formatBearing(45.5)
      expect(formatted).toContain('46')
      expect(formatted).toContain('°')
    })

    it('should round to nearest degree', () => {
      const formatted = formatBearing(45.1)
      expect(formatted).toContain('45')
    })
  })
})
