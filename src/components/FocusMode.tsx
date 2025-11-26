'use client'

import { useAccessibilityStore } from '@/store/accessibilityStore'

interface FocusModeProps {
  children: React.ReactNode
}

export default function FocusMode({ children }: FocusModeProps) {
  const { focusModeEnabled, colorDesaturation } = useAccessibilityStore()

  if (!focusModeEnabled) {
    return <>{children}</>
  }

  return (
    <div
      style={{
        filter: `saturate(${100 - colorDesaturation}%)`,
        transition: 'filter 0.5s ease-in-out',
      }}
    >
      {children}
    </div>
  )
}
