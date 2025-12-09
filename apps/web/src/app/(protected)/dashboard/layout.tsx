'use client'

import Toolbar from '@/components/layout/Toolbar'
import type { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toolbar />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
