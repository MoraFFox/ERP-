import bcrypt from "bcrypt"

const SALT_ROUNDS = 12

export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, SALT_ROUNDS)
    } catch (error) {
      throw new Error("Failed to hash password")
    }
  }

  static async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword)
    } catch (error) {
      throw new Error("Failed to compare passwords")
    }
  }

  static validate(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number")
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?&)")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
