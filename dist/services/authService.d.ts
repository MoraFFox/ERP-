import type { RegisterRequest, LoginRequest, AuthResponse } from "../types/auth";
export declare class AuthService {
    static register(data: RegisterRequest): Promise<AuthResponse>;
    static login(data: LoginRequest): Promise<AuthResponse>;
    static refreshToken(refreshToken: string): Promise<AuthResponse>;
}
//# sourceMappingURL=authService.d.ts.map