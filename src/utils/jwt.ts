import jwt from "jsonwebtoken"
import type { JWTPayload } from "../types/auth"

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m"
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d"

export class JWTUtils {
  static generateAccessToken(payload: Omit<JWTPayload, "type">): string {
    return jwt.sign({ ...payload, type: "access" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  }

  static generateRefreshToken(payload: Omit<JWTPayload, "type">): string {
    return jwt.sign({ ...payload, type: "refresh" }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN })
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
      if (decoded.type !== "access") {
        throw new Error("Invalid token type")
      }
      return decoded
    } catch (error) {
      throw new Error("Invalid or expired access token")
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload
      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type")
      }
      return decoded
    } catch (error) {
      throw new Error("Invalid or expired refresh token")
    }
  }

  static generateTokenPair(payload: Omit<JWTPayload, "type">) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    }
  }
}
