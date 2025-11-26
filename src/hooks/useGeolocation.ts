import { useState, useEffect, useCallback } from 'react'

export interface GeolocationCoordinates {
  latitude: number
  longitude: number
  accuracy: number
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  speed: number | null
}

export interface GeolocationState {
  loading: boolean
  error: string | null
  coordinates: GeolocationCoordinates | null
  timestamp: number | null
  permission: PermissionState | null
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  watch?: boolean
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
  } = options

  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    coordinates: null,
    timestamp: null,
    permission: null,
  })

  const updatePosition = useCallback((position: GeolocationPosition) => {
    setState({
      loading: false,
      error: null,
      coordinates: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
      },
      timestamp: position.timestamp,
      permission: 'granted',
    })
  }, [])

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'An unknown error occurred'
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied'
        break
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable'
        break
      case error.TIMEOUT:
        errorMessage = 'Location request timed out'
        break
    }

    setState((prev) => ({
      ...prev,
      loading: false,
      error: errorMessage,
      permission: error.code === error.PERMISSION_DENIED ? 'denied' : prev.permission,
    }))
  }, [])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const positionOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    }

    navigator.geolocation.getCurrentPosition(
      updatePosition,
      handleError,
      positionOptions
    )
  }, [enableHighAccuracy, timeout, maximumAge, updatePosition, handleError])

  const checkPermission = useCallback(async () => {
    if ('permissions' in navigator) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName })
        setState((prev) => ({ ...prev, permission: result.state }))
        return result.state
      } catch (error) {
        console.warn('Permission query failed:', error)
      }
    }
    return null
  }, [])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  useEffect(() => {
    if (!watch || !navigator.geolocation) return

    const positionOptions: PositionOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    }

    const watchId = navigator.geolocation.watchPosition(
      updatePosition,
      handleError,
      positionOptions
    )

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [watch, enableHighAccuracy, timeout, maximumAge, updatePosition, handleError])

  return {
    ...state,
    requestLocation,
    checkPermission,
  }
}
