'use client'

import { useEffect, useState } from 'react'

export function ServiceWorkerRegistration() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setRegistration(reg)
          
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true)
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })
    }
  }, [])

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      window.location.reload()
    }
  }

  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-sensory-sky-500 text-white rounded-lg shadow-lg z-50">
        <p className="mb-2">A new version is available!</p>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-white text-sensory-sky-500 rounded-md hover:bg-gray-100 transition-colors"
        >
          Update Now
        </button>
      </div>
    )
  }

  return null
}
