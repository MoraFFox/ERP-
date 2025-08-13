import jwt, { Secret, SignOptions } from "jsonwebtoken"
import type { JWTPayload } from "../types/auth"

const JWT_SECRET = Buffer.from(process.env.JWT_SECRET || "secret");
const JWT_REFRESH_SECRET = Buffer.from(process.env.JWT_REFRESH_SECRET || "secret_refresh");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

export class JWTUtils {
  static generateAccessToken(payload: Omit<JWTPayload, "type">): string {
    const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
    return jwt.sign({ ...payload, type: "access" }, JWT_SECRET, options);
  }

  static generateRefreshToken(payload: Omit<JWTPayload, "type">): string {
    const options: SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as any };
    return jwt.sign({ ...payload, type: "refresh" }, JWT_REFRESH_SECRET, options);
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (typeof decoded !== 'object' || decoded === null) {
        throw new Error('Invalid token');
      }
      const payload = decoded as JWTPayload;
      if (payload.type !== 'access') {
        throw new Error('Invalid token type');
      }
      return payload;
    } catch (error) {
      throw new Error("Invalid or expired access token");
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      if (typeof decoded !== 'object' || decoded === null) {
        throw new Error('Invalid token');
      }
      const payload = decoded as JWTPayload;
      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      return payload;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  static generateTokenPair(payload: Omit<JWTPayload, "type">) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
