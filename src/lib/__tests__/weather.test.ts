import {
  getSeasonalWeather,
  getWeatherOverlay,
  formatWeatherDisplay,
  type WeatherCondition,
} from '../weather'

describe('Weather Utilities', () => {
  describe('getSeasonalWeather', () => {
    it('should return summer season for May', () => {
      const may = new Date(2024, 4, 15) // May
      const weather = getSeasonalWeather(may)
      
      expect(weather.season).toBe('summer')
      expect(weather.temperatureRange[0]).toBeGreaterThan(30)
    })

    it('should return monsoon season for July', () => {
      const july = new Date(2024, 6, 15) // July
      const weather = getSeasonalWeather(july)
      
      expect(weather.season).toBe('monsoon')
      expect(weather.humidity).toBeGreaterThan(70)
    })

    it('should return winter season for January', () => {
      const january = new Date(2024, 0, 15) // January
      const weather = getSeasonalWeather(january)
      
      expect(weather.season).toBe('winter')
      expect(weather.temperatureRange[1]).toBeLessThan(30)
    })

    it('should have description for each season', () => {
      const seasons = ['summer', 'monsoon', 'winter'] as const
      
      seasons.forEach((season) => {
        const date = new Date()
        date.setMonth(season === 'summer' ? 4 : season === 'monsoon' ? 6 : 0)
        const weather = getSeasonalWeather(date)
        
        expect(weather.description).toBeTruthy()
        expect(weather.description.length).toBeGreaterThan(10)
      })
    })
  })

  describe('getWeatherOverlay', () => {
    it('should return overlay for clear condition', () => {
      const overlay = getWeatherOverlay('clear')
      
      expect(overlay.assetId).toBe('weather-clear')
      expect(overlay.blendMode).toBe('screen')
      expect(overlay.opacity).toBe(0)
    })

    it('should return overlay for rainy condition', () => {
      const overlay = getWeatherOverlay('rainy')
      
      expect(overlay.assetId).toBe('weather-rain')
      expect(overlay.blendMode).toBe('multiply')
      expect(overlay.opacity).toBeGreaterThan(0)
    })

    it('should have valid blend modes', () => {
      const conditions: WeatherCondition[] = [
        'clear',
        'cloudy',
        'rainy',
        'stormy',
        'foggy',
        'snowy',
      ]
      
      const validBlendModes = ['multiply', 'screen', 'overlay', 'lighten', 'darken']
      
      conditions.forEach((condition) => {
        const overlay = getWeatherOverlay(condition)
        expect(validBlendModes).toContain(overlay.blendMode)
      })
    })

    it('should have opacity between 0 and 1', () => {
      const conditions: WeatherCondition[] = [
        'clear',
        'cloudy',
        'rainy',
        'stormy',
        'foggy',
        'snowy',
      ]
      
      conditions.forEach((condition) => {
        const overlay = getWeatherOverlay(condition)
        expect(overlay.opacity).toBeGreaterThanOrEqual(0)
        expect(overlay.opacity).toBeLessThanOrEqual(1)
      })
    })
  })

  describe('formatWeatherDisplay', () => {
    it('should format seasonal weather correctly', () => {
      const july = new Date(2024, 6, 15)
      const weather = getSeasonalWeather(july)
      
      const formatted = formatWeatherDisplay(weather)
      
      expect(formatted).toContain('–')
      expect(formatted).toContain('°C')
      expect(formatted).toContain('%')
    })

    it('should include humidity in display', () => {
      const july = new Date(2024, 6, 15)
      const weather = getSeasonalWeather(july)
      
      const formatted = formatWeatherDisplay(weather)
      expect(formatted).toContain('humidity')
    })
  })
})
