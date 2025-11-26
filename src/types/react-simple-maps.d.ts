// Type declarations for react-simple-maps
declare module 'react-simple-maps' {
  export interface ComposableMapProps {
    children: React.ReactNode
    projection?: string
    projectionConfig?: {
      scale?: number
      center?: [number, number]
    }
  }

  export interface GeographiesProps {
    children: (props: { geographies: any[] }) => React.ReactNode
    geography: any
  }

  export interface GeographyProps {
    children?: (props: { path?: string }) => React.ReactNode
    geography: any
    onClick?: () => void
    onMouseEnter?: (event: any) => void
    onMouseLeave?: () => void
    style?: {
      default?: any
      hover?: any
      pressed?: any
    }
  }

  export interface MarkerProps {
    children: React.ReactNode
    coordinates: [number, number]
  }

  export const ComposableMap: React.FC<ComposableMapProps>
  export const Geographies: React.FC<GeographiesProps>
  export const Geography: React.FC<GeographyProps>
  export const Marker: React.FC<MarkerProps>
}