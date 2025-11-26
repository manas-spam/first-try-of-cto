# Cinematic Navigation

An immersive, multi-phase entry flow for the India Atlas experience that provides users with a sensory-rich introduction to the platform.

## Overview

The Cinematic Navigation system consists of three main phases:

1. **Preloader** - Kaleidoscopic mandala animation with tabla beats and progress tracking
2. **Globe-to-India Transition** - Scroll-driven globe animation focusing on India
3. **Interactive India Map** - Living terrain map with state exploration

## Components

### Preloader (`/src/components/Preloader.tsx`)

**Features:**
- **Kaleidoscopic Mandala**: Custom Three.js shader animation with rotating geometric patterns
- **Floating Spices**: 3D octahedrons representing Indian spices with ambient rotation
- **Tabla Beat**: Synchronized audio using Tone.js simulating traditional tabla rhythms
- **Golden Progress Arc**: SVG-based circular progress indicator tied to asset loading
- **Loading States**: Dynamic text feedback during different loading phases

**Technical Details:**
- Custom GLSL shaders for mandala generation
- Web Audio API integration through Tone.js
- Framer Motion for UI animations
- WebGL fallback support

### Globe-to-India Transition (`/src/components/GlobeToIndiaTransition.tsx`)

**Features:**
- **Scroll-Driven Animation**: Inertia and physics-based scrolling
- **Gravity Assist Easing**: Natural deceleration curves
- **Parallax Sensor Layers**: Multiple depth layers with particle effects
- **India Highlight**: Pulsing geometric representation of India
- **Progress Tracking**: Visual progress bar and contextual messaging

**Technical Details:**
- React Three Fiber for 3D rendering
- Custom camera interpolation
- Wheel event handling with momentum
- Audio feedback at key transition points

### Interactive India Map (`/src/components/InteractiveIndiaMap.tsx`)

**Features:**
- **Living Terrain Micro-animations**:
  - Himalayan elevation pulses (green states)
  - Kerala water shimmer (blue states)
  - Thar sand drift (orange states)
  - Central terrain effects (purple states)
- **Interactive States**: Hover tooltips, click handlers, keyboard navigation
- **Cultural Pulse Overlays**: Animated color gradients on selection
- **WebGL Fallback**: Graceful degradation for unsupported browsers
- **Responsive Design**: Mobile and desktop optimized

**Technical Details:**
- react-simple-maps for geographic visualization
- D3-geo for projection handling
- Fallback topojson data for offline scenarios
- TypeScript strict typing throughout

## Integration

### Main Orchestrator (`/src/components/CinematicNavigation.tsx`)

**Features:**
- **Phase Management**: Seamless transitions between all three phases
- **Accessibility**: Skip buttons, keyboard navigation (ESC, Ctrl+R)
- **Reduced Motion**: Respects user preferences for motion sensitivity
- **State Integration**: Updates global app store for navigation context

### Home Page Integration (`/src/app/page.tsx`)

The Atlas card now triggers the cinematic navigation experience:
- Special visual treatment with golden gradient overlay
- "✨ Cinematic Experience" badge
- Direct integration with existing haptic feedback system

## Audio System

### Enhanced Audio Manager (`/src/lib/audio.ts`)

**New Features:**
- **Tabla Beat Simulation**: Dual-pitch rhythm using Tone.js
- **Enhanced Sampler**: Prepared for actual tabla sample integration
- **Better Error Handling**: Graceful fallbacks for audio initialization

### Audio Hook (`/src/hooks/useAudio.ts`)

**Updated:**
- Added 'tabla' sound type to playSound function
- Maintains backward compatibility with existing sound types

## Data Integration

### India States Fallback (`/src/data/indiaStatesFallback.ts`)

**Purpose:**
- Provides simplified Indian state boundaries when external topojson fails
- Ensures consistent experience across network conditions
- Includes major states: Rajasthan, Gujarat, Maharashtra, Kerala, Karnataka, Tamil Nadu, Uttar Pradesh, Punjab, West Bengal, Delhi

## Store Updates

### Navigation Context (`/src/store/useAppStore.ts`)

**New Properties:**
- `cinematicNavigationActive`: Boolean flag for UI state management
- `setCinematicNavigationActive`: Action to update navigation state

## Performance Optimizations

### WebGL Detection
- Checks for WebGL support before initializing 3D components
- Provides 2D fallbacks for unsupported browsers

### Eco Mode Support
- Disables resource-intensive animations
- Simplified shader effects
- Reduced particle counts

### Reduced Motion
- Skips transition phases when user prefers reduced motion
- Maintains accessibility compliance

## Browser Support

### Supported Features
- **Modern Browsers**: Full 3D experience with all animations
- **Legacy Browsers**: 2D fallbacks with simplified interactions
- **Mobile**: Touch-optimized interactions and responsive layouts

### Fallbacks
- WebGL Canvas → 2D SVG Map
- External Topojson → Local Fallback Data
- Audio Context → Silent Experience

## Usage

### Basic Integration

```tsx
import CinematicNavigation from '@/components/CinematicNavigation'

function App() {
  const handleComplete = (selectedState?: State) => {
    // Navigate to atlas with optional state selection
    if (selectedState) {
      router.push(`/atlas?state=${selectedState.id}`)
    } else {
      router.push('/atlas')
    }
  }

  return (
    <CinematicNavigation
      onComplete={handleComplete}
      autoStart={false} // Optional: control when to start
    />
  )
}
```

### Direct Usage

```tsx
// Individual components can be used separately
import Preloader from '@/components/Preloader'
import GlobeToIndiaTransition from '@/components/GlobeToIndiaTransition'
import InteractiveIndiaMap from '@/components/InteractiveIndiaMap'
```

## Future Enhancements

### Planned Features
1. **Actual Tabla Samples**: Integration with authentic Indian percussion recordings
2. **Craft Pattern Overlays**: Regional textile and art patterns on state hover
3. **Weather Integration**: Real-time weather affecting terrain animations
4. **Voice Narration**: Cultural context and historical anecdotes
5. **VR Support**: Immersive 3D exploration with WebXR

### Performance Improvements
1. **Level of Detail (LOD)**: Dynamic mesh complexity based on device performance
2. **Web Workers**: Offload heavy calculations to background threads
3. **Progressive Loading**: Stream large datasets efficiently
4. **Caching**: Intelligent asset preloading and storage

## Testing

### Manual Testing Checklist

- [ ] Preloader completes with all animations
- [ ] Tabla beats sync with visual progress
- [ ] Globe-to-India scroll is smooth and responsive
- [ ] India highlight pulses correctly
- [ ] State hover tooltips appear and disappear properly
- [ ] State selection triggers cultural pulse overlay
- [ ] Keyboard navigation (ESC, Tab, Enter) works
- [ ] Reduced motion preference is respected
- [ ] Eco mode disables resource-intensive features
- [ ] WebGL fallback provides functional 2D map
- [ ] Mobile touch interactions work correctly
- [ ] Audio can be muted/unmuted
- [ ] Skip buttons allow bypassing any phase

### Automated Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

## Dependencies

### New Packages
- `react-simple-maps`: Interactive map visualization
- `topojson-client`: Geographic data handling
- `d3-geo`: Map projections and utilities
- `@types/react-simple-maps`: TypeScript definitions
- `@types/topojson-client`: TypeScript definitions

### Existing Packages Used
- `@react-three/fiber`: 3D rendering
- `@react-three/drei`: Three.js utilities
- `three`: 3D graphics library
- `framer-motion`: Animation library
- `tone`: Web Audio API
- `zustand`: State management

## File Structure

```
src/
├── components/
│   ├── CinematicNavigation.tsx     # Main orchestrator
│   ├── Preloader.tsx              # Loading phase
│   ├── GlobeToIndiaTransition.tsx  # Transition phase
│   └── InteractiveIndiaMap.tsx    # Map phase
├── data/
│   └── indiaStatesFallback.ts      # Fallback geo data
├── hooks/
│   ├── useAudio.ts                # Enhanced audio hook
│   └── useAtlas.ts               # Atlas data hooks
├── lib/
│   └── audio.ts                  # Enhanced audio manager
├── store/
│   └── useAppStore.ts            # Updated state management
├── types/
│   └── react-simple-maps.d.ts     # Type definitions
└── app/
    └── page.tsx                  # Updated home page
```

## Conclusion

The Cinematic Navigation system provides a rich, sensory introduction to the India Atlas experience while maintaining high performance, accessibility, and browser compatibility. The modular architecture allows for easy customization and future enhancement while the comprehensive fallback system ensures a consistent experience across all user environments.