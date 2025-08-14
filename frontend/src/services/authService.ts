import { apiRequest } from "./api"
import type { User, AuthTokens, LoginCredentials, RegisterData, ApiResponse } from "@/types"

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: ApiResponse<AuthResponse> = await apiRequest.post("/auth/login", credentials)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Login failed")
    }

    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response: ApiResponse<AuthResponse> = await apiRequest.post("/auth/register", data)

    if (!response.success || !response.data) {
      throw new Error(response.message || "Registration failed")
    }

    return response.data
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response: ApiResponse<AuthTokens> = await apiRequest.post("/auth/refresh", {
      refreshToken,
    })

    if (!response.success || !response.data) {
      throw new Error(response.message || "Token refresh failed")
    }

    return response.data
  },

  async logout(): Promise<void> {
    // Optional: Call backend logout endpoint if implemented
    // await apiRequest.post("/auth/logout")
  },
}
