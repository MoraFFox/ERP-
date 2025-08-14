import React from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success" | "warning"
}

const alertVariants = {
  default: "bg-blue-50 text-blue-900 border-blue-200",
  destructive: "bg-red-50 text-red-900 border-red-200",
  success: "bg-green-50 text-green-900 border-green-200",
  warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
}

const alertIcons = {
  default: Info,
  destructive: XCircle,
  success: CheckCircle,
  warning: AlertCircle,
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const Icon = alertIcons[variant]

    return (
      <div
        ref={ref}
        role="alert"
        className={cn("relative w-full rounded-lg border p-4", alertVariants[variant], className)}
        {...props}
      >
        <div className="flex items-start space-x-3">
          <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    )
  },
)

Alert.displayName = "Alert"
