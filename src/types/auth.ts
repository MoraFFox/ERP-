import type { Request } from "express";

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  roleId?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: {
        id: string
        name: string
        permissions: any
      }
    }
    accessToken: string
    refreshToken: string
  }
}

export interface JWTPayload {
  userId: string
  email: string
  roleId: string
  type: "access" | "refresh"
}

// Changed to intersection type for proper extension of Express Request
export type AuthenticatedRequest = Request & {
  user?: {
    userId: string
    email: string
    roleId: string
  }
}
