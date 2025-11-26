import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface MemoryTag {
  id: string
  label: string
  color: string
  emoji: string
}

export interface ScrapbookMemory {
  id: string
  destinationId: string
  destinationName: string
  stateId: string
  districtId: string
  coordinates: [number, number]
  imageUrl?: string
  
  visitDate?: string
  createdAt: string
  notes: string
  
  feelings: MemoryTag[]
  customTags: string[]
  
  isFavorite: boolean
  position: number
}

interface ScrapbookState {
  memories: Record<string, ScrapbookMemory>
  memoryOrder: string[]
  
  addMemory: (memory: Omit<ScrapbookMemory, 'id' | 'createdAt' | 'position'>) => string
  updateMemory: (id: string, updates: Partial<ScrapbookMemory>) => void
  removeMemory: (id: string) => void
  reorderMemories: (newOrder: string[]) => void
  toggleFavorite: (id: string) => void
  
  hasMemory: (destinationId: string) => boolean
  getMemoryByDestination: (destinationId: string) => ScrapbookMemory | undefined
  getMemoriesByState: (stateId: string) => ScrapbookMemory[]
  getMemoriesByTag: (tag: string) => ScrapbookMemory[]
  getFavorites: () => ScrapbookMemory[]
  
  clearAll: () => void
}

export const DEFAULT_FEELING_TAGS: MemoryTag[] = [
  { id: 'peaceful', label: 'Peaceful', color: '#60A5FA', emoji: '🕊️' },
  { id: 'energized', label: 'Energized', color: '#F59E0B', emoji: '⚡' },
  { id: 'inspired', label: 'Inspired', color: '#A78BFA', emoji: '✨' },
  { id: 'nostalgic', label: 'Nostalgic', color: '#F472B6', emoji: '🌅' },
  { id: 'adventurous', label: 'Adventurous', color: '#10B981', emoji: '🏔️' },
  { id: 'serene', label: 'Serene', color: '#06B6D4', emoji: '🌊' },
  { id: 'joyful', label: 'Joyful', color: '#FBBF24', emoji: '😊' },
  { id: 'contemplative', label: 'Contemplative', color: '#8B5CF6', emoji: '🤔' },
  { id: 'grateful', label: 'Grateful', color: '#EC4899', emoji: '🙏' },
  { id: 'amazed', label: 'Amazed', color: '#EF4444', emoji: '🤩' },
]

export const useScrapbookStore = create<ScrapbookState>()(
  persist(
    (set, get) => ({
      memories: {},
      memoryOrder: [],

      addMemory: (memoryData) => {
        const id = `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const position = get().memoryOrder.length
        
        const memory: ScrapbookMemory = {
          ...memoryData,
          id,
          createdAt: new Date().toISOString(),
          position,
        }

        set((state) => ({
          memories: {
            ...state.memories,
            [id]: memory,
          },
          memoryOrder: [...state.memoryOrder, id],
        }))

        return id
      },

      updateMemory: (id, updates) => {
        set((state) => {
          if (!state.memories[id]) return state

          return {
            memories: {
              ...state.memories,
              [id]: {
                ...state.memories[id],
                ...updates,
              },
            },
          }
        })
      },

      removeMemory: (id) => {
        set((state) => {
          const newMemories = { ...state.memories }
          delete newMemories[id]

          return {
            memories: newMemories,
            memoryOrder: state.memoryOrder.filter((memId) => memId !== id),
          }
        })
      },

      reorderMemories: (newOrder) => {
        set((state) => {
          const updatedMemories = { ...state.memories }
          newOrder.forEach((id, index) => {
            if (updatedMemories[id]) {
              updatedMemories[id] = {
                ...updatedMemories[id],
                position: index,
              }
            }
          })

          return {
            memories: updatedMemories,
            memoryOrder: newOrder,
          }
        })
      },

      toggleFavorite: (id) => {
        set((state) => {
          if (!state.memories[id]) return state

          return {
            memories: {
              ...state.memories,
              [id]: {
                ...state.memories[id],
                isFavorite: !state.memories[id].isFavorite,
              },
            },
          }
        })
      },

      hasMemory: (destinationId) => {
        const memories = Object.values(get().memories)
        return memories.some((m) => m.destinationId === destinationId)
      },

      getMemoryByDestination: (destinationId) => {
        const memories = Object.values(get().memories)
        return memories.find((m) => m.destinationId === destinationId)
      },

      getMemoriesByState: (stateId) => {
        return Object.values(get().memories)
          .filter((m) => m.stateId === stateId)
          .sort((a, b) => a.position - b.position)
      },

      getMemoriesByTag: (tag) => {
        return Object.values(get().memories)
          .filter((m) => 
            m.feelings.some((f) => f.id === tag) ||
            m.customTags.includes(tag)
          )
          .sort((a, b) => a.position - b.position)
      },

      getFavorites: () => {
        return Object.values(get().memories)
          .filter((m) => m.isFavorite)
          .sort((a, b) => a.position - b.position)
      },

      clearAll: () => {
        set({
          memories: {},
          memoryOrder: [],
        })
      },
    }),
    {
      name: 'scrapbook-storage',
    }
  )
)
