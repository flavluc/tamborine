'use client'

import { FullscreenLoader } from '@/components/ui/loader'
import { useAuth } from '@/lib/session'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const accessToken = useAuth((state) => state.accessToken)
  const hasHydrated = useAuth((state) => state.hasHydrated)

  useEffect(() => {
    if (!hasHydrated) return
    if (!accessToken) router.replace('/login')
  }, [accessToken, hasHydrated, router])

  if (!hasHydrated) {
    return <FullscreenLoader />
  }

  if (!accessToken) {
    return null
  }

  return children
}
