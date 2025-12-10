import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type User = {
  id: string
  email: string
  name: string
}

type AuthState = {
  accessToken: string | null
  user: User | null
  hasHydrated: boolean
  setSession: (accessToken: string, user: User) => void
  clear: () => void
  setHasHydrated: (value: boolean) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,

      setSession: (accessToken, user) =>
        set({
          accessToken,
          user,
        }),

      clear: () =>
        set({
          accessToken: null,
          user: null,
        }),

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),
    }),
    {
      name: 'auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          // log
          return
        }
        state?.setHasHydrated(true)
      },
    }
  )
)
