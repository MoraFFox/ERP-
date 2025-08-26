"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/store/authStore"
import { authService } from "@/services/authService"
import { registerSchema, type RegisterFormData } from "@/lib/validations"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError("")

      // Transform form data to match backend API
      const registerData = {
        email: data.email,
        username: `${data.email.split('@')[0]}_${Date.now()}`, // Use email prefix with timestamp to ensure uniqueness
        password: data.password,
        fullName: `${data.firstName} ${data.lastName}`.trim()
      }

      const response = await authService.register(registerData)

      login(response.user, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })

      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-primary">ERP System</h1>
          <h2 className="mt-6 text-2xl font-heading">Join Our Business Platform</h2>
          <p className="mt-2 text-sm text-gray-600">Create your account to get started.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && <Alert variant="destructive">{error}</Alert>}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  placeholder="John"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />

                <Input
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="john@company.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:text-accent transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
