import { renderHook, act } from '@testing-library/react'
import { useAppStore } from '../useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.resetSettings()
    })
  })

  it('should initialize with default settings', () => {
    const { result } = renderHook(() => useAppStore())
    
    expect(result.current.userSettings.ecoMode).toBe(false)
    expect(result.current.userSettings.reducedMotion).toBe(false)
    expect(result.current.userSettings.hapticFeedback).toBe(true)
    expect(result.current.userSettings.audioEnabled).toBe(true)
  })

  it('should update user settings', () => {
    const { result } = renderHook(() => useAppStore())
    
    act(() => {
      result.current.updateUserSettings({ ecoMode: true })
    })
    
    expect(result.current.userSettings.ecoMode).toBe(true)
  })

  it('should toggle atmospheric layer', () => {
    const { result } = renderHook(() => useAppStore())
    const initialVisibility = result.current.atmosphericLayers[0].visible
    
    act(() => {
      result.current.toggleAtmosphericLayer(result.current.atmosphericLayers[0].id)
    })
    
    expect(result.current.atmosphericLayers[0].visible).toBe(!initialVisibility)
  })

  it('should set current route', () => {
    const { result } = renderHook(() => useAppStore())
    
    act(() => {
      result.current.setCurrentRoute('/atlas')
    })
    
    expect(result.current.navigationContext.currentRoute).toBe('/atlas')
    expect(result.current.navigationContext.previousRoute).toBe('/')
  })
})
