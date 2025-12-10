'use client'

import { useAuth } from '@/lib/token'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { accessToken } = useAuth()

  useEffect(() => {
    if (accessToken) {
      router.replace('/dashboard')
    }
  }, [accessToken, router])

  if (accessToken) return null

  return children
}
