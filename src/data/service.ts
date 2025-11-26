/**
 * Atlas Data Service
 * High-level service for accessing and managing atlas data
 */

import type {
  State,
  District,
  Destination,
  DataQueryFilter,
  PaginatedResponse,
  GeoPoint,
} from './types'
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
  getStateDetailedData,
} from './utils'
import {
  validateDestination,
  validateDistrict,
  validateState,
  getDestinationValidationErrors,
} from './validation'

/**
 * Main Atlas Data Service
 */
class AtlasDataService {
  /**
   * Get all states with optional filtering
   */
  states(options?: { type?: 'state' | 'union-territory' }): State[] {
    return getAllStates(options)
  }

  /**
   * Get a state by ID
   */
  stateById(id: string): State | null {
    return getStateById(id)
  }

  /**
   * Get detailed state data including its districts and destinations
   */
  stateDetailedData(stateId: string) {
    return getStateDetailedData(stateId)
  }

  /**
   * Get all districts
   */
  districts(): District[] {
    return getAllDistricts()
  }

  /**
   * Get districts for a specific state
   */
  districtsByState(stateId: string): District[] {
    return getDistrictsByStateId(stateId)
  }

  /**
   * Get a district by ID
   */
  districtById(id: string): District | null {
    return getDistrictById(id)
  }

  /**
   * Get all destinations
   */
  destinations(): Destination[] {
    return getAllDestinations()
  }

  /**
   * Get a destination by ID
   */
  destinationById(id: string): Destination | null {
    return getDestinationById(id)
  }

  /**
   * Get destinations for a specific state
   */
  destinationsByState(stateId: string): Destination[] {
    return getDestinationsByStateId(stateId)
  }

  /**
   * Get destinations for a specific district
   */
  destinationsByDistrict(districtId: string): Destination[] {
    return getDestinationsByDistrictId(districtId)
  }

  /**
   * Find destinations near a geographic point
   */
  nearbyDestinations(center: GeoPoint, radiusKm?: number): Destination[] {
    return getDestinationsNearby(center, radiusKm || 50)
  }

  /**
   * Filter destinations with advanced options
   */
  filterDestinations(
    filter: DataQueryFilter,
    page?: number,
    pageSize?: number
  ): PaginatedResponse<Destination> {
    return filterDestinations(filter, page || 1, pageSize || 10)
  }

  /**
   * Search destinations by text query
   */
  searchDestinations(query: string): Destination[] {
    return searchDestinations(query)
  }

  /**
   * Get related destinations
   */
  relatedDestinations(destinationId: string, limit?: number): Destination[] {
    return getRelatedDestinations(destinationId, limit || 5)
  }

  /**
   * Sort destinations by distance from a point
   */
  sortByDistance(destinations: Destination[], center: GeoPoint): Destination[] {
    return sortDestinationsByDistance(destinations, center)
  }

  /**
   * Get atlas statistics
   */
  statistics() {
    return getAtlasStatistics()
  }

  /**
   * Validate data objects
   */
  validate = {
    destination: validateDestination,
    district: validateDistrict,
    state: validateState,
    destinationErrors: getDestinationValidationErrors,
  }
}

/**
 * Singleton instance of the service
 */
export const atlasService = new AtlasDataService()

/**
 * Export the service class for testing or alternative usage
 */
export { AtlasDataService }
