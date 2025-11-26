'use client'

import { useEffect, useState, useCallback } from 'react'
import { fetchWeatherData, getSeasonalWeather, type WeatherData } from '@/lib/weather'
import type { GeoPoint } from '@/data/types'

/**
 * Hook for fetching and managing weather data
 */
export function useWeather(coordinates: GeoPoint, _season?: 'summer' | 'monsoon' | 'winter') {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchWeatherData(coordinates)
      setWeather(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }, [coordinates])

  useEffect(() => {
    void fetch()
  }, [fetch, refreshKey])

  const refresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  return {
    weather,
    loading,
    error,
    refresh,
  }
}

/**
 * Hook for seasonal weather patterns
 */
export function useSeasonalWeather(season?: 'summer' | 'monsoon' | 'winter') {
  const [seasonalWeather, setSeasonalWeather] = useState(() => getSeasonalWeather())
  const [selectedSeason, setSelectedSeason] = useState(season)

  useEffect(() => {
    if (selectedSeason) {
      // Create a date in the appropriate season
      const seasonMonths: Record<string, number> = {
        summer: 4,
        monsoon: 7,
        winter: 1,
      }
      
      const date = new Date()
      date.setMonth(seasonMonths[selectedSeason] - 1)
      setSeasonalWeather(getSeasonalWeather(date))
    }
  }, [selectedSeason])

  return {
    seasonalWeather,
    selectedSeason,
    setSelectedSeason,
  }
}
