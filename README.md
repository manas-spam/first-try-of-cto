# Immersive Experience Application

A Next.js 14 application with TypeScript, featuring an immersive sensory experience with 3D globe visualization, atmospheric layers, and comprehensive accessibility features.

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling with custom sensory color palettes
- **Framer Motion** for smooth animations
- **Three.js** with React Three Fiber for 3D globe visualization
- **Tone.js** for Web Audio API interactions
- **Zustand** for global state management
- **PWA Support** with next-pwa and Workbox

## Features

### Core Features
- 🌍 **Interactive 3D Globe** - Explore the world with Three.js
- 🗺️ **Atlas View** - Navigate atmospheric layers and terrain
- 🏖️ **Destinations** - Discover places with geolocation integration
- 📝 **Memories** - Save and revisit your experiences
- ⚙️ **Settings** - Comprehensive accessibility and customization

### Accessibility Features
- ♿ Reduced motion support
- 🎨 High contrast mode
- 📱 Haptic feedback (mobile)
- 🔊 Audio feedback with Tone.js
- 🌿 Eco mode for reduced energy consumption

### Technical Features
- 📴 **Offline Support** - PWA with service worker
- 🎯 **Geolocation** - Real-time location tracking
- 🎨 **Theming** - Light, dark, and auto themes
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Performance** - Optimized with Next.js 14

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run type-check

# Linting
npm run lint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── atlas/             # Interactive globe view
│   ├── destinations/      # Destinations list
│   ├── memories/          # User memories
│   ├── settings/          # Settings and accessibility
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx     # Main navigation
│   ├── GlobeViewer.tsx    # Three.js globe component
│   └── ServiceWorkerRegistration.tsx
├── hooks/                 # Custom React hooks
│   ├── useHapticFeedback.ts
│   ├── useGeolocation.ts
│   └── useAudio.ts
├── store/                 # Zustand store
│   └── useAppStore.ts
└── lib/                   # Utility libraries
    └── audio.ts           # Tone.js audio manager
```

## State Management

The application uses Zustand for global state with the following features:

- **Navigation Context** - Current and previous routes
- **Atmospheric Layers** - Layer visibility and opacity
- **User Settings** - Accessibility and preferences
- **Persistent Storage** - Settings saved to localStorage

## Atmospheric Layers

- 🌤️ Weather
- 🏭 Pollution
- 🌳 Vegetation
- ⛰️ Terrain

## Customization

### Theme Colors

The application includes custom "sensory" color palettes:
- **Earth** - Green tones for nature
- **Sky** - Blue tones for atmosphere
- **Fire** - Red tones for energy
- **Twilight** - Purple tones for mystery

### Responsive Breakpoints

- `xs`: 475px
- `sm`: 640px (Tailwind default)
- `md`: 768px (Tailwind default)
- `lg`: 1024px (Tailwind default)
- `xl`: 1280px (Tailwind default)
- `2xl`: 1536px (Tailwind default)
- `3xl`: 1920px (custom)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## PWA Features

- Offline functionality
- Install to home screen
- Service worker with Workbox
- Progressive loading strategy

## License

MIT
