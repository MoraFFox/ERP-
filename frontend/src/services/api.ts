import axios, { type AxiosError, type AxiosResponse, type AxiosRequestConfig } from "axios"
import { useAuthStore } from "@/store/authStore"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout
})

interface RetryConfig {
  retries: number
  retryDelay: number
  retryCondition?: (error: AxiosError) => boolean
}

const defaultRetryConfig: RetryConfig = {
  retries: 3,
  retryDelay: 1000,
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600)
  },
}

api.interceptors.request.use(
  (config) => {
    const { tokens } = useAuthStore.getState()
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`
    }

    // Add request ID for tracking
    config.headers["X-Request-ID"] = Math.random().toString(36).substr(2, 9)

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      })
    }

    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      })
    }

    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      })
    }

    // Handle token refresh for 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const { tokens, updateTokens, logout } = useAuthStore.getState()

      if (tokens?.refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: tokens.refreshToken,
          })

          const newTokens = response.data.data
          updateTokens(newTokens)

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError)
          logout()
          window.location.href = "/login"
        }
      } else {
        logout()
        window.location.href = "/login"
      }
    }

    // Handle retry logic for network errors and server errors
    if (originalRequest && !originalRequest._retryCount) {
      originalRequest._retryCount = 0
    }

    const retryConfig = { ...defaultRetryConfig, ...originalRequest.retryConfig }

    if (
      originalRequest._retryCount < retryConfig.retries &&
      retryConfig.retryCondition &&
      retryConfig.retryCondition(error)
    ) {
      originalRequest._retryCount++

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryConfig.retryDelay * originalRequest._retryCount))

      console.log(`🔄 Retrying request (${originalRequest._retryCount}/${retryConfig.retries}):`, originalRequest.url)

      return api(originalRequest)
    }

    return Promise.reject(error)
  },
)

export const apiRequest = {
  get: async (url: string, params?: any, config?: AxiosRequestConfig): Promise<any> => {
    try {
      const response = await api.get(url, { params, ...config })
      return response.data
    } catch (error) {
      throw handleApiError(error as AxiosError)
    }
  },

  post: async (url: string, data?: any, config?: AxiosRequestConfig): Promise<any> => {
    try {
      const response = await api.post(url, data, config)
      return response.data
    } catch (error) {
      throw handleApiError(error as AxiosError)
    }
  },

  put: async (url: string, data?: any, config?: AxiosRequestConfig): Promise<any> => {
    try {
      const response = await api.put(url, data, config)
      return response.data
    } catch (error) {
      throw handleApiError(error as AxiosError)
    }
  },

  delete: async (url: string, config?: AxiosRequestConfig): Promise<any> => {
    try {
      const response = await api.delete(url, config)
      return response.data
    } catch (error) {
      throw handleApiError(error as AxiosError)
    }
  },

  withRetry: (retryConfig: Partial<RetryConfig>) => ({
    get: (url: string, params?: any, config?: AxiosRequestConfig) =>
      apiRequest.get(url, params, { ...config, retryConfig }),
    post: (url: string, data?: any, config?: AxiosRequestConfig) =>
      apiRequest.post(url, data, { ...config, retryConfig }),
    put: (url: string, data?: any, config?: AxiosRequestConfig) =>
      apiRequest.put(url, data, { ...config, retryConfig }),
    delete: (url: string, config?: AxiosRequestConfig) => apiRequest.delete(url, { ...config, retryConfig }),
  }),
}

function handleApiError(error: AxiosError): Error {
  let message = "An unexpected error occurred"
  let code = "UNKNOWN_ERROR"

  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const data = error.response.data as any

    switch (status) {
      case 400:
        message = data?.message || "Bad request. Please check your input."
        code = "BAD_REQUEST"
        break
      case 401:
        message = data?.message || "Authentication required. Please log in."
        code = "UNAUTHORIZED"
        break
      case 403:
        message = data?.message || "You don't have permission to perform this action."
        code = "FORBIDDEN"
        break
      case 404:
        message = data?.message || "The requested resource was not found."
        code = "NOT_FOUND"
        break
      case 409:
        message = data?.message || "A conflict occurred. The resource may already exist."
        code = "CONFLICT"
        break
      case 422:
        message = data?.message || "Validation failed. Please check your input."
        code = "VALIDATION_ERROR"
        break
      case 429:
        message = data?.message || "Too many requests. Please try again later."
        code = "RATE_LIMITED"
        break
      case 500:
        message = data?.message || "Internal server error. Please try again later."
        code = "SERVER_ERROR"
        break
      case 502:
        message = "Service temporarily unavailable. Please try again later."
        code = "BAD_GATEWAY"
        break
      case 503:
        message = "Service temporarily unavailable. Please try again later."
        code = "SERVICE_UNAVAILABLE"
        break
      default:
        message = data?.message || `Server error (${status}). Please try again later.`
        code = `HTTP_${status}`
    }

    // Include validation errors if available
    if (data?.errors && Array.isArray(data.errors)) {
      message += ` Details: ${data.errors.join(", ")}`
    }
  } else if (error.request) {
    // Network error
    if (error.code === "ECONNABORTED") {
      message = "Request timeout. Please check your connection and try again."
      code = "TIMEOUT"
    } else if (error.message.includes("Network Error")) {
      message = "Network error. Please check your internet connection."
      code = "NETWORK_ERROR"
    } else {
      message = "Unable to connect to the server. Please try again later."
      code = "CONNECTION_ERROR"
    }
  }

  const enhancedError = new Error(message)
  ;(enhancedError as any).code = code
  ;(enhancedError as any).originalError = error

  return enhancedError
}

export const networkStatus = {
  isOnline: () => navigator.onLine,

  onStatusChange: (callback: (isOnline: boolean) => void) => {
    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  },
}

export const healthCheck = {
  check: async (): Promise<boolean> => {
    try {
      await apiRequest.get("/api/health", {}, { timeout: 5000 })
      return true
    } catch (error) {
      console.error("Health check failed:", error)
      return false
    }
  },

  monitor: (interval = 30000, callback?: (isHealthy: boolean) => void) => {
    const checkHealth = async () => {
      const isHealthy = await healthCheck.check()
      callback?.(isHealthy)
    }

    checkHealth() // Initial check
    const intervalId = setInterval(checkHealth, interval)

    return () => clearInterval(intervalId)
  },
}
