'use client'

import { useCallback, useState, useEffect } from 'react'
import type {
  State,
  District,
  Destination,
  DataQueryFilter,
  PaginatedResponse,
  GeoPoint,
} from '@/data/types'
import {
  getAllStates,
  getStateById,
  getAllDistricts,
  getDistrictsByStateId,
  getDistrictById,
  getAllDestinations,
  getDestinationById,
  getDestinationsByStateId,
  getDestinationsByDistrictId,
  getDestinationsNearby,
  filterDestinations,
  getRelatedDestinations,
  searchDestinations,
  sortDestinationsByDistance,
  getAtlasStatistics,
  progressiveLoadAtlasData,
} from '@/data/utils'

/**
 * Hook for accessing atlas states
 */
export function useStates() {
  const [states, setStates] = useState<State[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const data = getAllStates()
    setStates(data)
    setLoading(false)
  }, [])

  const getById = useCallback((stateId: string) => getStateById(stateId), [])

  return { states, loading, getById }
}

/**
 * Hook for accessing districts
 */
export function useDistricts(stateId?: string) {
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const data = stateId ? getDistrictsByStateId(stateId) : getAllDistricts()
    setDistricts(data)
    setLoading(false)
  }, [stateId])

  const getById = useCallback((districtId: string) => getDistrictById(districtId), [])

  return { districts, loading, getById }
}

/**
 * Hook for accessing destinations with advanced filtering
 */
export function useDestinations(filter?: DataQueryFilter, page: number = 1) {
  const [result, setResult] = useState<PaginatedResponse<Destination> | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const pageSize = 10
    const data = filter ? filterDestinations(filter, page, pageSize) : getAllDestinations()

    if (Array.isArray(data)) {
      setResult({
        data,
        total: data.length,
        page: 1,
        pageSize: data.length,
        hasMore: false,
      })
    } else {
      setResult(data)
    }
    setLoading(false)
  }, [filter, page])

  return { destinations: result?.data || [], total: result?.total || 0, hasMore: result?.hasMore || false, loading }
}

/**
 * Hook for accessing a single destination with related data
 */
export function useDestination(destinationId: string) {
  const [destination, setDestination] = useState<Destination | null>(null)
  const [related, setRelated] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const dest = getDestinationById(destinationId)
    setDestination(dest)

    if (dest) {
      const relatedDests = getRelatedDestinations(destinationId)
      setRelated(relatedDests)
    }
    setLoading(false)
  }, [destinationId])

  return { destination, related, loading }
}

/**
 * Hook for searching destinations
 */
export function useSearchDestinations(query: string) {
  const [results, setResults] = useState<Destination[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    const searchResults = searchDestinations(query)
    setResults(searchResults)
    setLoading(false)
  }, [query])

  return { results, loading }
}

/**
 * Hook for finding nearby destinations
 */
export function useNearbyDestinations(center: GeoPoint, radiusKm: number = 50) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const nearby = getDestinationsNearby(center, radiusKm)
    const sorted = sortDestinationsByDistance(nearby, center)
    setDestinations(sorted)
    setLoading(false)
  }, [center, radiusKm])

  return { destinations, loading }
}

/**
 * Hook for getting destinations in a state
 */
export function useStateDestinations(stateId: string) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const data = getDestinationsByStateId(stateId)
    setDestinations(data)
    setLoading(false)
  }, [stateId])

  return { destinations, loading }
}

/**
 * Hook for getting destinations in a district
 */
export function useDistrictDestinations(districtId: string) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const data = getDestinationsByDistrictId(districtId)
    setDestinations(data)
    setLoading(false)
  }, [districtId])

  return { destinations, loading }
}

/**
 * Hook for progressive atlas data loading
 */
export function useProgressiveAtlasLoading() {
  const [states, setStates] = useState<State[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [progress, setProgress] = useState({
    stage: '',
    loaded: 0,
    total: 0,
    percentComplete: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    void progressiveLoadAtlasData((progressData) => {
      setProgress({
        ...progressData,
        percentComplete: (progressData.loaded / progressData.total) * 100,
      })
    }).then((data) => {
      setStates(data.states as State[])
      setDistricts(data.districts as District[])
      setDestinations(data.destinations as Destination[])
      setLoading(false)
    })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  return { states, districts, destinations, progress, loading }
}

/**
 * Hook for atlas statistics and metadata
 */
export function useAtlasStatistics() {
  const [stats, setStats] = useState<ReturnType<typeof getAtlasStatistics> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const data = getAtlasStatistics()
    setStats(data)
    setLoading(false)
  }, [])

  return { stats, loading }
}

/**
 * Hook for advanced destination filtering with state management
 */
export function useAdvancedDestinationFilter() {
  const [filter, setFilter] = useState<DataQueryFilter>({})
  const [page, setPage] = useState(1)
  const [result, setResult] = useState<PaginatedResponse<Destination> | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const data = filterDestinations(filter, page)
    setResult(data)
    setLoading(false)
  }, [filter, page])

  const updateFilter = useCallback((newFilter: Partial<DataQueryFilter>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }))
    setPage(1) // Reset to first page when filter changes
  }, [])

  const clearFilter = useCallback(() => {
    setFilter({})
    setPage(1)
  }, [])

  const goToPage = useCallback((pageNum: number) => {
    setPage(Math.max(1, pageNum))
  }, [])

  return {
    destinations: result?.data || [],
    total: result?.total || 0,
    page,
    hasMore: result?.hasMore || false,
    loading,
    filter,
    updateFilter,
    clearFilter,
    goToPage,
  }
}
