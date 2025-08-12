import { PrismaClient } from "@prisma/client"
import { PasswordUtils } from "../utils/password"
import { JWTUtils } from "../utils/jwt"
import type { RegisterRequest, LoginRequest, AuthResponse } from "../types/auth"
import { createError } from "../middleware/errorHandler"

const prisma = new PrismaClient()

export class AuthService {
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const { email, password, firstName, lastName, roleId } = data

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw createError("User with this email already exists", 409)
    }

    // Get default role if not provided
    let finalRoleId = roleId
    if (!finalRoleId) {
      const defaultRole = await prisma.role.findFirst({
        where: { name: "User" },
      })

      if (!defaultRole) {
        // Create default role if it doesn't exist
        const newRole = await prisma.role.create({
          data: {
            name: "User",
            description: "Default user role",
            permissions: ["read:own_profile", "update:own_profile"],
          },
        })
        finalRoleId = newRole.id
      } else {
        finalRoleId = defaultRole.id
      }
    }

    // Hash password
    const hashedPassword = await PasswordUtils.hash(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        roleId: finalRoleId,
      },
      include: {
        role: true,
      },
    })

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
    }

    const { accessToken, refreshToken } = JWTUtils.generateTokenPair(tokenPayload)

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    }
  }

  static async login(data: LoginRequest): Promise<AuthResponse> {
    const { email, password } = data

    // Find user with role
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    })

    if (!user) {
      throw createError("Invalid email or password", 401)
    }

    if (!user.isActive) {
      throw createError("Account is deactivated", 401)
    }

    // Verify password
    const isPasswordValid = await PasswordUtils.compare(password, user.password)
    if (!isPasswordValid) {
      throw createError("Invalid email or password", 401)
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      roleId: user.roleId,
    }

    const { accessToken, refreshToken } = JWTUtils.generateTokenPair(tokenPayload)

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    }
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify refresh token
      const decoded = JWTUtils.verifyRefreshToken(refreshToken)

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { role: true },
      })

      if (!user || !user.isActive) {
        throw createError("User not found or inactive", 401)
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        roleId: user.roleId,
      }

      const tokens = JWTUtils.generateTokenPair(tokenPayload)

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      }
    } catch (error) {
      throw createError("Invalid or expired refresh token", 401)
    }
  }
}
