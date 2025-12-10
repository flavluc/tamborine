'use client'

import { useAuth } from '@/lib/token'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { accessToken } = useAuth()

  //@TODO: it's redirecting to login and then back to dashboard
  useEffect(() => {
    if (!accessToken) {
      router.replace('/login')
    }
  }, [accessToken, router])

  //@TODO: add redirecting UI like a loading
  if (!accessToken) return null

  return children
}
