import type { Request, Response, NextFunction } from "express"
import { JWTUtils } from "../utils/jwt"
import type { AuthenticatedRequest } from "../types/auth"

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = (req as unknown as Request).get('authorization');
  const token = authHeader ? authHeader.split(" ")[1] : undefined;
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access token required",
    });
    return;
  }

  try {
    const decoded = JWTUtils.verifyAccessToken(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      roleId: decoded.roleId,
    };
    next();
    return;
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
    return;
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = (req as unknown as Request).get('authorization');
  const token = authHeader ? authHeader.split(" ")[1] : undefined;
  if (token) {
    try {
      const decoded = JWTUtils.verifyAccessToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        roleId: decoded.roleId,
      };
    } catch (error) {
      // Token invalid, continue without user context
    }
  }
  next();
  return;
};
