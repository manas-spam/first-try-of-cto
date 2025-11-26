# Atlas Data Schema

A comprehensive, strongly-typed data layer for Indian states, union territories, districts, and destinations with rich sensory, historical, and geospatial information.

## Overview

The Atlas Data Schema provides:

- **28 States + 8 Union Territories** - Complete geographic coverage of India
- **Rich Sensory Descriptions** - Visual, auditory, olfactory, tactile, and gustatory details
- **Historical & Cultural Context** - Anecdotes, proverbs, cultural significance, and festivals
- **Geospatial Data** - Coordinates, centroids, and polygon boundaries for mapping
- **Audio Integration** - Metadata for narrations, ambient sounds, music, and interviews
- **Weather Variants** - Season-specific asset references with temperature and humidity data
- **Content Categorization** - Tags for classification (mainstream, hidden-gem, culinary, living heritage, adventure, spiritual, urban)
- **Cultural Pulse** - Configuration for immersive visual/audio effects with patterns, colors, and tempo

## Structure

### Files

- **`types.ts`** - TypeScript type definitions for all data structures
- **`atlas.ts`** - Sample data with two complete exemplars (Rajasthan & Kerala states)
- **`utils.ts`** - Utility functions for data access, filtering, searching, and distance calculations
- **`validation.ts`** - Validation helpers for type checking and error reporting
- **`service.ts`** - High-level service layer for data access
- **`index.ts`** - Central export point for all modules

## Data Types

### Core Types

#### `State` / `District` / `Destination`

The primary data structures:

```typescript
State {
  id: string              // Unique identifier
  name: string           // State name
  code: string           // 2-letter state code
  type: 'state' | 'union-territory'
  centroid: [lng, lat]   // Center point coordinates
  sensoryDescription: string
  cultural: CulturalContext
  primaryLanguages: string[]
  categories: ContentCategory[]
  districtIds: string[]
  culturalPulse: CulturalPulse
}

District {
  id: string
  name: string
  stateId: string
  centroid: [lng, lat]
  boundary?: GeoPolygon  // Optional complete boundary
  sensoryDescription: string
  cultural: CulturalContext
  categories: ContentCategory[]
  destinationIds: string[]
  culturalPulse: CulturalPulse
}

Destination {
  id: string
  name: string
  type: 'landmark' | 'city' | 'heritage-site' | 'natural-wonder' | 'cultural-space'
  coordinates: [lng, lat]
  districtId: string
  stateId: string
  sensoryDescription: {
    visual: string
    auditory: string
    olfactory: string
    gustatory?: string
    tactile: string
  }
  cultural: CulturalContext
  audioClips: AudioClip[]
  weatherVariants: WeatherVariant[]
  categories: ContentCategory[]
  culturalPulse: CulturalPulse
}
```

#### Supporting Types

**`AudioClip`** - Audio metadata
```typescript
{
  id: string
  title: string
  url: string
  speaker: string
  language: 'en' | 'hi' | 'ta' | 'te' | 'ka' | 'ml' | 'mr' | 'gu' | 'pa' | 'bn' | 'or' | 'as'
  duration: number       // in seconds
  category: 'narration' | 'ambient-sound' | 'music' | 'interview'
}
```

**`WeatherVariant`** - Season-specific configuration
```typescript
{
  season: 'summer' | 'monsoon' | 'winter'
  assetId: string       // Reference to texture/image assets
  temperatureRange: [min, max]
  humidity: number      // 0-100
  description: string
}
```

**`CulturalPulse`** - Visual/audio effect configuration
```typescript
{
  pattern: 'rhythmic' | 'organic' | 'geometric' | 'fluid'
  color: string         // Hex color code
  tempo: number         // BPM
  intensity: number     // 0-100
  description: string
}
```

## Usage

### Using the Service Layer (Recommended)

```typescript
import { atlasService } from '@/data'

// Get all states
const states = atlasService.states()

// Get specific state
const rajasthan = atlasService.stateById('state-rajasthan')

// Get detailed state data
const detailed = atlasService.stateDetailedData('state-rajasthan')

// Filter destinations
const results = atlasService.filterDestinations(
  {
    stateId: 'state-rajasthan',
    categories: ['mainstream', 'heritage-site'],
    searchQuery: 'palace'
  },
  page,
  pageSize
)

// Search destinations
const search = atlasService.searchDestinations('Jaipur')

// Find nearby destinations
const nearby = atlasService.nearbyDestinations([75.8, 26.9], 50) // 50km radius

// Get related destinations
const related = atlasService.relatedDestinations('dest-city-palace', 5)
```

### Using React Hooks

```typescript
import {
  useStates,
  useDistricts,
  useDestinations,
  useDestination,
  useSearchDestinations,
  useNearbyDestinations,
  useStateDestinations,
  useDistrictDestinations,
  useProgressiveAtlasLoading,
  useAtlasStatistics,
  useAdvancedDestinationFilter
} from '@/hooks/useAtlas'

// Simple state fetching
function StatesComponent() {
  const { states, loading } = useStates()
  return <div>{states.map(s => <div key={s.id}>{s.name}</div>)}</div>
}

// Get state-specific districts
function DistrictsComponent() {
  const { districts } = useDistricts('state-rajasthan')
  return <ul>{districts.map(d => <li key={d.id}>{d.name}</li>)}</ul>
}

// Search destinations
function SearchComponent() {
  const [query, setQuery] = useState('')
  const { results } = useSearchDestinations(query)
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {results.map(d => <div key={d.id}>{d.name}</div>)}
    </>
  )
}

// Find nearby destinations
function NearbyComponent() {
  const center = [75.8, 26.9] as const
  const { destinations } = useNearbyDestinations(center, 50)
  return destinations.map(d => <div key={d.id}>{d.name}</div>)
}

// Advanced filtering with pagination
function AdvancedFilterComponent() {
  const {
    destinations,
    total,
    page,
    hasMore,
    filter,
    updateFilter,
    goToPage
  } = useAdvancedDestinationFilter()

  return (
    <div>
      <button onClick={() => updateFilter({ categories: ['culinary'] })}>
        Show Culinary
      </button>
      <div>Page {page} of {Math.ceil(total / 10)}</div>
      {destinations.map(d => <div key={d.id}>{d.name}</div>)}
    </div>
  )
}
```

### Using Utility Functions

```typescript
import {
  getAllStates,
  getAllDistricts,
  getAllDestinations,
  calculateDistance,
  filterDestinations,
  searchDestinations,
  getAtlasStatistics,
  progressiveLoadAtlasData,
  validateDestination,
  getDestinationValidationErrors
} from '@/data'

// Calculate distance between two points
const distance = calculateDistance([75.8, 26.9], [76.0, 27.0])

// Progressive loading with callback
await progressiveLoadAtlasData((progress) => {
  console.log(`Loaded ${progress.stage}: ${progress.loaded}/${progress.total}`)
})

// Complex filtering
const filtered = filterDestinations(
  {
    stateId: 'state-kerala',
    categories: ['culinary', 'living-heritage'],
    weatherSeason: 'monsoon',
    coordinates: {
      center: [76.3, 9.9],
      radiusKm: 30
    }
  },
  page,
  pageSize
)

// Validation
const destination = { /* ... */ }
const isValid = validateDestination(destination)
if (!isValid) {
  const errors = getDestinationValidationErrors(destination)
  console.error(errors)
}
```

## Sample Data

Two complete exemplars are included:

### 1. **Rajasthan** (State)
- **Districts**: Jaipur, Jodhpur, Udaipur
- **Destinations**:
  - City Palace Jaipur (heritage-site)
  - Hawa Mahal (landmark)
  - Jantar Mantar (heritage-site)

### 2. **Kerala** (State)
- **Districts**: Ernakulam, Kottayam, Idukki
- **Destinations**:
  - Chinese Fishing Nets (landmark)
  - Paradesi Synagogue (heritage-site)
  - Fort Kochi Spice Market (cultural-space)

Each exemplar includes:
- Complete sensory descriptions across all senses
- Historical anecdotes and proverbs
- Audio clip metadata (multiple languages)
- Weather variants for summer, monsoon, and winter
- Cultural pulse configurations
- Geospatial coordinates

## Adding New Data

To add new states, districts, or destinations:

1. **Define the structure** in `atlas.ts`
2. **Use proper types** from `types.ts`
3. **Validate** using helpers from `validation.ts`
4. **Add references** - Update parent IDs (e.g., add destinationIds to districts)

```typescript
const newDestination: Destination = {
  id: 'dest-unique-id',
  name: 'Destination Name',
  type: 'landmark',
  coordinates: [longitude, latitude],
  districtId: 'dist-xyz',
  stateId: 'state-xyz',
  sensoryDescription: {
    visual: '...',
    auditory: '...',
    olfactory: '...',
    tactile: '...'
  },
  cultural: {
    historicalAnecdote: '...',
    proverb: '...',
    culturalSignificance: '...',
    festivals: []
  },
  audioClips: [],
  weatherVariants: [],
  categories: ['mainstream'],
  culturalPulse: {
    pattern: 'geometric',
    color: '#FF0000',
    tempo: 100,
    intensity: 50,
    description: 'Vibrant and energetic'
  }
}

// Validate before adding
const errors = getDestinationValidationErrors(newDestination)
if (errors.length === 0) {
  // Add to atlasData
  atlasData.destinations[newDestination.id] = newDestination
}
```

## Categories

Valid content categories:

- `mainstream` - Popular, well-known destinations
- `hidden-gem` - Lesser-known but valuable discoveries
- `culinary` - Food-related experiences and locations
- `living-heritage` - Active cultural practices and traditions
- `adventure` - Action and outdoor activities
- `spiritual` - Religious and meditative sites
- `urban` - City experiences and attractions

## Geospatial Features

### Distance Calculation

Uses the Haversine formula for accurate great-circle distances:

```typescript
const km = calculateDistance(
  [75.8, 26.9],  // Jaipur
  [76.0, 27.0]   // Nearby point
)
```

### Geographic Filtering

Find destinations within a radius:

```typescript
const nearby = filterDestinations({
  coordinates: {
    center: [75.8, 26.9],
    radiusKm: 50
  }
})
```

### Polygon Boundaries

Districts can optionally include complete boundary polygons for advanced mapping:

```typescript
const boundary = district.boundary // GeoPolygon (GeoJSON format)
```

## Statistics

Get atlas statistics:

```typescript
const stats = atlasService.statistics()
// {
//   totalStates: 36,
//   states: 28,
//   unionTerritories: 8,
//   totalDistricts: 750+,
//   totalDestinations: 1000+,
//   categories: [...]
// }
```

## Validation

Strong typing with comprehensive validation:

```typescript
// Type guards
if (validateDestination(data)) {
  // data is Destination
}

// Detailed errors
const errors = getDestinationValidationErrors(data)
// Returns array of validation error messages
```

## Performance

### Progressive Loading

Load data in stages for better performance:

```typescript
const data = await progressiveLoadAtlasLoading(
  (progress) => updateProgress(progress)
)
// Calls callback for: 'states', 'districts', 'destinations'
```

### Pagination

All filter operations support pagination:

```typescript
const { data, total, page, hasMore, pageSize } = filterDestinations(
  filter,
  page,      // 1-based page number
  pageSize   // Items per page
)
```

## Future Enhancements

- [ ] Complete coverage of all 28 states + 8 UTs with districts
- [ ] Expand destinations to 500+ landmarks
- [ ] Add real audio clip URLs
- [ ] Integration with mapping libraries
- [ ] Real-time weather data integration
- [ ] User ratings and reviews
- [ ] Travel time calculations
- [ ] Multi-language support

## Testing

All functions include proper TypeScript types and validation. Test coverage includes:

- Type validation for all data structures
- Distance calculation accuracy
- Filter and search functionality
- Geospatial queries
- Progressive loading
- Pagination
