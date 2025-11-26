import { render, screen } from '@testing-library/react'
import { Navigation } from '../Navigation'

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

describe('Navigation', () => {
  it('should render navigation links', () => {
    render(<Navigation />)
    
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Atlas')).toBeInTheDocument()
    expect(screen.getByText('Destinations')).toBeInTheDocument()
    expect(screen.getByText('Memories')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('should render the logo', () => {
    render(<Navigation />)
    
    expect(screen.getByText('Immersive')).toBeInTheDocument()
  })
})
