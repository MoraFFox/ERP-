"use client"

import { useCallback } from "react"
import { useToast } from "@/components/ui/Toast"

interface ApiError extends Error {
  code?: string
  originalError?: any
}

export const useApiError = () => {
  const { addToast } = useToast()

  const handleError = useCallback(
    (error: ApiError, customMessage?: string) => {
      console.error("API Error Details:")
      console.error("Message:", error.message)
      console.error("Code:", error.code)
      console.error("Original Error:", error.originalError)
      console.error("Full Error Object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2))

      let title = "Error"
      let message = customMessage || error.message || "An unexpected error occurred"

      // Customize error messages based on error code
      switch (error.code) {
        case "NETWORK_ERROR":
          title = "Connection Error"
          message = "Please check your internet connection and try again."
          break
        case "TIMEOUT":
          title = "Request Timeout"
          message = "The request took too long. Please try again."
          break
        case "UNAUTHORIZED":
          title = "Authentication Required"
          message = "Please log in to continue."
          break
        case "FORBIDDEN":
          title = "Access Denied"
          message = "You don't have permission to perform this action."
          break
        case "NOT_FOUND":
          title = "Not Found"
          message = "The requested resource could not be found."
          break
        case "VALIDATION_ERROR":
          title = "Validation Error"
          break
        case "SERVER_ERROR":
          title = "Server Error"
          message = "Something went wrong on our end. Please try again later."
          break
        case "RATE_LIMITED":
          title = "Too Many Requests"
          message = "Please wait a moment before trying again."
          break
      }

      addToast({
        type: "error",
        title,
        message,
        duration: error.code === "NETWORK_ERROR" ? 10000 : 5000,
      })
    },
    [addToast],
  )

  const handleSuccess = useCallback(
    (message: string, title?: string) => {
      addToast({
        type: "success",
        title,
        message,
        duration: 3000,
      })
    },
    [addToast],
  )

  const handleWarning = useCallback(
    (message: string, title?: string) => {
      addToast({
        type: "warning",
        title,
        message,
        duration: 4000,
      })
    },
    [addToast],
  )

  const handleInfo = useCallback(
    (message: string, title?: string) => {
      addToast({
        type: "info",
        title,
        message,
        duration: 4000,
      })
    },
    [addToast],
  )

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo,
  }
}
