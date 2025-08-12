export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roleId?: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RefreshTokenRequest {
    refreshToken: string;
}
export interface AuthResponse {
    success: boolean;
    data: {
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: {
                id: string;
                name: string;
                permissions: any;
            };
        };
        accessToken: string;
        refreshToken: string;
    };
}
export interface JWTPayload {
    userId: string;
    email: string;
    roleId: string;
    type: "access" | "refresh";
}
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        roleId: string;
    };
}
//# sourceMappingURL=auth.d.ts.map