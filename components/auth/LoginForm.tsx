"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onSuccess: () => void
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("password123")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      if (email === "test@example.com" && password === "password123") {
        onSuccess()
      } else {
        setError("Invalid email or password")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="w-full max-w-md mx-auto border-amber-200 shadow-lg">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-7 h-7 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
        <CardDescription>Sign in to your ERP account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="border-amber-200 focus:border-amber-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="border-amber-200 focus:border-amber-500 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-700">
              Demo credentials: test@example.com / password123
            </AlertDescription>
          </Alert>

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={onSwitchToRegister}
              className="text-amber-600 hover:text-amber-700"
            >
              Don't have an account? Register here
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
