import type { JWTPayload } from "../types/auth";
export declare class JWTUtils {
    static generateAccessToken(payload: Omit<JWTPayload, "type">): string;
    static generateRefreshToken(payload: Omit<JWTPayload, "type">): string;
    static verifyAccessToken(token: string): JWTPayload;
    static verifyRefreshToken(token: string): JWTPayload;
    static generateTokenPair(payload: Omit<JWTPayload, "type">): {
        accessToken: string;
        refreshToken: string;
    };
}
//# sourceMappingURL=jwt.d.ts.map