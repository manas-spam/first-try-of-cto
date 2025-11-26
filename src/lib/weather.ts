/**
 * Weather Service Utilities
 * Real-time weather data fetching and seasonal variations
 */

import type { GeoPoint, WeatherVariant } from '@/data/types'

export interface WeatherData {
  temperature: number // Celsius
  humidity: number // 0-100
  condition: WeatherCondition
  windSpeed: number // km/h
  cloudCover: number // 0-100
  visibility: number // km
  uvIndex: number
}

export type WeatherCondition = 
  | 'clear'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'foggy'
  | 'snowy'

export interface SeasonalWeather {
  season: 'summer' | 'monsoon' | 'winter'
  temperatureRange: [number, number]
  humidity: number
  condition: WeatherCondition
  description: string
}

/**
 * Mock weather data - In production, integrate with real API
 * Examples: OpenWeather, WeatherAPI, etc.
 */
export async function fetchWeatherData(coordinates: GeoPoint): Promise<WeatherData> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Return mock data based on coordinates for demonstration
  const [lng, lat] = coordinates
  
  return {
    temperature: 25 + Math.sin(lng / 20) * 10,
    humidity: 60 + Math.cos(lat / 20) * 20,
    condition: getRandomWeatherCondition(),
    windSpeed: 10 + Math.random() * 20,
    cloudCover: Math.random() * 100,
    visibility: 10,
    uvIndex: Math.random() * 11,
  }
}

/**
 * Get seasonal weather pattern
 */
export function getSeasonalWeather(date: Date = new Date()): SeasonalWeather {
  const month = date.getMonth() + 1 // 1-12
  
  let season: 'summer' | 'monsoon' | 'winter'
  
  if (month >= 3 && month <= 5) {
    season = 'summer'
  } else if (month >= 6 && month <= 9) {
    season = 'monsoon'
  } else {
    season = 'winter'
  }
  
  const seasonalData: Record<string, SeasonalWeather> = {
    summer: {
      season: 'summer',
      temperatureRange: [35, 45],
      humidity: 40,
      condition: 'clear',
      description: 'Hot and dry with clear skies, occasional heat waves',
    },
    monsoon: {
      season: 'monsoon',
      temperatureRange: [25, 35],
      humidity: 80,
      condition: 'rainy',
      description: 'Wet and humid with frequent rains and dramatic clouds',
    },
    winter: {
      season: 'winter',
      temperatureRange: [10, 25],
      humidity: 60,
      condition: 'cloudy',
      description: 'Cool and pleasant with occasional fog',
    },
  }
  
  return seasonalData[season]
}

/**
 * Get appropriate weather overlay for canvas
 */
export function getWeatherOverlay(condition: WeatherCondition): {
  assetId: string
  blendMode: 'multiply' | 'screen' | 'overlay' | 'lighten' | 'darken'
  opacity: number
  description: string
} {
  const overlays: Record<WeatherCondition, any> = {
    clear: {
      assetId: 'weather-clear',
      blendMode: 'screen' as const,
      opacity: 0.0,
      description: 'Clear skies',
    },
    cloudy: {
      assetId: 'weather-clouds',
      blendMode: 'overlay' as const,
      opacity: 0.3,
      description: 'Scattered clouds',
    },
    rainy: {
      assetId: 'weather-rain',
      blendMode: 'multiply' as const,
      opacity: 0.4,
      description: 'Rainy weather',
    },
    stormy: {
      assetId: 'weather-storm',
      blendMode: 'darken' as const,
      opacity: 0.6,
      description: 'Stormy conditions',
    },
    foggy: {
      assetId: 'weather-fog',
      blendMode: 'lighten' as const,
      opacity: 0.5,
      description: 'Foggy conditions',
    },
    snowy: {
      assetId: 'weather-snow',
      blendMode: 'screen' as const,
      opacity: 0.7,
      description: 'Snowy conditions',
    },
  }
  
  return overlays[condition] || overlays.clear
}

/**
 * Match best weather variant for current conditions
 */
export function matchWeatherVariant(
  variants: WeatherVariant[],
  currentWeather: WeatherData | SeasonalWeather
): WeatherVariant {
  // Prioritize by season if available
  if ('season' in currentWeather) {
    const seasonMatch = variants.find(v => v.season === currentWeather.season)
    if (seasonMatch) return seasonMatch
  }
  
  // Fallback to first variant
  return variants[0]
}

/**
 * Get random weather condition for demo
 */
function getRandomWeatherCondition(): WeatherCondition {
  const conditions: WeatherCondition[] = ['clear', 'cloudy', 'rainy', 'stormy', 'foggy']
  return conditions[Math.floor(Math.random() * conditions.length)]
}

/**
 * Format weather display text
 */
export function formatWeatherDisplay(weather: WeatherData | SeasonalWeather): string {
  if ('temperature' in weather) {
    return `${weather.temperature.toFixed(0)}°C, ${weather.humidity}% humidity`
  }
  
  const [min, max] = weather.temperatureRange
  return `${min}–${max}°C, ${weather.humidity}% humidity`
}
