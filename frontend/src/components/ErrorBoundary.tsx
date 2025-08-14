"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
    this.setState({ error, errorInfo })

    // Log error to monitoring service
    this.logErrorToService(error, errorInfo)
  }

  logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you would send this to your error monitoring service
    console.error("Logging error to service:", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the
                problem persists.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-xs bg-gray-50 p-2 rounded">
                  <summary className="cursor-pointer font-medium">Error Details (Development)</summary>
                  <pre className="mt-2 whitespace-pre-wrap">{this.state.error.message}</pre>
                  {this.state.error.stack && (
                    <pre className="mt-2 whitespace-pre-wrap text-xs">{this.state.error.stack}</pre>
                  )}
                </details>
              )}

              <div className="flex space-x-2">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="flex-1">
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
