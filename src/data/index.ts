/**
 * Atlas Data Module
 * Centralized exports for all data types, utilities, and services
 */

// Types
export type {
  GeoPoint,
  GeoPolygon,
  AudioClip,
  WeatherVariant,
  ContentCategory,
  CulturalPulse,
  CulturalContext,
  Destination,
  District,
  State,
  AtlasData,
  DataQueryFilter,
  PaginatedResponse,
} from './types'

// Data
export { atlasData } from './atlas'

// Utilities
export {
  calculateDistance,
  getAllStates,
  getStateById,
  getStateByName,
  getAllDistricts,
  getDistrictsByStateId,
  getDistrictById,
  getDistrictByName,
  getAllDestinations,
  getDestinationById,
  getDestinationsByDistrictId,
  getDestinationsByStateId,
  getDestinationsNearby,
  getDestinationsByCategory,
  searchDestinations,
  filterDestinations,
  getRelatedDestinations,
  sortDestinationsByDistance,
  getAllCategories,
  getAtlasStatistics,
  progressiveLoadAtlasData,
  getStateDetailedData,
  validateDestination,
} from './utils'

// Validation
export {
  validateGeoPoint,
  validateAudioClip,
  validateWeatherVariant,
  validateCulturalContext,
  validateCulturalPulse,
  validateDestination as validateDestinationStrict,
  validateDistrict,
  validateState,
  getDestinationValidationErrors,
  getDistrictValidationErrors,
  getStateValidationErrors,
} from './validation'

// Service
export { atlasService, AtlasDataService } from './service'
