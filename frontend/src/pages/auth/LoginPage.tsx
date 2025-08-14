"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/store/authStore"
import { authService } from "@/services/authService"
import { loginSchema, type LoginFormData } from "@/lib/validations"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Alert } from "@/components/ui/Alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError("")

      const response = await authService.login(data)

      login(response.user, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      })

      navigate("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-primary">ERP System</h1>
          <h2 className="mt-6 text-2xl font-heading">Secure Access to Your Business Solutions</h2>
          <p className="mt-2 text-sm text-gray-600">Log in to manage your operations seamlessly.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && <Alert variant="destructive">{error}</Alert>}

              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
              />

              <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
                {isLoading ? "Signing In..." : "Enter Dashboard"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-primary hover:text-accent transition-colors">
                  Create one here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
