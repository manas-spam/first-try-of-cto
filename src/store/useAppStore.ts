import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface UserSettings {
  ecoMode: boolean
  reducedMotion: boolean
  highContrast: boolean
  hapticFeedback: boolean
  audioEnabled: boolean
  theme: 'light' | 'dark' | 'auto'
}

export interface AtmosphericLayer {
  id: string
  type: 'weather' | 'pollution' | 'vegetation' | 'terrain'
  visible: boolean
  opacity: number
}

export interface NavigationContext {
  currentRoute: string
  previousRoute: string | null
  isTransitioning: boolean
}

interface AppState {
  navigationContext: NavigationContext
  atmosphericLayers: AtmosphericLayer[]
  userSettings: UserSettings
  
  setCurrentRoute: (route: string) => void
  setIsTransitioning: (isTransitioning: boolean) => void
  toggleAtmosphericLayer: (id: string) => void
  setLayerOpacity: (id: string, opacity: number) => void
  updateUserSettings: (settings: Partial<UserSettings>) => void
  resetSettings: () => void
}

const defaultSettings: UserSettings = {
  ecoMode: false,
  reducedMotion: false,
  highContrast: false,
  hapticFeedback: true,
  audioEnabled: true,
  theme: 'auto',
}

const defaultLayers: AtmosphericLayer[] = [
  { id: 'weather', type: 'weather', visible: true, opacity: 0.7 },
  { id: 'pollution', type: 'pollution', visible: false, opacity: 0.5 },
  { id: 'vegetation', type: 'vegetation', visible: true, opacity: 0.8 },
  { id: 'terrain', type: 'terrain', visible: true, opacity: 1.0 },
]

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        navigationContext: {
          currentRoute: '/',
          previousRoute: null,
          isTransitioning: false,
        },
        atmosphericLayers: defaultLayers,
        userSettings: defaultSettings,

        setCurrentRoute: (route: string) =>
          set((state) => ({
            navigationContext: {
              currentRoute: route,
              previousRoute: state.navigationContext.currentRoute,
              isTransitioning: false,
            },
          })),

        setIsTransitioning: (isTransitioning: boolean) =>
          set((state) => ({
            navigationContext: {
              ...state.navigationContext,
              isTransitioning,
            },
          })),

        toggleAtmosphericLayer: (id: string) =>
          set((state) => ({
            atmosphericLayers: state.atmosphericLayers.map((layer) =>
              layer.id === id ? { ...layer, visible: !layer.visible } : layer
            ),
          })),

        setLayerOpacity: (id: string, opacity: number) =>
          set((state) => ({
            atmosphericLayers: state.atmosphericLayers.map((layer) =>
              layer.id === id ? { ...layer, opacity } : layer
            ),
          })),

        updateUserSettings: (settings: Partial<UserSettings>) =>
          set((state) => ({
            userSettings: { ...state.userSettings, ...settings },
          })),

        resetSettings: () =>
          set({
            userSettings: defaultSettings,
            atmosphericLayers: defaultLayers,
          }),
      }),
      {
        name: 'immersive-app-storage',
        partialize: (state) => ({
          userSettings: state.userSettings,
          atmosphericLayers: state.atmosphericLayers,
        }),
      }
    )
  )
)
