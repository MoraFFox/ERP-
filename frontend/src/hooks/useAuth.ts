import { useAuthStore } from "@/store/authStore"
import { authService } from "@/services/authService"
import { useNavigate } from "react-router-dom"

export const useAuth = () => {
  const { user, tokens, isAuthenticated, login, logout: storeLogout, setLoading } = useAuthStore()
  const navigate = useNavigate()

  const logout = async () => {
    try {
      setLoading(true)
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      storeLogout()
      navigate("/login")
      setLoading(false)
    }
  }

  const refreshTokens = async () => {
    if (!tokens?.refreshToken) {
      logout()
      return null
    }

    try {
      const newTokens = await authService.refreshToken(tokens.refreshToken)
      useAuthStore.getState().updateTokens(newTokens)
      return newTokens
    } catch (error) {
      console.error("Token refresh error:", error)
      logout()
      return null
    }
  }

  return {
    user,
    tokens,
    isAuthenticated,
    login,
    logout,
    refreshTokens,
  }
}
