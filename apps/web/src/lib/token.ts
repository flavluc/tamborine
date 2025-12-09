import { create } from 'zustand'

type TokenState = {
  accessToken: string | null
  setToken: (t: string | null) => void
  clear: () => void
}

export const useToken = create<TokenState>((set) => ({
  accessToken: null,
  setToken: (t) => set({ accessToken: t }),
  clear: () => set({ accessToken: null }),
}))
