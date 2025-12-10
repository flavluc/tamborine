'use client'

import { FullscreenLoader } from '@/components/ui/loader'
import { useAuth } from '@/lib/session'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const accessToken = useAuth((state) => state.accessToken)
  const hasHydrated = useAuth((state) => state.hasHydrated)

  useEffect(() => {
    if (!hasHydrated) return
    if (accessToken) {
      router.replace('/dashboard')
    }
  }, [accessToken, hasHydrated, router])

  if (!hasHydrated) {
    return <FullscreenLoader />
  }

  if (accessToken) {
    return <FullscreenLoader />
  }

  return children
}
