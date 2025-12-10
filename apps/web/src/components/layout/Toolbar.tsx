'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/session'

export default function Toolbar() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const user = useAuth((state) => state.user)
  const clear = useAuth((state) => state.clear)

  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    if (loggingOut) return

    setLoggingOut(true)
    try {
      await api('/auth/logout', { method: 'POST' })
    } catch {
      // logout is best-effort; ignore errors
    } finally {
      clear()
      queryClient.clear()
      router.replace('/login')
    }
  }

  return (
    <header className="flex items-center justify-between border-b p-4">
      <h1 className="text-lg font-semibold tracking-tight">Tamborine</h1>

      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">{user!.name}</span>

        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={loggingOut}
          className="cursor-pointer flex items-center gap-2"
        >
          {loggingOut && (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          )}
          Logout
        </Button>
      </div>
    </header>
  )
}
