import './globals.css'

import type { Metadata } from 'next'

import { Providers } from './providers' // your React Query + token initializer

export const metadata: Metadata = {
  title: 'Tamborine',
  description: 'A simple Transaction Processing system for Tamborine',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
