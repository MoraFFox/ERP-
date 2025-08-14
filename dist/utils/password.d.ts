export declare class PasswordUtils {
    static hash(password: string): Promise<string>;
    static compare(password: string, hashedPassword: string): Promise<boolean>;
    static validate(password: string): {
        isValid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=password.d.ts.map
