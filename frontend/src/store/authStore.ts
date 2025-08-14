import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, AuthTokens } from "@/types"

interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, tokens: AuthTokens) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateTokens: (tokens: AuthTokens) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user, tokens) => {
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        })
      },
      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },
      setLoading: (loading) => {
        set({ isLoading: loading })
      },
      updateTokens: (tokens) => {
        set({ tokens })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
