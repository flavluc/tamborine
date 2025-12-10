'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { useAuth } from '@/lib/token'

export default function Toolbar() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, accessToken, clear } = useAuth()

  async function handleLogout() {
    try {
      await api('/auth/logout', { method: 'POST' })
    } catch (err) {
      console.error(`Logout error: ${JSON.stringify(err)}`)
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
        {accessToken && user ? (
          <>
            <span className="text-sm text-gray-600">{user.name}</span>

            <Button className="cursor-pointer" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Button className="cursor-pointer" onClick={() => router.push('/login')}>
            Login
          </Button>
        )}
      </div>
    </header>
  )
}
