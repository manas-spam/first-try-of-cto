import type { ScrapbookMemory } from '@/store/scrapbookStore'
import type { Destination } from '@/data'

const CACHE_NAME = 'memory-keeper-cache-v1'

interface CachedMemoryPayload {
  memory: ScrapbookMemory
  destination: Destination
}

function getMemoryRequest(id: string) {
  return new Request(`/memory-cache/${id}.json`)
}

export async function cacheMemoryData(memory: ScrapbookMemory, destination: Destination) {
  if (typeof window === 'undefined' || !('caches' in window)) return

  const cache = await caches.open(CACHE_NAME)
  const payload: CachedMemoryPayload = { memory, destination }
  await cache.put(getMemoryRequest(memory.id), new Response(JSON.stringify(payload)))
}

export async function removeCachedMemory(id: string) {
  if (typeof window === 'undefined' || !('caches' in window)) return

  const cache = await caches.open(CACHE_NAME)
  await cache.delete(getMemoryRequest(id))
}

export async function getCachedMemories(): Promise<CachedMemoryPayload[]> {
  if (typeof window === 'undefined' || !('caches' in window)) return []

  const cache = await caches.open(CACHE_NAME)
  const requests = await cache.keys()
  const matches: CachedMemoryPayload[] = []

  await Promise.all(
    requests.map(async (request) => {
      const response = await cache.match(request)
      if (response) {
        try {
          const data = await response.json()
          matches.push(data)
        } catch (error) {
          console.error('Error parsing cached memory:', error)
        }
      }
    })
  )

  return matches
}

export async function clearCachedMemories() {
  if (typeof window === 'undefined' || !('caches' in window)) return

  await caches.delete(CACHE_NAME)
}
