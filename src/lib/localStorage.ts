export class LocalStorageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LocalStorageError'
  }
}

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__test_storage__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export function getFromLocalStorage<T>(
  key: string,
  defaultValue: T
): T {
  if (!isLocalStorageAvailable()) {
    return defaultValue
  }

  try {
    const item = localStorage.getItem(key)
    if (!item) {
      return defaultValue
    }
    return JSON.parse(item) as T
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error)
    return defaultValue
  }
}

export function setToLocalStorage<T>(
  key: string,
  value: T
): boolean {
  if (!isLocalStorageAvailable()) {
    throw new LocalStorageError('localStorage is not available')
  }

  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new LocalStorageError('localStorage quota exceeded')
    }
    console.error(`Error writing to localStorage (${key}):`, error)
    return false
  }
}

export function removeFromLocalStorage(key: string): boolean {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error)
    return false
  }
}

export function clearLocalStorage(): boolean {
  if (!isLocalStorageAvailable()) {
    return false
  }

  try {
    localStorage.clear()
    return true
  } catch (error) {
    console.error('Error clearing localStorage:', error)
    return false
  }
}

export function getLocalStorageSize(): number {
  if (!isLocalStorageAvailable()) {
    return 0
  }

  try {
    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  } catch (error) {
    console.error('Error calculating localStorage size:', error)
    return 0
  }
}

export function getAllKeys(): string[] {
  if (!isLocalStorageAvailable()) {
    return []
  }

  try {
    return Object.keys(localStorage)
  } catch (error) {
    console.error('Error getting localStorage keys:', error)
    return []
  }
}
