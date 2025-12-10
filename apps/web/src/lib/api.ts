'use client'

import { env } from './env'
import { useAuth } from './session'

let refreshing: Promise<string | null> | null = null

async function refreshAccess(): Promise<string | null> {
  if (refreshing) {
    return refreshing
  }

  refreshing = (async () => {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })

    if (!res.ok) {
      refreshing = null
      return null
    }

    const { data } = await res.json()
    const token = data?.access ?? null
    const user = data?.user ?? null

    useAuth.getState().setSession(token, user)

    refreshing = null
    return token
  })()

  return refreshing
}

export async function initSession() {
  return refreshAccess()
}

export async function api<T = unknown>(
  path: string,
  options: RequestInit = {},
  attempt = 0
): Promise<T> {
  const token = useAuth.getState().accessToken
  const isAuthRoute = path.startsWith('/auth')

  const headers = new Headers(options.headers)

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !isAuthRoute) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!isAuthRoute && res.status === 401 && attempt === 0) {
    const newAccess = await refreshAccess()
    if (newAccess) return api<T>(path, options, 1)
  }

  const status = res.status
  const contentLength = res.headers.get('content-length')
  if (status === 204 || status === 205 || contentLength === '0') {
    return undefined as T
  }

  if (!res.ok) {
    throw await res.json().catch(() => new Error('Request failed'))
  }

  return res.json()
}
