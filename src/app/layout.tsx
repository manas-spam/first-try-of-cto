import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration'
import AccessibilitySuite from '@/components/AccessibilitySuite'
import FocusMode from '@/components/FocusMode'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Immersive Experience',
  description: 'An immersive sensory experience application',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Immersive',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#0ea5e9',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <FocusMode>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1" role="main" id="main-content">
              {children}
            </main>
          </div>
        </FocusMode>
        <ServiceWorkerRegistration />
        <AccessibilitySuite />
      </body>
    </html>
  )
}
