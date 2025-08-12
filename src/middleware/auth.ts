import type { Response, NextFunction } from "express"
import { JWTUtils } from "../utils/jwt"
import type { AuthenticatedRequest } from "../types/auth"

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    })
  }

  try {
    const decoded = JWTUtils.verifyAccessToken(token)
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roleId: decoded.roleId,
    }
    next()
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    })
  }
}

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(" ")[1]

  if (token) {
    try {
      const decoded = JWTUtils.verifyAccessToken(token)
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        roleId: decoded.roleId,
      }
    } catch (error) {
      // Token is invalid, but we continue without user context
    }
  }

  next()
}
